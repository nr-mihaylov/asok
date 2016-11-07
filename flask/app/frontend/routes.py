from . import frontend
from flask import render_template

@frontend.app_errorhandler(404)
def page_not_found(e):
    return 'This is not the location you are looking for.', 404

@frontend.route('/')
def index():
    return render_template('index.html')
