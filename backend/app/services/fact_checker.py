from .gemini_service import GeminiService
from .evidence_search import EvidenceSearchService

class FactCheckerService:
    def __init__(self):
        self.gemini = GeminiService()

    def check_claim(self, claim: str) -> dict:
        return EvidenceSearchService.search_google_realtime(claim)
