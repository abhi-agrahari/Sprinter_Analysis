import numpy as np
from .angle_utils import calculate_angle_between_vectors

def calculate_elbow_flaring(keypoints_with_scores):
    """
    Calculates left and right elbow flaring angles.
    """
    keypoints = keypoints_with_scores[0, 0]
    left_elbow_idx = 7
    left_shoulder_idx = 5
    right_elbow_idx = 8
    right_shoulder_idx = 6
    
    conf_threshold = 0.2
    
    # Left side
    if keypoints[left_elbow_idx, 2] > conf_threshold and keypoints[left_shoulder_idx, 2] > conf_threshold:
        l_elb = keypoints[left_elbow_idx, :2]
        l_sh = keypoints[left_shoulder_idx, :2]
        l_vec = l_sh - l_elb
        l_flare = calculate_angle_between_vectors(l_vec, np.array([0, -1]))
    else:
        l_flare = 0.0

    # Right side
    if keypoints[right_elbow_idx, 2] > conf_threshold and keypoints[right_shoulder_idx, 2] > conf_threshold:
        r_elb = keypoints[right_elbow_idx, :2]
        r_sh = keypoints[right_shoulder_idx, :2]
        r_vec = r_sh - r_elb
        r_flare = calculate_angle_between_vectors(r_vec, np.array([0, -1]))
    else:
        r_flare = 0.0

    return l_flare, r_flare