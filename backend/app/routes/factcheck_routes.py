from flask import Blueprint, request
from ..services.fact_checker import FactCheckerService
from ..utils.validators import validate_claim_input
from ..utils.response import success_response, error_response

factcheck_bp = Blueprint('factcheck', __name__)
fact_checker = FactCheckerService()

@factcheck_bp.route('', methods=['POST'])
@factcheck_bp.route('/', methods=['POST'])
def check_claim():
    data = request.get_json(silent=True) or {}
    is_valid, result = validate_claim_input(data)

    if not is_valid:
        return error_response(result, 400)

    try:
        report = fact_checker.check_claim(result)
        return success_response(report)
    except Exception as e:
        return error_response(f"Verification processing error: {str(e)}", 500)
