import numpy as np


def calculate_angle_between_vectors(vector1, vector2):

    dot_product = np.dot(vector1, vector2)

    # Magnitude of [a,b] = sqrt(a² + b²)
    magnitude_product = np.linalg.norm(vector1) * np.linalg.norm(vector2)

    cosine_theta = dot_product / magnitude_product

    # Angle in radians
    angle_rad = np.arccos(np.clip(cosine_theta, -1.0, 1.0))

    # Converting radians to degrees
    angle_deg = np.degrees(angle_rad)

    return angle_deg


def calculate_angle_three_points(point1, point2, point3):

    # creating vectors
    vector1 = point1 - point2

    vector2 = point3 - point2
    return calculate_angle_between_vectors(vector1, vector2)

def get_upright_avg(angles):
    """ Calculate average of a list of angles. """
    if not angles:
        return 0
    return sum(angles) / len(angles)