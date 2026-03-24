import numpy as np

from calculations.angle_utils import calculate_angle_between_vectors


def calculate_elbow_flaring(keypoints_with_scores):
    """
    Calculates left and right elbow flaring angles.

    The flaring angle is measured between the upper arm vector
    (shoulder → elbow) and the vertical downward direction [0, -1].

    """
    left_elbow_index = 7       # Left elbow
    left_shoulder_index = 5    # Left shoulder
    right_elbow_index = 8      # Right elbow
    right_shoulder_index = 6   # Right shoulder

    left_elbow = keypoints_with_scores[0, 0, left_elbow_index, :2]
    left_shoulder = keypoints_with_scores[0, 0, left_shoulder_index, :2]
    right_elbow = keypoints_with_scores[0, 0, right_elbow_index, :2]
    right_shoulder = keypoints_with_scores[0, 0, right_shoulder_index, :2]

    # Vector from elbow TO shoulder
    left_upper_arm_vector = left_shoulder - left_elbow
    right_upper_arm_vector = right_shoulder - right_elbow

    # Defining the vertical axis
    vertical_axis = np.array([0, -1])

    left_elbow_flare_angle = calculate_angle_between_vectors(
        left_upper_arm_vector, vertical_axis
    )
    right_elbow_flare_angle = calculate_angle_between_vectors(
        right_upper_arm_vector, vertical_axis
    )

    return left_elbow_flare_angle, right_elbow_flare_angle