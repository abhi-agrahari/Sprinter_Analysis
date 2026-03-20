import cv2
import numpy as np

EDGES = {
    (0, 1): 'm',    # nose → left_eye
    (0, 2): 'c',    # nose → right_eye
    (1, 3): 'm',    # left_eye → left_ear
    (2, 4): 'c',    # right_eye → right_ear
    (0, 5): 'm',    # nose → left_shoulder
    (0, 6): 'c',    # nose → right_shoulder
    (5, 7): 'm',    # left_shoulder → left_elbow
    (7, 9): 'm',    # left_elbow → left_wrist
    (6, 8): 'c',    # right_shoulder → right_elbow
    (8, 10): 'c',   # right_elbow → right_wrist
    (5, 6): 'y',    # left_shoulder → right_shoulder
    (5, 11): 'm',   # left_shoulder → left_hip
    (6, 12): 'c',   # right_shoulder → right_hip
    (11, 12): 'y',  # left_hip → right_hip
    (11, 13): 'm',  # left_hip → left_knee
    (13, 15): 'm',  # left_knee → left_ankle
    (12, 14): 'c',  # right_hip → right_knee
    (14, 16): 'c',  # right_knee → right_ankle
}

def draw_keypoints(img, keypoints, confidence_threshold):
    y, x, c = frame.shape

    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

    for kp in shaped:
        ky, kx, kp_conf = kp
        if kp_conf >= confidence_threshold:
            cv2.circle(frame, (int(kx), int(ky)), 4, (0, 255, 0), -1)

    def draw_connections(frame, keypoints, edges):
        y, x, c = frame.shape

        for edge, color in edges.items():
            p1, p2 = edge

            y1, x1, c1 = shaped[p1]
            y2, x2, c2 = shaped[p2]

            if(c1 > confidence_threshold) & (c2 > confidence_threshold):
                cv2.line(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)