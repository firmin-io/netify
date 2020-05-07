import json
import logging

from api.common import errors
from api.data_access import user_dao
from api.model.model import LoginRequestModel, UserModel
from api.utils.api_utils import build_response_with_body, build_response_without_body


def login(event, context):
    try:
        login_request = LoginRequestModel.from_request(json.loads(event['body']))

        if login_request.email == 'admin@n3tify.net' and login_request.password == 'password':
            return build_response_without_body(204)

        if login_request.email == 'test@n3tify.net' and login_request.password == 'n3tify_test_account':
            return build_response_without_body(204)

        return errors.build_response_from_api_error(errors.ApiError(errors.invalid_user_name_or_password))

    except errors.ApiError as e:
        print(e)
        if e.api_error.issue == 'NOT_FOUND':
            return errors.build_response_from_api_error(errors.ApiError(errors.invalid_user_name_or_password))
        else:
            return errors.build_response_from_api_error(e)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def create_user(event, context):
    try:
        user_request = UserModel.from_request(json.loads(event['body']))
        validate_user_does_not_exist(user_request.email)
        logging.debug(user_request.to_dict())
        user = user_dao.create(user_request)
        logging.debug(user)
        logging.debug(user.to_dict())
        return build_response_with_body(201, user.to_dict())

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def update_user(event, context):
    try:
        user_request = UserModel.from_update_request(json.loads(event['body']))
        logging.debug(user_request.to_dict())
        user = user_dao.update(user_request)
        logging.debug(user)
        logging.debug(user.to_dict())
        return build_response_with_body(200, user.to_dict())

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def delete_user(event, context):
    try:
        user_dao.delete(event['pathParameters']['user_id'])
        return build_response_without_body(204)

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except KeyError as e:
        return errors.build_response_from_api_error(errors.Error('MISSING_REQUIRED_PARAMETER', str(e), 400))

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def get_users(event, context):
    try:
        items = user_dao.get_all()
        if items is None:
            items = []
        users = [item.to_dict() for item in items if items]
        return build_response_with_body(200, users)

    except errors.ApiError as ae:
        return errors.build_response_from_api_error(ae)

    except Exception as e:
        return errors.build_response_from_api_error(errors.ApiError(errors.internal_server_error, e))


def validate_user_does_not_exist(email):
    try:
        user = user_dao.get_by_email(email)
        logging.debug('user.id {}'.format(user.id))
        raise errors.ApiError(errors.already_registered)
    except errors.ApiError as e:
        logging.debug(e)
        if e.api_error.issue == 'ALREADY_REGISTERED':
            logging.debug('user exists')
            raise e

    except Exception as e:
        if e == 'list index out of range':
            return
