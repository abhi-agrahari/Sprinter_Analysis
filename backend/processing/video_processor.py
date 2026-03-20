import cv2
import os


def save_uploaded_video(file_data, filename, upload_folder='uploaded_videos'):

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    video_path = os.path.join(upload_folder, filename)

    with open(video_path, 'wb') as f:
        f.write(file_data)

    return video_path


def extract_frames(video_path):

    cap = cv2.VideoCapture(video_path)

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        yield frame

    cap.release()


def get_video_info(video_path):

    cap = cv2.VideoCapture(video_path)

    info = {
        'fps': cap.get(cv2.CAP_PROP_FPS),

        'frame_count': int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),

        'width': int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
    }

    cap.release()
    return info