// src/services/factCheckClient.ts
// Single client for POST /api/fact-check. Failures are surfaced; no report is synthesized.
// Any failure throws FactCheckError; the UI must show it instead of a report.

export type Verdict =
  | 'TRUE' | 'MOSTLY TRUE' | 'MIXED' | 'MOSTLY FALSE' | 'FALSE' | 'UNVERIFIED';
export type Relationship = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT';

export interface Evidence {
  id: string;
  source: string;
  title: string;
  url: string;
  quote: string;
  date: string; // may be '' -> UI shows "Date unavailable"
  relationship: Relationship;
  credibilityScore: number; // currently retrieval relevance 0-100
  urlReachable: boolean;
}

export interface FactCheckResultData {
  id: string;
  status: 'ok' | 'inconclusive';
  claim: string;
  checkedAt: string;
  verdict: Verdict;
  confidence: number;
  summary: string;
  analysis: string;
  reasoning: { index: string; title: string; description: string }[];
  evidenceOverview: { total: number; supports: number; contradicts: number; context: number };
  evidence: Evidence[];
  isDemo: false;
}

export class FactCheckError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const VERDICTS = ['TRUE', 'MOSTLY TRUE', 'MIXED', 'MOSTLY FALSE', 'FALSE', 'UNVERIFIED'];
const RELS = ['SUPPORTS', 'CONTRADICTS', 'CONTEXT'];
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function parseResult(raw: any): FactCheckResultData {
  let d = raw;
  if (typeof d === 'string') {
    try {
      d = JSON.parse(d);
    } catch {
      // will be caught by not an object check
    }
  }

  const bad = (why: string) => new FactCheckError('BAD_RESPONSE', `Malformed server response (${why}).`);
  if (!d || typeof d !== 'object') throw bad('not an object');
  if (d.isDemo === true) throw bad('demo data rejected');
  if (!['ok', 'inconclusive'].includes(d.status)) throw bad('status');
  if (!VERDICTS.includes(d.verdict)) throw bad('verdict');
  if (![d.id, d.claim, d.summary, d.analysis, d.checkedAt].every(isStr)) throw bad('text fields');
  if (!isNum(d.confidence) || !Array.isArray(d.evidence) || !Array.isArray(d.reasoning)) throw bad('shape');

  for (const e of d.evidence) {
    if (![e.id, e.source, e.title, e.url, e.quote, e.date].every(isStr)) throw bad('evidence fields');
    if (!RELS.includes(e.relationship) || !isNum(e.credibilityScore) || typeof e.urlReachable !== 'boolean')
      throw bad('evidence labels');
    if (!/^https?:\/\//i.test(e.url)) throw bad('evidence url');
  }

  // Counts must match the evidence actually returned; never trust a separate number.
  const n = (r: string) => d.evidence.filter((e: Evidence) => e.relationship === r).length;
  const o = d.evidenceOverview ?? {};
  if (o.total !== d.evidence.length || o.supports !== n('SUPPORTS') ||
      o.contradicts !== n('CONTRADICTS') || o.context !== n('CONTEXT')) throw bad('count mismatch');

  return d as FactCheckResultData;
}

export async function checkClaim(claim: string, signal?: AbortSignal): Promise<FactCheckResultData> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90_000);
  signal?.addEventListener('abort', () => ctrl.abort());

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/fact-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ claim }),
      signal: ctrl.signal,
    });
  } catch (err: any) {
    throw new FactCheckError(
      err?.name === 'AbortError' ? 'TIMEOUT' : 'BACKEND_UNREACHABLE',
      err?.name === 'AbortError'
        ? 'Verification timed out. No result was produced.'
        : 'Could not reach the verification server. No result was produced.'
    );
  } finally {
    clearTimeout(timer);
  }

  let rawText = '';
  try {
    rawText = await res.text();
  } catch {
    throw new FactCheckError('NETWORK_ERROR', 'Failed to read response from server.');
  }

  let data: any = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    if (!res.ok) {
      throw new FactCheckError('SERVER_ERROR', `Server error (${res.status}). No result was produced.`);
    }
    if (rawText.trim().startsWith('<') || res.headers.get('content-type')?.includes('text/html')) {
      throw new FactCheckError(
        'BAD_RESPONSE',
        'Server returned HTML page instead of JSON API response. Please retry.'
      );
    }
    throw new FactCheckError(
      'BAD_RESPONSE',
      `Server returned invalid JSON format: ${rawText.slice(0, 60)}`
    );
  }

  if (!res.ok) {
    throw new FactCheckError(
      data?.code ?? 'VERIFICATION_FAILED',
      data?.message ?? `Server error (${res.status}). No result was produced.`
    );
  }

  return parseResult(data);
}
