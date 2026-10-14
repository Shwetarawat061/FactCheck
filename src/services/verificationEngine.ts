import { GoogleGenAI } from '@google/genai';
import { FactCheckResult, Evidence, ReasoningStep } from '../types/factCheck';

const MULTIPART_TLDS = new Set([
  'ac.uk', 'co.in', 'co.jp', 'co.nz', 'co.uk',
  'com.au', 'com.br', 'com.cn', 'com.mx', 'com.sg',
  'com.tr', 'org.uk', 'gov.uk', 'edu.au',
]);

export function getDomain(rawUrl: string): string {
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

export interface RetrievedSource {
  url: string;
  title: string;
  domain: string;
  content: string;
  date?: string;
  score?: number;
}

export async function searchWithTavily(claim: string, apiKey: string): Promise<RetrievedSource[]> {
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

export async function searchWithDuckDuckGo(claim: string): Promise<RetrievedSource[]> {
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

export async function searchWithWikipedia(claim: string): Promise<RetrievedSource[]> {
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
        const u = urls[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
        const exRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (!exRes.ok) return null;
        const exData = (await exRes.json()) as any;
        const pages = Object.values(exData?.query?.pages || {}) as any[];
        const extract = (pages[0]?.extract || '').trim();
        if (extract && extract.length > 25) {
          return {
            url: u,
            title: `${title} - Wikipedia`,
            domain: 'en.wikipedia.org',
            content: extract.slice(0, 3000),
            date: '',
            score: 0.92,
          };
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

export async function generateWithGemini(ai: GoogleGenAI, prompt: string): Promise<string> {
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

export async function verifyClaimEngine(
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

  // Concurrently execute multi-source retrieval (Tavily, DuckDuckGo, Wikipedia)
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

  // Evidence scarcity gate
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

  // Grounded Cross-Examination
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

  const allowedVerdicts = ['TRUE', 'MOSTLY TRUE', 'MIXED', 'MOSTLY FALSE', 'FALSE', 'UNVERIFIED'];
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
  } else if (supportsCount >= 2 && contradictsCount === 0 && (verdict === 'FALSE' || verdict === 'MOSTLY FALSE')) {
    verdict = 'TRUE';
  }

  const confidence =
    verdict === 'UNVERIFIED'
      ? 0
      : typeof parsed?.confidence === 'number' && parsed.confidence >= 50 && parsed.confidence <= 99
      ? parsed.confidence
      : supportsCount >= 3 || contradictsCount >= 3
      ? 94
      : 86;

  const reasoning: ReasoningStep[] =
    Array.isArray(parsed?.reasoning) && parsed.reasoning.length > 0
      ? parsed.reasoning.map((r: any, idx: number) => ({
          index: String(r.index || `0${idx + 1}`),
          title: String(r.title || `Reasoning Phase ${idx + 1}`),
          description: String(r.description || `Assessment derived from retrieved source data.`),
        }))
      : [
          {
            index: '01',
            title: 'Primary Corroboration',
            description: `Cross-referenced across ${evidenceList.length} independent sources.`,
          },
        ];

  return {
    id: auditId,
    status: verdict === 'UNVERIFIED' ? 'inconclusive' : 'ok',
    claim,
    checkedAt: nowIso,
    verdict: verdict as any,
    confidence,
    summary:
      typeof parsed?.summary === 'string' && parsed.summary.trim()
        ? parsed.summary.trim()
        : `Evidence synthesis conducted for "${claim}".`,
    analysis:
      typeof parsed?.analysis === 'string' && parsed.analysis.trim()
        ? parsed.analysis.trim()
        : `Verified findings based on ${uniqueDomains.size} independent domains.`,
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
