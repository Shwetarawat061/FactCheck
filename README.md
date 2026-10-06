# FactCheckAI — Evidence-First Claim Verification

FactCheckAI retrieves web results with Tavily and asks Gemini to assess only the retrieved source material. Citation excerpts must match retrieved text, and a verdict requires at least two decisive excerpts from independent domains. Results are inconclusive if more than half of candidate excerpts fail validation. Confidence is a heuristic, not a probability; insufficient evidence produces an inconclusive result.

---

## Key Features

- **Open & Frictionless**: Instant claim verification with zero logins, accounts, or sign-up walls.
- **Live Web Retrieval**: Tavily retrieves public web results for each claim.
- **Conservative Evidence Gates**: One source, one domain, or insufficient validated citations cannot produce a confident verdict.
- **Structured Reasoning**: Step-by-step analytical audit explaining why an assertion is supported, contradicted, or mixed.
- **Auditable Evidence**: Retrieved links and source-text-matched excerpts, publisher domains, and relationship tags (`SUPPORTS`, `CONTRADICTS`, `CONTEXT`).
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
│   │   └── examples.ts
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
│   │   │   ├── verification_pipeline.py
│   │   │   └── verification_gates.py
│   │   ├── utils/
│   │   │   ├── validators.py
│   │   │   └── response.py
│   │   └── config.py
│   │
│   ├── tests/
│   │   ├── test_factcheck.py
│   │   ├── test_verification_gates.py
│   │   ├── test_verification_pipeline.py
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

# Run Vite in this terminal; /api is proxied to Flask on port 5000
npm run dev
```

Keep Vite and Flask running in separate terminals.

### 2. Backend Development (Flask + Python)

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Set GEMINI_API_KEY and TAVILY_API_KEY in .env

# Run backend tests
pytest

# Start Flask server
python run.py
```

### 3. Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `GEMINI_API_KEY` | Backend Only | Google Gemini API key for evidence analysis |
| `GEMINI_MODEL` | Backend Only | Gemini model (default: `gemini-2.5-flash`) |
| `TAVILY_API_KEY` | Backend Only | Tavily API key for live web search; required |
| `PORT` | Backend | Flask port (default: 5000) |
