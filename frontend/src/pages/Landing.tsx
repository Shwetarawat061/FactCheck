import React, { useRef } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Layers, FileCheck2, Database, Sparkles, ExternalLink, Search } from 'lucide-react';
import { ClaimInput } from '../components/ClaimInput';
import { ExampleClaims } from '../components/ExampleClaims';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface LandingProps {
  onCheckClaim: (claim: string) => void;
  claimInput: string;
  setClaimInput: (val: string) => void;
  isLoading: boolean;
  onNewCheck?: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  onCheckClaim,
  claimInput,
  setClaimInput,
  isLoading,
  onNewCheck,
}) => {
  const examplesSectionRef = useRef<HTMLDivElement>(null);
  const claimSectionRef = useRef<HTMLDivElement>(null);

  const scrollToClaimInput = () => {
    claimSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToExamples = () => {
    examplesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToSection = (section: 'verify' | 'how-it-works' | 'examples' | 'about') => {
    if (section === 'verify') {
      scrollToClaimInput();
    } else {
      const el = document.getElementById(section);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClaimSubmit = () => {
    if (!claimInput.trim()) return;
    onCheckClaim(claimInput.trim());
  };

  const handleSelectExample = (claim: string) => {
    setClaimInput(claim);
    onCheckClaim(claim);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c1917]">
      <Navbar onNewCheck={onNewCheck || scrollToClaimInput} onNavigateSection={scrollToSection} />

      <main className="flex-1">
        
        {/* ---------------- 1. HERO SECTION ---------------- */}
        <section className="pt-20 pb-14 sm:pt-28 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          
          {/* Subtle Tagline Badge */}
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

          {/* Direct Verification CTAs (No logins, no popups) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollToClaimInput}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold tracking-wide transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Verify a Claim</span>
            </button>

            <button
              type="button"
              onClick={scrollToExamples}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-sm font-semibold tracking-wide transition-all shadow-2xs hover:bg-stone-50 cursor-pointer"
            >
              <span>Explore Examples</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-5 text-xs font-mono text-stone-500 tracking-wide">
            Evidence-first fact checking • Live Tavily search • Retrieved-source citations
          </p>

          {/* Interactive Claim Input Section */}
          <div id="verify" ref={claimSectionRef} className="mt-14 text-left max-w-3xl mx-auto">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                What claim would you like to verify?
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Instant Evidence Analysis
              </span>
            </div>

            <ClaimInput
              value={claimInput}
              onChange={setClaimInput}
              onSubmit={handleClaimSubmit}
              isLoading={isLoading}
              placeholder="Paste a claim, article statement, or factual assertion..."
            />

            <ExampleClaims onSelectClaim={handleSelectExample} disabled={isLoading} />
          </div>

        </section>

        {/* ---------------- 2. HOW IT WORKS ---------------- */}
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
                A multi-stage claim analysis that evaluates retrieved public web sources and exposes its evidence trail.
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
                  Input any factual statement, headline, quote, or statistical claim for semantic entity isolation.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
                  02
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Retrieve Evidence
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Searches the public web for relevant pages; coverage and source quality vary by claim.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
                  03
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  AI Analysis
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Gemini analyzes retrieved evidence against the claim, cross-referencing contradictions and nuances.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-stone-200 bg-[#faf9f6] space-y-3">
                <div className="w-9 h-9 rounded-lg bg-stone-900 text-white font-mono text-sm font-bold flex items-center justify-center">
                  04
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Structured Verdict
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Produces a heuristic assessment with excerpts checked against retrieved source text and direct links.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------- 3. EXAMPLES SECTION ---------------- */}
        <section ref={examplesSectionRef} id="examples" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase font-bold text-stone-500 tracking-wider">
              VERIFICATION ARCHIVE
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mt-1">
              Explore Example Fact Checks
            </h2>
            <p className="text-sm text-stone-600 mt-2 font-serif">
              Click any example below to inspect the evidence hierarchy and source citations:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                claim: 'The Great Wall of China is visible from the Moon.',
                verdict: 'FALSE',
                summary: 'Contradicted by optical physics and NASA Apollo astronaut testimony; masonry is optically unresolvable from 384,400 km away.',
                sources: 5
              },
              {
                claim: 'Coffee causes cancer.',
                verdict: 'FALSE',
                summary: 'WHO IARC removed coffee from possible carcinogens in 2016, observing protective associations for liver and uterine cancers.',
                sources: 6
              },
              {
                claim: 'Humans only use 10% of their brains.',
                verdict: 'FALSE',
                summary: 'Functional fMRI imaging and clinical neurology confirm 100% metabolic activation across distributed cortico-subcortical circuits.',
                sources: 5
              },
              {
                claim: 'Water boils at 100°C at sea level.',
                verdict: 'TRUE',
                summary: 'Under 1 standard atmosphere (101.325 kPa), pure water transitions from liquid to vapor at 99.974°C (conventionally 100.0°C).',
                sources: 4
              }
            ].map((ex, i) => (
              <div
                key={i}
                onClick={() => handleSelectExample(ex.claim)}
                className="p-5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer text-left space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-stone-900 group-hover:text-stone-700">
                    {ex.verdict}
                  </span>
                  <span className="font-mono text-stone-400 text-[11px]">
                    {ex.sources} sources reviewed
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-stone-900 group-hover:text-stone-800 leading-snug">
                  "{ex.claim}"
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {ex.summary}
                </p>
                <div className="pt-2 text-[11px] font-semibold text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Audit Evidence</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- 4. ABOUT SECTION ---------------- */}
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
                  FactCheckAI is built on the tenet that information verification requires an audit trail: exact quotes, publisher domains, publication dates, and explicit relationship labels (SUPPORTS, CONTRADICTS, CONTEXT).
                </p>
                <div className="mt-6 space-y-3 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Frictionless & Open:</strong> Immediate verification without accounts, sign-ins, or logins.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Server-Side Protection:</strong> All AI models and search keys execute on the backend, never exposing secrets in browser code.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Honest AI Confidence:</strong> Confidence scores are clearly presented as machine synthesis weights rather than statistical absolutes.</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-[#faf9f6] border border-stone-200 space-y-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-serif font-black text-lg flex items-center justify-center mx-auto shadow-sm">
                  FC
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Ready to verify assertions?
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Type or paste any claim into the verification engine to inspect live sources.
                </p>
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={scrollToClaimInput}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify a Claim Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
