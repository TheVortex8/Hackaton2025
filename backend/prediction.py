import pandas as pd
import numpy as np


severity_map = {'': 0, 'low': 1, 'medium': 2, 'high': 3}

# X: wildfire history
# Y: environment history
def categorize_by_severity(wildfire_history_df: pd.DataFrame, environment_history_df: pd.DataFrame) -> dict:
  severity_by_timestamp = np.array([])
  for environment_timestamp in environment_history_df['timestamp']:
    matching_wildfires: pd.DataFrame = wildfire_history_df[wildfire_history_df['timestamp'] == environment_timestamp]
    
    severity_level = ''
    if not matching_wildfires.empty:
      severity_level = matching_wildfires['severity'].iloc[0]
    severity_by_timestamp = np.append(severity_by_timestamp, severity_map[severity_level])
      
  return severity_by_timestamp

if __name__ == '__main__':
  wildfire_history_df = pd.read_csv('dataset/historical_wildfiredata.csv')
  environment_history_df = pd.read_csv('dataset/historical_environmental_data.csv')

  severity_by_timestamp =  categorize_by_severity(wildfire_history_df, environment_history_df)
  
    
            
