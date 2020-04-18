import logging

from api.common import errors


class Model:

    def __init__(self):
        pass

    def to_dict(self):
        pass

    def to_dynamo_dict(self):
        pass

    @classmethod
    def from_request(cls, json):
        pass

    @classmethod
    def from_update_request(cls, json):
        pass

    @classmethod
    def from_dynamo(cls, json):
        pass


class LoginRequestModel(Model):

    def __init__(self, email, password):
        Model.__init__(self)
        self.email = email
        self.password = password

    @classmethod
    def from_request(cls, json):
        try:
            return LoginRequestModel(json['email'], json['password'])
        except KeyError as e:
            raise_bad_request_error(e)

    @classmethod
    def from_dynamo(cls, json):
        pass


class UserModel(Model):

    def __init__(self, email, first_name, last_name, phone_number, timestamp=None, _id=None):
        Model.__init__(self)
        self.id = _id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.phone_number = phone_number
        self.timestamp = timestamp

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'timestamp': self.timestamp
        }

    def to_dynamo_dict(self):
        return self.to_dict()

    @classmethod
    def from_request(cls, json):
        print('building model')
        print(json)
        try:
            return UserModel(
                email=json['email'],
                first_name=json['first_name'],
                last_name=json['last_name'],
                phone_number=json['phone_number']
            )
        except KeyError as e:
            print('key error {}'.format(str(e)))
            raise_bad_request_error(e)

    @classmethod
    def from_dynamo(cls, json):
        logging.debug("user model dynamo db")
        logging.debug(json)
        try:
            return UserModel(
                _id=json['id'],
                email=json['email'],
                first_name=json['first_name'],
                last_name=json['last_name'],
                phone_number=json['phone_number'],
                timestamp=json['timestamp']
            )
        except KeyError as e:
            raise_dynamo_error(e)


class MessageModel(Model):

    def __init__(self, subject, message, timestamp=None, _id=None):
        Model.__init__(self)
        self.id = _id
        self.timestamp = timestamp
        self.subject = subject
        self.message = message

    def to_dict(self):
        return {
            'id': self.id,
            'subject': self.subject,
            'message': self.message,
            'timestamp': self.timestamp
        }

    def to_dynamo_dict(self):
        return self.to_dict()

    @classmethod
    def from_request(cls, json):
        print('building model')
        print(json)
        try:
            return MessageModel(
                subject=json['subject'],
                message=json['message']
            )
        except KeyError as e:
            print('key error {}'.format(str(e)))
            raise_bad_request_error(e)

    @classmethod
    def from_dynamo(cls, json):
        try:
            return MessageModel(
                _id=json['id'],
                subject=json['subject'],
                message=json['message'],
                timestamp=json['timestamp']
            )
        except KeyError as e:
            raise_dynamo_error(e)


def raise_bad_request_error(e):
    raise errors.ApiError(errors.Error('MISSING_REQUIRED_PARAMETER', str(e), 400))


def raise_dynamo_error(e):
    raise errors.ApiError(
        errors.Error('MISSING_EXPECTED_ATTRIBUTE', str(e), 422)
    )
