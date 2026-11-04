import React from 'react';
import { Search, Scale, FileCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const pillars = [
    {
      icon: Search,
      title: 'Evidence retrieval',
      desc: 'Find relevant, authoritative sources across news wires, peer-reviewed journals, and public registries.',
      highlight: 'Find relevant sources'
    },
    {
      icon: Scale,
      title: 'Evidence comparison',
      desc: 'Assess both supporting and contradicting evidence with calibrated impartiality and context checks.',
      highlight: 'Assess both sides'
    },
    {
      icon: FileCheck,
      title: 'Cited verdicts',
      desc: 'Deliver clear conclusions grounded in verifiable excerpts, source links, and auditable reasoning.',
      highlight: 'Explain the conclusion'
    },
    {
      icon: HelpCircle,
      title: 'Transparent results',
      desc: 'Never assume false without evidence; highlight caveats, evidentiary scarcity, and uncertainty.',
      highlight: 'Show uncertainty'
    }
  ];

  return (
    <div className="w-full mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#161B22]/80 border border-[#30363D] hover:border-emerald-500/40 transition-all duration-200 text-left space-y-2 group shadow-xs hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#0D1117] border border-[#30363D] group-hover:border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h4 className="font-mono text-xs sm:text-sm font-bold text-[#F0F6FC] group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8B949E] mt-1 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="pt-1.5 border-t border-[#21262D] text-[10px] font-mono text-emerald-400/90 font-semibold">
                // {item.highlight}
              </div>
            </div>
          );
        })}
      </div>

      {/* Concept preview notice */}
      <div className="mt-4 text-center">
        <p className="text-[11px] font-mono text-[#484F58] tracking-wide">
          CONCEPT PREVIEW · Example actions illustrate the proposed UI; actual verification executes live web grounding and Gemini reasoning.
        </p>
      </div>
    </div>
  );
};
