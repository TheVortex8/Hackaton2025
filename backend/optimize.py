import pandas as pd

def optimize(wildfires_df: pd.DataFrame, resources_df: pd.DataFrame): 
    wildfires_df.sort_values(by='severity', key=lambda x: x.map({'high': 1, 'medium': 2, 'low': 3}), inplace=True)
    resources_df.sort_values(by='cost', inplace=True)

    resources = {}
    for _, resources_row in resources_df.iterrows():
        resource_name = resources_row['name']
        resources[resource_name] = {
            'time': resources_row['time'],
            'cost': resources_row['cost'],
            'units': resources_row['units']
        }
    
    resource_deployments = []
    current_resource = resources_df.iloc[0]
    for _, wildfire_row in wildfires_df.iterrows():
        resource_deployments.append({
            'reported_time': wildfire_row['timestamp'],
            'estimated_fire_start_time': wildfire_row['fire_start_time'],
            'severity': wildfire_row['severity'],
            'location': wildfire_row['location'],
            'assigned_resource': current_resource['name'],
            'deployment_time': current_resource['time'],
            'cost': current_resource['cost']
        })
        current_resource['units'] -= 1 
        
        
        if current_resource['units'] == 0:
            next_resource_index = resources_df.index.get_loc(current_resource.name) + 1
            if next_resource_index >= len(resources_df): # No more resources to deploy
                break 
            
            current_resource = resources_df.iloc[next_resource_index]

    return pd.DataFrame(resource_deployments)