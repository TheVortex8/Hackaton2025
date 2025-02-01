import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import mean_squared_error


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


def initialize_model(environment_history_df_values: np.ndarray,severity_by_timestamp:np.ndarray[int]) -> RandomForestClassifier:
  X = environment_history_df_values
  y = severity_by_timestamp
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

  model = RandomForestClassifier(class_weight={0: 1, 1: 10, 2: 10, 3: 10}, random_state=42)
  model.fit(X_train, y_train)

  y_pred = model.predict(X_test)

  mse = mean_squared_error(y_test, y_pred)
  print(f"Erreur quadratique moyenne (MSE) : {mse}")

  print("Prédictions : ", y_pred)
  return model


if __name__ == '__main__':
  wildfire_history_df = pd.read_csv('dataset/historical_wildfiredata.csv')
  environment_history_df = pd.read_csv('dataset/historical_environmental_data.csv')

  environment_data = get_environment_data(environment_history_df)
  severity_by_timestamp =  categorize_by_severity(wildfire_history_df, environment_history_df)
  
  model = initialize_model(environment_data, severity_by_timestamp)
    
            
