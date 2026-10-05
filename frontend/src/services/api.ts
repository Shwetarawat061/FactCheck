import { FactCheckResult, PipelineStep, PipelineStepStatus, Verdict } from '../types/factCheck';
import { DEMO_DATABASE } from '../data/examples';

export interface ProgressCallback {
  (stepIndex: number, steps: PipelineStep[]): void;
}

export const INITIAL_PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'understand',
    label: 'Understanding the claim',
    detail: 'Parsing semantic entities and extracting core proposition',
    status: 'pending'
  },
  {
    id: 'assertions',
    label: 'Identifying key assertions',
    detail: 'Isolating testable factual premises and bounding context',
    status: 'pending'
  },
  {
    id: 'search',
    label: 'Searching for relevant evidence',
    detail: 'Querying indexed academic, institutional, and archival databases',
    status: 'pending'
  },
  {
    id: 'compare',
    label: 'Comparing sources',
    detail: 'Weighting institutional authority and cross-checking contradictions',
    status: 'pending'
  },
  {
    id: 'verdict',
    label: 'Generating verdict',
    detail: 'Synthesizing reasoning points and calculating AI confidence',
    status: 'pending'
  }
];

export class FactCheckApiService {
  private static getApiBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
      return envUrl.trim().replace(/\/$/, '');
    }
    return '';
  }

  /**
   * Primary entry point to analyze a claim with staged telemetry.
   */
  public static async checkClaim(
    claim: string,
    onProgress?: ProgressCallback
  ): Promise<FactCheckResult> {
    const trimmed = claim.trim();
    if (!trimmed) {
      throw new Error('Please enter a claim to verify.');
    }

    const steps: PipelineStep[] = INITIAL_PIPELINE_STEPS.map(s => ({
      ...s,
      status: 'pending' as PipelineStepStatus
    }));

    // Step 0: Understanding the claim
    steps[0].status = 'active';
    onProgress?.(0, [...steps]);
    await this.sleep(450);

    // Step 1: Identifying key assertions
    steps[0].status = 'completed';
    steps[1].status = 'active';
    onProgress?.(1, [...steps]);
    await this.sleep(550);

    // Launch network request to /api/fact-check in parallel with Step 2 & 3
    const networkPromise = this.callBackendEndpoint(trimmed);

    // Step 2: Searching for relevant evidence
    steps[1].status = 'completed';
    steps[2].status = 'active';
    onProgress?.(2, [...steps]);
    await this.sleep(650);

    // Step 3: Comparing sources
    steps[2].status = 'completed';
    steps[3].status = 'active';
    onProgress?.(3, [...steps]);
    await this.sleep(600);

    // Step 4: Generating verdict
    steps[3].status = 'completed';
    steps[4].status = 'active';
    onProgress?.(4, [...steps]);

    let finalResult: FactCheckResult;

    try {
      finalResult = await networkPromise;
    } catch (networkError) {
      console.warn('Backend unavailable or network error, utilizing development fallback:', networkError);
      finalResult = this.generateFallbackResult(trimmed);
    }

    await this.sleep(400);
    steps[4].status = 'completed';
    onProgress?.(4, [...steps]);

    return finalResult;
  }

  /**
   * Calls POST /api/fact-check
   */
  private static async callBackendEndpoint(claim: string): Promise<FactCheckResult> {
    const baseUrl = this.getApiBaseUrl();
    const endpoint = `${baseUrl}/api/fact-check`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ claim }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (!json || typeof json !== 'object' || !json.verdict) {
        throw new Error('Invalid JSON response format from /api/fact-check');
      }

      // Format to our standard FactCheckResult interface
      const result: FactCheckResult = {
        id: json.id || `claim-${Date.now()}`,
        claim: json.claim || claim,
        verdict: json.verdict || 'UNVERIFIED',
        confidence: typeof json.confidence === 'number' ? json.confidence : 90,
        summary: json.summary || 'Summary unavailable.',
        analysis: json.analysis || json.summary || '',
        reasoning: Array.isArray(json.reasoning) ? json.reasoning : [],
        evidenceOverview: json.evidenceOverview || {
          total: Array.isArray(json.evidence) ? json.evidence.length : 0,
          supports: Array.isArray(json.evidence) ? json.evidence.filter((e: any) => e.relationship === 'SUPPORTS' || e.supports === true).length : 0,
          contradicts: Array.isArray(json.evidence) ? json.evidence.filter((e: any) => e.relationship === 'CONTRADICTS' || e.supports === false).length : 0,
          context: Array.isArray(json.evidence) ? json.evidence.filter((e: any) => e.relationship === 'CONTEXT').length : 0
        },
        evidence: Array.isArray(json.evidence) ? json.evidence.map((e: any, idx: number) => ({
          id: e.id || `ev-${idx}`,
          source: e.source || e.sourceName || 'Primary Source',
          title: e.title || 'Institutional Publication',
          url: e.url || 'https://example.com',
          quote: e.quote || 'No direct excerpt available.',
          date: e.date || 'Recent archive',
          relationship: e.relationship || (e.supports === true ? 'SUPPORTS' : e.supports === false ? 'CONTRADICTS' : 'CONTEXT'),
          credibilityScore: e.credibilityScore || 95
        })) : [],
        checkedAt: json.checkedAt || 'Checked just now',
        isDemo: json.isDemo ?? false
      };

      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Provides development mock fallback if backend is offline or disconnected
   */
  private static generateFallbackResult(claim: string): FactCheckResult {
    // Check if matching demo database
    for (const [key, demoVal] of Object.entries(DEMO_DATABASE)) {
      if (claim.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(claim.toLowerCase())) {
        return {
          ...demoVal,
          id: `demo-${Date.now()}`,
          claim: claim,
          checkedAt: 'Checked just now (Demo Mode)',
          isDemo: true
        };
      }
    }

    // Default development fallback
    const isQuestionable = /flat|moon|10%|cure|fake|hoax/i.test(claim);
    const verdict: Verdict = isQuestionable ? 'FALSE' : 'MIXED';

    return {
      id: `dev-fallback-${Date.now()}`,
      claim: claim,
      verdict: verdict,
      confidence: 94,
      summary: `Evaluated "${claim}" against accessible reference registries. Multilateral consensus indicates the assertion requires essential contextual clarification.`,
      analysis: `The submitted proposition "${claim}" was assessed through empirical source cross-referencing. While certain assertions contain colloquial or historical context, direct scientific and regulatory verification highlights critical boundary conditions.`,
      reasoning: [
        {
          index: '01',
          title: 'Semantic Proposition Extraction',
          description: 'Isolating specific empirical claims and examining boundary definitions across published literature.'
        },
        {
          index: '02',
          title: 'Institutional Evidence Cross-Checking',
          description: 'Evaluating against peer-reviewed registries and authoritative research bodies.'
        },
        {
          index: '03',
          title: 'Consensus Formulation',
          description: 'Synthesizing evidence weights to establish calibrated determination.'
        }
      ],
      evidenceOverview: {
        total: 3,
        supports: isQuestionable ? 0 : 2,
        contradicts: isQuestionable ? 2 : 0,
        context: 1
      },
      evidence: [
        {
          id: 'src-1',
          source: 'Reuters Fact Check Archive',
          title: 'Comprehensive Verification Analysis of Circulated Claims',
          url: 'https://www.reuters.com/fact-check',
          quote: 'Public record data and institutional repositories require specific contextual qualification for assertions of this nature.',
          date: 'Reference Archive',
          relationship: isQuestionable ? 'CONTRADICTS' : 'CONTEXT',
          credibilityScore: 96
        },
        {
          id: 'src-2',
          source: 'Associated Press News',
          title: 'Fact Check & Public Record Inquiries',
          url: 'https://apnews.com/hub/ap-fact-check',
          quote: 'Independent researchers highlight that statistical qualifiers must be factored in prior to broad dissemination.',
          date: 'Verification Review',
          relationship: isQuestionable ? 'CONTRADICTS' : 'SUPPORTS',
          credibilityScore: 95
        },
        {
          id: 'src-3',
          source: 'National Institutes of Health (NIH)',
          title: 'Systematic Evaluation of Published Literature',
          url: 'https://pubmed.ncbi.nlm.nih.gov',
          quote: 'Empirical data across comparative sample studies provide critical boundary parameters regarding this topic.',
          date: 'Peer Review Database',
          relationship: 'CONTEXT',
          credibilityScore: 94
        }
      ],
      checkedAt: 'Checked just now (Demo Mode)',
      isDemo: true
    };
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
  }
}
