import React from 'react';
import { Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D1117] border-t border-[#30363D] mt-20 text-[#8B949E] text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#161B22] border border-[#30363D] text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono font-bold text-[#F0F6FC] text-base">
                FACTCHECK<span className="text-emerald-400">.AI</span>
              </span>
            </div>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Forensic data engine for live evidentiary fact verification and multi-domain consensus cross-examination.
            </p>
          </div>

          {/* Verification Ethos */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-[#F0F6FC] mb-3 tracking-wider">
              // AUDIT_STANDARDS
            </h5>
            <ul className="space-y-2 text-xs text-[#8B949E]">
              <li>Evidence-first methodology</li>
              <li>Multi-domain corroboration gate</li>
              <li>Verbatim citation tracing</li>
              <li>Zero synthetic hallucination</li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-[#F0F6FC] mb-3 tracking-wider">
              // ARCHITECTURE
            </h5>
            <ul className="space-y-2 text-xs text-[#8B949E]">
              <li>React 19 + TypeScript + Vite</li>
              <li>Live web search retrieval + Gemini</li>
              <li>Server-side secure proxy pipeline</li>
            </ul>
          </div>

          {/* Retrieval Scope */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-[#F0F6FC] mb-3 tracking-wider">
              // DATA_PROVENANCE
            </h5>
            <p className="text-xs text-[#8B949E] leading-relaxed">
              Exclusively audits publicly indexed web documents and authoritative institutional records. Does not rely on ungrounded model assumptions.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-[#21262D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#484F58]">
          <div>
            © {new Date().getFullYear()} FactCheckAI Forensic Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">// PRIVACY</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">// TERMS</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">// METHODOLOGY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
