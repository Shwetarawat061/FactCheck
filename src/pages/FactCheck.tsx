import React, { useRef } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { FactCheckResult as ResultType, PipelineStep } from '../types/factCheck';
import { ClaimInput } from '../components/ClaimInput';
import { ExampleClaims } from '../components/ExampleClaims';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { FactCheckResult } from '../components/FactCheckResult';

interface FactCheckPageProps {
  claimInput: string;
  setClaimInput: (val: string) => void;
  isLoading: boolean;
  pipelineSteps: PipelineStep[];
  result: ResultType | null;
  onCheckClaim: (claim?: string) => void;
  onReset: () => void;
  errorMessage: string | null;
  onClearError: () => void;
}

export const FactCheckPage: React.FC<FactCheckPageProps> = ({
  claimInput,
  setClaimInput,
  isLoading,
  pipelineSteps,
  result,
  onCheckClaim,
  onReset,
  errorMessage,
  onClearError
}) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const handleExampleSelect = (exampleClaim: string) => {
    setClaimInput(exampleClaim);
    onCheckClaim(exampleClaim);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Error state alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">{errorMessage}</span>
              <span className="text-xs text-rose-700 mt-0.5 block">
                FactCheckAI encountered an issue. Please retry with another claim or an example below.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Input Form (Visible when not actively displaying a result) */}
      {!result && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-medium border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>LIVE EVIDENCE GROUNDING</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              Verify a Claim
            </h1>
            <p className="text-sm sm:text-base text-stone-600 font-serif leading-relaxed max-w-2xl">
              Enter any statement, headline, statistic, or assertion. FactCheckAI searches live evidence and presents an objective, citation-backed report.
            </p>
          </div>

          {/* Claim Input Card */}
          <ClaimInput
            value={claimInput}
            onChange={setClaimInput}
            onSubmit={() => onCheckClaim()}
            isLoading={isLoading}
            autoFocus={!isLoading}
          />

          {/* Example Claims */}
          <ExampleClaims
            onSelectClaim={handleExampleSelect}
            disabled={isLoading}
          />

          {/* Analysis Loading State */}
          {isLoading && (
            <AnalysisLoader
              steps={pipelineSteps}
              claim={claimInput}
            />
          )}

        </div>
      )}

      {/* Result Section */}
      {result && (
        <div ref={resultRef}>
          <FactCheckResult
            result={result}
            onReset={onReset}
          />
        </div>
      )}

    </div>
  );
};
