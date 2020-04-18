import logging

from botocore.exceptions import ClientError

from api.common import errors, validation
from api.data_access import dynamo_db as db
from api.model.model import MessageModel
from api.utils.id_utils import generate_id
from api.utils.time_utils import generate_timestamp

table = db.dynamo_db.Table('netify_message')


def get_all():
    try:
        response = table.scan()
        items = validation.validate_items_exist_quietly(response)
        messages = []
        for item in items:
            message = MessageModel.from_dynamo(item)
            messages.append(message)
        return messages

    except ClientError:
        raise errors.ApiError(errors.internal_server_error)

    except errors.ApiError as e:
        raise e

    except Exception as e:
        errors.ApiError(errors.internal_server_error, e)


def get_by_id(_id):
    try:
        logging.debug('getting quiz by id')
        response = table.get_item(
            Key={
                'id': _id
            }
        )
        logging.debug('got quiz by id')
        item = validation.validate_item_exists(response)
        logging.debug('got item')
        message = MessageModel.from_dynamo(item)
        logging.debug(message.to_dynamo_dict())
        return message

    except ClientError:
        raise errors.ApiError(errors.internal_server_error)

    except errors.ApiError as e:
        raise e

    except Exception as e:
        raise errors.ApiError(errors.internal_server_error, e)


def delete(message_id):
    try:
        message = get_by_id(message_id)
        table.delete_item(
            Key={
                'id': message_id
            }
        )

        print('deleted:', message.id)

    except errors.ApiError as e:
        if e.api_error.issue == 'NOT_FOUND':
            return

    except ClientError as e:
        raise errors.ApiError(errors.internal_server_error)

    except Exception as e:
        raise errors.ApiError(errors.internal_server_error, e)


def create(message):
    try:
        logging.debug('creating message')
        _id = generate_id()
        message.id = _id
        message.timestamp = generate_timestamp()
        table.put_item(
            Item=message.to_dynamo_dict()
        )
        logging.debug('created message')
        return get_by_id(_id)

    except ClientError as e:
        raise errors.ApiError(errors.internal_server_error, e)

    except errors.ApiError as e:
        raise e

    except Exception as e:
        raise errors.ApiError(errors.internal_server_error, e)


