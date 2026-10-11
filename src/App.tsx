import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuditorCursor } from './components/AuditorCursor';
import { ClaimInput } from './components/ClaimInput';
import { ExampleClaims } from './components/ExampleClaims';
import { AnalysisLoader } from './components/AnalysisLoader';
import { FactCheckResult } from './components/FactCheckResult';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { checkClaim, FactCheckError } from './services/factCheckClient';
import { FactCheckResult as ResultType } from './types/factCheck';
import { playTerminalSound } from './services/terminalAudio';
import { ArrowRight, CheckCircle2, ShieldCheck, Database, Search, AlertCircle, RefreshCw, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [claimInput, setClaimInput] = useState<string>('The Great Wall of China is visible from the Moon.');
  const [activeAuditingClaim, setActiveAuditingClaim] = useState<string>('The Great Wall of China is visible from the Moon.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<ResultType[]>(() => {
    try {
      const stored = sessionStorage.getItem('factcheck_session_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleCheckClaim = async (targetClaimText?: string) => {
    const claimToVerify = (targetClaimText !== undefined ? targetClaimText : claimInput).trim();
    if (!claimToVerify) {
      setErrorMessage('Please enter or select a factual statement to audit.');
      playTerminalSound('error');
      return;
    }
    if (isLoading) return;

    setActiveAuditingClaim(claimToVerify);
    setClaimInput(claimToVerify);
    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);
    playTerminalSound('start');

    // Scroll to verification top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await checkClaim(claimToVerify);
      setResult(data);
      playTerminalSound('success');
      setSessionHistory((prev) => {
        const filtered = prev.filter(
          (p) => p.id !== data.id && p.claim.trim().toLowerCase() !== data.claim.trim().toLowerCase()
        );
        const updated = [...filtered, data];
        try {
          sessionStorage.setItem('factcheck_session_history', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    } catch (e: any) {
      playTerminalSound('error');
      setErrorMessage(
        e instanceof FactCheckError
          ? e.message
          : 'Verification failed. No result was produced.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoricalClaim = (histResult: ResultType) => {
    playTerminalSound('click');
    setResult(histResult);
    setClaimInput(histResult.claim);
    setActiveAuditingClaim(histResult.claim);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckRelatedClaim = (claimText: string) => {
    playTerminalSound('click');
    setClaimInput(claimText);
    handleCheckClaim(claimText);
  };

  const handleReset = () => {
    playTerminalSound('click');
    setResult(null);
    setClaimInput('');
    setActiveAuditingClaim('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExampleSelect = (claim: string) => {
    playTerminalSound('click');
    setClaimInput(claim);
    handleCheckClaim(claim);
  };

  const handleNavigateSection = (section: 'verify' | 'how-it-works' | 'examples' | 'about') => {
    playTerminalSound('click');
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
    <div className="min-h-screen flex flex-col bg-[#0D1117] text-[#C9D1D9] cyber-grid">
      <AuditorCursor />
      <Navbar onNewCheck={handleReset} onNavigateSection={handleNavigateSection} />

      <main className="flex-1">
        
        {/* Error Alert with Cyber Terminal Styling */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in font-mono shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">// INQUEST_EXECUTION_ERROR:</span>
                  <span className="text-xs text-rose-300 mt-0.5 block">
                    {errorMessage}
                  </span>
                  <span className="text-[11px] text-rose-400/80 mt-1 block">
                    Please inspect your claim syntax or click one of the verified dossiers below.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white font-bold text-xs cursor-pointer px-2 py-1 rounded bg-rose-900/40 border border-rose-500/30"
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        {/* ---------------- ACTIVE RESULT VIEW ---------------- */}
        {result && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="mb-6 flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-[#30363D] bg-[#161B22] hover:bg-[#21262D] hover:border-emerald-500/50 text-[#C9D1D9] hover:text-emerald-400 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs hover:-translate-y-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>// NEW_INQUEST</span>
              </button>
              <span className="text-xs text-[#8B949E] hidden sm:inline">
                PIPELINE: Live Web Retrieval + Gemini Cross-Examination
              </span>
            </div>

            <FactCheckResult
              result={result}
              sessionHistory={sessionHistory}
              onSelectHistoricalClaim={handleSelectHistoricalClaim}
              onCheckRelatedClaim={handleCheckRelatedClaim}
              onReset={handleReset}
            />
          </div>
        )}

        {/* ---------------- LOADING ANALYSIS VIEW ---------------- */}
        {isLoading && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <AnalysisLoader
              claim={activeAuditingClaim || claimInput || 'Target Assertion'}
            />
          </div>
        )}

        {/* ---------------- HERO & CLAIM INPUT (when not showing result) ---------------- */}
        {!result && !isLoading && (
          <>
            <section className="pt-20 pb-14 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center terminal-scanlines relative rounded-2xl">
              
              {/* Cyber Tagline Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161B22] border border-[#30363D] text-[#C9D1D9] text-xs font-mono font-medium shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-7 hover:border-emerald-500/40 transition-colors">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-emerald-400 font-bold">CYBER_AUDITOR //</span>
                <span>FORENSIC DATA &amp; INTELLIGENCE ENGINE</span>
              </div>

              {/* Main Headline (Pixelated Retro Cyber Terminal Typography) */}
              <h1 className="font-pixel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-[#F0F6FC] leading-[1.25] max-w-4xl mx-auto uppercase">
                FORENSIC CLAIM AUDITOR. <br />
                <span className="text-emerald-400 text-pixel-glow">VERIFY THE EVIDENCE.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-sm sm:text-base text-[#8B949E] leading-relaxed max-w-2xl mx-auto font-mono">
                Cross-examines public assertions against live web documents, academic registries, and verified sources with strict polarity gates and verbatim citation tracing.
              </p>

              {/* Interactive Centerpiece Claim Input Section */}
              <div id="verify-section" className="mt-12 text-left max-w-3xl mx-auto">
                <div className="mb-3 flex items-center justify-between font-mono">
                  <span className="text-xs uppercase font-bold text-[#F0F6FC] tracking-wider flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TARGET_STATEMENT_INPUT</span>
                  </span>
                  <span className="text-[11px] text-emerald-400/90">
                    // INSTANT_FORENSIC_ANALYSIS
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

            {/* ---------------- HOW IT WORKS (Connected Pipeline) ---------------- */}
            <HowItWorks />

            {/* ---------------- USE CASES ---------------- */}
            <UseCases />

            {/* ---------------- SUGGESTED DOSSIERS SECTION ---------------- */}
            <section id="examples" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14 font-mono">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  // SAMPLE_INQUEST_DOSSIERS
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F0F6FC] mt-2 uppercase">
                  Explore Pre-Seeded Target Assertions
                </h2>
                <p className="text-xs sm:text-sm text-[#8B949E] mt-2">
                  Select any dossier to execute live retrieval, multi-source consensus extraction, and evidentiary synthesis:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    topic: 'ASTROPHYSICS & ORBITAL',
                    claim: 'The Great Wall of China is visible from the Moon.'
                  },
                  {
                    topic: 'EPIDEMIOLOGY & ONCOLOGY',
                    claim: 'Coffee causes cancer.'
                  },
                  {
                    topic: 'NEUROLOGY & COGNITIVE',
                    claim: 'Humans only use 10% of their brains.'
                  },
                  {
                    topic: 'THERMODYNAMICS & ATMOSPHERE',
                    claim: 'Water boils at 100°C at sea level.'
                  }
                ].map((ex, i) => (
                  <div
                    key={i}
                    data-cursor="FACT"
                    onClick={() => handleExampleSelect(ex.claim)}
                    className="p-5 rounded-xl bg-[#161B22] border border-[#30363D] shadow-xs hover:border-emerald-500/50 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all duration-200 cursor-pointer text-left space-y-2 group hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-medium text-emerald-400 text-[11px] uppercase tracking-wider">
                        // {ex.topic}
                      </span>
                      <span className="text-[10px] text-[#8B949E] group-hover:text-emerald-400">
                        INQUEST #{i + 1}
                      </span>
                    </div>
                    <h4 className="font-mono text-sm sm:text-base font-bold text-[#F0F6FC] group-hover:text-white leading-snug">
                      "{ex.claim}"
                    </h4>
                    <div className="pt-2 text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>EXECUTE_INQUEST</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------------- ABOUT SECTION ---------------- */}
            <section id="about" className="py-24 bg-[#161B22] border-t border-[#30363D]">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    <span className="font-mono text-xs uppercase font-bold text-emerald-400 tracking-wider">
                      // AUDIT_SPECIFICATION
                    </span>
                    <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#F0F6FC] uppercase">
                      Forensic Precision. Verifiable Provenance.
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8B949E] leading-relaxed font-mono">
                      FactCheckAI operates under a strict anti-hallucination mandate: every claim is audited through multi-source cross-examination with verbatim quote extraction, independent domain validation, and explicit relationship classifications.
                    </p>
                    <div className="space-y-2.5 text-xs font-mono text-[#C9D1D9] pt-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Zero-Friction Inquest:</strong> Instant public access with zero logins, accounts, or telemetry tracking.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Multi-Domain Gate:</strong> Requires distinct top-level domains before rendering a confident verdict.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Verbatim Tracing:</strong> Citation passages are cross-checked against retrieved source text.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-4 text-center shadow-lg">
                    <div className="w-12 h-12 rounded-lg bg-[#161B22] border border-emerald-500/50 text-emerald-400 font-mono font-bold text-lg flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="font-mono text-lg font-bold text-[#F0F6FC] uppercase">
                      Initialize Forensic Audit
                    </h3>
                    <p className="text-xs text-[#8B949E] max-w-sm mx-auto font-mono">
                      Input any disputed proposition or statement into the terminal to begin live verification.
                    </p>
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleNavigateSection('verify')}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#0D1117] font-mono text-xs font-bold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer hover:-translate-y-0.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>AUDIT_A_CLAIM</span>
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
