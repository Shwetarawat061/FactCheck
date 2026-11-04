import React, { useState } from 'react';
import { TrendingUp, Activity, ArrowRight, Terminal } from 'lucide-react';
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

  for (const t of tokensA) {
    if (tokensB.has(t)) return true;
  }

  const domainsA = new Set((claimA.evidence || []).map((e) => e.source.toLowerCase()));
  const domainsB = new Set((claimB.evidence || []).map((e) => e.source.toLowerCase()));
  for (const d of domainsA) {
    if (d && domainsB.has(d)) return true;
  }

  return false;
}

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

function getVerdictNeon(verdict: Verdict): {
  stroke: string;
  dot: string;
  text: string;
} {
  switch (verdict) {
    case 'TRUE':
      return { stroke: '#10B981', dot: '#10B981', text: 'text-emerald-400' };
    case 'MOSTLY TRUE':
      return { stroke: '#14B8A6', dot: '#14B8A6', text: 'text-teal-300' };
    case 'MIXED':
      return { stroke: '#F59E0B', dot: '#F59E0B', text: 'text-amber-400' };
    case 'MOSTLY FALSE':
      return { stroke: '#F97316', dot: '#F97316', text: 'text-orange-400' };
    case 'FALSE':
      return { stroke: '#F43F5E', dot: '#F43F5E', text: 'text-rose-400' };
    case 'UNVERIFIED':
    default:
      return { stroke: '#8B949E', dot: '#8B949E', text: 'text-[#8B949E]' };
  }
}

