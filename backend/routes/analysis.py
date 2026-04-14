import os
import json
import uuid
import cv2
import numpy as np
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, AnalysisHistory
from ml.predictor import SprintPredictor
from ml.inference import load_movenet, run_inference
from ml.feedback import get_coaching_feedback
from processing.video_processor import save_uploaded_video, extract_frames, get_video_info, get_skip_interval
from imagekit_utils import upload_to_imagekit
from calculations.knee_angles import calculate_knee_angles
from calculations.vertical_upright import calculate_vertical_upright_angle
from calculations.elbow_flaring import calculate_elbow_flaring
from calculations.pelvic_tilt import calculate_pelvic_tilt
from processing.keypoint_drawer import draw_keypoints


movenet = load_movenet()
predictor = SprintPredictor()

analysis_bp = Blueprint('analysis', __name__)

def get_avg(lst):
    return sum(lst) / len(lst) if lst else 0

@analysis_bp.route('/api/analyze', methods=['POST'])
@jwt_required()
def analyze_video():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if 'file' not in request.files:
        return jsonify({'message': 'No video uploaded'}), 400
    
    video_file = request.files['file']
    filename = f"{uuid.uuid4()}_{video_file.filename}"
    upload_path = save_uploaded_video(video_file.read(), filename)
    processed_path = os.path.join(os.path.dirname(upload_path), f"processed_{filename}")
    
    try:
        print(f"Analyzing video for user {user.name}...")
        info = get_video_info(upload_path)
        skip_interval = get_skip_interval(info['frame_count'])
        processing_fps = info['fps'] / skip_interval
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(processed_path, fourcc, processing_fps, (info['width'], info['height']))
        
        angles_history = {
            'knee_extension': [],
            'knee_lift': [],
            'upright_angles': [], 
            'elbow_flare': [], 
            'pelvic_tilt': [],
            'conf_scores': []
        }
        
        ideal_values = predictor.predict_ideal_values(user.height, user.weight, user.gender)
        
        for frame in extract_frames(upload_path, skip_interval):
            keypoints = run_inference(movenet, frame)
            
            draw_keypoints(frame, keypoints[0, 0], confidence_threshold=0.3)
            avg_frame_conf = np.mean(keypoints[0, 0, :, 2])
            angles_history['conf_scores'].append(round(float(avg_frame_conf), 2))
            
            l_knee, r_knee = calculate_knee_angles(keypoints)
            l_elbow_flare, r_elbow_flare = calculate_elbow_flaring(keypoints)
            p_tilt = calculate_pelvic_tilt(keypoints)
            v_upright = calculate_vertical_upright_angle(keypoints)
            
            # drawing detailed metrics on frame
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(frame, f"L-Knee: {int(l_knee)}'  R-Knee: {int(r_knee)}'", (10, 50), font, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Elbow Flare: {int(l_elbow_flare)}'", (10, 100), font, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Pelvic Tilt: {int(p_tilt)}'", (10, 150), font, 1, (0, 255, 0), 2)
            cv2.putText(frame, f"Upright Angle: {int(v_upright)}'", (10, 200), font, 1, (0, 255, 0), 2)

            out.write(frame)
            
            if l_knee is not None and r_knee is not None:
                # extension is the larger angle (leg straight)
                angles_history['knee_extension'].append(round(float(max(l_knee, r_knee)), 2))
                # lift is the smaller angle (leg bent)
                angles_history['knee_lift'].append(round(float(min(l_knee, r_knee)), 2))
            
            if v_upright is not None:
                angles_history['upright_angles'].append(round(float(v_upright), 2))
                
            if l_elbow_flare is not None and r_elbow_flare is not None:
                angles_history['elbow_flare'].append(round(float(max(l_elbow_flare, r_elbow_flare)), 2))
                
            if p_tilt is not None:
                angles_history['pelvic_tilt'].append(round(float(p_tilt), 2))

        out.release()
        
        avgs = {k: get_avg(v) for k, v in angles_history.items()}
        avg_conf = avgs.get('conf_scores', 0)
        
        if avg_conf < 0.45:
             return jsonify({'message': 'Quality too low. Please upload clear video.'}), 400

        if not angles_history['upright_angles']:
             return jsonify({'message': 'No movement detected.'}), 400

        stream_url = upload_to_imagekit(processed_path, f"processed_{filename}")
        advices = get_coaching_feedback(avgs, ideal_values)

        history_entry = AnalysisHistory(
            user_id = user_id,
            video_url = stream_url,
            advice = json.dumps(advices),
            graph_data = json.dumps(angles_history)
        )
        db.session.add(history_entry)
        db.session.commit()
        
        return jsonify({
            'stream_url': stream_url,
            'advice': advices,
            'graph_data': angles_history
        })
    finally:
        if os.path.exists(upload_path): os.remove(upload_path)
        if os.path.exists(processed_path): os.remove(processed_path)

@analysis_bp.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    histories = AnalysisHistory.query.filter_by(user_id=user_id).order_by(AnalysisHistory.created_at.desc()).all()
    
    result = []
    for h in histories:
        result.append({
            'date': h.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'url': h.video_url,
            'advice': json.loads(h.advice),
            'graph_data': json.loads(h.graph_data)
        })
    return jsonify(result)
