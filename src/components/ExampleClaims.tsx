import React from 'react';
import { EXAMPLE_CLAIMS } from '../data/examples';
import { Plus, Terminal } from 'lucide-react';
import { playTerminalSound } from '../services/terminalAudio';

interface ExampleClaimsProps {
  onSelectClaim: (claim: string) => void;
  disabled?: boolean;
}

export const ExampleClaims: React.FC<ExampleClaimsProps> = ({ onSelectClaim, disabled = false }) => {
  return (
    <div className="w-full mt-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>SUGGESTED_INQUEST_QUERIES:</span>
        </span>
        <span className="font-mono text-[11px] text-[#484F58]">
          CLICK CHIP TO POPULATE & AUDIT
        </span>
      </div>

      {/* Clickable Query Chips with subtle + icon */}
      <div className="flex flex-wrap gap-2.5">
        {EXAMPLE_CLAIMS.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              playTerminalSound('click');
              onSelectClaim(item.claim);
            }}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] hover:border-emerald-500/50 text-[#C9D1D9] hover:text-[#F0F6FC] font-mono text-xs transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-[0.98] disabled:opacity-40"
          >
            <span className="text-emerald-400/80 group-hover:text-emerald-400 font-mono text-[11px] font-bold">
              {item.category}:
            </span>
            <span className="truncate max-w-[260px] sm:max-w-none text-[#C9D1D9] group-hover:text-white">
              "{item.claim}"
            </span>
            <div className="w-4 h-4 rounded bg-[#0D1117] border border-[#30363D] group-hover:border-emerald-500/50 flex items-center justify-center shrink-0 ml-0.5 group-hover:bg-emerald-950/40 transition-colors">
              <Plus className="w-2.5 h-2.5 text-[#8B949E] group-hover:text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
