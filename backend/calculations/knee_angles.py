import math


def calculate_knee_angles(keypoints_with_scores):

    # MoveNet keypoint indices for leg joints
    left_hip_idx = 11      # Left hip joint
    left_knee_idx = 13     # Left knee joint
    left_ankle_idx = 15    # Left ankle joint
    right_hip_idx = 12     # Right hip joint
    right_knee_idx = 14    # Right knee joint
    right_ankle_idx = 16   # Right ankle joint

    keypoints = keypoints_with_scores[0, 0]

    left_hip = keypoints[left_hip_idx, :2]       # [y, x] of left hip
    left_knee = keypoints[left_knee_idx, :2]     # [y, x] of left knee
    left_ankle = keypoints[left_ankle_idx, :2]   # [y, x] of left ankle
    right_hip = keypoints[right_hip_idx, :2]     # [y, x] of right hip
    right_knee = keypoints[right_knee_idx, :2]   # [y, x] of right knee
    right_ankle = keypoints[right_ankle_idx, :2] # [y, x] of right ankle


    # math.atan2(dy, dx) returns angle in radians
    # math.degrees() converts radians - degrees

    left_knee_angle = math.degrees(
        math.atan2(left_knee[1] - left_hip[1], left_knee[0] - left_hip[0])   # angle of thigh
        - math.atan2(left_ankle[1] - left_knee[1], left_ankle[0] - left_knee[0])  # angle of shin
    )

    right_knee_angle = math.degrees(
        math.atan2(right_knee[1] - right_hip[1], right_knee[0] - right_hip[0])
        - math.atan2(right_ankle[1] - right_knee[1], right_ankle[0] - right_knee[0])
    )

    return left_knee_angle, right_knee_angle