import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-stone-200 mt-20 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif font-black text-xs">
                FC
              </div>
              <span className="font-serif font-bold text-stone-900 text-base">
                FactCheckAI
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-serif italic">
              "Verify Claims. See the Evidence."
            </p>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              AI-assisted evidence synthesis and claim verification. Proof, not just a verdict.
            </p>
          </div>

          {/* Core Principles */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-stone-900 mb-3 tracking-wider">
              Verification Ethos
            </h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>Evidence-first methodology</li>
              <li>Traceable retrieved sources</li>
              <li>Non-partisan consensus audit</li>
              <li>Heuristic source-agreement confidence</li>
            </ul>
          </div>

          {/* Resources & Architecture */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-stone-900 mb-3 tracking-wider">
              Architecture
            </h5>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tavily web search + Gemini analysis</li>
              <li>REST API Architecture</li>
            </ul>
          </div>

          {/* Web Retrieval Scope */}
          <div>
            <h5 className="font-mono text-xs uppercase font-bold text-stone-900 mb-3 tracking-wider">
              Search Scope
            </h5>
            <p className="text-xs text-stone-600 leading-relaxed">
              Retrieves public web pages for analysis. Source coverage and quality vary by claim.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-150 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} FactCheckAI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-700 cursor-pointer">Methodology</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
