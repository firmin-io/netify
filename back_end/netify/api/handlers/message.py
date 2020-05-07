import json
import logging

from api.common import errors
from api.data_access import message_dao
from api.model.model import MessageModel
from api.utils.api_utils import build_response_with_body


def create_message(event, context):
    try:
        message_request = MessageModel.from_request(json.loads(event['body']))
        logging.debug(message_request.to_dict())
        message = message_dao.create(message_request)

        logging.debug(message)
        logging.debug(message.to_dict())

        return build_response_with_body(201, message.to_dict())

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def get_messages(event, context):
    try:
        items = message_dao.get_all()
        if items is None:
            items = []
        messages = [item.to_dict() for item in items if items]
        return build_response_with_body(200, messages)

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))