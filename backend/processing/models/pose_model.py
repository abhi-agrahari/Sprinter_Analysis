import tensorflow as tf
import numpy as np

class PoseModel:

    def __init__(self, model_path='model_files/lite-model_movenet_singlepose_lightning_3.tflite'):

        self.interpreter = tf.lite.Interpreter(model_path=model_path)

        self.interpreter.allocate_tensors()

        self.input_details = self.interpreter.get_input_details()

        self.output_details = self.interpreter.get_output_details()

    def detect_keypoints(self, frame):
        img = frame.copy()

        input_image = tf.image.resize(np.expand_dims(img, axis=0), dimension[192, 192])

        input_image = tf.cast(input_image, tf.float32)

        self.interpreter.set_tensor(self.input_details[0]['index'], np.array(input_image))

        self.interpreter.invoke()

        keypoints_with_scores = self.interpreter.get_tensor(self.output_details[0]['index'])

        return keypoints_with_scores