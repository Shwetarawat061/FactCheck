import React from 'react';
import { Loader2, Search, Database, ShieldCheck } from 'lucide-react';
import { PipelineStep } from '../types/factCheck';

interface AnalysisLoaderProps {
  steps?: PipelineStep[];
  claim: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ claim }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-9 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-medium mb-3">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-800" />
          <span>Verifying with live web records...</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
          Verifying Claim
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 italic line-clamp-2 max-w-lg mx-auto">
          "{claim}"
        </p>
      </div>

      {/* Neutral indeterminate pulse bar */}
      <div className="w-full bg-stone-100 rounded-full h-1.5 mb-7 overflow-hidden relative">
        <div className="bg-stone-900 h-full w-1/3 rounded-full animate-indeterminate" />
      </div>

      {/* Operational stages shown neutrally */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex flex-col items-center">
          <Search className="w-4 h-4 text-stone-700 mb-1.5" />
          <span className="text-xs font-semibold text-stone-900">Live Search</span>
          <span className="text-[11px] text-stone-500 mt-0.5">Querying public sources</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex flex-col items-center">
          <Database className="w-4 h-4 text-stone-700 mb-1.5" />
          <span className="text-xs font-semibold text-stone-900">Consensus Audit</span>
          <span className="text-[11px] text-stone-500 mt-0.5">Cross-examining domains</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-stone-700 mb-1.5" />
          <span className="text-xs font-semibold text-stone-900">Strict Verification</span>
          <span className="text-[11px] text-stone-500 mt-0.5">Evaluating polarity gates</span>
        </div>
      </div>
    </div>
  );
};
