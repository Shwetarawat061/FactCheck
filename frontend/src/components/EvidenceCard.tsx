import React from 'react';
import { ExternalLink, Check, X, Info, Globe, AlertTriangle } from 'lucide-react';
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
    label: 'SUPPORTS',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: Check
  },
  'CONTRADICTS': {
    label: 'CONTRADICTS',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: X
  },
  'CONTEXT': {
    label: 'CONTEXT',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    icon: Info
  }
};

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
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
  const displayDate = evidence.date && evidence.date.trim() ? evidence.date.trim() : 'Date unavailable';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 transition-all hover:border-stone-300 hover:shadow-xs group">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="font-semibold text-xs text-stone-900 block truncate">
              {evidence.source}
            </span>
            <span className="font-mono text-[11px] text-stone-600 truncate block">
              {domain}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Link reachable verification status */}
          {!isReachable && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Link could not be verified</span>
            </span>
          )}

          {/* Relevance score */}
          {typeof evidence.relevanceScore === 'number' && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              <span>{Math.round(evidence.relevanceScore)}% Relevance</span>
            </span>
          )}

          {/* Relationship Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${relConfig.bg} ${relConfig.text} ${relConfig.border}`}
          >
            <RelIcon className="w-3 h-3 shrink-0" />
            <span>{relConfig.label}</span>
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base font-medium text-stone-900 leading-snug mb-3 font-serif">
        {evidence.title}
      </h4>

      {/* Verbatim Extracted Excerpt */}
      {evidence.quote && (
        <div className="relative pl-3.5 my-3 border-l-2 border-stone-300/80 italic text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50/50 py-2 pr-3 rounded-r-md">
          "{evidence.quote}"
        </div>
      )}

      {/* Bottom Bar: Date & External Link Button */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
        <span className="text-stone-500 font-mono text-[11px]">
          {displayDate}
        </span>

        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-stone-700 group-hover:translate-x-0.5 transition-all"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
