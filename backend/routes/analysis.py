import os
import uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, AnalysisHistory
from processing.video_processor import save_uploaded_video, get_video_info, get_skip_interval, extract_frames
from ml.inference import load_movenet, run_inference
from processing.keypoint_drawer import draw_keypoints
from calculations.knee_angles import calculate_knee_angles
from calculations.angle_utils import get_upright_avg
from ml.feedback import get_coaching_feedback
import cv2
from imagekit_utils import upload_to_imagekit

analysis_bp = Blueprint('analysis', __name__)

# Initialize MoveNet once
movenet = load_movenet()

@analysis_bp.route('/analyze', methods=['POST'])
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
        info = get_video_info(upload_path)
        skip_interval = get_skip_interval(info['frame_count'])
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(processed_path, fourcc, info['fps'] / skip_interval, (info['width'], info['height']))
        
        angles_history = {'upright_angles': []}
        
        for frame in extract_frames(upload_path, skip_interval):
             # Run Inference
             keypoints_with_scores = run_inference(movenet, frame)
             
             # Draw skeleton on frame
             draw_keypoints(frame, keypoints_with_scores, 0.3)
             
             # Calculate angles (knee_angles.py returns a tuple of angles)
             left_knee, right_knee = calculate_knee_angles(keypoints_with_scores)
             
             # We use the average of both knees for 'upright' in this simplified model
             # or just one for tracking. Let's keep it simple for now as per project origin.
             angles_history['upright_angles'].append((left_knee + right_knee) / 2)
             
             out.write(frame)
        
        out.release()
        
        avgs = {
            'upright': get_upright_avg(angles_history['upright_angles'])
        }
        
        # Default ideal for upright posture
        ideal_values = {
            'upright': 175
        }

        stream_url = upload_to_imagekit(processed_path, f"processed_{filename}")
        advices = get_coaching_feedback(avgs, ideal_values)

        history_entry = AnalysisHistory(
            user_id=user.id,
            video_url=stream_url,
            feedback=str(advices)
        )
        db.session.add(history_entry)
        db.session.commit()

        return jsonify({
            'stream_url': stream_url,
            'advice': advices
        }), 200
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({'message': 'Failed to process video'}), 500
    finally:
        if os.path.exists(upload_path): os.remove(upload_path)
        if os.path.exists(processed_path): os.remove(processed_path)
