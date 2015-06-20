from . import frontend
from flask import render_template


@frontend.app_errorhandler(404)
def page_not_found(e):
    return 'Page not found', 404


# Render HTML
@frontend.route('/')
def index():
    return render_template('index.html')
