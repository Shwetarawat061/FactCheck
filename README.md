# FactCheckAI — Evidence-First Claim Verification

FactCheckAI is an authoritative, evidence-based fact-checking intelligence platform. It cross-references assertions against live web results via Google Search tool integration and institutional consensus using Gemini 3.8 Flash, providing transparent reasoning, calibrated confidence scores, and verbatim citations.

---

## Key Features

- **Open & Frictionless**: Instant claim verification with zero logins, accounts, or sign-up walls.
- **Live Google Search Grounding**: Dynamic web retrieval fetches real-time results to ground findings in institutional data.
- **Calibrated AI Confidence**: Objective confidence scores (50–99%) calibrated against source consensus.
- **Structured Reasoning**: Step-by-step analytical audit explaining why an assertion is supported, contradicted, or mixed.
- **Auditable Evidence**: Primary links, verbatim citations, publisher domains, and relationship tags (`SUPPORTS`, `CONTRADICTS`, `CONTEXT`).
- **Server-Side Security**: All Gemini API models execute exclusively on the backend, safeguarding secrets.

---

## Project Structure

```
FactCheckAI/
│
├── src/                              # React + TypeScript + Vite
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ClaimInput.tsx
│   │   ├── ExampleClaims.tsx
│   │   ├── AnalysisLoader.tsx
│   │   ├── FactCheckResult.tsx
│   │   ├── VerdictBadge.tsx
│   │   ├── EvidenceCard.tsx
│   │   ├── EvidenceOverview.tsx
│   │   ├── ReasoningSection.tsx
│   │   └── Footer.tsx
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── LandingPage.tsx
│   │   ├── FactCheck.tsx
│   │   └── AppHome.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── factCheckApi.ts
│   │
│   ├── types/
│   │   ├── factCheck.ts
│   │   └── evidence.ts
│   │
│   ├── data/
│   │   ├── examples.ts
│   │   └── mockResults.ts
│   │
│   ├── hooks/
│   │   └── useFactCheck.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── backend/                          # Flask + Python
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── factcheck_routes.py
│   │   │   └── health_routes.py
│   │   ├── services/
│   │   │   ├── fact_checker.py
│   │   │   ├── evidence_search.py
│   │   │   └── gemini_service.py
│   │   ├── utils/
│   │   │   ├── validators.py
│   │   │   └── response.py
│   │   └── config.py
│   │
│   ├── tests/
│   │   ├── test_factcheck.py
│   │   └── test_health.py
│   │
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
│
├── api/                              # Vercel serverless entry
│   └── index.py
│
├── README.md
├── .gitignore
└── LICENSE
```

---

## Getting Started

### 1. Frontend Development (React + TypeScript + Vite)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 2. Backend Development (Flask + Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend tests
pytest

# Start Flask server
python run.py
```

### 3. Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `GEMINI_API_KEY` | Backend Only | Google Gemini API Key for grounded evidence synthesis |
| `PORT` | Backend | Port number (default: 3000 for Node / 5000 for Flask) |
