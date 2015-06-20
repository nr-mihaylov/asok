from . import frontend


@frontend.app_errorhandler(404)
def page_not_found(e):
    return 'We could not find this one', 404


@frontend.route('/')
def index():
    return 'hello'
