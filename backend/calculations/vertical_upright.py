import numpy as np  # NumPy for trigonometry


def calculate_vertical_upright_angle(keypoints_with_scores):
    """
        Measures the angle of the shoulders relative to horizontal.
        Compares the y-coordinates of left and right shoulders.
        If both shoulders are at the same height → angle = 0 (perfectly upright)
        If one shoulder is higher → angle increases (leaning)
    """
    left_shoulder_index = 5   # Left shoulder
    right_shoulder_index = 6  # Right shoulder

    left_shoulder_y = keypoints_with_scores[0, 0, left_shoulder_index, 0]
    right_shoulder_y = keypoints_with_scores[0, 0, right_shoulder_index, 0]

    vertical_upright_angle = np.arctan2(
        right_shoulder_y - left_shoulder_y,  # How much the shoulders differ
        1                                     # Horizontal reference
    )

    vertical_upright_angle = np.degrees(vertical_upright_angle)

    return vertical_upright_angle