import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyClaimEngine } from './src/services/verificationEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

// CORS headers for static client deployments (e.g. GitHub Pages)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    configured: Boolean(process.env.GEMINI_API_KEY),
    hasTavily: Boolean(process.env.TAVILY_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Explicit 405 for GET /api/fact-check
app.get('/api/fact-check', (_req: Request, res: Response) => {
  res.status(405).json({
    status: 'failed',
    code: 'METHOD_NOT_ALLOWED',
    message: 'FactCheck API requires POST requests with JSON body: {"claim": "..."}',
  });
});

// -------------------------------------------------------------
// POST /api/fact-check Endpoint
// -------------------------------------------------------------
app.post('/api/fact-check', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      status: 'failed',
      code: 'SERVER_MISCONFIGURED',
      message: 'GEMINI_API_KEY is not configured on the server.',
    });
    return;
  }

  const rawClaim = req.body?.claim;
  const rawCategory = req.body?.category;
  const rawSourceUrl = req.body?.sourceUrl;

  if (typeof rawClaim !== 'string' || !rawClaim.trim()) {
    res.status(400).json({
      status: 'failed',
      code: 'INVALID_CLAIM',
      message: 'Claim must be a non-empty string.',
    });
    return;
  }

  const claim = rawClaim.trim();
  if (claim.length > 1000) {
    res.status(400).json({
      status: 'failed',
      code: 'CLAIM_TOO_LONG',
      message: 'Claim must not exceed 1000 characters.',
    });
    return;
  }

  try {
    const result = await verifyClaimEngine(
      claim,
      typeof rawCategory === 'string' ? rawCategory : undefined,
      typeof rawSourceUrl === 'string' ? rawSourceUrl : undefined
    );
    res.json(result);
  } catch (error: any) {
    console.error('Fact-check evaluation error:', error);
    res.status(502).json({
      status: 'failed',
      code: 'VERIFICATION_ERROR',
      message: error?.message || 'Fact-checking evaluation encountered an internal error.',
    });
  }
});

// -------------------------------------------------------------
// Vite Dev Server / Static File Serving
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev] Vite middlewares mounted inside Express.');
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
    console.log('[Prod] Serving static build from dist directory.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FactCheckAI server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
