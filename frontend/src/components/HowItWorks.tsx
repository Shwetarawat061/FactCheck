import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase font-bold text-stone-500 tracking-wider">
            TRANSPARENT METHODOLOGY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-1">
            How FactCheckAI Works
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-serif">
            A multi-stage verification pipeline grounded in real-time web retrieval, document analysis, and transparent citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Enter Claim
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Input any factual assertion, article statement, or disputed quote for verification.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Search the Web
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Searches the public web for relevant articles, news wire records, and documentation across independent domains.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Evidence Audit
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Gemini cross-examines the retrieved web evidence against the claim, evaluating corroboration and contradictions.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
              04
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Structured Report
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Produces a heuristic assessment with excerpts checked against retrieved source text, dates (when available), and links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
