import uuid

from utils.time_utils import generate_time_uuid


def generate_id():
    return str(generate_time_uuid())


def generate_debug_id():
    return 'di-{}'.format(generate_id())

