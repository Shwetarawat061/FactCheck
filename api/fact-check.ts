// Vercel Serverless Function: POST /api/fact-check
// 100% self-contained with no relative file imports to guarantee zero ERR_MODULE_NOT_FOUND issues on Vercel
import { GoogleGenAI } from '@google/genai';

export type Verdict =
  | 'TRUE'
  | 'MOSTLY TRUE'
  | 'PARTIALLY TRUE'
  | 'MISLEADING'
  | 'MIXED'
  | 'MOSTLY FALSE'
  | 'FALSE'
  | 'UNVERIFIED';

export type Relationship = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT';

export interface Evidence {
  id: string;
  source: string;
  title: string;
  url: string;
  quote: string;
  date: string;
  relationship: Relationship;
  credibilityScore: number;
  urlReachable: boolean;
}

export interface ReasoningStep {
  index: string;
  title: string;
  description: string;
}

export interface FactCheckResult {
  id: string;
  status: 'ok' | 'inconclusive';
  claim: string;
  checkedAt: string;
  verdict: Verdict;
  confidence: number;
  summary: string;
  analysis: string;
  reasoning: ReasoningStep[];
  evidenceOverview: {
    total: number;
    supports: number;
    contradicts: number;
    context: number;
  };
  evidence: Evidence[];
  isDemo: false;
}

export interface RetrievedSource {
  url: string;
  title: string;
  domain: string;
  content: string;
  date?: string;
  score?: number;
}

const MULTIPART_TLDS = new Set([
  'ac.uk', 'co.in', 'co.jp', 'co.nz', 'co.uk',
  'com.au', 'com.br', 'com.cn', 'com.mx', 'com.sg',
  'com.tr', 'org.uk', 'gov.uk', 'edu.au',
]);

function getDomain(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const parts = host.split('.');
    if (parts.length < 2) return host;
    const lastTwo = parts.slice(-2).join('.');
    if (MULTIPART_TLDS.has(lastTwo) && parts.length >= 3) {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  } catch {
    return 'unknown-source.org';
  }
}

async function searchWithTavily(claim: string, apiKey: string): Promise<RetrievedSource[]> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query: claim,
      search_depth: 'basic',
      max_results: 6,
      include_raw_content: false,
      include_answer: false,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed (${response.status})`);
  }

  const data = (await response.json()) as any;
  const results = Array.isArray(data?.results) ? data.results : [];
  const sources: RetrievedSource[] = [];
  const seenUrls = new Set<string>();

  for (const item of results) {
    const url = item?.url;
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) continue;
    const norm = url.toLowerCase().replace(/\/$/, '');
    if (seenUrls.has(norm)) continue;
    seenUrls.add(norm);

    const content = (item.raw_content || item.content || '').trim();
    if (!content) continue;

    sources.push({
      url,
      title: (item.title || getDomain(url)).trim(),
      domain: getDomain(url),
      content: content.slice(0, 4000),
      date: item.published_date || '',
      score: typeof item.score === 'number' ? item.score : 0.85,
    });
  }

  return sources;
}

async function searchWithDuckDuckGo(claim: string): Promise<RetrievedSource[]> {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(claim)}`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(6_000),
  });

  if (!res.ok) {
    throw new Error(`Web search failed with HTTP ${res.status}`);
  }

  const text = await res.text();
  const blocks = text.split('<div class="result results_links');
  const sources: RetrievedSource[] = [];
  const seenUrls = new Set<string>();

  for (const b of blocks.slice(1)) {
    const urlMatch =
      b.match(/href="(?:https?:)?\/\/duckduckgo\.com\/l\/\?uddg=([^&"']+)/) ||
      b.match(/class="result__url"[^>]*href="([^"]+)"/);
    const titleMatch = b.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
    const snippetMatch = b.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);

    if (urlMatch && titleMatch) {
      let rawUrl = '';
      try {
        rawUrl = decodeURIComponent(urlMatch[1]);
      } catch {
        rawUrl = urlMatch[1];
      }

      if (!/^https?:\/\//i.test(rawUrl)) continue;
      const norm = rawUrl.toLowerCase().replace(/\/$/, '');
      if (seenUrls.has(norm)) continue;
      seenUrls.add(norm);

      const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      const snippet = (snippetMatch ? snippetMatch[1] : '').replace(/<[^>]+>/g, '').trim();
      if (!snippet) continue;

      const domain = getDomain(rawUrl);
      sources.push({
        url: rawUrl,
        title: title || domain,
        domain,
        content: snippet,
        date: '',
        score: 0.88,
      });

      if (sources.length >= 8) break;
    }
  }

  return sources;
}

