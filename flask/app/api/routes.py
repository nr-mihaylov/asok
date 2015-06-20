# import blueprint
from . import api
from flask import jsonify, request


@api.route('/')
def index():
    return jsonify(data='hello there')


@api.route('/locations', methods=['GET', 'POST'])
def locations():
    if request.method == 'GET':
        # TODO: GET- retrieve locations from sqlite
        return jsonify(locations=[])
    else:
        # TODO: POST- save location to sqlite
        return jsonify(status='OK')
