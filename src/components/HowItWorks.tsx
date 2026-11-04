import React from 'react';
import { Terminal, Search, Cpu, FileCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      code: 'INGEST',
      icon: Terminal,
      title: 'Claim Ingestion',
      desc: 'Parses assertion syntax, strips prompt injections, and extracts semantic inquiry keywords for target exploration.'
    },
    {
      num: '02',
      code: 'RETRIEVE',
      icon: Search,
      title: 'Real-Time Web Retrieval',
      desc: 'Retrieves public web sources, scientific databases, and regulatory records across independent top-level domains.'
    },
    {
      num: '03',
      code: 'AUDIT',
      icon: Cpu,
      title: 'Evidence Cross-Exam',
      desc: 'Cross-examines verbatim excerpt passages against the claim, evaluating corroborating and contradictory source signals.'
    },
    {
      num: '04',
      code: 'DOSSIER',
      icon: FileCheck,
      title: 'Evidentiary Dossier',
      desc: 'Compiles calibrated confidence, cited primary links, verbatim excerpts, and an auditable step-by-step reasoning log.'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0D1117] border-y border-[#30363D] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B22] border border-[#30363D] text-emerald-400 font-mono text-xs tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FORENSIC_PIPELINE_ARCHITECTURE</span>
          </div>
          <h2 className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] uppercase">
            Four-Stage Verification Protocol
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-3 font-mono leading-relaxed">
            Every assertion undergoes sequential cross-examination with auditable data provenance and zero hallucinations.
          </p>
        </div>

        {/* Pipeline Container with Horizontal Progress Connector Line on Desktop */}
        <div className="relative">
          
          {/* Subtle horizontal progress connector line on desktop */}
          <div 
            aria-hidden="true" 
            className="hidden md:block absolute top-7 left-12 right-12 h-[2px] bg-gradient-to-r from-emerald-500/30 via-[#30363D] to-emerald-500/30 z-0 pointer-events-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="p-6 rounded-xl border border-[#30363D] bg-[#161B22] space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-emerald-500/50 group relative"
                >
                  {/* Step Header with Node Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#0D1117] border border-[#30363D] group-hover:border-emerald-500/60 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shadow-xs transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#8B949E] group-hover:text-emerald-400 transition-colors">
                      {s.num} //{s.code}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-mono text-base font-bold text-[#F0F6FC] group-hover:text-white leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#8B949E] leading-relaxed font-sans mt-2">
                      {s.desc}
                    </p>
                  </div>

                  {/* Terminal status dot at bottom */}
                  <div className="pt-2 border-t border-[#21262D] flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                    <span>STAGE_{s.num}_OK</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
