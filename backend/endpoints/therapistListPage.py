from flask import request, jsonify, json, Blueprint #,render_template, request
from app import mysql # , socketio, sockets
# If you need socketio stuff maybe uncomment the below line. 100% uncomment the stuff directly above
# from flask_socketio import SocketIO, join_room, leave_room, send, emit

# Feel free to add more imports


therapistListData = Blueprint('therapistListData', __name__)

@therapistListData.route('/endpointOne', methods=['GET'])
def sample_endpoint_function():
    return jsonify({"data" : "I exist"}), 200