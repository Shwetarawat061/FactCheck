from flask import Blueprint
from ..utils.response import success_response

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return success_response({
        'status': 'healthy',
        'service': 'FactCheckAI Python Backend',
        'version': '1.0.0'
    })
