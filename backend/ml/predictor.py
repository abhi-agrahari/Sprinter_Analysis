import joblib
import pandas as pd


class SprintPredictor:

    def __init__(self, model_path='model_files/sprinter_multivariate_model.pkl'):

        # loading the model and scaler
        data = joblib.load(model_path)

        # extracting both from the dictionary
        self.model = data['model']
        self.scaler = data['scaler']

        # output column names matching train_model.py and datasetathlete.csv
        self.column_names = [
            'Mean_Deviation_Stride',
            'Vertical_upright_angle',
            'Left_elbow',
            'right_elbow',
            'left_knee',
            'right_knee'
        ]

    def predict_ideal_values(self, height_cm, weight_kg, gender):

        gender_numeric = 1 if gender == 'Male' else 0

        # creating dataframe of input with SAME order as training
        input_data = pd.DataFrame({
            'Weight': [weight_kg],
            'Height': [height_cm],
            'Gender': [gender_numeric]
        })

        # normalizing weight and height using the same order as fit
        input_data[['Weight', 'Height']] = self.scaler.transform(
            input_data[['Weight', 'Height']]
        )

        # making predictions (input_data now has correct order and scaling)
        predicted_values = self.model.predict(input_data)

        # converting result into dictionary
        result = {}
        for i, col_name in enumerate(self.column_names):
            result[col_name] = float(predicted_values[0][i])

        return result