import React, { useState } from 'react';
import { TrendingUp, Activity, ArrowRight, CheckCircle2, XCircle, AlertTriangle, HelpCircle, Layers } from 'lucide-react';
import { FactCheckResult, Verdict } from '../types/factCheck';

interface SessionTrendSparklineProps {
  currentResult: FactCheckResult;
  sessionHistory: FactCheckResult[];
  onSelectHistoricalClaim?: (result: FactCheckResult) => void;
  onCheckRelatedClaim?: (claim: string) => void;
}

const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'does', 'did', 'doing', 'would', 'should', 'could', 'ought', 'the', 'and', 'but',
  'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just',
  'visible', 'from', 'level', 'only'
]);

function extractKeyTokens(claim: string): Set<string> {
  return new Set(
    claim
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  );
}

function areClaimsRelated(claimA: FactCheckResult, claimB: FactCheckResult): boolean {
  if (claimA.id === claimB.id) return true;
  if (claimA.claim.trim().toLowerCase() === claimB.claim.trim().toLowerCase()) return true;

  const tokensA = extractKeyTokens(claimA.claim);
  const tokensB = extractKeyTokens(claimB.claim);

  // Check token overlap
  for (const t of tokensA) {
    if (tokensB.has(t)) return true;
  }

  // Check shared citation source domains
  const domainsA = new Set((claimA.evidence || []).map((e) => e.source.toLowerCase()));
  const domainsB = new Set((claimB.evidence || []).map((e) => e.source.toLowerCase()));
  for (const d of domainsA) {
    if (d && domainsB.has(d)) return true;
  }

  return false;
}

// Convert verdict to numerical value on 0-100 spectrum
function getVerdictScore(verdict: Verdict): number {
  switch (verdict) {
    case 'TRUE':
      return 100;
    case 'MOSTLY TRUE':
      return 80;
    case 'MIXED':
      return 50;
    case 'MOSTLY FALSE':
      return 25;
    case 'FALSE':
      return 0;
    case 'UNVERIFIED':
    default:
      return 45;
  }
}

function getVerdictColor(verdict: Verdict): {
  stroke: string;
  fill: string;
  dot: string;
  text: string;
  bg: string;
} {
  switch (verdict) {
    case 'TRUE':
      return {
        stroke: '#059669',
        fill: '#ecfdf5',
        dot: '#059669',
        text: 'text-emerald-800',
        bg: 'bg-emerald-50',
      };
    case 'MOSTLY TRUE':
      return {
        stroke: '#0d9488',
        fill: '#f0fdfa',
        dot: '#0d9488',
        text: 'text-teal-800',
        bg: 'bg-teal-50',
      };
    case 'MIXED':
      return {
        stroke: '#d97706',
        fill: '#fffbeb',
        dot: '#d97706',
        text: 'text-amber-800',
        bg: 'bg-amber-50',
      };
    case 'MOSTLY FALSE':
      return {
        stroke: '#ea580c',
        fill: '#fff7ed',
        dot: '#ea580c',
        text: 'text-orange-800',
        bg: 'bg-orange-50',
      };
    case 'FALSE':
      return {
        stroke: '#e11d48',
        fill: '#fff1f2',
        dot: '#e11d48',
        text: 'text-rose-800',
        bg: 'bg-rose-50',
      };
    case 'UNVERIFIED':
    default:
      return {
        stroke: '#78716c',
        fill: '#fafaf9',
        dot: '#78716c',
        text: 'text-stone-700',
        bg: 'bg-stone-100',
      };
  }
}

