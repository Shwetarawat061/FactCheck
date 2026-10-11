import React, { useEffect, useState } from 'react';
import { Terminal, Plus, ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  onNewCheck?: () => void;
  onNavigateSection?: (section: 'verify' | 'how-it-works' | 'examples' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewCheck,
  onNavigateSection,
}) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (isMounted) {
          setIsOnline(res.ok);
        }
      } catch {
        if (isMounted) {
          setIsOnline(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D1117]/90 backdrop-blur-md border-b border-[#30363D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Forensic Terminal Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#161B22] border border-[#30363D] text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-[#F0F6FC] text-base tracking-tight flex items-center gap-1.5">
              FACTCHECK<span className="text-emerald-400">.AI</span>
            </span>
            <span className="hidden md:inline-block font-mono text-[10px] text-[#8B949E] px-1.5 py-0.5 rounded border border-[#30363D] bg-[#161B22]">
              FORENSIC_ENGINE
            </span>

            {/* Pulse ping dot live status */}
            {isOnline === false ? (
              <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-rose-900/40 bg-rose-950/20 text-rose-400 text-[10px] font-mono uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span>OFFLINE</span>
              </span>
            ) : isOnline ? (
              <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-emerald-900/50 bg-emerald-950/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">LIVE_AUDIT</span>
                <span className="sm:hidden">LIVE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded border border-[#30363D] bg-[#161B22] text-[#8B949E] text-[10px] font-mono uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B949E] animate-pulse"></span>
                <span>SYNCING</span>
              </span>
            )}
          </div>
        </div>

        {/* Monospace Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-[#8B949E]">
          <a 
            href="#verify" 
            data-cursor="READ"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('verify');
            }}
            className="hover:text-emerald-400 hover:underline underline-offset-4 transition-colors"
          >
            // VERIFY_CLAIM
          </a>
          <a 
            href="#how-it-works" 
            data-cursor="READ"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('how-it-works');
            }}
            className="hover:text-emerald-400 hover:underline underline-offset-4 transition-colors"
          >
            // PIPELINE
          </a>
          <a 
            href="#examples" 
            data-cursor="READ"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('examples');
            }}
            className="hover:text-emerald-400 hover:underline underline-offset-4 transition-colors"
          >
            // DOSSIERS
          </a>
          <a 
            href="#about" 
            data-cursor="READ"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('about');
            }}
            className="hover:text-emerald-400 hover:underline underline-offset-4 transition-colors"
          >
            // AUDIT_SPEC
          </a>
        </nav>

        {/* Action Button: + New Inquest */}
        <div className="flex items-center gap-3">
          {onNewCheck && (
            <button
              type="button"
              data-cursor="VERIFY"
              onClick={onNewCheck}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] hover:border-emerald-500/50 text-[#F0F6FC] hover:text-emerald-300 font-mono text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer hover:-translate-y-0.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>NEW_CLAIM</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
