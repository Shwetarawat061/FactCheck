from .verification_pipeline import verify_claim

class FactCheckerService:
    def check_claim(self, claim: str) -> dict:
        return verify_claim(claim)
