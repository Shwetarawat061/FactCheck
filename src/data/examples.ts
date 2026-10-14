export interface ExampleClaimItem {
  id: string;
  claim: string;
  category: 'News' | 'Health' | 'Finance' | 'Social' | 'Forensics' | 'Science';
  categoryLabel: string;
}

export const EXAMPLE_CLAIMS: ExampleClaimItem[] = [
  {
    id: 'news-1',
    claim: 'The United Nations passed a binding treaty banning civilian drones worldwide in 2026.',
    category: 'News',
    categoryLabel: 'News & Current Affairs'
  },
  {
    id: 'health-coffee',
    claim: 'Coffee causes cancer.',
    category: 'Health',
    categoryLabel: 'Health & Science'
  },
  {
    id: 'finance-tesla',
    claim: 'Tesla announced an immediate 40% price cut across all Model Y electric vehicles.',
    category: 'Finance',
    categoryLabel: 'Finance & Business'
  },
  {
    id: 'social-call-ban',
    claim: 'A secret federal regulation prohibits phone calls between 10 PM and 6 AM.',
    category: 'Social',
    categoryLabel: 'Social Media & Viral'
  },
  {
    id: 'forensics-moon',
    claim: 'The Great Wall of China is visible from the Moon with the naked eye.',
    category: 'Forensics',
    categoryLabel: 'Forensic & Evidence'
  },
  {
    id: 'science-brain',
    claim: 'Humans only use 10% of their brains.',
    category: 'Science',
    categoryLabel: 'Health & Science'
  }
];
