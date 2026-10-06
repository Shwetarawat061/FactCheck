def validate_claim_input(data):
    if not isinstance(data, dict):
        return False, "Invalid request payload format."
    raw_claim = data.get('claim')
    if not isinstance(raw_claim, str):
        return False, "Claim must be a string."
    claim = raw_claim.strip()
    if not claim:
        return False, "Claim string cannot be empty."
    if len(claim) > 1000:
        return False, "Claim string exceeds maximum length of 1000 characters."
    return True, claim
