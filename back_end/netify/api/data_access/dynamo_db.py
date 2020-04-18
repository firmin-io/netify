import logging

import boto3
from api.utils.env_utils import get_env

env = get_env()

logging.debug('ENV = ' + env)

tables_created = False


def create_tables(d):
    logging.debug('creating tables')

    logging.debug('creating user table')
    # user
    d.create_table(
        TableName='netify_user',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'email',
                'AttributeType': 'S'
            }

        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        },
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'email-index',
                'KeySchema': [
                    {
                        'AttributeName': 'email',
                        'KeyType': 'HASH'  # Partition key
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 10,
                    'WriteCapacityUnits': 10
                }
            }
        ]
    )

    logging.debug('creating message table')
    # message
    d.create_table(
        TableName='netify_message',
        KeySchema=[
            {
                'AttributeName': 'id',
                'KeyType': 'HASH'  # Partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'id',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )




if env == 'PROD':
    dynamo_db = boto3.resource('dynamodb')
else:
    dynamo_db = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
    if not tables_created:
        try:
            create_tables(dynamo_db)
            tables_created = True
            logging.debug("****All tables created")
        except Exception as e:
            logging.debug('bleep encountered')
            logging.debug(e)




