from flask import Blueprint
from .database import init_db

init_db()
api = Blueprint('api', __name__)


from . import routes