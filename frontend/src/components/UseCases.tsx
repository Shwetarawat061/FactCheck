import React from 'react';
import { Newspaper, GraduationCap, Users, ShieldAlert } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: Newspaper,
      title: 'Journalists & Fact-Checkers',
      desc: 'Rapidly cross-reference breaking viral assertions and quote sources with primary archival evidence before publishing.'
    },
    {
      icon: GraduationCap,
      title: 'Researchers & Academics',
      desc: 'Evaluate scientific, historical, and demographic claims against relevant public web search results.'
    },
    {
      icon: Users,
      title: 'Curious Readers',
      desc: 'Verify sensational social media rumors, dietary claims, and health advice with transparent citations.'
    },
    {
      icon: ShieldAlert,
      title: 'Policy & Analysts',
      desc: 'Audit policy claims, statistics, and white paper references against empirical public records.'
    }
  ];

  return (
    <section className="py-16 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase font-bold text-stone-500 tracking-wider">
            APPLICATIONS
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 mt-1">
            Built for High-Stakes Inquiry
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-serif">
            Designed for anyone seeking objective verification with auditable sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-900">
                  {c.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
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
