import joblib
import pandas as pd


class SprintPredictor:

    def __init__(self, model_path='model_files/sprinter_multivariate_model.pkl'):

        # loading the model and scaler
        data = joblib.load(model_path)

        # extracting model and scaler from the dictionary
        self.model = data['model']
        self.scaler = data['scaler']

        # output column names
        self.column_names = [
            'mean_deviation_stride',
            'vertical_upright_angle',
            'Left_elbow',
            'right_elbow',
            'left_knee',
            'right_knee'
        ]

    def predict_ideal_values(self, height_cm, weight_kg, gender):

        gender_numeric = 1 if gender == 'Male' else 0

        # creating dataframe of input
        input_data = pd.DataFrame({
            'Weight': [weight_kg],
            'Height': [height_cm],
            'Gender': [gender_numeric]
        })

        # normalizing weight and height
        input_data[['Weight', 'Height']] = self.scaler.transform(
            input_data[['Weight', 'Height']]
        )

        # making predictions
        predicted_values = self.model.predict(input_data)

        # converting result into dictionary
        result = {}
        for i, col_name in enumerate(self.column_names):
            result[col_name] = float(predicted_values[0][i])

        return result