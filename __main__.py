import pulumi
import pulumi_aws as aws
import pulumi_synced_folder as synced_folder
import json
import os
import pulumi_random as random

# Import the program's configuration settings.
config = pulumi.Config()
path = config.get("path") or "./www"
index_document = config.get("indexDocument") or "index.html"
error_document = config.get("errorDocument") or "error.html"
region = aws.config.region or "us-east-1"

# Criar um sufixo aleatório para o nome do bucket
bucket_suffix = random.RandomString("bucket-suffix",
    length=8,
    special=False,
    upper=False
)

# Create an S3 bucket with a unique name
bucket = aws.s3.BucketV2("bucket",
    bucket=pulumi.Output.concat("retro-safari-dash-", bucket_suffix.result)
)

# Configure the bucket as a website
bucket_website = aws.s3.BucketWebsiteConfigurationV2(
    "bucket-website",
    bucket=bucket.bucket,
    index_document={"suffix": index_document},
    error_document={"key": error_document},
)

# Set ownership controls for the new bucket
ownership_controls = aws.s3.BucketOwnershipControls(
    "ownership-controls",
    bucket=bucket.bucket,
    rule={
        "object_ownership": "ObjectWriter",
    },
)

# Configure public ACL block on the new bucket
public_access_block = aws.s3.BucketPublicAccessBlock(
    "public-access-block",
    bucket=bucket.bucket,
    block_public_acls=False,
)

# Export the bucket name for reference
pulumi.export("bucketName", bucket.bucket)

# Use a synced folder to manage the files of the website.
bucket_folder = synced_folder.S3BucketFolder(
    "bucket-folder",
    acl="public-read",
    bucket_name=bucket.bucket,
    path=path,
    opts=pulumi.ResourceOptions(depends_on=[bucket, ownership_controls, public_access_block]),
)

# Create a CloudFront CDN to distribute and cache the website.
cdn = aws.cloudfront.Distribution(
    "cdn",
    enabled=True,
    origins=[
        {
            "origin_id": bucket.arn,
            "domain_name": bucket_website.website_endpoint,
            "custom_origin_config": {
                "origin_protocol_policy": "http-only",
                "http_port": 80,
                "https_port": 443,
                "origin_ssl_protocols": ["TLSv1.2"],
            },
        }
    ],
    default_cache_behavior={
        "target_origin_id": bucket.arn,
        "viewer_protocol_policy": "redirect-to-https",
        "allowed_methods": [
            "GET",
            "HEAD",
            "OPTIONS",
        ],
        "cached_methods": [
            "GET",
            "HEAD",
            "OPTIONS",
        ],
        "default_ttl": 600,
        "max_ttl": 600,
        "min_ttl": 600,
        "forwarded_values": {
            "query_string": True,
            "cookies": {
                "forward": "all",
            },
        },
    },
    price_class="PriceClass_100",
    custom_error_responses=[
        {
            "error_code": 404,
            "response_code": 404,
            "response_page_path": f"/{error_document}",
        }
    ],
    restrictions={
        "geo_restriction": {
            "restriction_type": "none",
        },
    },
    viewer_certificate={
        "cloudfront_default_certificate": True,
    },
)

# Export the URLs and hostnames of the bucket and distribution.
pulumi.export("originURL", pulumi.Output.concat("http://", bucket_website.website_endpoint))
pulumi.export("originHostname", bucket_website.website_endpoint)
pulumi.export("cdnURL", pulumi.Output.concat("https://", cdn.domain_name))
pulumi.export("cdnHostname", cdn.domain_name)

