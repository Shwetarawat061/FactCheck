import React, { useState } from 'react';
import { 
  VERIFICATION_DOMAINS, 
  RECOMMENDED_VERDICTS, 
  WORKFLOW_STAGES, 
  VerificationDomain 
} from '../data/verificationDomains';
import { 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Search, 
  FileText, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { playTerminalSound } from '../services/terminalAudio';

interface VerificationGuideProps {
  onSelectClaim?: (claim: string) => void;
}

export const VerificationGuide: React.FC<VerificationGuideProps> = ({ onSelectClaim }) => {
  const [selectedDomain, setSelectedDomain] = useState<VerificationDomain>(VERIFICATION_DOMAINS[0]);
  const [activeTab, setActiveTab] = useState<'domains' | 'workflow' | 'verdicts'>('domains');

  const handleDomainClick = (domain: VerificationDomain) => {
    playTerminalSound('click');
    setSelectedDomain(domain);
  };

  const handleClaimClick = (claim: string) => {
    playTerminalSound('click');
    if (onSelectClaim) {
      onSelectClaim(claim);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="verification-scope" className="py-20 bg-[#0D1117] border-b border-[#30363D] relative overflow-hidden">
      {/* Background glow & accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-emerald-400 font-mono text-xs tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM_AUDIT_SPECIFICATION // SCOPE & ARCHITECTURE</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] uppercase">
            What Should FactCheckAI Verify?
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-3 font-mono leading-relaxed max-w-2xl mx-auto">
            Comprehensive domain coverage spanning public discourse, peer-reviewed science, corporate filings, viral media, and forensic media integrity.
          </p>

          {/* Subnav Tabs */}
          <div className="mt-8 inline-flex items-center p-1 rounded-lg bg-[#161B22] border border-[#30363D] gap-1 font-mono text-xs">
            <button
              type="button"
              data-cursor="READ"
              onClick={() => { playTerminalSound('click'); setActiveTab('domains'); }}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'domains'
                  ? 'bg-emerald-500 text-[#0D1117] font-bold shadow-xs'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              // 5 VERIFICATION DOMAINS
            </button>
            <button
              type="button"
              data-cursor="READ"
              onClick={() => { playTerminalSound('click'); setActiveTab('workflow'); }}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-emerald-500 text-[#0D1117] font-bold shadow-xs'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              // 4-STAGE PIPELINE
            </button>
            <button
              type="button"
              data-cursor="READ"
              onClick={() => { playTerminalSound('click'); setActiveTab('verdicts'); }}
              className={`px-4 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'verdicts'
                  ? 'bg-emerald-500 text-[#0D1117] font-bold shadow-xs'
                  : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
              }`}
            >
              // 5 VERDICT STANDARDS
            </button>
          </div>
        </div>

        {/* ---------------- TAB 1: 5 VERIFICATION DOMAINS ---------------- */}
        {activeTab === 'domains' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Domain Selectors (Left Column) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-[11px] text-[#8B949E] uppercase tracking-wider block mb-1">
                // SELECT VERIFICATION DOMAIN
              </span>
              {VERIFICATION_DOMAINS.map((domain, index) => {
                const Icon = domain.icon;
                const isSelected = selectedDomain.id === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    data-cursor="FACT"
                    onClick={() => handleDomainClick(domain)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#161B22] border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                        : 'bg-[#161B22]/70 border-[#30363D] hover:border-[#484F58] hover:bg-[#161B22]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                          : 'bg-[#0D1117] border border-[#30363D] text-[#8B949E] group-hover:text-emerald-400 group-hover:border-emerald-500/40'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs font-bold ${isSelected ? 'text-white' : 'text-[#F0F6FC] group-hover:text-white'}`}>
                            {index + 1}. {domain.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0D1117] border border-[#30363D] text-emerald-400/90">
                            {domain.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8B949E] line-clamp-1 mt-0.5 font-sans">
                          {domain.shortDesc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-[#484F58] group-hover:text-[#8B949E]'}`} />
                  </button>
                );
              })}
            </div>

            {/* Domain Details & Interactive Inquest Chips (Right Column) */}
            <div className="lg:col-span-7 bg-[#161B22] border border-[#30363D] rounded-xl p-6 sm:p-7 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30363D] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#0D1117] border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
                    {React.createElement(selectedDomain.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block font-bold">
                      // {selectedDomain.tag}
                    </span>
                    <h3 className="font-mono text-lg sm:text-xl font-bold text-[#F0F6FC]">
                      {selectedDomain.name}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-[#0D1117] border border-[#30363D] text-[#8B949E] font-mono text-xs">
                  DOM_CODE: {selectedDomain.id.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider block mb-1.5">
                  AUDIT SCOPE &amp; MANDATE:
                </span>
                <p className="text-xs sm:text-sm text-[#C9D1D9] leading-relaxed">
                  {selectedDomain.fullDesc}
                </p>
              </div>

              {/* Forensic Methodology */}
              <div className="p-4 rounded-lg bg-[#0D1117] border border-[#30363D]/80 space-y-1.5">
                <span className="font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  EVIDENTIARY METHODOLOGY:
                </span>
                <p className="text-xs text-[#8B949E] leading-relaxed font-mono">
                  {selectedDomain.methodology}
                </p>
              </div>

              {/* Key Indexed Sources */}
              <div>
                <span className="font-mono text-xs text-[#8B949E] uppercase tracking-wider block mb-2">
                  CORROBORATIVE SOURCE REGISTRIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDomain.keySources.map((source, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0D1117] border border-[#30363D] text-[#C9D1D9] font-mono text-[11px] flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      <span>{source}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Sample Inquests */}
              <div className="pt-2 border-t border-[#30363D]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    SAMPLE INQUEST PROPOSITIONS (CLICK TO AUDIT):
                  </span>
                  <span className="font-mono text-[10px] text-[#484F58]">
                    LIVE VERIFICATION
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedDomain.exampleClaims.map((claim, idx) => (
                    <button
                      key={idx}
                      type="button"
                      data-cursor="FACT"
                      onClick={() => handleClaimClick(claim)}
                      className="w-full p-3 rounded-lg bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/60 hover:bg-[#161B22] text-left transition-all duration-150 group cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] text-[#8B949E] group-hover:text-emerald-400 shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-mono text-xs text-[#C9D1D9] group-hover:text-white leading-relaxed">
                          "{claim}"
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span>AUDIT</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- TAB 2: 4-STAGE PIPELINE ---------------- */}
        {activeTab === 'workflow' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WORKFLOW_STAGES.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-xl bg-[#161B22] border border-[#30363D] space-y-4 hover:border-emerald-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0D1117] border border-emerald-500/50 text-emerald-400">
                      STAGE_{step.step}
                    </span>
                    <span className="font-mono text-[10px] text-[#8B949E]">
                      AUDIT_NODE
                    </span>
                  </div>
                  <h4 className="font-mono text-base font-bold text-[#F0F6FC]">
                    {step.name}
                  </h4>
                  <p className="text-xs text-[#C9D1D9] leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="pt-2 border-t border-[#21262D] text-[11px] font-mono text-[#8B949E]">
                    // {step.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Stack Callout */}
            <div className="p-6 rounded-xl bg-[#161B22] border border-[#30363D] font-mono">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3">
                // FACTCHECK.AI RECOMMENDED ARCHITECTURE SPECIFICATION:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] block">FRONTEND</span>
                  <span className="text-[#F0F6FC] font-bold block mt-1">React, TypeScript, Vite</span>
                  <span className="text-[11px] text-emerald-400/90 mt-0.5 block">Tailwind CSS + Monospace UI</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] block">BACKEND RUNTIME</span>
                  <span className="text-[#F0F6FC] font-bold block mt-1">Express / Flask REST API</span>
                  <span className="text-[11px] text-emerald-400/90 mt-0.5 block">Full-stack REST proxy</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] block">AI REASONING</span>
                  <span className="text-[#F0F6FC] font-bold block mt-1">Gemini API SDK</span>
                  <span className="text-[11px] text-emerald-400/90 mt-0.5 block">Cross-exam &amp; consensus logic</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#0D1117] border border-[#30363D]">
                  <span className="text-[10px] text-[#8B949E] block">EVIDENCE RETRIEVAL</span>
                  <span className="text-[#F0F6FC] font-bold block mt-1">Google Grounding / Web</span>
                  <span className="text-[11px] text-emerald-400/90 mt-0.5 block">Multi-domain indexed search</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: 5 VERDICT STANDARDS ---------------- */}
        {activeTab === 'verdicts' && (
          <div className="space-y-6">
            
            {/* Critical Safeguard Callout */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white">// STRICT ANTI-ASSUMPTION POLICY:</span>
                <span>
                  FactCheckAI does <strong className="text-amber-200 underline">not</strong> automatically label a claim <em>False</em> simply because it cannot find evidence for it. Unproven claims with scarce indexed records are classified as <strong className="text-white">Unverified</strong> to preserve evidentiary integrity.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {RECOMMENDED_VERDICTS.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.category}
                    className={`p-5 rounded-xl bg-[#161B22] border ${v.borderClass} space-y-3 transition-all duration-200 hover:-translate-y-0.5 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-bold border ${v.badgeClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{v.category.toUpperCase()}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#8B949E]">
                        CODE: {v.code}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-mono text-sm font-bold text-[#F0F6FC]">
                        {v.definition}
                      </h4>
                      <p className="text-xs text-[#8B949E] mt-2 font-mono leading-relaxed">
                        <strong className="text-[#C9D1D9]">Standard:</strong> {v.auditStandard}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