export const SessionTrendSparkline: React.FC<SessionTrendSparklineProps> = ({
  currentResult,
  sessionHistory,
  onSelectHistoricalClaim,
  onCheckRelatedClaim,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [metricMode, setMetricMode] = useState<'verdict' | 'confidence'>('verdict');

  // Compile list of related claims in current session
  // Ensure currentResult is present in the session list
  const fullSessionList = [
    ...sessionHistory.filter(
      (h) => h.id !== currentResult.id && h.claim.trim().toLowerCase() !== currentResult.claim.trim().toLowerCase()
    ),
    currentResult,
  ];

  // Identify claims related to the current claim
  const relatedClaims = fullSessionList.filter((item) => areClaimsRelated(currentResult, item));

  // If fewer than 2 related claims in session, do not render trend visualization
  if (relatedClaims.length < 2) {
    return null;
  }

  // Sort claims chronologically by checkedAt if valid, else by list appearance
  const sortedClaims = [...relatedClaims].sort((a, b) => {
    const timeA = new Date(a.checkedAt).getTime();
    const timeB = new Date(b.checkedAt).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
    return 0;
  });

  const currentIndex = sortedClaims.findIndex((c) => c.id === currentResult.id);
  const activeHoverClaim = hoveredIdx !== null ? sortedClaims[hoveredIdx] : null;

  // SVG Sparkline dimensions
  const svgWidth = 260;
  const svgHeight = 58;
  const padX = 22;
  const padY = 12;
  const usableWidth = svgWidth - padX * 2;
  const usableHeight = svgHeight - padY * 2;

  const points = sortedClaims.map((claim, idx) => {
    const val = metricMode === 'verdict' ? getVerdictScore(claim.verdict) : Math.max(20, claim.confidence || 30);
    const x = padX + (idx / Math.max(1, sortedClaims.length - 1)) * usableWidth;
    const y = svgHeight - padY - (val / 100) * usableHeight;
    return { x, y, claim, val, idx };
  });

  // Construct SVG polyline and area path
  const linePointsString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${points[0].x.toFixed(1)},${svgHeight - padY} ` +
    points.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L ${points[points.length - 1].x.toFixed(1)},${svgHeight - padY} Z`;

  // Compute trend statistics
  const firstScore = getVerdictScore(sortedClaims[0].verdict);
  const latestScore = getVerdictScore(sortedClaims[sortedClaims.length - 1].verdict);
  const delta = latestScore - firstScore;

  let trendLabel = 'Stable Consensus';
  if (delta >= 25) {
    trendLabel = 'Shifting Supported';
  } else if (delta <= -25) {
    trendLabel = 'Shifting Refuted';
  } else {
    const allFalse = sortedClaims.every((c) => c.verdict === 'FALSE' || c.verdict === 'MOSTLY FALSE');
    const allTrue = sortedClaims.every((c) => c.verdict === 'TRUE' || c.verdict === 'MOSTLY TRUE');
    if (allFalse) trendLabel = 'Consistently Refuted';
    else if (allTrue) trendLabel = 'Consistently Corroborated';
    else trendLabel = 'Mixed Related Findings';
  }

  const avgConfidence = Math.round(
    sortedClaims.reduce((acc, c) => acc + (c.confidence || 0), 0) / sortedClaims.length
  );

  return (
    <section
      aria-label="Session Claims Trend Visualization"
      className="p-5 rounded-xl border border-stone-200/90 bg-[#faf9f6] text-stone-900 space-y-4"
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-stone-700" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-800">
              Session Topic Trend
            </h4>
            <span className="text-xs text-stone-500 font-mono">
              ({sortedClaims.length} related claims)
            </span>
          </div>
          <p className="text-xs text-stone-600 font-serif">
            Chronological veracity trajectory across related assertions checked in this browser session.
          </p>
        </div>

        {/* Metric Selector Toggle (segmented button per design constitution) */}
        <div className="flex items-center self-start sm:self-center bg-stone-200/70 p-0.5 rounded-lg text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMetricMode('verdict')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              metricMode === 'verdict'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Veracity
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('confidence')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              metricMode === 'confidence'
                ? 'bg-white text-stone-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Confidence
          </button>
        </div>
      </div>

      {/* Main Sparkline & Stat Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Interactive SVG Sparkline */}
        <div className="md:col-span-7 bg-white p-3 rounded-lg border border-stone-200 shadow-2xs relative">
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mb-1 px-1">
            <span>
              {metricMode === 'verdict' ? 'High Truth (100)' : 'High Confidence (100%)'}
            </span>
            <span>
              Earliest → Latest ({sortedClaims.length})
            </span>
          </div>

          <div className="relative flex justify-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-16 overflow-visible"
              role="img"
              aria-label="Sparkline graph showing trend across checked claims"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78716c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#78716c" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid baseline */}
              <line
                x1={padX}
                y1={svgHeight - padY}
                x2={svgWidth - padX}
                y2={svgHeight - padY}
                stroke="#e7e5e4"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <line
                x1={padX}
                y1={padY}
                x2={svgWidth - padX}
                y2={padY}
                stroke="#f5f5f4"
                strokeDasharray="2 2"
                strokeWidth="1"
              />

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#trendGradient)" />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#44403c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePointsString}
              />

              {/* Data points */}
              {points.map((pt) => {
                const isCurrent = pt.claim.id === currentResult.id;
                const isHovered = hoveredIdx === pt.idx;
                const colors = getVerdictColor(pt.claim.verdict);

                return (
                  <g
                    key={pt.claim.id || pt.idx}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredIdx(pt.idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => onSelectHistoricalClaim?.(pt.claim)}
                  >
                    {/* Pulsing ring for currently viewed claim */}
                    {isCurrent && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="none"
                        stroke="#1c1917"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Hover focus ring */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="none"
                        stroke={colors.dot}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isCurrent ? '5' : '4'}
                      fill={colors.dot}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mt-1 px-1 border-t border-stone-100 pt-1">
            <span>{metricMode === 'verdict' ? 'Refuted (0)' : 'Min (0%)'}</span>
            <span className="text-stone-400">Hover or click dots to inspect</span>
          </div>
        </div>

        {/* Right: Trend Insights & Metrics */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-2xs space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Trajectory</span>
              <span className="font-semibold text-stone-800">{trendLabel}</span>
            </div>

            {/* Zero-pill metadata row */}
            <div className="flex items-center gap-2 text-xs text-stone-600 font-mono pt-1">
              <span>{sortedClaims.length} Claims</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{avgConfidence}% Avg Conf</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-semibold text-stone-900">{currentResult.verdict}</span>
            </div>

            <p className="text-[11px] text-stone-600 leading-snug">
              {delta > 0
                ? 'Evidence trend reflects increasing veracity across sequential claim refinements.'
                : delta < 0
                ? 'Evidence trend reflects increasing skepticism as assertions were scrutinized.'
                : 'Consistent empirical assessment across related claims in this session.'}
            </p>
          </div>
        </div>

      </div>

      {/* Tooltip / Active Point Details Panel */}
      {activeHoverClaim ? (
        <div className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-stone-500">
                Claim #{sortedClaims.findIndex((c) => c.id === activeHoverClaim.id) + 1}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="font-bold text-stone-900">{activeHoverClaim.verdict}</span>
              {activeHoverClaim.confidence > 0 && (
                <>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-600">{activeHoverClaim.confidence}% Confidence</span>
                </>
              )}
              {activeHoverClaim.id === currentResult.id && (
                <span className="text-emerald-700 font-medium">(Currently Viewing)</span>
              )}
            </div>
            <p className="font-serif text-stone-800 italic line-clamp-1">
              "{activeHoverClaim.claim}"
            </p>
          </div>

          {activeHoverClaim.id !== currentResult.id && onSelectHistoricalClaim && (
            <button
              type="button"
              onClick={() => onSelectHistoricalClaim(activeHoverClaim)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 text-white hover:bg-stone-800 text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              <span>View Report</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        /* Sequence dots navigation when not hovering */
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1">
            Jump to check:
          </span>
          {sortedClaims.map((claim, idx) => {
            const isCurrent = claim.id === currentResult.id;
            const colors = getVerdictColor(claim.verdict);
            return (
              <button
                key={claim.id || idx}
                type="button"
                onClick={() => onSelectHistoricalClaim?.(claim)}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-2xs'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                }`}
                title={claim.claim}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isCurrent ? '#ffffff' : colors.dot }}
                />
                <span className="truncate max-w-[140px]">
                  #{idx + 1} {claim.verdict}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
