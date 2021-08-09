import json
import boto3
import os
from datetime import datetime

s3 = boto3.client('s3')
dynamoDB = boto3.client('dynamodb')

def lambda_handler(event, context):

    print(event)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda! Github ')
    }

