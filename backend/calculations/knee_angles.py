import math
import numpy as np
from .angle_utils import calculate_angle_three_points


def calculate_knee_angles(keypoints_with_scores):

    # MoveNet keypoint indices for leg joints
    left_hip_idx = 11      # Left hip joint
    left_knee_idx = 13     # Left knee joint
    left_ankle_idx = 15    # Left ankle joint
    right_hip_idx = 12     # Right hip joint
    right_knee_idx = 14    # Right knee joint
    right_ankle_idx = 16   # Right ankle joint

    keypoints = keypoints_with_scores[0, 0]

    left_hip = keypoints[left_hip_idx, :2]       # [y, x]
    left_knee = keypoints[left_knee_idx, :2]     # [y, x]
    left_ankle = keypoints[left_ankle_idx, :2]   # [y, x]
    right_hip = keypoints[right_hip_idx, :2]     # [y, x]
    right_knee = keypoints[right_knee_idx, :2]   # [y, x]
    right_ankle = keypoints[right_ankle_idx, :2] # [y, x]

    # Calculate interior angles using three points
    # This will return values around 180 for a straight leg and smaller for a bent leg.
    left_knee_angle = calculate_angle_three_points(left_hip, left_knee, left_ankle)
    right_knee_angle = calculate_angle_three_points(right_hip, right_knee, right_ankle)

    return left_knee_angle, right_knee_angle