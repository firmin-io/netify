import logging

from api.data_access import user_dao
from api.utils.coms_utils import send_email, send_sms


def send_messages(event, context):
    logging.debug('stream event')
    logging.debug(event)
    logging.debug(str(event))

    records = event['Records']

    logging.debug(records)
    logging.debug(str(records))

    users = user_dao.get_all()

    for record in records:
        logging.debug("event record")
        logging.debug(record)
        if record['eventName'] == 'INSERT':
            subject = record['dynamodb']['NewImage']['subject']['S']
            message = record['dynamodb']['NewImage']['message']['S']

            for user in users:
                send_sms(user.phone_number, '*Netify* You have new message. Please check your email [{0}]'.format(user.email))
                send_email(user.email, subject, message)
