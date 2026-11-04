import React from 'react';
import { Newspaper, GraduationCap, Users, ShieldAlert, Terminal } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: Newspaper,
      tag: 'JOURNALISM',
      title: 'Reporters & Fact-Check Desks',
      desc: 'Rapidly cross-reference breaking viral assertions and press releases against primary archival records before editorial distribution.'
    },
    {
      icon: GraduationCap,
      tag: 'ACADEMIA',
      title: 'Researchers & Scientists',
      desc: 'Evaluate scientific citations, historical accounts, and quantitative statistical claims against indexed public research.'
    },
    {
      icon: Users,
      tag: 'OSINT',
      title: 'Investigators & Analysts',
      desc: 'Audit policy claims, election rumors, and corporate disclosures with verbatim excerpt provenance and domain diversity metrics.'
    },
    {
      icon: ShieldAlert,
      tag: 'PUBLIC',
      title: 'Informed Citizens',
      desc: 'Dissect sensational health advice, viral social claims, and distorted quotes with calibrated consensus scoring.'
    }
  ];

  return (
    <section className="py-20 bg-[#0D1117] border-b border-[#30363D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase font-bold text-emerald-400 tracking-wider">
            // OPERATIONAL_APPLICATIONS
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#F0F6FC] mt-2 uppercase">
            Built for High-Stakes Evidence Verification
          </h2>
          <p className="text-xs sm:text-sm text-[#8B949E] mt-2 font-mono">
            Forensic evidentiary engine designed for rigorous fact audits where accuracy is paramount.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-xl bg-[#161B22] border border-[#30363D] shadow-xs space-y-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-emerald-500/50 group cursor-default"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#0D1117] border border-[#30363D] group-hover:border-emerald-500/60 flex items-center justify-center text-emerald-400 transition-colors shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#8B949E] group-hover:text-emerald-400 transition-colors">
                    [{c.tag}]
                  </span>
                </div>

                <h3 className="font-mono text-sm sm:text-base font-bold text-[#F0F6FC] group-hover:text-white leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-[#8B949E] leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
