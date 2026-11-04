import React from 'react';
import { ExternalLink, Check, X, Info, Globe, AlertTriangle, FileText } from 'lucide-react';
import { Evidence, EvidenceRelationship } from '../types/factCheck';

interface EvidenceCardProps {
  evidence: Evidence;
  index?: number;
}

const RELATIONSHIP_CONFIG: Record<
  EvidenceRelationship,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  'SUPPORTS': {
    label: 'CORROBORATES',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/50',
    icon: Check
  },
  'CONTRADICTS': {
    label: 'CONTRADICTS',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    border: 'border-rose-500/50',
    icon: X
  },
  'CONTEXT': {
    label: 'CONTEXT_ONLY',
    bg: 'bg-sky-950/40',
    text: 'text-sky-300',
    border: 'border-sky-500/50',
    icon: Info
  }
};

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, index = 0 }) => {
  const relConfig = RELATIONSHIP_CONFIG[evidence.relationship] || RELATIONSHIP_CONFIG['CONTEXT'];
  const RelIcon = relConfig.icon;

  let domain = evidence.sourceDomain || '';
  if (!domain && evidence.url) {
    try {
      const urlObj = new URL(evidence.url);
      domain = urlObj.hostname.replace(/^www\./, '');
    } catch {
      domain = evidence.source.toLowerCase().replace(/[^a-z0-9.]/g, '');
    }
  }

  const isReachable = evidence.urlReachable !== false;
  const displayDate = evidence.date && evidence.date.trim() ? evidence.date.trim() : 'INDEXED_RECENT';

  return (
    <div className="bg-[#161B22] rounded-xl border border-[#30363D] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#58A6FF]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] group">
      
      {/* Dossier Header Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3 border-b border-[#21262D]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-emerald-400 shrink-0 font-mono text-[10px]">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="truncate">
            <span className="font-mono font-bold text-xs text-[#F0F6FC] block truncate">
              {evidence.source}
            </span>
            <span className="font-mono text-[11px] text-[#8B949E] truncate block">
              // {domain}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Link status */}
          {!isReachable && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>UNVERIFIED_URI</span>
            </span>
          )}

          {/* Relevance score */}
          {typeof evidence.relevanceScore === 'number' && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-[#8B949E] bg-[#0D1117] px-2 py-0.5 rounded border border-[#30363D]">
              <span>RELEVANCE: {Math.round(evidence.relevanceScore)}%</span>
            </span>
          )}

          {/* Relationship Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${relConfig.bg} ${relConfig.text} ${relConfig.border} shadow-2xs`}
          >
            <RelIcon className="w-3 h-3 shrink-0" />
            <span>{relConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm sm:text-base font-mono font-semibold text-[#F0F6FC] leading-snug mb-3 group-hover:text-white transition-colors">
        {evidence.title}
      </h4>

      {/* Terminal Diff Evidentiary Quote Excerpt */}
      {evidence.quote && (
        <div className="relative pl-3.5 my-3 border-l-2 border-emerald-500/60 font-mono text-xs sm:text-[13px] text-[#C9D1D9] leading-relaxed bg-[#0D1117] py-2.5 pr-3 rounded-r-md">
          <span className="text-emerald-400 font-bold mr-1.5 select-none">+</span>
          <span className="text-[#E6EDF3]">"{evidence.quote}"</span>
        </div>
      )}

      {/* Dossier Bottom Bar */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#21262D] text-xs font-mono">
        <span className="text-[#8B949E] text-[11px]">
          REC_DATE: {displayDate}
        </span>

        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="READ"
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-0.5 transition-all"
          >
            <span>AUDIT_PRIMARY_SOURCE</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

    </div>
  );
};
