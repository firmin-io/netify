from flask import Flask, request
from flask_cors import CORS
import logging

from api.handlers import user
from api.handlers import message


netify = Flask(__name__)
CORS(netify)


def get_auth_header(r):
    try:
        return str(r.headers['Authorization']).replace('"', '')
    except Exception as e:
        logging.debug(e)
        return ''


def build_event_with_path_params(r, param_name, param_value):
    return {
        'body': str(r.json).replace("'", '"').replace('True', 'true').replace('False', 'false'),
        'headers': {
            'Authorization': get_auth_header(r)
        },
        'pathParameters': {
            param_name: param_value
        }
    }
    

def build_event_with_path_params_without_body(r, param_name, param_value):
    return {
        'headers': {
            'Authorization': get_auth_header(r)
        },
        'pathParameters': {
            param_name: param_value
        }
    }


def build_event(r):
    return {
        'body': str(r.json).replace("'", '"').replace('True', 'true').replace('False', 'false'),
        'headers': {
            'Authorization': get_auth_header(r)
        },
    }


@netify.route('/netify/login', methods=['POST'])
def login():
    event = build_event(request)
    logging.debug(event)
    res = user.login(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/users', methods=['POST'])
def create_user():
    event = build_event(request)
    logging.debug(event)
    res = user.create_user(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/users', methods=['PUT'])
def update_user():
    event = build_event(request)
    logging.debug(event)
    res = user.update_user(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/users', methods=['GET'])
def get_users():
    event = build_event(request)
    logging.debug(event)
    res = user.get_users(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    event = build_event_with_path_params(request, 'user_id', user_id)
    logging.debug(event)
    res = user.delete_user(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/messages', methods=['POST'])
def create_message():
    event = build_event(request)
    logging.debug(event)
    res = message.create_message(event, None)
    return res['body'], res['statusCode']


@netify.route('/netify/messages', methods=['GET'])
def get_messages():
    event = build_event(request)
    logging.debug(event)
    res = message.get_messages(event, None)
    return res['body'], res['statusCode']


if __name__ == '__main__':
    netify.run(debug=True)
