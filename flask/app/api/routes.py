# import blueprint
from . import api
from flask import request, jsonify
from .database import session, Location

def isFloat(f):
    try:
        float(f)
        return True
    except ValueError:
        return False

def isInt(f):
    try:
        int(f)
        return True
    except ValueError:
        return False

@api.route('/location/<int:id>', methods=['GET', 'DELETE'])
def locationWithId(id):

    if request.method == 'GET':
        loc = Location.query.filter(Location.id == id).first()
        if loc == None: 
            return jsonify(error="Location with id " + str(id) + " not found"), 404
        return jsonify(loc.serialize), 200

    elif request.method == 'DELETE':
        loc = Location.query.filter(Location.id == id).first()
        if loc == None: 
            return jsonify(error="Location with id " + str(id) + " not found"), 404
        Location.query.filter(Location.id == id).delete()
        session.commit()
        return jsonify(message="Location deleted", id=id), 200

@api.route('/location', methods=['POST', 'PUT'])
def location():

    params = request.form

    if request.method == 'POST':

        if not 'title' in params:
            return jsonify(error="Missing title"), 400

        if not 'latitude' in params:
            return jsonify(error="Missing latitude"), 400

        if not isFloat(params['latitude']): 
            return jsonify(error="Latitude value is not valid"), 400

        if not 'longitude' in params:
            return jsonify(error="Missing longitude"), 400

        if not isFloat(params['longitude']): 
            return jsonify(error="Longitude value is not valid"), 400

        newLocation = Location(
            params['title'], 
            params['description'] if 'description' in params else "", 
            params['latitude'], 
            params['longitude'] 
        )

        session.add(newLocation)
        session.commit()

        return jsonify(message="Location created", location=newLocation.serialize), 201

    elif request.method == 'PUT':

        if not 'id' in params:
            return jsonify(error="Missing id"), 400

        locId = params['id']

        if not isInt(locId):
            return jsonify(error="Invalid id"), 400

        loc =Location.query.filter(Location.id == int(locId)).first()
        if loc == None:
            return jsonify(error="Location with id " + locId + " not found"), 404

        if 'title' in params:
            if params['title'] == "" or params['title'].isspace():
                return jsonify(error="Title cannot be empty"), 400
            loc.title = params['title']

        if 'description' in params:
            loc.description = params['description']

        if 'latitude' in params:
            if not isFloat(params['latitude']): 
                return jsonify(error="Latitude value is not valid"), 400
            loc.latitude = params['latitude']

        if 'longitude' in params:
            if not isFloat(params['longitude']): 
                return jsonify(error="Longitude value is not valid"), 400
            loc.longitude = params['longitude']

        session.commit()

        return jsonify(message="Location updated", location=loc.serialize)

@api.route('/locations', methods=['GET'])
def locations():

    if request.method == 'GET':
        result = Location.query.all()
        return jsonify([l.serialize for l in result])