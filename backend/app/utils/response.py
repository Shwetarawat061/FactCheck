from flask import jsonify

def success_response(data=None, status_code=200):
    if data is None:
        data = {}
    return jsonify(data), status_code

def error_response(message="An error occurred", status_code=400, details=None):
    payload = {"error": message}
    if details:
        payload["details"] = details
    return jsonify(payload), status_code
