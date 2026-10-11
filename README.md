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

## Deployment

### 1. Deploy to Vercel (Full-Stack with Serverless APIs)

FactCheckAI is structured for native zero-config deployment on [Vercel](https://vercel.com):

1. Push this repository to GitHub.
2. In the Vercel dashboard, click **"Add New Project"** and import the repository.
3. Vercel automatically detects the Vite framework and `vercel.json` configuration.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `TAVILY_API_KEY`: *(Optional)* Your Tavily search API Key.
5. Click **Deploy**. Both the Vite frontend and `/api` serverless functions (`/api/health` and `/api/fact-check`) will be live immediately.

---

### 2. Deploy to GitHub Pages (Static Frontend)

FactCheckAI includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`:

1. In your GitHub repository, navigate to **Settings** → **Pages**.
2. Under **Build and deployment**, set the source to **GitHub Actions**.
3. Under **Settings** → **Secrets and variables** → **Actions**, add a repository secret or variable:
   - `VITE_API_BASE_URL`: The URL of your deployed Vercel backend (*e.g.* `https://your-project.vercel.app`).
4. Commit or push to `main` (or run the workflow manually via **Actions** → **Deploy to GitHub Pages** → **Run workflow**).
5. The application will be deployed and available at `https://<username>.github.io/<repo-name>/`.

---

## Local Development

```bash
# Install dependencies
npm install

# Run full-stack dev server (Vite + Express on port 3000)
npm run dev

# Run automated endpoint and schema tests
npm run test:api
```

### Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `GEMINI_API_KEY` | Server / Vercel API | Google Gemini API key for grounded evidence synthesis |
| `TAVILY_API_KEY` | Server / Vercel API | *(Optional)* Tavily API key for search retrieval |
| `VITE_API_BASE_URL` | Client (Build-time) | Base URL for APIs when deployed statically on GitHub Pages |
| `PORT` | Local Dev Server | Server port (default: 3000) |