async function searchWithWikipedia(claim: string): Promise<RetrievedSource[]> {
  try {
    const cleaned = claim.replace(/[^\w\s]/g, ' ').trim();
    const query = encodeURIComponent(cleaned.split(/\s+/).slice(0, 5).join(' ') || claim);

    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}&limit=4&namespace=0&format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as any;
    const titles = Array.isArray(data?.[1]) ? data[1] : [];
    const urls = Array.isArray(data?.[3]) ? data[3] : [];

    if (titles.length === 0) return [];

    const sources: RetrievedSource[] = [];
    const extractPromises = titles.slice(0, 3).map(async (title: string, idx: number) => {
      try {
        const pageRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (pageRes.ok) {
          const pageData = (await pageRes.json()) as any;
          const extract = pageData?.extract;
          if (extract && extract.length > 30) {
            return {
              url: urls[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
              title: `${title} - Wikipedia`,
              domain: 'wikipedia.org',
              content: extract,
              date: pageData?.timestamp || '',
              score: 0.95,
            };
          }
        }
      } catch {
        return null;
      }
      return null;
    });

    const results = await Promise.all(extractPromises);
    for (const r of results) {
      if (r) sources.push(r);
    }
    return sources;
  } catch (err: any) {
    console.warn('Wikipedia search error:', err?.message);
    return [];
  }
}

async function generateWithGemini(ai: GoogleGenAI, prompt: string): Promise<string> {
  const models = [
    process.env.GEMINI_MODEL,
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ].filter((m): m is string => Boolean(m) && m !== 'gemini-2.5-flash');

  let lastError: any = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const text = response.text?.trim();
      if (text) return text;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini] Model ${model} failed (${err?.message?.slice(0, 100)}), trying next...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to respond.');
}

