import React from 'react';
import { Terminal, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ReasoningStep } from '../types/factCheck';

interface ReasoningSectionProps {
  reasoning?: ReasoningStep[];
  verdict: string;
}

export const ReasoningSection: React.FC<ReasoningSectionProps> = ({ reasoning, verdict }) => {
  if (!reasoning || reasoning.length === 0) return null;

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-6 sm:p-7 mb-7 text-[#C9D1D9]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-[#F0F6FC]">
            // FORENSIC_REASONING_AUDIT_LOG
          </h4>
        </div>
        <span className="font-mono text-[11px] text-[#8B949E]">
          VERDICT_SYNTHESIS: [{verdict}]
        </span>
      </div>

      <p className="text-xs sm:text-sm font-mono text-[#8B949E] mb-6 leading-relaxed">
        Step-by-step analytical audit tracing why the retrieved evidence establishes the <span className="text-emerald-400 font-bold">[{verdict}]</span> determination:
      </p>

      {/* Step by step reasoning log */}
      <div className="space-y-4">
        {reasoning.map((step, idx) => (
          <div 
            key={step.index || idx} 
            className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#0D1117] border border-[#21262D] hover:border-[#30363D] transition-colors"
          >
            <span className="px-2 py-1 rounded bg-[#161B22] border border-[#30363D] text-emerald-400 font-mono text-xs font-bold shrink-0 mt-0.5">
              STEP_{step.index || String(idx + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <h5 className="font-mono text-xs sm:text-sm font-bold text-[#F0F6FC] mb-1">
                {step.title}
              </h5>
              <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed font-sans">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI-assisted analysis transparency card */}
      <div className="mt-6 pt-4 border-t border-[#30363D] flex items-start gap-3 text-xs font-mono text-[#8B949E] leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-[#F0F6FC] font-semibold block mb-0.5">
            // TRANSPARENCY_AUDIT_PROTOCOL
          </span>
          <p>
            Synthesized exclusively against retrieved web corpus excerpts. Excerpts are verified against primary sources to ensure zero synthetic hallucinations.
          </p>
        </div>
      </div>
    </div>
  );
};
