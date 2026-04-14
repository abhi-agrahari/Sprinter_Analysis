import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os

def train_random_forest_model():
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
    X = df[['Weight', 'Height', 'Gender']].copy()

    # initialize and fit scaler on Height and Weight
    from sklearn.preprocessing import MinMaxScaler
    scaler = MinMaxScaler()
    X[['Weight', 'Height']] = scaler.fit_transform(X[['Weight', 'Height']])
    
    # output
    targets = [
        'pelvic_tilt',
        'vertical_upright_angle',
        'left_elbow',
        'right_elbow', 
        'left_knee', 
        'right_knee'
    ]
    y = df[targets]

    # splitting data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # initialize Random Forest Multi-output Regressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # predictions
    y_pred = model.predict(X_test)

    # model evaluation
    print(f"\nModel Evaluation ---")
    for i, target in enumerate(targets):
        actual = y_test.iloc[:, i]
        predicted = y_pred[:, i]
        
        mse = mean_squared_error(actual, predicted)
        mae = mean_absolute_error(actual, predicted)
        rmse = np.sqrt(mse)
        r2 = r2_score(actual, predicted)
        
        # Calculate "Accuracy" with sensible tolerances
        if 'pelvic' in target.lower():
            # Pelvic tilt tolerance of 2.0 degrees
            tolerance = 2.0
        elif 'upright' in target.lower():
            # Upright angle tolerance of 2.0 degrees
            tolerance = 2.0
        else:
            # Other angles: 10% of mean or at least 10 degrees
            tolerance = max(10.0, 0.10 * np.mean(actual))
            
        accuracy = np.mean(np.abs(actual - predicted) < tolerance) * 100
        
        print(f"{target}:")
        print(f"  MAE: {mae:.4f}")
        print(f"  RMSE: {rmse:.4f}")
        print(f"  R2: {r2:.4f}")
        print(f"  Accuracy (within tolerance): {accuracy:.2f}%")

    # saving model and scaler
    os.makedirs("model_files", exist_ok=True)
    model_filename = "model_files/sprinter_random_forest_model.pkl"
    # save both model and scaler in a dictionary for consistent loading
    save_dict = {
        'model': model,
        'scaler': scaler
    }
    joblib.dump(save_dict, model_filename)

    print(f"\nModel and Scaler successfully trained and saved.")

if __name__ == "__main__":
    train_random_forest_model()
