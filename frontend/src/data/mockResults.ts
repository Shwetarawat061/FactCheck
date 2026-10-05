import { DEMO_DATABASE } from './examples';
import { FactCheckResult } from '../types/factCheck';

export const MOCK_FACT_CHECK_RESULTS: Record<string, FactCheckResult> = DEMO_DATABASE;

export const DEFAULT_EXAMPLE_CLAIMS = [
  'The Great Wall of China is visible from the Moon.',
  'Coffee causes cancer.',
  'Humans only use 10% of their brains.',
  'Water boils at 100°C at sea level.'
];
