from flask import Flask


def create_app(config_path=None):
    '''Flask app factory function'''

    app = Flask(__name__)
    app.debug = True

    _setup_blueprints(app)

    return app


def _setup_blueprints(app):
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    from .frontend import frontend as frontend_blueprint
    app.register_blueprint(frontend_blueprint, url_prefix='')
