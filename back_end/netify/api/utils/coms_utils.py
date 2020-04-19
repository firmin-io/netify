import boto3
from botocore.exceptions import ClientError


sns = boto3.client('sns')

ses = boto3.client('ses')


# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
SENDER = 'fsaint1@students.towson.edu'

# The character encoding for the email.
CHARSET = "UTF-8"


def send_sms(phone_number, message):
    sns.publish(PhoneNumber=clean_phone_number(phone_number), Message=message)


def send_email(email, subject, message):
    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = ses.send_email(
            Destination={
                'ToAddresses': [
                    email
                ],
            },
            Message={
                'Body': {
                    'Text': {
                        'Charset': CHARSET,
                        'Data': message,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': '*Netify* {0}'.format(subject),
                },
            },
            Source=SENDER
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def clean_phone_number(phone_number):
    return "+1{0}".format(phone_number.replace('-', ''))
