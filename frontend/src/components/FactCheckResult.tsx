import React, { useState } from 'react';
import { Share2, Copy, Check, RotateCcw, ShieldCheck, Sparkles, ExternalLink, FileDown, Loader2 } from 'lucide-react';
import { FactCheckResult as ResultType } from '../types/factCheck';
import { VerdictBadge, VERDICT_CONFIG } from './VerdictBadge';
import { EvidenceOverview } from './EvidenceOverview';
import { EvidenceCard } from './EvidenceCard';
import { ReasoningSection } from './ReasoningSection';
import { exportFactCheckToPdf } from '../services/pdfExport';

interface FactCheckResultProps {
  result: ResultType;
  onReset: () => void;
}

export const FactCheckResult: React.FC<FactCheckResultProps> = ({
  result,
  onReset
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const verdictConfig = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG['UNVERIFIED'];

  const handleExportPdf = () => {
    try {
      setIsExportingPdf(true);
      exportFactCheckToPdf(result);
      setShareNotice('PDF verification report downloaded successfully.');
      setTimeout(() => setShareNotice(null), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setShareNotice('Failed to generate PDF report. Please try again.');
      setTimeout(() => setShareNotice(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = async () => {
    const text = `FactCheckAI Report
Verdict: ${result.verdict} (AI confidence: ${result.confidence}%)
Claim: "${result.claim}"

Summary:
${result.summary}

Evidence Sources Reviewed (${result.evidence.length}):
${result.evidence.map(e => `• ${e.source} (${e.relationship}): "${e.quote}" - ${e.url}`).join('\n')}

Verified with FactCheckAI Evidence Engine`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FactCheckAI: ${result.verdict} - "${result.claim}"`,
          text: `FactCheckAI determined "${result.claim}" to be ${result.verdict} (${result.confidence}% AI confidence).`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await handleCopy();
      setShareNotice('Report summary copied to clipboard for sharing!');
      setTimeout(() => setShareNotice(null), 3500);
    }
  };

  return (
    <article className="w-full bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Banner Strip */}
      <div className="border-b border-stone-200 px-6 py-4 bg-[#faf9f6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-700">
            FACT CHECK RESULT
          </span>

          {result.status === 'inconclusive' || result.verdict === 'UNVERIFIED' ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              INCONCLUSIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              LIVE EVIDENCE AUDIT
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
          <span>
            {(() => {
              try {
                const d = new Date(result.checkedAt);
                return !isNaN(d.getTime()) ? d.toISOString() : result.checkedAt;
              } catch {
                return result.checkedAt;
              }
            })()}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-9 space-y-8">
        
        {/* Verdict Hero Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-xl border border-stone-200 bg-stone-50/70">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <VerdictBadge verdict={result.verdict} size="lg" />
              {result.status !== 'inconclusive' && result.verdict !== 'UNVERIFIED' && result.confidence > 0 ? (
                <span
                  title="Confidence is a heuristic based on source agreement, not a statistical probability"
                  className="font-mono text-xs sm:text-sm font-semibold text-stone-700 tabular-nums cursor-help"
                >
                  Confidence: {result.confidence}% <span className="text-[10px] text-stone-400 font-normal">(heuristic)</span>
                </span>
              ) : null}
            </div>
            <p className="text-xs text-stone-600 max-w-xl">
              {verdictConfig.description}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="p-2 sm:px-3 rounded-lg border border-stone-800 bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
              title="Download structured PDF fact-check report"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
              ) : (
                <FileDown className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share report"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {shareNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900 rounded-lg flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{shareNotice}</span>
          </div>
        )}

        {/* Claim Checked */}
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-stone-500 block mb-2">
            CLAIM CHECKED
          </span>
          <div className="p-4 rounded-xl bg-white border border-stone-200 text-stone-900 font-serif text-lg sm:text-xl font-medium leading-relaxed italic">
            "{result.claim}"
          </div>
        </div>

        {/* Summary */}
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-stone-500 block mb-2">
            SUMMARY
          </span>
          <p className="text-base sm:text-lg text-stone-800 leading-relaxed font-serif">
            {result.summary}
          </p>
        </div>

        {/* Detailed Analysis */}
        {result.analysis && (
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-stone-500 block mb-2">
              ANALYSIS
            </span>
            <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed">
              <p>{result.analysis}</p>
            </div>
          </div>
        )}

        {/* Evidence Overview Statistics */}
        <EvidenceOverview overview={result.evidenceOverview} />

        {/* Evidence Sources Section */}
        <div>
          <div className="mb-4">
            <h4 className="font-serif text-xl font-bold text-stone-900 tracking-tight">
              Evidence
            </h4>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Sources reviewed for this analysis
            </p>
          </div>

          {result.evidence && result.evidence.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {result.evidence.map((item, idx) => (
                <EvidenceCard key={item.id || idx} evidence={item} index={idx} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-sm">
              <p className="font-medium">Insufficient reliable evidence was found to verify this claim.</p>
              <p className="text-xs text-stone-500 mt-1">
                The proposition was assigned a verdict of <strong>UNVERIFIED</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Reasoning and Transparency */}
        <ReasoningSection reasoning={result.reasoning} verdict={result.verdict} />

        {/* Bottom Actions Bar */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Another Claim</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-300" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
