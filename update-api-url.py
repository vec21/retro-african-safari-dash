#!/usr/bin/env python3
"""
Script to update the API URL in the configuration file after deployment with Pulumi
"""

import sys
import os
import json
import re

def update_api_url(api_url):
    """Updates the API URL in the api-config.js file"""
    config_file = os.path.join('www', 'api-config.js')
    
    if not os.path.exists(config_file):
        print(f"Error: File {config_file} not found")
        return False
    
    try:
        with open(config_file, 'r') as f:
            content = f.read()
        
        # Replace the placeholder with the real URL
        updated_content = content.replace('{{API_URL}}', api_url)
        
        with open(config_file, 'w') as f:
            f.write(updated_content)
        
        print(f"API URL successfully updated: {api_url}")
        return True
    except Exception as e:
        print(f"Error updating API URL: {e}")
        return False

def get_api_url_from_pulumi_output():
    """Gets the API URL from Pulumi output"""
    try:
        # Check if the Pulumi output file exists
        if not os.path.exists('output.json'):
            print("File output.json not found")
            return None
        
        with open('output.json', 'r') as f:
            output = json.load(f)
        
        # Get the API URL from the output
        if 'apiUrl' in output:
            return output['apiUrl']
        else:
            print("API URL not found in Pulumi output")
            return None
    except Exception as e:
        print(f"Error getting API URL: {e}")
        return None

def main():
    """Main function"""
    # Check if the API URL was provided as an argument
    if len(sys.argv) > 1:
        api_url = sys.argv[1]
    else:
        # Try to get the API URL from Pulumi output
        api_url = get_api_url_from_pulumi_output()
        
        if not api_url:
            print("API URL not provided and not found in Pulumi output")
            return 1
    
    # Update the API URL in the configuration file
    if update_api_url(api_url):
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())
