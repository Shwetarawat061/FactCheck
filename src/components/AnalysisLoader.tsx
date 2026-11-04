import React from 'react';
import { Loader2, Search, Database, ShieldCheck, Terminal } from 'lucide-react';
import { PipelineStep } from '../types/factCheck';

interface AnalysisLoaderProps {
  steps?: PipelineStep[];
  claim: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ claim }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-[#161B22] rounded-xl border border-[#30363D] shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-6 sm:p-9 animate-in fade-in zoom-in-95 duration-200 text-[#C9D1D9]">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0D1117] border border-[#30363D] text-emerald-400 text-xs font-mono font-medium mb-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>// FORENSIC_SCAN_IN_PROGRESS</span>
        </div>
        <h3 className="font-mono text-xl sm:text-2xl font-bold text-[#F0F6FC] tracking-tight uppercase">
          Executing Verification Pipeline
        </h3>
        <p className="mt-2.5 text-xs sm:text-sm text-[#8B949E] font-mono italic line-clamp-2 max-w-lg mx-auto bg-[#0D1117] p-2.5 rounded border border-[#21262D]">
          &gt; "{claim}"
        </p>
      </div>

      {/* Cyber neon indeterminate scanline */}
      <div className="w-full bg-[#0D1117] rounded-full h-1.5 mb-8 overflow-hidden relative border border-[#30363D]">
        <div className="bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 h-full w-1/3 rounded-full animate-indeterminate shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
      </div>

      {/* Pipeline telemetry stages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left font-mono">
        <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">01 // ACTIVE</span>
          </div>
          <span className="text-xs font-bold text-[#F0F6FC]">Live Web Retrieval</span>
          <span className="text-[11px] text-[#8B949E] mt-1">Gathering multi-source documents</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-4 h-4 text-teal-400" />
            <span className="text-[10px] text-teal-400 font-bold">02 // ACTIVE</span>
          </div>
          <span className="text-xs font-bold text-[#F0F6FC]">Consensus Audit</span>
          <span className="text-[11px] text-[#8B949E] mt-1">Cross-examining domains</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-cyan-400 font-bold">03 // ACTIVE</span>
          </div>
          <span className="text-xs font-bold text-[#F0F6FC]">Strict Verification</span>
          <span className="text-[11px] text-[#8B949E] mt-1">Enforcing polarity gates</span>
        </div>
      </div>

    </div>
  );
};
