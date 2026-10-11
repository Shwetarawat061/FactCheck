import React, { useState } from 'react';
import { Share2, Copy, Check, RotateCcw, ShieldCheck, Sparkles, ExternalLink, FileDown, Loader2, Terminal, FileText } from 'lucide-react';
import { FactCheckResult as ResultType } from '../types/factCheck';
import { VerdictBadge, VERDICT_CONFIG } from './VerdictBadge';
import { EvidenceOverview } from './EvidenceOverview';
import { EvidenceCard } from './EvidenceCard';
import { ReasoningSection } from './ReasoningSection';
import { SessionTrendSparkline } from './SessionTrendSparkline';
import { TerminalStreamingText } from './TerminalStreamingText';
import { exportFactCheckToPdf } from '../services/pdfExport';

interface FactCheckResultProps {
  result: ResultType;
  sessionHistory?: ResultType[];
  onSelectHistoricalClaim?: (result: ResultType) => void;
  onCheckRelatedClaim?: (claim: string) => void;
  onReset: () => void;
}

export const FactCheckResult: React.FC<FactCheckResultProps> = ({
  result,
  sessionHistory,
  onSelectHistoricalClaim,
  onCheckRelatedClaim,
  onReset
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const [fallbackHistory] = useState<ResultType[]>(() => {
    try {
      const stored = sessionStorage.getItem('factcheck_session_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeSessionHistory = sessionHistory || fallbackHistory;
  const confidenceLabel = result.status === 'ok' && result.confidence > 0
    ? ` (${result.confidence}% heuristic confidence)`
    : '';

  const verdictConfig = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG['UNVERIFIED'];

  const handleExportPdf = () => {
    try {
      setIsExportingPdf(true);
      exportFactCheckToPdf(result);
      setShareNotice('Evidentiary PDF verification dossier exported successfully.');
      setTimeout(() => setShareNotice(null), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setShareNotice('Failed to generate PDF dossier. Please retry.');
      setTimeout(() => setShareNotice(null), 4000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = async () => {
    const text = `FACTCHECK.AI // FORENSIC DOSSIER REPORT
VERDICT: ${result.verdict}${confidenceLabel}
CLAIM: "${result.claim}"

SUMMARY:
${result.summary}

EVIDENCE AUDIT TRAIL (${result.evidence.length} sources):
${result.evidence.map(e => `[${e.relationship}] ${e.source}: "${e.quote}" - ${e.url}`).join('\n')}

AUDIT PROTOCOL: Multi-domain grounded consensus verification`;

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
          text: `FactCheckAI forensic analysis classified "${result.claim}" as ${result.verdict}${confidenceLabel}.`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await handleCopy();
      setShareNotice('Forensic audit record copied to clipboard!');
      setTimeout(() => setShareNotice(null), 3500);
    }
  };

  return (
    <article className="w-full bg-[#161B22] rounded-xl border border-[#30363D] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in duration-200 text-[#C9D1D9] terminal-scanlines relative">
      
      {/* Dossier Terminal Header Banner */}
      <div className="border-b border-[#30363D] px-6 py-4 bg-[#0D1117] flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>EVIDENTIARY_DOSSIER // {result.id || 'AUDIT_REF'}</span>
          </div>

          {result.status === 'inconclusive' || result.verdict === 'UNVERIFIED' ? (
            <span className="px-2 py-0.5 rounded text-[11px] uppercase tracking-wider bg-[#21262D] text-[#8B949E] border border-[#30363D] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E]" />
              INCONCLUSIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] uppercase tracking-wider bg-emerald-950/40 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GROUNDED_CONSENSUS
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#8B949E]">
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
        
        {/* Verdict Hero Card with Terminal Diff Styling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-xl border border-[#30363D] bg-[#0D1117] transition-all duration-200 hover:border-[#58A6FF]/40 hover:shadow-md">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <VerdictBadge verdict={result.verdict} size="lg" />
              {result.status !== 'ok' ? null : (
                <span
                  title="Confidence is a heuristic based on source agreement, not a statistical probability"
                  className="font-mono text-xs sm:text-sm font-semibold text-emerald-400 tabular-nums cursor-help"
                >
                  CONFIDENCE: {result.confidence}% <span className="text-[10px] text-[#8B949E] font-normal">[HEURISTIC_AGREEMENT]</span>
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#8B949E] max-w-xl">
              {verdictConfig.description}
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="p-2 sm:px-3 rounded-md border border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-[0.98] cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
              title="Download structured evidentiary PDF dossier"
            >
              {isExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <FileDown className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isExportingPdf ? 'EXPORTING...' : 'EXPORT_PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-md border border-[#30363D] bg-[#161B22] text-[#C9D1D9] hover:bg-[#21262D] hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer hover:-translate-y-0.5"
              title="Share report"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">SHARE</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-md border border-[#30363D] bg-[#161B22] text-[#C9D1D9] hover:bg-[#21262D] hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer hover:-translate-y-0.5"
              title="Copy terminal summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {shareNotice && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 rounded-lg flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{shareNotice}</span>
          </div>
        )}

        {/* Claim Checked Box (Styled like Evidentiary Exhibit) */}
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#8B949E] block mb-2">
            // EXHIBIT_A // PARSED_TARGET_ASSERTION
          </span>
          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-[#F0F6FC] font-mono text-base sm:text-lg font-medium leading-relaxed">
            <span className="text-emerald-400 mr-2 select-none">&gt;</span>
            "{result.claim}"
          </div>
        </div>

        {/* Session Trend Sparkline (renders if multiple related claims have been checked in the session) */}
        <SessionTrendSparkline
          currentResult={result}
          sessionHistory={activeSessionHistory}
          onSelectHistoricalClaim={onSelectHistoricalClaim}
          onCheckRelatedClaim={onCheckRelatedClaim}
        />

        {/* Executive Summary Dossier */}
        <div>
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#8B949E] block mb-2">
            // EXECUTIVE_SYNTHESIS
          </span>
          <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
            <TerminalStreamingText
              key={`summary-${result.id}`}
              text={result.summary}
              className="text-sm sm:text-base text-[#C9D1D9] leading-relaxed font-sans"
              speed={12}
              chunkSize={3}
              streamSound={true}
            />
          </div>
        </div>

        {/* Detailed Forensic Analysis */}
        {result.analysis && (
          <div>
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#8B949E] block mb-2">
              // DETAILED_FORENSIC_CROSS_EXAMINATION
            </span>
            <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
              <TerminalStreamingText
                key={`analysis-${result.id}`}
                text={result.analysis}
                className="text-sm text-[#8B949E] leading-relaxed font-sans"
                speed={10}
                chunkSize={4}
                streamSound={false}
              />
            </div>
          </div>
        )}

        {/* Evidence Overview Statistics */}
        <EvidenceOverview overview={result.evidenceOverview} />

        {/* Evidence Sources Section */}
        <div>
          <div className="mb-4">
            <h4 className="font-mono text-base font-bold text-[#F0F6FC] tracking-tight uppercase">
              // RETRIEVED_EVIDENCE_CORPUS
            </h4>
            <p className="text-xs text-[#8B949E] font-mono mt-0.5">
              Primary documents examined for empirical consensus
            </p>
          </div>

          {result.evidence && result.evidence.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {result.evidence.map((item, idx) => (
                <EvidenceCard key={item.id || idx} evidence={item} index={idx} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0D1117] rounded-xl border border-[#30363D] text-[#8B949E] text-xs font-mono">
              <p className="font-medium">INSUFFICIENT RELIABLE EVIDENCE DISCOVERED IN PUBLIC RECORDS.</p>
              <p className="text-[11px] text-[#484F58] mt-1">
                STATUS CONVERGED TO [INCONCLUSIVE] TO AVOID HALLUCINATION.
              </p>
            </div>
          )}
        </div>

        {/* Reasoning and Transparency */}
        <ReasoningSection reasoning={result.reasoning} verdict={result.verdict} />

        {/* Bottom Actions Bar */}
        <div className="pt-6 border-t border-[#30363D] flex flex-wrap items-center justify-between gap-4 font-mono">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#0D1117] font-mono text-xs sm:text-sm font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>AUDIT_ANOTHER_CLAIM</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#F0F6FC] hover:text-emerald-400 text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isExportingPdf ? 'EXPORTING...' : 'EXPORT_PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#30363D] bg-[#0D1117] text-[#C9D1D9] hover:text-white hover:border-[#8B949E] text-xs font-mono font-semibold transition-all cursor-pointer hover:-translate-y-0.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY_RECORD'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[#30363D] bg-[#0D1117] text-[#C9D1D9] hover:text-white hover:border-[#8B949E] text-xs font-mono font-semibold transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE</span>
            </button>
          </div>
        </div>

      </div>
    </article>
  );
};
