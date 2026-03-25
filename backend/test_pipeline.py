import cv2
import os

from processing.video_processor import extract_frames, get_video_info
from processing.keypoint_drawer import draw_keypoints
from calculations.knee_angles import calculate_knee_angles
from calculations.elbow_flaring import calculate_elbow_flaring
from calculations.pelvic_tilt import calculate_pelvic_tilt
from ml.inference import load_movenet, run_inference

# Video path
VIDEO_PATH = "videos/sprinter.mp4"
OUTPUT_PATH = "videos/sprinter_processed.mp4"

def main():
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: Could not find video at {VIDEO_PATH}")
        return

    info = get_video_info(VIDEO_PATH)
    print(f"Processing Video: {info['width']}x{info['height']} at {info['fps']} fps")

    # loading movenet model
    print("Loading MoveNet model...")
    movenet = load_movenet()

    # writing on video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(OUTPUT_PATH, fourcc, info['fps'], (info['width'], info['height']))

    print("Beginning processing...")
    frame_count = 0
    for frame in extract_frames(VIDEO_PATH):

        keypoints_with_scores = run_inference(movenet, frame)

        # drawing keypoints
        draw_keypoints(frame, keypoints_with_scores[0, 0], confidence_threshold=0.3)

        # calculating angles
        l_knee, r_knee = calculate_knee_angles(keypoints_with_scores)
        l_elbow_flare, r_elbow_flare = calculate_elbow_flaring(keypoints_with_scores)
        p_tilt = calculate_pelvic_tilt(keypoints_with_scores)

        # writing result on frame
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, f"L-Knee: {int(l_knee)}'  R-Knee: {int(r_knee)}'", (10, 50), font, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Elbow Flare: {int(l_elbow_flare)}'", (10, 100), font, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Pelvic Tilt: {int(p_tilt)}'", (10, 150), font, 1, (255, 255, 255), 2)

        # adding frame to output video
        out.write(frame)

        frame_count += 1
        if frame_count % 10 == 0:
            print(f"Processed {frame_count} frames...")

    out.release()
    print(f"Successfully processed {frame_count} frames. Output saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
