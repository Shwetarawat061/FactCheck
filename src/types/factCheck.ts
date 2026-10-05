export type Verdict =
  | 'TRUE'
  | 'MOSTLY TRUE'
  | 'MIXED'
  | 'MOSTLY FALSE'
  | 'FALSE'
  | 'UNVERIFIED';

export type Relationship = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT';
export type EvidenceRelationship = Relationship;

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
  sourceName?: string;
  sourceDomain?: string;
  relevanceScore?: number;
}

export interface ReasoningStep {
  index: string;
  title: string;
  description: string;
  sourceIds?: string[];
}

export interface EvidenceCounts {
  total: number;
  supports: number;
  contradicts: number;
  context: number;
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
  evidenceOverview: EvidenceCounts;
  evidence: Evidence[];
  isDemo: false;
  sources?: Evidence[];
}

export type FactCheckResultData = FactCheckResult;

export type PipelineStepStatus = 'pending' | 'active' | 'completed';

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  status: PipelineStepStatus;
}
