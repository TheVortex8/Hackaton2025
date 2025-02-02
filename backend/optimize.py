import pandas as pd
from resources import damage_costs_df

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
    for index, wildfire_row in wildfires_df.iterrows():
        miss_cost = damage_costs_df[damage_costs_df['severity'] == wildfire_row['severity']]['cost'].values[0]
        if current_resource is None:
            resource_deployments.append({
                'id': index,
                'reported_time': wildfire_row['timestamp'],
                'estimated_fire_start_time': wildfire_row['fire_start_time'],
                'severity': wildfire_row['severity'],
                'location': wildfire_row['location'],
                'cost': miss_cost,
                'miss_cost': miss_cost
            })
        else:
            resource_deployments.append({
                'id': index,
                'reported_time': wildfire_row['timestamp'],
                'estimated_fire_start_time': wildfire_row['fire_start_time'],
                'severity': wildfire_row['severity'],
                'location': wildfire_row['location'],
                'assigned_resource': current_resource['name'],
                'deployment_time': current_resource['time'],
                'cost': current_resource['cost'],
                'miss_cost': miss_cost
            })
            current_resource['units'] -= 1 
        
        
        if current_resource is not None and current_resource['units'] == 0:
            next_resource_index = resources_df.index.get_loc(current_resource.name) + 1
            if next_resource_index >= len(resources_df): # No more resources to deploy
                current_resource = None 
            else:
                current_resource = resources_df.iloc[next_resource_index]
    return pd.DataFrame(resource_deployments)