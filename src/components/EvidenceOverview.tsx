import React from 'react';
import { Layers, CheckCircle2, XCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import { EvidenceCounts } from '../types/factCheck';

interface EvidenceOverviewProps {
  overview: EvidenceCounts;
}

export const EvidenceOverview: React.FC<EvidenceOverviewProps> = ({ overview }) => {
  return (
    <div className="bg-[#faf9f6] rounded-xl border border-stone-200/90 p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-700" />
          <h4 className="font-serif text-base font-bold text-stone-900 tracking-tight">
            Evidence Overview
          </h4>
        </div>
        <span className="text-[11px] font-mono text-stone-600">
          Distribution of retrieved reference documents
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Sources */}
        <div className="bg-white rounded-lg p-3.5 border border-stone-200/70 shadow-2xs">
          <div className="text-[11px] font-mono font-medium uppercase text-stone-600 mb-1">
            Sources reviewed
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
            {overview.total}
          </div>
        </div>

        {/* Supports */}
        <div className="bg-white rounded-lg p-3.5 border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase text-emerald-700 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Supports</span>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-800 tabular-nums">
            {overview.supports}
          </div>
        </div>

        {/* Contradicts */}
        <div className="bg-white rounded-lg p-3.5 border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase text-rose-700 mb-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Contradicts</span>
          </div>
          <div className="text-2xl font-serif font-bold text-rose-800 tabular-nums">
            {overview.contradicts}
          </div>
        </div>

        {/* Provides Context */}
        <div className="bg-white rounded-lg p-3.5 border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium uppercase text-sky-700 mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Provides context</span>
          </div>
          <div className="text-2xl font-serif font-bold text-sky-800 tabular-nums">
            {overview.context}
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-stone-200/60 flex items-start gap-2 text-[11px] text-stone-600 leading-relaxed">
        <ShieldAlert className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <span>
          Note: This count reflects primary citations examined in the evidence corpus. It serves as an audit trail rather than a statistical certainty metric.
        </span>
      </div>
    </div>
  );
};
