export type EvidenceRelationship = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXT';

export interface EvidenceSource {
  id: string;
  source: string;
  sourceName?: string;
  sourceDomain?: string;
  title: string;
  url: string;
  quote: string;
  date: string;
  relationship: EvidenceRelationship;
  direction?: string;
  supportsVerdict?: boolean;
  credibilityScore: number;
}

export interface EvidenceOverviewData {
  total: number;
  supports: number;
  contradicts: number;
  context: number;
  strengthScore?: number;
}
