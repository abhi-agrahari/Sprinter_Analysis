import numpy as np

def calculate_pelvic_tilt(keypoints_with_scores):
    """
    The pelvic tilt is the angle formed by the difference in
    hip heights relative to the spine position.
    """
    left_hip_index = 11   # Left hip joint
    right_hip_index = 12  # Right hip joint
    spine_index = 8       # Right elbow (used as spine approximation)

    left_hip_y = keypoints_with_scores[0, 0, left_hip_index, 0]
    right_hip_y = keypoints_with_scores[0, 0, right_hip_index, 0]
    spine_y = keypoints_with_scores[0, 0, spine_index, 0]

    if None not in [left_hip_y, right_hip_y, spine_y]:

        pelvic_tilt_angle = np.arctan2(
            right_hip_y - left_hip_y,
            spine_y - 0.5
        ) * (180.0 / np.pi)

        return pelvic_tilt_angle
    else:
        return None