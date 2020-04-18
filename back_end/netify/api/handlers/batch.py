import logging

from api.data_access import user_dao
from utils.coms_utils import send_email, send_sms


def send_messages(event, context):
    records = event.records

    logging.debug(event)
    logging.debug(str(event))

    logging.debug(records)
    logging.debug(str(records))

    users = user_dao.get_all()

    for record in records:
        if record.eventName == 'INSERT':
            subject = record.dynamodb.NewImage.subject.S
            message = record.dynamodb.NewImage.message.S

            for user in users:
                send_sms(user.phone_number, 'You have new message. check your email [{0}]'.format(user.email))
                send_email(user.email, subject, message)
