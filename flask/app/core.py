from flask import Flask
from .api import api as api_blueprint
from .frontend import frontend as frontend_blueprint

def create_app():
    '''Flask app factory function'''

    app = Flask(__name__)
    app.debug = True

    _setup_blueprints(app)

    return app

def _setup_blueprints(app):
    app.register_blueprint(api_blueprint, url_prefix='/api')
    app.register_blueprint(frontend_blueprint, url_prefix='')
