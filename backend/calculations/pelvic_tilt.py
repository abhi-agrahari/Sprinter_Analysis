import numpy as np
from .angle_utils import calculate_angle_between_vectors

def calculate_pelvic_tilt(keypoints_with_scores):
    """
    Measures the tilt of the pelvis (hip line) relative to the horizontal.
    """
    keypoints = keypoints_with_scores[0, 0]
    left_hip_idx = 11
    right_hip_idx = 12
    
    conf_threshold = 0.2
    if keypoints[left_hip_idx, 2] < conf_threshold or keypoints[right_hip_idx, 2] < conf_threshold:
        return 0.0

    l_hip = keypoints[left_hip_idx, :2]
    r_hip = keypoints[right_hip_idx, :2]

    # Vector representing the hips line
    hip_vec = r_hip - l_hip # [dy, dx]
    # Horizontal vector [0, 1] (y doesn't change, x increases)
    horiz_vec = np.array([0.0, 1.0])

    angle = calculate_angle_between_vectors(hip_vec, horiz_vec)
    return angle