import boto3
import os

def handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ['TABLE_NAME']
    table = dynamodb.Table(table_name)
    
    # Example query
    response = table.get_item(Key={'customerId': event['customerId']})
    return response.get('Item', {})
