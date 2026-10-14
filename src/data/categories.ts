export interface ClaimCategory {
  id: string;
  label: string;
  tag: string;
  description: string;
}

export const CLAIM_CATEGORIES: ClaimCategory[] = [
  { id: 'all', label: 'All Categories', tag: 'GENERAL', description: 'Universal claim verification across all topics' },
  { id: 'news', label: 'News & Current Affairs', tag: 'NEWS', description: 'Breaking headlines, politics, and current events' },
  { id: 'politics', label: 'Politics', tag: 'POLITICS', description: 'Speeches, legislative claims, and political assertions' },
  { id: 'health', label: 'Health & Medicine', tag: 'HEALTH', description: 'Medical remedies, wellness claims, and nutrition' },
  { id: 'science', label: 'Science & Nature', tag: 'SCIENCE', description: 'Scientific discoveries, physics, and empirical research' },
  { id: 'finance', label: 'Finance & Business', tag: 'FINANCE', description: 'Market statistics, corporate news, and earnings' },
  { id: 'tech', label: 'Technology', tag: 'TECH', description: 'AI developments, software, hardware, and gadgets' },
  { id: 'social', label: 'Social Media & Viral', tag: 'VIRAL', description: 'Forwarded messages, viral quotes, and meme claims' },
  { id: 'other', label: 'Other', tag: 'OTHER', description: 'General curiosity and miscellaneous assertions' }
];

export interface SampleClaimPrompt {
  id: string;
  category: string;
  chipLabel: string;
  claim: string;
  sourceHint?: string;
}

export const SAMPLE_CLAIMS: SampleClaimPrompt[] = [
  {
    id: 'sample-health',
    category: 'Health',
    chipLabel: 'Health claim',
    claim: 'Coffee causes cancer according to international health organizations.',
    sourceHint: 'WHO / IARC monograph reviews'
  },
  {
    id: 'sample-pop',
    category: 'Science',
    chipLabel: 'Population claim',
    claim: 'Humans only use 10% of their brains in everyday thinking.',
    sourceHint: 'Neuroimaging consensus studies'
  },
  {
    id: 'sample-viral',
    category: 'Viral',
    chipLabel: 'Viral claim',
    claim: 'The Great Wall of China is visible from the Moon with the naked eye.',
    sourceHint: 'NASA & orbital photography'
  },
  {
    id: 'sample-news',
    category: 'News',
    chipLabel: 'News headline',
    claim: 'The United Nations passed a binding treaty banning civilian drones worldwide in 2026.',
    sourceHint: 'UN General Assembly resolutions'
  },
  {
    id: 'sample-finance',
    category: 'Finance',
    chipLabel: 'Finance claim',
    claim: 'Tesla announced an immediate 40% price cut across all Model Y vehicles globally.',
    sourceHint: 'SEC 8-K filings & investor relations'
  }
];
