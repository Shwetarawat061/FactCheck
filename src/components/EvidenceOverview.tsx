import React from 'react';
import { Layers, CheckCircle2, XCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { EvidenceCounts } from '../types/factCheck';

interface EvidenceOverviewProps {
  overview: EvidenceCounts;
}

export const EvidenceOverview: React.FC<EvidenceOverviewProps> = ({ overview }) => {
  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 sm:p-6 mb-6 text-[#C9D1D9]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-[#F0F6FC]">
            // EVIDENCE_DISTRIBUTION_TELEMETRY
          </h4>
        </div>
        <span className="text-[11px] font-mono text-[#8B949E]">
          POLARITY_AUDIT_CORPUS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Sources */}
        <div className="bg-[#0D1117] rounded-lg p-3.5 border border-[#30363D] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B949E] hover:shadow-md">
          <div className="text-[11px] font-mono font-medium uppercase text-[#8B949E] mb-1">
            EXAMINED_SOURCES
          </div>
          <div className="text-2xl font-mono font-bold text-[#F0F6FC] tabular-nums">
            {overview.total}
          </div>
        </div>

        {/* Supports */}
        <div className="bg-[#0D1117] rounded-lg p-3.5 border border-emerald-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-emerald-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CORROBORATING</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            {overview.supports}
          </div>
        </div>

        {/* Contradicts */}
        <div className="bg-[#0D1117] rounded-lg p-3.5 border border-rose-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500/60 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-rose-400 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>CONTRADICTING</span>
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400 tabular-nums">
            {overview.contradicts}
          </div>
        </div>

        {/* Provides Context */}
        <div className="bg-[#0D1117] rounded-lg p-3.5 border border-sky-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/60 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-sky-400 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CONTEXTUAL</span>
          </div>
          <div className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
            {overview.context}
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-[#30363D] flex items-start gap-2 text-[11px] font-mono text-[#8B949E] leading-relaxed">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          GATE_SPEC: A definitive verdict requires independent cross-corroboration across at least 2 distinct domain registries. Single-source assertions default to INCONCLUSIVE.
        </span>
      </div>
    </div>
  );
};
