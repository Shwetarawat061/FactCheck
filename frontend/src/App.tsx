import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ClaimInput } from './components/ClaimInput';
import { ExampleClaims } from './components/ExampleClaims';
import { AnalysisLoader } from './components/AnalysisLoader';
import { FactCheckResult } from './components/FactCheckResult';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { checkClaim, FactCheckError } from './services/factCheckClient';
import { FactCheckResult as ResultType } from './types/factCheck';
import { ArrowRight, CheckCircle2, ShieldCheck, Database, Search, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [claimInput, setClaimInput] = useState<string>('The Great Wall of China is visible from the Moon.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckClaim = async (targetClaimText?: string) => {
    const claimToVerify = (targetClaimText || claimInput).trim();
    if (!claimToVerify || isLoading) return;

    if (targetClaimText) {
      setClaimInput(targetClaimText);
    }

    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    // Scroll to verification top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await checkClaim(claimToVerify);
      setResult(data);
    } catch (e: any) {
      setErrorMessage(
        e instanceof FactCheckError
          ? e.message
          : 'Verification failed. No result was produced.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setClaimInput('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExampleSelect = (claim: string) => {
    setClaimInput(claim);
    handleCheckClaim(claim);
  };

  const handleNavigateSection = (section: 'verify' | 'how-it-works' | 'examples' | 'about') => {
    if (section === 'verify') {
      if (result) {
        handleReset();
      } else {
        const el = document.getElementById('verify-section');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      const el = document.getElementById(section);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c1917]">
      <Navbar onNewCheck={handleReset} onNavigateSection={handleNavigateSection} />

      <main className="flex-1">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{errorMessage}</span>
                  <span className="text-xs text-rose-700 mt-0.5 block">
                    Please try checking another statement or select one of the verified examples below.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ---------------- ACTIVE RESULT VIEW ---------------- */}
        {result && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify Another Claim</span>
              </button>
              <span className="text-xs font-mono text-stone-500">
                Verification Engine: Web search retrieval + Gemini analysis
              </span>
            </div>

            <FactCheckResult
              result={result}
              onReset={handleReset}
            />
          </div>
        )}

        {/* ---------------- LOADING ANALYSIS VIEW ---------------- */}
        {isLoading && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <AnalysisLoader
              claim={claimInput}
            />
          </div>
        )}

        {/* ---------------- HERO & CLAIM INPUT (when not showing result) ---------------- */}
        {!result && !isLoading && (
          <>
            <section className="pt-20 pb-14 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
              
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 text-stone-700 text-xs font-mono font-medium shadow-2xs mb-6">
                <span className="w-2 h-2 rounded-full bg-stone-900" />
                <span>PROOF, NOT JUST A VERDICT</span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.08] max-w-4xl mx-auto uppercase">
                VERIFY CLAIMS. <br />
                <span className="italic font-normal lowercase">SEE THE EVIDENCE.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-serif">
                FactCheckAI analyzes claims using evidence from available sources and presents a transparent verification report.
              </p>

              {/* Interactive Claim Input Section */}
              <div id="verify-section" className="mt-12 text-left max-w-3xl mx-auto">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                    What claim would you like to verify?
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    Instant Analysis
                  </span>
                </div>

                <ClaimInput
                  value={claimInput}
                  onChange={setClaimInput}
                  onSubmit={() => handleCheckClaim()}
                  isLoading={isLoading}
                  placeholder="Paste a claim, article statement, or factual assertion..."
                />

                <ExampleClaims onSelectClaim={handleExampleSelect} disabled={isLoading} />
              </div>

            </section>

            {/* ---------------- HOW IT WORKS ---------------- */}
            <HowItWorks />

            {/* ---------------- USE CASES ---------------- */}
            <UseCases />

            {/* ---------------- EXAMPLES SECTION ---------------- */}
            <section id="examples" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-mono text-xs uppercase font-bold text-stone-500 tracking-wider">
                  SAMPLE PROMPTS
                </span>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mt-1">
                  Explore Suggested Claims
                </h2>
                <p className="text-sm text-stone-600 mt-2 font-serif">
                  Select any claim below to trigger real-time web search retrieval and live verification:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    topic: 'Space Exploration',
                    claim: 'The Great Wall of China is visible from the Moon.'
                  },
                  {
                    topic: 'Health & Nutrition',
                    claim: 'Coffee causes cancer.'
                  },
                  {
                    topic: 'Neuroscience & Biology',
                    claim: 'Humans only use 10% of their brains.'
                  },
                  {
                    topic: 'Physical Science',
                    claim: 'Water boils at 100°C at sea level.'
                  }
                ].map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => handleExampleSelect(ex.claim)}
                    className="p-5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer text-left space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-medium text-stone-500 text-[11px] uppercase tracking-wider">
                        {ex.topic}
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-stone-800 leading-snug">
                      "{ex.claim}"
                    </h4>
                    <div className="pt-2 text-[11px] font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Try this claim</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------------- ABOUT SECTION ---------------- */}
            <section id="about" className="py-20 bg-white border-t border-stone-200">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <span className="font-mono text-xs uppercase font-bold text-stone-500 tracking-wider">
                      ABOUT FACTCHECKAI
                    </span>
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mt-2">
                      Proof, not just an automated opinion.
                    </h2>
                    <p className="mt-4 text-sm text-stone-600 leading-relaxed font-serif">
                      FactCheckAI is built on the tenet that information verification requires an audit trail: exact quotes, publisher domains, publication dates (when available), and explicit relationship labels (SUPPORTS, CONTRADICTS, CONTEXT).
                    </p>
                    <div className="mt-6 space-y-3 text-xs text-stone-700">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span><strong>Open Verification:</strong> Immediate access to evidence-backed claim analysis without accounts or paywalls.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span><strong>Web Search Retrieval:</strong> Real-time search across the public web retrieves corroborating and contradictory primary evidence.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span><strong>Heuristic AI Confidence:</strong> Confidence is a heuristic based on source agreement, not a statistical probability.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-[#faf9f6] border border-stone-200 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-serif font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                      FC
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      Verify any assertion instantly
                    </h3>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto">
                      Enter any claim in the input above to begin comprehensive fact analysis.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleNavigateSection('verify')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Verify a Claim</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}