export const SessionTrendSparkline: React.FC<SessionTrendSparklineProps> = ({
  currentResult,
  sessionHistory,
  onSelectHistoricalClaim,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [metricMode, setMetricMode] = useState<'verdict' | 'confidence'>('verdict');

  const fullSessionList = [
    ...sessionHistory.filter(
      (h) => h.id !== currentResult.id && h.claim.trim().toLowerCase() !== currentResult.claim.trim().toLowerCase()
    ),
    currentResult,
  ];

  const relatedClaims = fullSessionList.filter((item) => areClaimsRelated(currentResult, item));

  if (relatedClaims.length < 2) {
    return null;
  }

  const sortedClaims = [...relatedClaims].sort((a, b) => {
    const timeA = new Date(a.checkedAt).getTime();
    const timeB = new Date(b.checkedAt).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
    return 0;
  });

  const activeHoverClaim = hoveredIdx !== null ? sortedClaims[hoveredIdx] : null;

  // SVG Sparkline dimensions
  const svgWidth = 280;
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

  const linePointsString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `M ${points[0].x.toFixed(1)},${svgHeight - padY} ` +
    points.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') +
    ` L ${points[points.length - 1].x.toFixed(1)},${svgHeight - padY} Z`;

  const firstScore = getVerdictScore(sortedClaims[0].verdict);
  const latestScore = getVerdictScore(sortedClaims[sortedClaims.length - 1].verdict);
  const delta = latestScore - firstScore;

  let trendLabel = 'STABLE_CONSENSUS';
  if (delta >= 25) {
    trendLabel = 'SHIFTING_CORROBORATED';
  } else if (delta <= -25) {
    trendLabel = 'SHIFTING_REFUTED';
  } else {
    const allFalse = sortedClaims.every((c) => c.verdict === 'FALSE' || c.verdict === 'MOSTLY FALSE');
    const allTrue = sortedClaims.every((c) => c.verdict === 'TRUE' || c.verdict === 'MOSTLY TRUE');
    if (allFalse) trendLabel = 'CONSISTENTLY_REFUTED';
    else if (allTrue) trendLabel = 'CONSISTENTLY_CORROBORATED';
    else trendLabel = 'MIXED_SUBCLAIMS';
  }

  const avgConfidence = Math.round(
    sortedClaims.reduce((acc, c) => acc + (c.confidence || 0), 0) / sortedClaims.length
  );

  return (
    <section
      aria-label="Session Claims Trend Visualization"
      className="p-5 rounded-xl border border-[#30363D] bg-[#161B22] text-[#C9D1D9] space-y-4"
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#21262D] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F0F6FC]">
              // SESSION_TOPIC_TRAJECTORY
            </h4>
            <span className="text-xs text-emerald-400 font-mono">
              [{sortedClaims.length}_RELATED_CLAIMS]
            </span>
          </div>
          <p className="text-xs text-[#8B949E] font-mono">
            Sequential veracity delta across related assertions evaluated in this browser session.
          </p>
        </div>

        {/* Metric Selector Toggle */}
        <div className="flex items-center self-start sm:self-center bg-[#0D1117] border border-[#30363D] p-0.5 rounded-lg text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setMetricMode('verdict')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              metricMode === 'verdict'
                ? 'bg-[#21262D] text-emerald-400 font-bold border border-[#30363D]'
                : 'text-[#8B949E] hover:text-[#C9D1D9]'
            }`}
          >
            VERACITY
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('confidence')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
              metricMode === 'confidence'
                ? 'bg-[#21262D] text-emerald-400 font-bold border border-[#30363D]'
                : 'text-[#8B949E] hover:text-[#C9D1D9]'
            }`}
          >
            CONFIDENCE
          </button>
        </div>
      </div>

      {/* Main Sparkline & Telemetry Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Interactive SVG Sparkline */}
        <div className="md:col-span-7 bg-[#0D1117] p-3 rounded-lg border border-[#30363D] relative">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E] mb-1 px-1">
            <span>{metricMode === 'verdict' ? 'VERIFIED_TRUE (100)' : 'HIGH_CONFIDENCE (100%)'}</span>
            <span>EARLIEST → LATEST ({sortedClaims.length})</span>
          </div>

          <div className="relative flex justify-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-16 overflow-visible"
              role="img"
              aria-label="Sparkline graph showing trend across checked claims"
            >
              <defs>
                <linearGradient id="cyberTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid baseline */}
              <line
                x1={padX}
                y1={svgHeight - padY}
                x2={svgWidth - padX}
                y2={svgHeight - padY}
                stroke="#21262D"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <line
                x1={padX}
                y1={padY}
                x2={svgWidth - padX}
                y2={padY}
                stroke="#21262D"
                strokeDasharray="2 2"
                strokeWidth="1"
              />

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#cyberTrendGradient)" />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePointsString}
              />

              {/* Data points */}
              {points.map((pt) => {
                const isCurrent = pt.claim.id === currentResult.id;
                const isHovered = hoveredIdx === pt.idx;
                const neon = getVerdictNeon(pt.claim.verdict);

                return (
                  <g
                    key={pt.claim.id || pt.idx}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredIdx(pt.idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => onSelectHistoricalClaim?.(pt.claim)}
                  >
                    {isCurrent && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}

                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="none"
                        stroke={neon.dot}
                        strokeWidth="2"
                        opacity="0.9"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isCurrent ? '5' : '4'}
                      fill={neon.dot}
                      stroke="#0D1117"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8B949E] mt-1 px-1 border-t border-[#21262D] pt-1">
            <span>{metricMode === 'verdict' ? 'REFUTED_FALSE (0)' : 'MIN (0%)'}</span>
            <span className="text-emerald-400/80">HOVER / CLICK NODES TO INSPECT</span>
          </div>
        </div>

        {/* Right: Trend Insights */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="bg-[#0D1117] p-3.5 rounded-lg border border-[#30363D] space-y-2 font-mono">
            <div className="text-[11px] uppercase tracking-wider text-[#8B949E] flex items-center justify-between">
              <span>TRAJECTORY_SIGNAL</span>
              <span className="font-bold text-emerald-400">{trendLabel}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8B949E] pt-1">
              <span>{sortedClaims.length} Claims</span>
              <span aria-hidden="true" className="text-[#30363D]">·</span>
              <span>{avgConfidence}% Avg Conf</span>
              <span aria-hidden="true" className="text-[#30363D]">·</span>
              <span className="font-semibold text-[#F0F6FC]">{currentResult.verdict}</span>
            </div>

            <p className="text-[11px] text-[#8B949E] leading-snug">
              {delta > 0
                ? 'Empirical consistency increased as assertions were sharpened in this research session.'
                : delta < 0
                ? 'Contradiction signals amplified across sequential claim variations.'
                : 'Consistent empirical consensus observed across related session claims.'}
            </p>
          </div>
        </div>

      </div>

      {/* Tooltip / Active Point Details Panel */}
      {activeHoverClaim ? (
        <div className="p-3 bg-[#0D1117] rounded-lg border border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-150">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#8B949E]">
                CLAIM_{sortedClaims.findIndex((c) => c.id === activeHoverClaim.id) + 1}
              </span>
              <span aria-hidden="true" className="text-[#30363D]">·</span>
              <span className="font-bold text-emerald-400">{activeHoverClaim.verdict}</span>
              {activeHoverClaim.confidence > 0 && (
                <>
                  <span aria-hidden="true" className="text-[#30363D]">·</span>
                  <span className="text-[#8B949E]">{activeHoverClaim.confidence}% CONF</span>
                </>
              )}
              {activeHoverClaim.id === currentResult.id && (
                <span className="text-emerald-400 font-semibold">[ACTIVE]</span>
              )}
            </div>
            <p className="text-[#C9D1D9] truncate">
              "{activeHoverClaim.claim}"
            </p>
          </div>

          {activeHoverClaim.id !== currentResult.id && onSelectHistoricalClaim && (
            <button
              type="button"
              onClick={() => onSelectHistoricalClaim(activeHoverClaim)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#0D1117] font-mono text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <span>INSPECT_REPORT</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono">
          <span className="text-[11px] text-[#8B949E] uppercase tracking-wider mr-1">
            QUICK_HOP:
          </span>
          {sortedClaims.map((claim, idx) => {
            const isCurrent = claim.id === currentResult.id;
            const neon = getVerdictNeon(claim.verdict);
            return (
              <button
                key={claim.id || idx}
                type="button"
                onClick={() => onSelectHistoricalClaim?.(claim)}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold shadow-xs'
                    : 'border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:border-[#8B949E] hover:text-[#C9D1D9]'
                }`}
                title={claim.claim}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: neon.dot }}
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
