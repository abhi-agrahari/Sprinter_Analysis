import os
import uuid
import cv2
import traceback
import numpy as np
from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, AnalysisHistory
from processing.video_processor import save_uploaded_video, get_video_info, get_skip_interval, extract_frames
from ml.inference import load_movenet, run_inference
from processing.keypoint_drawer import draw_keypoints
from calculations.knee_angles import calculate_knee_angles
from calculations.angle_utils import get_upright_avg
from calculations.vertical_upright import calculate_vertical_upright_angle
from calculations.pelvic_tilt import calculate_pelvic_tilt
from calculations.elbow_flaring import calculate_elbow_flaring
from ml.feedback import get_coaching_feedback
from ml.predictor import SprintPredictor

analysis_bp = Blueprint('analysis', __name__)

# Initialize ML Models
movenet = load_movenet()
predictor = SprintPredictor()

# Folder for serving processed videos
PROCESSED_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'processed_videos')
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@analysis_bp.route('/api/videos/<filename>')
def serve_video(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

@analysis_bp.route('/api/test', methods=['GET'])
def test_route():
    return jsonify({'status': 'Backend is working!', 'message': 'Cloud deployment successful'}), 200

@analysis_bp.route('/api/analyze', methods=['POST'])
@jwt_required()
def analyze_video():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if 'file' not in request.files:
        return jsonify({'message': 'No video uploaded'}), 400
    
    video_file = request.files['file']
    filename = f"{uuid.uuid4()}_{video_file.filename}"
    upload_path = save_uploaded_video(video_file.read(), filename)
    processed_path = os.path.join(os.path.dirname(upload_path), f"processed_{filename}")
    
    try:
        info = get_video_info(upload_path)
        skip_interval = get_skip_interval(info['frame_count'])
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(processed_path, fourcc, info['fps'] / skip_interval, (info['width'], info['height']))
        
        # Comprehensive history tracking
        metrics_history = {
            'upright_angles': [],
            'knee_angles': [],
            'elbow_flares': [],
            'pelvic_tilts': []
        }
        
        for frame in extract_frames(upload_path, skip_interval):
             keypoints_with_scores = run_inference(movenet, frame)
             
             # Draw skeleton on frame
             draw_keypoints(frame, keypoints_with_scores, 0.3)
             
             # Perform all biomechanical calculations
             left_knee, right_knee = calculate_knee_angles(keypoints_with_scores)
             upright = calculate_vertical_upright_angle(keypoints_with_scores)
             pelvic = calculate_pelvic_tilt(keypoints_with_scores)
             l_flare, r_flare = calculate_elbow_flaring(keypoints_with_scores)
             
             # Store results
             metrics_history['upright_angles'].append(upright)
             metrics_history['knee_angles'].append((left_knee + right_knee) / 2)
             metrics_history['elbow_flares'].append((l_flare + r_flare) / 2)
             metrics_history['pelvic_tilts'].append(pelvic)
             
             out.write(frame)
        
        out.release()
        
        # Calculate session averages
        session_avgs = {
            'vertical_upright_angle': float(get_upright_avg(metrics_history['upright_angles'])),
            'knee_angle': float(get_upright_avg(metrics_history['knee_angles'])),
            'elbow_flare': float(get_upright_avg(metrics_history['elbow_flares'])),
            'pelvic_tilt': float(get_upright_avg(metrics_history['pelvic_tilts']))
        }
        
        # Get Personalized Ideal Values from Random Forest Predictor
        # Using athlete profile: height, weight, gender
        ideal_values = predictor.predict_ideal_values(
            height_cm=user.height or 175.0, 
            weight_kg=user.weight or 70.0, 
            gender=user.gender or 'Male'
        )

        # Save processed video locally instead of ImageKit
        final_name = f"processed_{filename}"
        final_path = os.path.join(PROCESSED_FOLDER, final_name)
        
        import shutil
        shutil.move(processed_path, final_path)
        
        stream_url = f"{request.host_url}api/videos/{final_name}"
        print(f"VIDEO URL: {stream_url}")

        advices = get_coaching_feedback(session_avgs, ideal_values)

        # Update Database History
        history_entry = AnalysisHistory(
            user_id=user.id,
            video_url=stream_url,
            advice=str(advices),
            graph_data=str(session_avgs)
        )
        db.session.add(history_entry)
        db.session.commit()

        return jsonify({
            'stream_url': stream_url,
            'advice': advices,
            'session_metrics': session_avgs,
            'ideal_metrics': ideal_values
        }), 200
        
    except Exception as e:
        print(f"===== ANALYSIS ERROR =====")
        traceback.print_exc()
        print(f"==========================")
        db.session.rollback()
        return jsonify({'message': f'Failed to process video: {str(e)}'}), 500
    finally:
        if os.path.exists(upload_path): os.remove(upload_path)

@analysis_bp.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    history = AnalysisHistory.query.filter_by(user_id=user_id).order_by(AnalysisHistory.created_at.desc()).all()
    
    result = []
    for item in history:
        result.append({
            'id': item.id,
            'video_url': item.video_url,
            'advice': item.advice,
            'graph_data': item.graph_data,
            'created_at': item.created_at.isoformat()
        })
    return jsonify(result), 200
