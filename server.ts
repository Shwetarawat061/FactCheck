import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

// CORS and Preflight handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
const apiKey = process.env.GEMINI_API_KEY;
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    configured: Boolean(apiKey),
    timestamp: new Date().toISOString()
  });
});

// Initialize GoogleGenAI SDK with server-side API key and User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface GroundedChunk {
  url: string;
  title: string;
  snippet?: string;
  domain: string;
}

// -------------------------------------------------------------
// SSRF Guard and URL Reachability Checker
// -------------------------------------------------------------
async function isUrlReachable(urlStr: string): Promise<boolean> {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    // SSRF Guard: block loopback and private networks
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.')
    ) {
      return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const resp = await fetch(urlStr, {
      method: 'HEAD',
      headers: { 'User-Agent': 'FactCheckAI-LinkCheck/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return resp.status < 400;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Fallback Live Web Search Engine
// Provides authentic real-time web records if Gemini Google Search tool quota is exhausted
// -------------------------------------------------------------
async function searchWebPublic(query: string): Promise<GroundedChunk[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const html = await res.text();
    const results: GroundedChunk[] = [];
    const seenDomains = new Set<string>();

    const blocks = html.split(/class="result\s/);
    for (const block of blocks.slice(1)) {
      const titleMatch = block.match(/class="result__title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const urlMatch = block.match(/class="result__url"[^>]*href="([^"]+)"/);
      const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);

      if (urlMatch && urlMatch[1]) {
        let rawUrl = urlMatch[1];
        const uddgMatch = rawUrl.match(/[?&]uddg=([^&]+)/);
        const directUrl = uddgMatch ? decodeURIComponent(uddgMatch[1]) : rawUrl;

        const cleanTitle = (titleMatch ? titleMatch[1] : '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        const cleanSnippet = (snippetMatch ? snippetMatch[1] : '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

        if (directUrl.startsWith('http://') || directUrl.startsWith('https://')) {
          try {
            const domain = new URL(directUrl).hostname.replace(/^www\./, '').toLowerCase();
            // Avoid internal redirect or search engine domains
            if (!domain.includes('duckduckgo.com') && !seenDomains.has(domain)) {
              seenDomains.add(domain);
              results.push({
                url: directUrl,
                title: cleanTitle || `Source: ${domain}`,
                snippet: cleanSnippet,
                domain
              });
            }
          } catch {
            // Skip invalid URL
          }
        }
      }
      if (results.length >= 6) break;
    }
    return results;
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// Resilient Gemini Text Generation with Model Fallback
// -------------------------------------------------------------
async function generateJsonWithFallback(prompt: string): Promise<any> {
  if (!ai) throw new Error('AI client not initialized');

  const modelsToTry = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed;
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      // If 429 quota or 503 high demand, try the next model
      if (msg.includes('429') || msg.includes('503') || msg.includes('RESOURCE_EXHAUSTED')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}

// -------------------------------------------------------------
// POST /api/fact-check (and /api/fact-check/)
// -------------------------------------------------------------
app.post(['/api/fact-check', '/api/fact-check/'], async (req, res) => {
  const { claim } = req.body;

  if (!claim || typeof claim !== 'string') {
    return res.status(400).json({
      status: 'failed',
      code: 'INVALID_CLAIM',
      message: 'Claim string cannot be empty.'
    });
  }

  const trimmed = claim.trim();
  if (trimmed.length < 1) {
    return res.status(400).json({
      status: 'failed',
      code: 'INVALID_CLAIM',
      message: 'Claim string cannot be empty.'
    });
  }

  if (trimmed.length > 1000) {
    return res.status(400).json({
      status: 'failed',
      code: 'CLAIM_TOO_LONG',
      message: 'Claim must be at most 1000 characters.'
    });
  }

  // Optional: If FLASK_URL is configured and reachable, proxy to Flask backend
  const flaskUrl = process.env.FLASK_URL;
  if (flaskUrl) {
    try {
      const flaskRes = await fetch(`${flaskUrl.replace(/\/$/, '')}/api/fact-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: trimmed }),
      });
      const data = await flaskRes.json();
      return res.status(flaskRes.status).json(data);
    } catch {
      return res.status(502).json({
        status: 'failed',
        code: 'BACKEND_UNREACHABLE',
        message: 'Verification service unreachable.'
      });
    }
  }

  if (!ai) {
    return res.status(503).json({
      status: 'failed',
      code: 'SERVER_MISCONFIGURED',
      message: 'Verification service is not configured (missing GEMINI_API_KEY).'
    });
  }

  const sanitizedClaim = trimmed.replace(/[<>{}]/g, ' ').replace(/\s+/g, ' ').trim();

  try {
    // -------------------------------------------------------------
    // STAGE 1: Real-time Live Web Search Retrieval
    // Try Gemini Google Search tool first; if quota exceeded, use public search
    // -------------------------------------------------------------
    let chunks: GroundedChunk[] = [];
    const seenDomains = new Set<string>();
    const seenUrls = new Set<string>();

    try {
      const searchPrompt = `Search the live web for authoritative evidence and official records regarding this claim:
"${sanitizedClaim}"`;

      const searchResponse = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const rawChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(rawChunks)) {
        for (const item of rawChunks) {
          const webUri = item?.web?.uri;
          const webTitle = item?.web?.title || '';
          if (webUri && typeof webUri === 'string' && /^https?:\/\//i.test(webUri)) {
            try {
              const urlObj = new URL(webUri);
              const domain = urlObj.hostname.replace(/^www\./, '').toLowerCase();

              if (!seenUrls.has(webUri)) {
                seenUrls.add(webUri);
                seenDomains.add(domain);
                chunks.push({
                  url: webUri,
                  title: webTitle || `Source: ${domain}`,
                  domain,
                });
              }
            } catch {
              // Ignore invalid URIs
            }
          }
        }
      }
    } catch {
      // If Google Search tool quota fails with 429, fall back to public live web retrieval
      const publicChunks = await searchWebPublic(sanitizedClaim);
      for (const p of publicChunks) {
        if (!seenUrls.has(p.url)) {
          seenUrls.add(p.url);
          seenDomains.add(p.domain);
          chunks.push(p);
        }
      }
    }

    // If still empty, do one more attempt with query keywords
    if (chunks.length === 0) {
      const fallbackResults = await searchWebPublic(sanitizedClaim);
      for (const p of fallbackResults) {
        if (!seenUrls.has(p.url)) {
          seenUrls.add(p.url);
          seenDomains.add(p.domain);
          chunks.push(p);
        }
      }
    }

    // -------------------------------------------------------------
    // STAGE 2: Minimum Evidence Threshold Verification Gate
    // If fewer than 2 independent domains retrieved -> UNVERIFIED (inconclusive)
    // -------------------------------------------------------------
    if (chunks.length < 2 || seenDomains.size < 2) {
      const checkedEvidence = await Promise.all(chunks.map(async (c, i) => ({
        id: `ev-${i + 1}`,
        source: c.domain,
        title: c.title || `Source: ${c.domain}`,
        url: c.url,
        quote: c.snippet || `Referenced in public search records regarding "${sanitizedClaim}".`,
        date: '',
        relationship: 'CONTEXT' as const,
        credibilityScore: 70,
        urlReachable: await isUrlReachable(c.url),
      })));

      return res.json({
        id: `audit-${Date.now()}`,
        status: 'inconclusive',
        claim: sanitizedClaim,
        checkedAt: new Date().toISOString(),
        verdict: 'UNVERIFIED',
        confidence: 0,
        summary: `Insufficient authoritative, independent public evidence was retrieved from indexed records to objectively substantiate or disprove "${sanitizedClaim}".`,
        analysis: `Our real-time search across public web sources and archives did not uncover multiple corroborating sources from independent domains for this specific assertion. In accordance with strict verification standards, an uncorroborated proposition cannot be assigned a definitive TRUE or FALSE verdict.`,
        reasoning: [
          {
            index: '01',
            title: 'Evidence Scarcity Check',
            description: `Querying public records retrieved ${chunks.length} verifiable source(s) across ${seenDomains.size} independent domain(s), falling below the threshold of 2 independent domains.`
          }
        ],
        evidenceOverview: {
          total: checkedEvidence.length,
          supports: 0,
          contradicts: 0,
          context: checkedEvidence.length,
        },
        evidence: checkedEvidence,
        isDemo: false
      });
    }

    // -------------------------------------------------------------
    // STAGE 3: Grounded Evidence Cross-Examination & Synthesis
    // -------------------------------------------------------------
    const sourcesSummaryList = chunks.slice(0, 6).map((c, idx) => 
      `Source [${idx + 1}]:\n  Title: "${c.title}"\n  Domain: "${c.domain}"\n  URL: "${c.url}"\n  Excerpt: "${c.snippet || ''}"`
    ).join('\n\n');

    const analysisPrompt = `You are FactCheckAI, an impartial evidence auditor.
Analyze the following claim strictly against the verified retrieved sources below:

CLAIM: "${sanitizedClaim}"

VERIFIED RETRIEVED SOURCES:
${sourcesSummaryList}

CRITICAL RULES:
1. You MUST NOT invent any sources, URLs, or quotes. Use ONLY the verified sources provided above.
2. For each source, classify whether it SUPPORTS, CONTRADICTS, or provides CONTEXT for the claim.
3. Determine an objective verdict: must be one of:
   - "FALSE" (if consensus clearly disproves the claim)
   - "TRUE" (if consensus clearly proves the claim)
   - "MOSTLY TRUE" (if accurate with minor qualifications)
   - "MOSTLY FALSE" (if predominantly inaccurate with minor truth)
   - "MIXED" (if valid arguments exist on both sides or sources conflict)
   - "UNVERIFIED" (if evidence remains ambiguous or contested)
4. Provide a 2-3 sentence executive summary.
5. Provide 3-4 structured reasoning steps explaining how the verdict was derived.
6. Provide a concise, substantive excerpt explaining what each source asserts.

Reply with ONLY a single valid JSON object adhering strictly to this schema:
{
  "verdict": "FALSE",
  "summary": "...",
  "analysis": "...",
  "reasoning": [
    { "index": "01", "title": "...", "description": "..." }
  ],
  "sourceEvaluations": [
    {
      "sourceIndex": 1,
      "relationship": "CONTRADICTS",
      "excerpt": "..."
    }
  ]
}`;

    const parsedData = await generateJsonWithFallback(analysisPrompt);
    const evaluations = Array.isArray(parsedData.sourceEvaluations) ? parsedData.sourceEvaluations : [];

    // Build structured evidence strictly using retrieved chunks and verify reachability
    const rawEvidence = chunks.slice(0, 6).map((chunk, idx) => {
      const evalItem = evaluations.find((e: any) => e.sourceIndex === idx + 1) || evaluations[idx];
      let rel: 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT' = 'CONTEXT';
      if (evalItem?.relationship === 'SUPPORTS') rel = 'SUPPORTS';
      else if (evalItem?.relationship === 'CONTRADICTS') rel = 'CONTRADICTS';

      const excerpt = (evalItem?.excerpt && typeof evalItem.excerpt === 'string' && evalItem.excerpt.trim())
        ? evalItem.excerpt.trim()
        : (chunk.snippet || `Primary citation examining assertion: "${sanitizedClaim.slice(0, 80)}..."`);

      return {
        id: `ev-${idx + 1}`,
        source: chunk.domain,
        title: chunk.title || `Source: ${chunk.domain}`,
        url: chunk.url,
        quote: excerpt,
        date: '',
        relationship: rel,
        credibilityScore: 85,
        urlReachable: true,
      };
    });

    // Check reachability asynchronously with SSRF guards
    await Promise.all(rawEvidence.map(async (ev) => {
      ev.urlReachable = await isUrlReachable(ev.url);
    }));

    const supportsCount = rawEvidence.filter(e => e.relationship === 'SUPPORTS').length;
    const contradictsCount = rawEvidence.filter(e => e.relationship === 'CONTRADICTS').length;
    const contextCount = rawEvidence.filter(e => e.relationship === 'CONTEXT').length;
    const decisiveCount = supportsCount + contradictsCount;

    let verdict = (parsedData.verdict || 'UNVERIFIED').toUpperCase();
    if (verdict === 'INCONCLUSIVE') {
      verdict = 'UNVERIFIED';
    }

    // Enforce Invariant 3: Evidence Polarity & Consistency Gate
    if (decisiveCount === 0) {
      verdict = 'UNVERIFIED';
    } else if (supportsCount > 0 && contradictsCount > 0) {
      verdict = 'MIXED';
    } else if (contradictsCount >= 2 && supportsCount === 0) {
      if (verdict === 'TRUE' || verdict === 'MOSTLY TRUE') {
        verdict = 'FALSE';
      }
    } else if (supportsCount >= 2 && contradictsCount === 0) {
      if (verdict === 'FALSE' || verdict === 'MOSTLY FALSE') {
        verdict = 'TRUE';
      }
    }

    // Programmatically calculate calibrated heuristic confidence
    let calibratedConfidence = 0;
    if (verdict !== 'UNVERIFIED') {
      if (decisiveCount >= 3 && (supportsCount === 0 || contradictsCount === 0)) {
        calibratedConfidence = 94;
      } else if (decisiveCount >= 2 && (supportsCount === 0 || contradictsCount === 0)) {
        calibratedConfidence = 88;
      } else if (verdict === 'MIXED') {
        calibratedConfidence = 74;
      } else {
        calibratedConfidence = 80;
      }
    }

    const isOk = verdict !== 'UNVERIFIED';
    const status: 'ok' | 'inconclusive' = isOk ? 'ok' : 'inconclusive';

    const finalReport = {
      id: `audit-${Date.now()}`,
      status,
      claim: sanitizedClaim,
      checkedAt: new Date().toISOString(),
      verdict,
      confidence: calibratedConfidence,
      summary: typeof parsedData.summary === 'string' && parsedData.summary.trim()
        ? parsedData.summary.trim()
        : `Multi-source evidence audit conducted for "${sanitizedClaim}".`,
      analysis: typeof parsedData.analysis === 'string' && parsedData.analysis.trim()
        ? parsedData.analysis.trim()
        : (typeof parsedData.summary === 'string' ? parsedData.summary : 'Detailed analysis conducted using retrieved web evidence.'),
      reasoning: Array.isArray(parsedData.reasoning) && parsedData.reasoning.length > 0 
        ? parsedData.reasoning.map((r: any, idx: number) => ({
            index: String(r.index || `0${idx + 1}`),
            title: String(r.title || 'Reasoning Step'),
            description: String(r.description || '')
          }))
        : [
            {
              index: '01',
              title: 'Source Examination',
              description: `Analyzed ${rawEvidence.length} authoritative reference documents across ${seenDomains.size} independent domains.`
            }
          ],
      evidenceOverview: {
        total: rawEvidence.length,
        supports: supportsCount,
        contradicts: contradictsCount,
        context: contextCount,
      },
      evidence: rawEvidence,
      isDemo: false as const
    };

    return res.json(finalReport);
  } catch (error: any) {
    const msg = String(error?.message || error || '');
    const isQuota = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
    if (isQuota) {
      return res.status(429).json({
        status: 'failed',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Verification quota exceeded. Please wait a moment before trying again.'
      });
    }
    return res.status(502).json({
      status: 'failed',
      code: 'VERIFICATION_FAILED',
      message: 'Verification failed. No result was produced.'
    });
  }
});

// GET /api/fact-check handler (informational or query fallback, never return HTML)
app.get(['/api/fact-check', '/api/fact-check/'], (req, res) => {
  res.status(405).json({
    status: 'failed',
    code: 'METHOD_NOT_ALLOWED',
    message: 'FactCheck API requires POST requests with JSON body: {"claim": "..."}'
  });
});

// Explicit API Guard: Any unmatched /api/* route must return JSON, NEVER fall through to HTML SPA
app.all(['/api', '/api/*'], (req, res) => {
  res.status(404).json({
    status: 'failed',
    code: 'NOT_FOUND',
    message: `API endpoint ${req.method} ${req.path} not found.`
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FactCheckAI server listening on port ${port}`);
  });
}

startServer();
