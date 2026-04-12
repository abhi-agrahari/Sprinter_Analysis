import cv2
import os


def save_uploaded_video(file_data, filename, upload_folder='uploaded_videos'):

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    video_path = os.path.join(upload_folder, filename)

    with open(video_path, 'wb') as f:
        f.write(file_data)

    return video_path


def get_skip_interval(frame_count):
    if frame_count > 1600:
        return 3
    elif frame_count > 800:
        return 2
    return 1


def extract_frames(video_path, skip_interval=1):

    cap = cv2.VideoCapture(video_path)
    frame_idx = 0

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        if frame_idx % skip_interval == 0:
            yield frame
        
        frame_idx += 1

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