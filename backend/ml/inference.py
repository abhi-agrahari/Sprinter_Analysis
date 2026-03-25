import tensorflow as tf
import numpy as np
import cv2


def load_movenet():
    # loading movenet model from tflite file
    interpreter = tf.lite.Interpreter(model_path="model_files/lite-model_movenet_singlepose_lightning_3.tflite")
    interpreter.allocate_tensors()

    def movenet(input_image):
        # getting input and output details
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # setting tensor
        interpreter.set_tensor(input_details[0]['index'], input_image.numpy())

        # running inference
        interpreter.invoke()

        # getting output
        keypoints = interpreter.get_tensor(output_details[0]['index'])

        return {'output_0': tf.constant(keypoints)}

    return movenet


def run_inference(movenet, frame):

    # converting BGR to RGB (movenet expects RGB)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # resizing frame
    input_image = tf.image.resize(np.expand_dims(frame_rgb, axis=0), (192, 192))
    input_image = tf.cast(input_image, dtype=tf.float32)

    # running model
    outputs = movenet(input_image)
    keypoints_with_scores = outputs['output_0'].numpy()

    return keypoints_with_scores