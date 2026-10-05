export type Verdict =
  | 'TRUE'
  | 'MOSTLY TRUE'
  | 'MIXED'
  | 'MOSTLY FALSE'
  | 'FALSE'
  | 'UNVERIFIED';

export type EvidenceRelationship =
  | 'SUPPORTS'
  | 'CONTRADICTS'
  | 'CONTEXT';

export interface Evidence {
  id?: string;
  source: string;
  sourceName?: string;
  sourceDomain?: string;
  title: string;
  url: string;
  quote: string;
  date?: string;
  relationship: EvidenceRelationship;
  direction?: string;
  credibilityScore?: number;
}

export interface ReasoningStep {
  index: string;
  title: string;
  description: string;
}

export interface EvidenceCounts {
  total: number;
  supports: number;
  contradicts: number;
  context: number;
}

export interface FactCheckResult {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: number; // AI confidence integer 0-100
  summary: string;
  analysis?: string;
  reasoning?: ReasoningStep[];
  evidenceOverview: EvidenceCounts;
  evidence: Evidence[];
  sources?: Evidence[];
  checkedAt: string;
  isDemo?: boolean;
}

export type PipelineStepStatus = 'pending' | 'active' | 'completed';

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  status: PipelineStepStatus;
}
