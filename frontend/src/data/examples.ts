export interface ExampleClaimItem {
  id: string;
  claim: string;
  category: 'Science' | 'Health' | 'Astronomy' | 'Geography' | 'Physics';
}

export const EXAMPLE_CLAIMS: ExampleClaimItem[] = [
  {
    id: 'flat-earth',
    claim: 'The Earth is flat.',
    category: 'Science'
  },
  {
    id: 'brain-10',
    claim: 'Humans only use 10% of their brains.',
    category: 'Science'
  },
  {
    id: 'great-wall-moon',
    claim: 'The Great Wall of China is visible from the Moon.',
    category: 'Astronomy'
  },
  {
    id: 'coffee-cancer',
    claim: 'Coffee causes cancer.',
    category: 'Health'
  },
  {
    id: 'water-boiling',
    claim: 'Water boils at 100°C at sea level.',
    category: 'Physics'
  }
];
