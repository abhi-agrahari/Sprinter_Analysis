import numpy as np
from .angle_utils import calculate_angle_between_vectors

def calculate_vertical_upright_angle(keypoints_with_scores):
    """
    Measures the angle of the trunk relative to vertical.
    Trunk is defined as the segment connecting the midpoint of shoulders to the midpoint of hips.
    Perfectly upright = 0 degrees.
    Leaning forward = positive degrees.
    """
    keypoints = keypoints_with_scores[0, 0]
    
    # MoveNet Indices
    left_shoulder_idx = 5
    right_shoulder_idx = 6
    left_hip_idx = 11
    right_hip_idx = 12

    # Confidence check
    conf_threshold = 0.2
    if (keypoints[left_shoulder_idx, 2] < conf_threshold or 
        keypoints[right_shoulder_idx, 2] < conf_threshold or
        keypoints[left_hip_idx, 2] < conf_threshold or 
        keypoints[right_hip_idx, 2] < conf_threshold):
        return 0.0

    # Get coordinates [y, x]
    l_sh = keypoints[left_shoulder_idx, :2]
    r_sh = keypoints[right_shoulder_idx, :2]
    l_hip = keypoints[left_hip_idx, :2]
    r_hip = keypoints[right_hip_idx, :2]

    # Midpoints
    mid_shoulder = (l_sh + r_sh) / 2.0
    mid_hip = (l_hip + r_hip) / 2.0

    # Trunk vector: from hip to shoulder
    # In MoveNet, y increases downwards, x increases rightwards.
    # Vector points from hip upwards/forwards to shoulder.
    trunk_vec = mid_shoulder - mid_hip # [dy, dx]
    
    # Vertical up vector would be [dy=-1, dx=0] (y decreases as we go up)
    vertical_vec = np.array([-1.0, 0.0])

    # Calculate angle
    angle = calculate_angle_between_vectors(trunk_vec, vertical_vec)
    
    return angle