export type VerdictType = 
  | 'TRUE' 
  | 'MOSTLY TRUE' 
  | 'PARTIALLY TRUE'
  | 'MIXED' 
  | 'MOSTLY FALSE' 
  | 'FALSE' 
  | 'UNVERIFIED';

export type EvidenceDirection = 
  | 'SUPPORTS CLAIM' 
  | 'CONTRADICTS CLAIM' 
  | 'CONTEXT';

export interface EvidenceSource {
  id: string;
  sourceName: string;
  sourceDomain: string;
  title: string;
  url: string;
  quote: string;
  date: string;
  direction: EvidenceDirection;
  supportsVerdict: boolean;
  credibilityScore?: number;
  screenshotVerified?: boolean;
}

export interface ReasoningPoint {
  index: string;
  title: string;
  description: string;
}

export interface User {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  avatar?: string;
  photoURL?: string;
  provider: 'google' | 'apple' | 'email' | 'microsoft' | 'sso';
}

export interface FactCheckResultData {
  id: string;
  claim: string;
  checkedAt: string;
  verdict: VerdictType;
  confidence: number; // 0 to 100
  headline?: string;
  summary: string;
  caveats?: string[];
  reasoning: ReasoningPoint[];
  evidenceOverview: {
    strengthScore: number; // e.g. 86
    totalSources: number;
    contradictCount: number;
    supportCount: number;
    contextCount: number;
  };
  sources: EvidenceSource[];
  isDemo?: boolean;
}

export type PipelineStepStatus = 'pending' | 'active' | 'completed';

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  status: PipelineStepStatus;
}
