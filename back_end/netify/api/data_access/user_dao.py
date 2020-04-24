import logging

from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

from api.common import errors, validation
from api.data_access import dynamo_db as db
from api.model.model import UserModel
from api.utils.hash_utils import hash_password
from api.utils.id_utils import generate_id
from api.utils.time_utils import generate_timestamp

table = db.dynamo_db.Table('netify_user')


def get_by_email(email):

    try:
        response = table.query(
            IndexName="email-index",
            KeyConditionExpression=Key('email').eq(email)
        )
        logging.debug('dynamo response: ')
        logging.debug(response)
        item = validation.validate_items_exist(response)[0]
        return UserModel.from_dynamo(item)
    except ClientError:
        raise errors.ApiError(errors.internal_server_error)

    except Exception as e:
        if str(e) == 'list index out of range':
            print(e)
            raise errors.ApiError(errors.not_found)
        else:
            raise errors.ApiError(errors.internal_server_error, e)


def get_by_id(_id):
    try:
        logging.debug('retrieve user by id')
        response = table.get_item(
            Key={
                'id': _id
            }
        )
        logging.debug('dynamo response: ', response)
        item = validation.validate_item_exists(response)
        return UserModel.from_dynamo(item)
    except ClientError as e:
        logging.debug(e)
        raise errors.ApiError(errors.internal_server_error)


def delete(user_id):
    try:
        user = get_by_id(user_id)
        table.delete_item(
            Key={
                'id': user_id
            }
        )

        print('deleted:', user.id)

    except errors.ApiError as e:
        if e.api_error.issue == 'NOT_FOUND':
            return

    except ClientError as e:
        raise errors.ApiError(errors.internal_server_error)

    except Exception as e:
        raise errors.ApiError(errors.internal_server_error, e)


def get_all():
    try:
        response = table.scan()
        items = validation.validate_items_exist_quietly(response)
        users = []
        for item in items:
            user = UserModel.from_dynamo(item)
            users.append(user)
        return users

    except ClientError:
        raise errors.ApiError(errors.internal_server_error)

    except errors.ApiError as e:
        raise e

    except Exception as e:
        errors.ApiError(errors.internal_server_error, e)


def create(user):
    logging.debug('creating user...')
    try:
        _id = generate_id()
        logging.debug('id generated')
        user.id = _id
        user.create_time = generate_timestamp()
        user.update_time = user.create_time
        table.put_item(
            Item=user.to_dynamo_dict()
        )
        logging.debug('created user')
        return get_by_id(_id)
    except ClientError as e:
        logging.debug(e)
        logging.debug(str(e))
        raise errors.ApiError(errors.internal_server_error)
    except Exception as e:
        logging.debug(e)
        logging.debug(str(e))
        raise errors.ApiError(errors.internal_server_error)


def update(user):
    try:
        table.update_item(
            Key={
                'id': user.id
            },
            UpdateExpression='set #fn=:fn, #ln=:ln, #e=:e, #p=:p, #u=:u',
            ExpressionAttributeValues={
                ':fn': user.first_name,
                ':ln': user.last_name,
                ':e': user.email,
                ':p': user.phone_number,
                ':u': generate_timestamp()
            },
            ExpressionAttributeNames={
                '#fn': 'first_name',
                '#ln': 'last_name',
                '#e': 'email',
                '#p': 'phone_number',
                '#u': 'update_time'
            }
        )
        return get_by_id(user.id)
    except ClientError as e:
        raise errors.ApiError(errors.internal_server_error, e)

    except errors.ApiError as e:
        raise e

    except Exception as e:
        raise errors.ApiError(errors.internal_server_error, e)