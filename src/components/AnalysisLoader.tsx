import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { PipelineStep } from '../types/factCheck';

interface AnalysisLoaderProps {
  steps: PipelineStep[];
  claim: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ steps, claim }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-9 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Header */}
      <div className="text-center mb-7">
        <span className="font-mono text-xs uppercase tracking-wider text-stone-600 block mb-1">
          Evidence Pipeline Active
        </span>
        <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
          Analyzing claim
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 italic line-clamp-2 max-w-lg mx-auto">
          "{claim}"
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-1.5 mb-8 overflow-hidden">
        <div 
          className="bg-stone-900 h-full transition-all duration-300 ease-out"
          style={{
            width: `${Math.max(
              15,
              (steps.filter(s => s.status === 'completed').length / steps.length) * 100
            )}%`
          }}
        />
      </div>

      {/* 5 Steps List */}
      <div className="space-y-4 max-w-md mx-auto">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 transition-all duration-200 ${
                isDone
                  ? 'text-stone-900'
                  : isActive
                  ? 'text-stone-900 font-medium'
                  : 'text-stone-400'
              }`}
            >
              {/* Status Circle */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-stone-900 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-stone-900 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                  </div>
                )}
              </div>

              {/* Label & Detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isActive ? 'font-semibold' : ''}`}>
                    {step.label}
                  </span>
                  {isActive && (
                    <Loader2 className="w-3.5 h-3.5 text-stone-700 animate-spin" />
                  )}
                </div>
                <p className="text-[11px] text-stone-600 leading-snug mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
