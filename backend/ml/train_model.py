import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def train_multivariate_model():
    # Load dataset
    csv_path = "datasetathlete.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    # skipping spaces in CSV
    df = pd.read_csv(csv_path, skipinitialspace=True)
    
    # removing quotes
    df.columns = df.columns.str.strip('"')

    # input features
    X = df[['Weight', 'Height', 'Gender']]
    
    # output
    targets = [
        'Mean_Deviation_Stride', 
        'Vertical_upright_angle', 
        'Left_elbow', 
        'right_elbow', 
        'left_knee', 
        'right_knee'
    ]
    y = df[targets]

    # splitting data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize Multivariate Multi-output Linear Regression
    # Sklearn's LinearRegression handles multiple targets (y) automatically 
    # by fitting one regressor per target in a single step.
    model = LinearRegression()
    model.fit(X_train, y_train)

    # predictions
    y_pred = model.predict(X_test)

    # model evaluation
    print("Model Evaluation ---")
    for i, target in enumerate(targets):
        mse = mean_squared_error(y_test.iloc[:, i], y_pred[:, i])
        r2 = r2_score(y_test.iloc[:, i], y_pred[:, i])
        print(f"{target}:")
        print(f"  MSE: {mse:.4f}")
        print(f"  R2 Score: {r2:.4f}")

    # saving model
    os.makedirs("models", exist_ok=True)
    model_filename = "models/sprinter_multivariate_model.pkl"
    joblib.dump(model, model_filename)

    print(f"\nModel successfully trained and saved.")

if __name__ == "__main__":
    train_multivariate_model()
