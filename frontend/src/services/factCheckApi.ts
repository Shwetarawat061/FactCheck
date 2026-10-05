/**
 * FactCheckAI Frontend API Client
 * Communicates with the Flask REST API (/api/fact-check) via VITE_API_BASE_URL.
 * Falls back gracefully to mock verification data if backend is offline.
 */

import { FactCheckResult, PipelineStep, PipelineStepStatus } from '../types/factCheck';
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
    detail: 'Querying indexed academic, institutional, and live search databases',
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

export class FactCheckApi {
  /**
   * Retrieves configured API base URL from Vite environment variables.
   * Default fallback to '' which proxies to backend via Vite or same-origin server.
   */
  private static getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
      return envUrl.trim().replace(/\/$/, '');
    }
    return '';
  }

  /**
   * Primary entry point: Executes fact check against Flask API with staged telemetry.
   */
  public static async check(
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

    // Step 0: Understand claim
    steps[0].status = 'active';
    onProgress?.(0, [...steps]);
    await this.sleep(400);

    // Step 1: Identify assertions
    steps[0].status = 'completed';
    steps[1].status = 'active';
    onProgress?.(1, [...steps]);
    await this.sleep(500);

    // Launch network request to Flask REST endpoint
    const networkPromise = this.callFlaskApi(trimmed);

    // Step 2: Search evidence
    steps[1].status = 'completed';
    steps[2].status = 'active';
    onProgress?.(2, [...steps]);
    await this.sleep(600);

    // Step 3: Compare sources
    steps[2].status = 'completed';
    steps[3].status = 'active';
    onProgress?.(3, [...steps]);
    await this.sleep(550);

    // Step 4: Generate verdict
    steps[3].status = 'completed';
    steps[4].status = 'active';
    onProgress?.(4, [...steps]);

    let finalResult: FactCheckResult;

    try {
      finalResult = await networkPromise;
    } catch (networkError) {
      console.warn('Backend unavailable, utilizing development mock fallback:', networkError);
      finalResult = this.generateFallbackResult(trimmed);
    }

    await this.sleep(350);
    steps[4].status = 'completed';
    onProgress?.(4, [...steps]);

    return finalResult;
  }

  /**
   * Calls POST /api/fact-check on the Flask backend
   */
  private static async callFlaskApi(claim: string): Promise<FactCheckResult> {
    const baseUrl = this.getBaseUrl();
    const endpoint = `${baseUrl}/api/fact-check`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ claim }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      const payload = json.data || json;

      if (!payload || typeof payload !== 'object' || !payload.verdict) {
        throw new Error('Invalid JSON structure received from /api/fact-check');
      }

      return {
        id: payload.id || `claim-${Date.now()}`,
        claim: payload.claim || claim,
        verdict: payload.verdict || 'UNVERIFIED',
        confidence: typeof payload.confidence === 'number' ? payload.confidence : 90,
        summary: payload.summary || 'Summary unavailable.',
        analysis: payload.analysis || payload.summary || '',
        reasoning: Array.isArray(payload.reasoning) ? payload.reasoning : [],
        evidenceOverview: payload.evidenceOverview || {
          total: Array.isArray(payload.evidence) ? payload.evidence.length : 0,
          supports: Array.isArray(payload.evidence) ? payload.evidence.filter((e: any) => e.relationship === 'SUPPORTS' || e.supports === true).length : 0,
          contradicts: Array.isArray(payload.evidence) ? payload.evidence.filter((e: any) => e.relationship === 'CONTRADICTS' || e.supports === false).length : 0,
          context: Array.isArray(payload.evidence) ? payload.evidence.filter((e: any) => e.relationship === 'CONTEXT').length : 0
        },
        evidence: Array.isArray(payload.evidence) ? payload.evidence.map((e: any, idx: number) => ({
          id: e.id || `ev-${idx}`,
          source: e.source || e.sourceName || 'Primary Source',
          sourceName: e.sourceName || e.source || 'Primary Source',
          sourceDomain: e.sourceDomain || '',
          title: e.title || 'Institutional Publication',
          url: e.url || 'https://example.com',
          quote: e.quote || 'No direct excerpt available.',
          date: e.date || 'Recent archive',
          relationship: e.relationship || (e.supports === true ? 'SUPPORTS' : e.supports === false ? 'CONTRADICTS' : 'CONTEXT'),
          credibilityScore: e.credibilityScore || 95
        })) : [],
        checkedAt: payload.checkedAt || 'Checked just now',
        isDemo: payload.isDemo ?? false
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Fallback mock generator when Flask backend is not running on localhost
   */
  private static generateFallbackResult(claim: string): FactCheckResult {
    const c = claim.toLowerCase();

    for (const [key, demo] of Object.entries(DEMO_DATABASE)) {
      if (c.includes(key) || key.includes(c)) {
        return {
          ...demo,
          id: `demo-${key}`,
          claim,
          checkedAt: 'Checked just now (Demo Mode)',
          isDemo: true
        };
      }
    }

    return {
      id: `mock-${Date.now()}`,
      claim,
      verdict: 'MIXED',
      confidence: 88,
      summary: `Evidence synthesis for "${claim}". Primary consensus indicates nuanced qualifications are necessary when evaluating this statement.`,
      analysis: `Our comparative analysis of institutional publications and scientific literature suggests that while certain premises of "${claim}" have partial backing, critical counter-evidence warrants a qualified verdict.`,
      reasoning: [
        {
          index: '01',
          title: 'Premise Isolation',
          description: `Isolated core factual assertion: "${claim.slice(0, 80)}..." for verification against documented empirical consensus.`
        },
        {
          index: '02',
          title: 'Evidence Cross-Referencing',
          description: 'Examined multi-source literature and institutional databases to identify conflicting or corroborating assertions.'
        }
      ],
      evidenceOverview: {
        total: 2,
        supports: 1,
        contradicts: 1,
        context: 0
      },
      evidence: [
        {
          id: 'ev-mock-1',
          source: 'Reuters Fact Check Archive',
          title: 'Independent Verification of Public Statements',
          url: 'https://www.reuters.com/fact-check',
          quote: 'Public record data confirms that substantial caveats apply to this assertion.',
          date: 'Reference Registry',
          relationship: 'CONTRADICTS',
          credibilityScore: 97
        },
        {
          id: 'ev-mock-2',
          source: 'Associated Press News',
          title: 'Analysis of Circulating Claims and Scientific Evidence',
          url: 'https://apnews.com/hub/ap-fact-check',
          quote: 'Peer-reviewed studies indicate context is critical to interpreting this topic accurately.',
          date: 'Audited Report',
          relationship: 'SUPPORTS',
          credibilityScore: 95
        }
      ],
      checkedAt: 'Checked just now (Mock Fallback)',
      isDemo: true
    };
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
