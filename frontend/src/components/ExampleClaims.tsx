import React from 'react';
import { EXAMPLE_CLAIMS } from '../data/examples';

interface ExampleClaimsProps {
  onSelectClaim: (claim: string) => void;
  disabled?: boolean;
}

export const ExampleClaims: React.FC<ExampleClaimsProps> = ({ onSelectClaim, disabled = false }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">
          Try an example:
        </span>
        <span className="text-[11px] text-stone-400 italic">
          Test inputs only • Subject to verification
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_CLAIMS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectClaim(item.claim)}
            className="text-xs text-stone-700 bg-white hover:bg-stone-50 hover:text-stone-900 border border-stone-200/90 rounded-lg px-3 py-1.5 transition-all text-left shadow-2xs hover:border-stone-300 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
          >
            "{item.claim}"
          </button>
        ))}
      </div>
    </div>
  );
};