# Create a DynamoDB table for the game leaderboard
leaderboard_table = aws.dynamodb.Table("leaderboard",
    attributes=[
        aws.dynamodb.TableAttributeArgs(
            name="id",
            type="S",
        ),
        aws.dynamodb.TableAttributeArgs(
            name="score",
            type="N",
        ),
    ],
    hash_key="id",
    global_secondary_indexes=[
        aws.dynamodb.TableGlobalSecondaryIndexArgs(
            name="ScoreIndex",
            hash_key="id",
            range_key="score",
            projection_type="ALL",
            read_capacity=5,
            write_capacity=5,
        ),
    ],
    billing_mode="PROVISIONED",
    read_capacity=5,
    write_capacity=5,
)

# IAM role for the Lambda function
lambda_role = aws.iam.Role("lambdaRole",
    assume_role_policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [{
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "lambda.amazonaws.com",
            },
            "Effect": "Allow",
            "Sid": "",
        }],
    }),
)

# Attach policies to the Lambda role
lambda_policy = aws.iam.RolePolicy("lambdaPolicy",
    role=lambda_role.id,
    policy=pulumi.Output.all(leaderboard_table.arn).apply(
        lambda arn: json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Action": [
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Scan",
                    "dynamodb:Query",
                ],
                "Resource": arn,
                "Effect": "Allow",
            }, {
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                ],
                "Resource": "arn:aws:logs:*:*:*",
                "Effect": "Allow",
            }],
        })
    ),
)

# Create Lambda function for leaderboard operations
leaderboard_lambda = aws.lambda_.Function("leaderboardLambda",
    code=pulumi.AssetArchive({
        ".": pulumi.FileArchive("./lambda"),
    }),
    role=lambda_role.arn,
    handler="index.handler",
    runtime="nodejs18.x",
    environment={
        "variables": {
            "LEADERBOARD_TABLE": leaderboard_table.name,
        },
    },
)

# Create API Gateway REST API
api = aws.apigateway.RestApi("gameApi",
    description="API for Retro African Safari Dash game",
)

# Create API resource and method for leaderboard
leaderboard_resource = aws.apigateway.Resource("leaderboardResource",
    rest_api=api.id,
    parent_id=api.root_resource_id,
    path_part="leaderboard",
)

# GET method for retrieving leaderboard
get_method = aws.apigateway.Method("getMethod",
    rest_api=api.id,
    resource_id=leaderboard_resource.id,
    http_method="GET",
    authorization="NONE",
)

get_integration = aws.apigateway.Integration("getIntegration",
    rest_api=api.id,
    resource_id=leaderboard_resource.id,
    http_method=get_method.http_method,
    integration_http_method="POST",
    type="AWS_PROXY",
    uri=leaderboard_lambda.invoke_arn,
)

# POST method for submitting scores
post_method = aws.apigateway.Method("postMethod",
    rest_api=api.id,
    resource_id=leaderboard_resource.id,
    http_method="POST",
    authorization="NONE",
)

post_integration = aws.apigateway.Integration("postIntegration",
    rest_api=api.id,
    resource_id=leaderboard_resource.id,
    http_method=post_method.http_method,
    integration_http_method="POST",
    type="AWS_PROXY",
    uri=leaderboard_lambda.invoke_arn,
)

# Deploy the API
deployment = aws.apigateway.Deployment("apiDeployment",
    rest_api=api.id,
    # Ensure the deployment happens after the routes are configured
    opts=pulumi.ResourceOptions(depends_on=[
        get_integration,
        post_integration,
    ]),
)

stage = aws.apigateway.Stage("apiStage",
    deployment=deployment.id,
    rest_api=api.id,
    stage_name="v1",
)

# Allow API Gateway to invoke the Lambda function
lambda_permission = aws.lambda_.Permission("lambdaPermission",
    action="lambda:InvokeFunction",
    function=leaderboard_lambda.name,
    principal="apigateway.amazonaws.com",
    source_arn=pulumi.Output.concat(api.execution_arn, "/*/*"),
)

# Export the API URL
pulumi.export("apiUrl", pulumi.Output.concat(stage.invoke_url, "/leaderboard"))
pulumi.export("leaderboardTableName", leaderboard_table.name)
