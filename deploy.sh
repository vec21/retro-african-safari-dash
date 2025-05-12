#!/bin/bash
# Script to deploy the Retro African Safari Dash game

# Check if Pulumi is installed
if ! command -v pulumi &> /dev/null; then
    echo "Error: Pulumi is not installed"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS CLI is not properly configured"
    exit 1
fi

echo "Starting deployment of Retro African Safari Dash game..."

# Update Pulumi state (without the --yes flag)
echo "Updating Pulumi state..."
pulumi stack refresh

# Install pulumi_random package if not installed
echo "Checking dependencies..."
pip install pulumi_random

# First, create only the S3 bucket and related configurations
echo "Creating S3 bucket and related configurations..."
pulumi up --yes --target aws:s3:BucketV2 --target aws:s3:BucketWebsiteConfigurationV2 --target aws:s3:BucketOwnershipControls --target aws:s3:BucketPublicAccessBlock

# Wait a moment to ensure the bucket is available
echo "Waiting for S3 bucket to become available..."
sleep 10

# Now, do the complete deployment
echo "Performing complete deployment..."
pulumi up --yes

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
fi

# Save Pulumi output to a file
echo "Saving Pulumi output..."
pulumi stack output --json > output.json

# Extract API URL from output
API_URL=$(jq -r '.apiUrl' output.json)

if [ -z "$API_URL" ] || [ "$API_URL" == "null" ]; then
    echo "Warning: API URL not found in Pulumi output"
else
    echo "API URL: $API_URL"
    
    # Update API URL in configuration file
    echo "Updating API URL in configuration file..."
    ./update-api-url.py "$API_URL"
    
    # Sync updated files with S3 again
    echo "Syncing updated files with S3..."
    pulumi up --yes
fi

echo "Deployment completed successfully!"
echo "Game URL: $(jq -r '.cdnURL' output.json)"
exit 0
