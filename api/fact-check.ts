// Vercel Serverless Function: POST /api/fact-check
import { verifyClaimEngine } from '../src/services/verificationEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'failed',
      code: 'METHOD_NOT_ALLOWED',
      message: 'FactCheck API requires POST requests with JSON body: {"claim": "..."}',
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      status: 'failed',
      code: 'SERVER_MISCONFIGURED',
      message: 'GEMINI_API_KEY is not configured on the server.',
    });
  }

  // Support parsed body or stringified body in serverless
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        status: 'failed',
        code: 'INVALID_JSON',
        message: 'Request body must be valid JSON.',
      });
    }
  }

  const rawClaim = body?.claim;
  if (typeof rawClaim !== 'string' || !rawClaim.trim()) {
    return res.status(400).json({
      status: 'failed',
      code: 'INVALID_CLAIM',
      message: 'Claim must be a non-empty string.',
    });
  }

  const claim = rawClaim.trim();
  if (claim.length > 1000) {
    return res.status(400).json({
      status: 'failed',
      code: 'CLAIM_TOO_LONG',
      message: 'Claim must not exceed 1000 characters.',
    });
  }

  try {
    const result = await verifyClaimEngine(claim);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Fact-check serverless error:', error);
    return res.status(502).json({
      status: 'failed',
      code: 'VERIFICATION_ERROR',
      message: error?.message || 'Fact-checking evaluation encountered an internal error.',
    });
  }
}
