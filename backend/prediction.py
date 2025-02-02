import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
from imblearn.over_sampling import SMOTE
import os

severity_map = {'': 0, 'low': 1, 'medium': 2, 'high': 3}

def get_environment_data(environment_history_df:pd.DataFrame) -> np.ndarray:
  return np.array([[environment_entry['temperature'],
                    environment_entry['humidity'],
                    environment_entry['wind_speed'],
                    environment_entry['precipitation'], 
                    environment_entry['human_activity_index'], 
                    environment_entry['latitude'], 
                    environment_entry['longitude'] ] 
                    for _,environment_entry  in environment_history_df.iterrows()])

# X: wildfire history
# Y: environment history
def categorize_by_severity(wildfire_history_df: pd.DataFrame, environment_history_df: pd.DataFrame) -> np.ndarray[int]:
  severity_by_timestamp = np.array([])
  for environment_timestamp in environment_history_df['timestamp']:
    matching_wildfires: pd.DataFrame = wildfire_history_df[wildfire_history_df['timestamp'] == environment_timestamp]
    
    severity_level = ''
    if not matching_wildfires.empty:
      severity_level = matching_wildfires['severity'].iloc[0]
    severity_by_timestamp = np.append(severity_by_timestamp, severity_map[severity_level])
      
  return severity_by_timestamp

def create_model(environment_history_df_values: np.ndarray,severity_by_timestamp:np.ndarray[int]) -> RandomForestClassifier:
  X = environment_history_df_values
  y = severity_by_timestamp
  X_train, X_test, y_train, y_test = train_test_split(X,y )

  model = RandomForestClassifier(class_weight={0: 1, 1: 25, 2: 25, 3: 25}, random_state=42, min_samples_leaf=1, max_features='sqrt')
  smote = SMOTE(sampling_strategy={1: 3500, 2: 3500, 3: 3500},  random_state=42)
  new_X, new_Y = smote.fit_resample(X_train, y_train)
  
  model.fit(new_X, new_Y)

  y_pred = model.predict(X_test)
  mse = mean_squared_error(y_test, y_pred)
  print(f"Erreur quadratique moyenne (MSE) : {mse}")

  print("Prédictions : ", y_pred)
  return model

def get_future_wildfire(model:RandomForestClassifier) -> pd.DataFrame:
  future_environment_df = pd.read_csv('dataset/future_environmental_data.csv')
  future_environment = get_environment_data(future_environment_df)
  future_wildfire_severity =  model.predict(future_environment)

  future_wildfire = []
  for index in range(len(future_wildfire_severity)):
    severity = future_wildfire_severity[index]
    if(severity == 0):
      continue

    latitude = future_environment_df["latitude"][index]
    longitude = future_environment_df["longitude"][index]

    location = f"{latitude},{longitude}"

    future_wildfire.append({
      "timestamp":future_environment_df["timestamp"][index],
      "fire_start_time": future_environment_df["timestamp"][index],
      "location": location,
      "severity": severity,   
    })
  return pd.DataFrame(future_wildfire)

def get_prediction() -> pd.DataFrame:
  wildfire_history_df = pd.read_csv('dataset/historical_wildfiredata.csv')
  environment_history_df = pd.read_csv('dataset/historical_environmental_data.csv')

  environment_data = get_environment_data(environment_history_df)
  severity_by_timestamp =  categorize_by_severity(wildfire_history_df, environment_history_df)
  
  model = create_model(environment_data, severity_by_timestamp)

  future_wildfire = get_future_wildfire(model)

  os.makedirs('generated', exist_ok=True)
  future_wildfire.to_csv("generated/predictions.csv", index=False, encoding="utf-8")

  return future_wildfire



get_prediction()






  



   
    
            
