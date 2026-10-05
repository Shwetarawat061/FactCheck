import os
import json

class GeminiService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY', '')
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None

    def analyze_claim(self, claim: str) -> dict:
        if not self.client:
            raise RuntimeError("Gemini client not initialized or missing API key.")

        prompt = f"""You are FactCheckAI, an authoritative, rigorous evidence-based claim verification engine.
Analyze the following claim against real-world scientific, institutional, and journalistic consensus:
"{claim}"

Instructions:
1. Examine verifiable facts from primary sources (WHO, NASA, EPA, Science, Nature, PubMed, UN, Reuters, AP, etc.).
2. Determine an objective verdict: must be one of "TRUE", "MOSTLY TRUE", "MIXED", "MOSTLY FALSE", "FALSE", or "UNVERIFIED".
3. Provide an AI confidence score from 50 to 99 based on source consensus.
4. Provide a 2-3 sentence executive summary explaining what the evidence demonstrates.
5. Provide 3-4 structured reasoning steps (01, 02, 03, 04) with clear titles and explanations.
6. Provide an evidence overview with counts of contradicting, supporting, and contextual sources.
7. Provide at least 3-5 real, reputable primary sources with exact titles, domains, direct URLs, relevant quotes, and whether each source "CONTRADICTS CLAIM", "SUPPORTS CLAIM", or provides "CONTEXT".

You MUST reply with ONLY a single valid JSON object conforming to this schema (no markdown formatting, no backticks, no extra text):
{{
  "id": "claim-{int(os.times()[4] * 1000)}",
  "claim": "{claim}",
  "checkedAt": "Checked just now",
  "verdict": "FALSE",
  "confidence": 94,
  "summary": "...",
  "reasoning": [
    {{ "index": "01", "title": "...", "description": "..." }},
    {{ "index": "02", "title": "...", "description": "..." }}
  ],
  "evidenceOverview": {{
    "total": 5,
    "supports": 0,
    "contradicts": 4,
    "context": 1
  }},
  "evidence": [
    {{
      "id": "src-1",
      "source": "...",
      "title": "...",
      "url": "https://...",
      "quote": "...",
      "date": "...",
      "relationship": "CONTRADICTS",
      "credibilityScore": 98
    }}
  ]
}}"""

        response = self.client.models.generateContent(
            model='gemini-3.8-flash',
            contents=prompt,
            config={'tools': [{'googleSearch': {}}]}
        )

        raw_text = response.text or ''
        clean_json = raw_text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_json)
