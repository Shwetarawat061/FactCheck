import { useState, useCallback } from 'react';
import { FactCheckResult, PipelineStep } from '../types/factCheck';
import { FactCheckApiService, INITIAL_PIPELINE_STEPS } from '../services/api';

export function useFactCheck() {
  const [claimInput, setClaimInput] = useState<string>('The Great Wall of China is visible from the Moon.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE_STEPS);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyClaim = useCallback(async (claimText?: string) => {
    const claim = (claimText || claimInput).trim();
    if (!claim) return null;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await FactCheckApiService.checkClaim(claim, (_idx, steps) => {
        setPipelineSteps(steps);
      });
      setResult(data);
      return data;
    } catch (err: any) {
      setError(err?.message || 'Failed to verify claim.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [claimInput]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setClaimInput('');
    setPipelineSteps(INITIAL_PIPELINE_STEPS);
  }, []);

  return {
    claimInput,
    setClaimInput,
    isLoading,
    pipelineSteps,
    result,
    error,
    verifyClaim,
    reset,
  };
}