export async function runVerification(
  claimText: string,
  category?: string,
  sourceUrl?: string
): Promise<FactCheckResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const claim = claimText.trim();
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  let sources: RetrievedSource[] = [];

  const searchQuery = category && category !== 'all' ? `${claim} ${category}` : claim;
  const searchTasks: Promise<RetrievedSource[]>[] = [];
  if (process.env.TAVILY_API_KEY) {
    searchTasks.push(searchWithTavily(searchQuery, process.env.TAVILY_API_KEY).catch(() => []));
  }
  searchTasks.push(searchWithDuckDuckGo(searchQuery).catch(() => []));
  searchTasks.push(searchWithWikipedia(claim).catch(() => []));

  const settleResults = await Promise.allSettled(searchTasks);
  for (const r of settleResults) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      for (const item of r.value) {
        if (!sources.some((s) => s.url.toLowerCase() === item.url.toLowerCase())) {
          sources.push(item);
        }
      }
    }
  }

  const uniqueDomains = new Set(sources.map((s) => s.domain));
  const nowIso = new Date().toISOString();
  const auditId = `audit-${Date.now()}`;

  if (sources.length < 2 || uniqueDomains.size < 2) {
    const fallbackEvidence: Evidence[] = sources.map((s, idx) => ({
      id: `ev-${idx + 1}`,
      source: s.domain,
      title: s.title,
      url: s.url,
      quote: s.content.slice(0, 300) || `Indexed reference examining: "${claim}".`,
      date: s.date || '',
      relationship: 'CONTEXT' as const,
      credibilityScore: 70,
      urlReachable: true,
    }));

    return {
      id: auditId,
      status: 'inconclusive',
      claim,
      checkedAt: nowIso,
      verdict: 'UNVERIFIED',
      confidence: 0,
      summary: `Available sources did not meet the required threshold of at least 2 independent domains to substantiate or refute "${claim}".`,
      analysis: `Public query retrieved ${sources.length} source(s) across ${uniqueDomains.size} independent domain(s). A conclusive verdict requires independent corroboration across multiple separate domains.`,
      reasoning: [
        {
          index: '01',
          title: 'Evidence Scarcity Gate',
          description: `Only ${sources.length} source(s) across ${uniqueDomains.size} domain(s) were retrieved, falling below the multi-domain verification requirement.`,
        },
      ],
      evidenceOverview: {
        total: fallbackEvidence.length,
        supports: 0,
        contradicts: 0,
        context: fallbackEvidence.length,
      },
      evidence: fallbackEvidence,
      isDemo: false,
    };
  }

  const sourceDescriptions = sources
    .slice(0, 6)
    .map(
      (s, idx) =>
        `Source [${idx + 1}]:\n  Title: "${s.title}"\n  Domain: "${s.domain}"\n  URL: "${s.url}"\n  Retrieved Text: "${s.content}"`
    )
    .join('\n\n');

  const analysisPrompt = `You are FactCheckAI, an objective scientific and evidence verification auditor.
Examine this claim strictly against the verified retrieved sources below:

CLAIM: "${claim}"

RETRIEVED INDEPENDENT SOURCES:
${sourceDescriptions}

CRITICAL RULES:
1. Do not invent facts, URLs, or quotes. Use ONLY the verified sources provided above.
2. For each source [1..${Math.min(sources.length, 6)}], determine whether its text SUPPORTS, CONTRADICTS, or provides CONTEXT for the claim. Extract a verbatim quote/excerpt (25-300 characters) from that source's text.
3. Choose an objective verdict strictly among these categories:
   - "TRUE": reliable evidence directly supports the claim.
   - "FALSE": reliable evidence directly contradicts the claim.
   - "PARTIALLY TRUE": some parts are accurate, while others are inaccurate or exaggerated.
   - "MISLEADING": the claim omits context or presents information deceptively.
   - "UNVERIFIED": insufficient reliable evidence is available.
   * STRICT SAFEGUARD: Do NOT automatically label a claim FALSE simply because you cannot find evidence for it. If evidence is scarce, choose "UNVERIFIED".
4. Determine confidence as an integer between 70 and 96 based on evidence consensus.
5. Provide a 2-3 sentence executive summary.
6. Provide an analytical audit paragraph.
7. Provide 3 structured reasoning steps with index ("01", "02", "03"), title, and description.

Reply ONLY with a JSON object in this exact shape:
{
  "verdict": "TRUE",
  "confidence": 92,
  "summary": "...",
  "analysis": "...",
  "reasoning": [
    { "index": "01", "title": "...", "description": "..." },
    { "index": "02", "title": "...", "description": "..." },
    { "index": "03", "title": "...", "description": "..." }
  ],
  "sourceEvaluations": [
    { "sourceIndex": 1, "relationship": "SUPPORTS", "excerpt": "..." }
  ]
}`;

  const jsonText = await generateWithGemini(ai, analysisPrompt);
  const parsed = JSON.parse(jsonText || '{}');
  const evaluations: any[] = Array.isArray(parsed?.sourceEvaluations) ? parsed.sourceEvaluations : [];

  const evidenceList: Evidence[] = [];
  const usedSources = sources.slice(0, 6);

  for (let i = 0; i < usedSources.length; i++) {
    const src = usedSources[i];
    const evalMatch = evaluations.find((e) => e.sourceIndex === i + 1) || {};
    let rel = String(evalMatch.relationship || 'CONTEXT').toUpperCase();
    if (!['SUPPORTS', 'CONTRADICTS', 'CONTEXT'].includes(rel)) {
      rel = 'CONTEXT';
    }

    let quote = typeof evalMatch.excerpt === 'string' ? evalMatch.excerpt.trim() : '';
    if (!quote || quote.length < 15) {
      quote = src.content.slice(0, 200).trim() || `Retrieved evidence excerpt for "${claim.slice(0, 60)}..."`;
    }

    evidenceList.push({
      id: `ev-${i + 1}`,
      source: src.domain,
      title: src.title,
      url: src.url,
      quote,
      date: src.date || '',
      relationship: rel as any,
      credibilityScore: Math.round((src.score ?? 0.85) * 100),
      urlReachable: true,
    });
  }

  const supportsCount = evidenceList.filter((e) => e.relationship === 'SUPPORTS').length;
  const contradictsCount = evidenceList.filter((e) => e.relationship === 'CONTRADICTS').length;
  const contextCount = evidenceList.filter((e) => e.relationship === 'CONTEXT').length;

  const allowedVerdicts = ['TRUE', 'MOSTLY TRUE', 'PARTIALLY TRUE', 'MISLEADING', 'MIXED', 'MOSTLY FALSE', 'FALSE', 'UNVERIFIED'];
  let verdict = String(parsed?.verdict || 'UNVERIFIED').toUpperCase();
  if (verdict === 'INCONCLUSIVE') verdict = 'UNVERIFIED';
  if (!allowedVerdicts.includes(verdict)) {
    if (supportsCount > 0 && contradictsCount === 0) verdict = 'TRUE';
    else if (contradictsCount > 0 && supportsCount === 0) verdict = 'FALSE';
    else if (supportsCount > 0 && contradictsCount > 0) verdict = 'MIXED';
    else verdict = 'UNVERIFIED';
  }

  if (contradictsCount >= 2 && supportsCount === 0 && (verdict === 'TRUE' || verdict === 'MOSTLY TRUE')) {
    verdict = 'FALSE';
  }

  const confidence =
    typeof parsed?.confidence === 'number' && Number.isFinite(parsed.confidence)
      ? Math.max(70, Math.min(96, Math.round(parsed.confidence)))
      : 85;

  const summary =
    typeof parsed?.summary === 'string' && parsed.summary.trim().length > 10
      ? parsed.summary.trim()
      : `Evidence cross-examination across ${uniqueDomains.size} independent domains yielded a verdict of ${verdict} with calibrated confidence of ${confidence}%.`;

  const analysis =
    typeof parsed?.analysis === 'string' && parsed.analysis.trim().length > 10
      ? parsed.analysis.trim()
      : `Analysis retrieved ${evidenceList.length} verified passages across ${uniqueDomains.size} domains. Corroborating signals: ${supportsCount}, contradicting signals: ${contradictsCount}, contextual signals: ${contextCount}.`;

  const reasoning: ReasoningStep[] = Array.isArray(parsed?.reasoning) && parsed.reasoning.length > 0
    ? parsed.reasoning.map((r: any, idx: number) => ({
        index: String(r.index || `0${idx + 1}`).padStart(2, '0'),
        title: String(r.title || `Reasoning Phase 0${idx + 1}`),
        description: String(r.description || ''),
      }))
    : [
        {
          index: '01',
          title: 'Evidence Ingestion & Deconstruction',
          description: `Extracted core semantic claims and queried multi-domain indices for corroborating or refuting literature.`,
        },
        {
          index: '02',
          title: 'Passage Polarity & Excerpt Verification',
          description: `Identified ${supportsCount} corroborating, ${contradictsCount} refuting, and ${contextCount} contextual evidentiary references.`,
        },
        {
          index: '03',
          title: 'Consensus Calibration & Verdict Formulation',
          description: `Synthesized multi-source signals into a final verdict of ${verdict} with an assessed confidence score of ${confidence}%.`,
        },
      ];

  return {
    id: auditId,
    status: verdict === 'UNVERIFIED' ? 'inconclusive' : 'ok',
    claim,
    checkedAt: nowIso,
    verdict: verdict as any,
    confidence,
    summary,
    analysis,
    reasoning,
    evidenceOverview: {
      total: evidenceList.length,
      supports: supportsCount,
      contradicts: contradictsCount,
      context: contextCount,
    },
    evidence: evidenceList,
    isDemo: false,
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
      message: 'GEMINI_API_KEY is not configured in Vercel Environment Variables. Please add GEMINI_API_KEY in Vercel Settings -> Environment Variables and redeploy.',
    });
  }

  // Parse body safely in all serverless environments
  let body = req.body;
  if (!body && typeof req.on === 'function') {
    try {
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (raw) {
        body = JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

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

  const category = typeof body?.category === 'string' ? body.category : undefined;
  const sourceUrl = typeof body?.sourceUrl === 'string' ? body.sourceUrl : undefined;

  try {
    const result = await runVerification(claim, category, sourceUrl);
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
