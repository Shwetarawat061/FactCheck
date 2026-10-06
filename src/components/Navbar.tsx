import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif font-black text-sm tracking-tighter shadow-2xs">
            FC
          </div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-900 text-lg tracking-tight">
              FactCheckAI
            </span>
            {isOnline === false ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                Offline
              </span>
            ) : isOnline ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Backend Online
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-stone-500 border border-stone-200">
                Connecting
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
          <a 
            href="#verify" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('verify');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            Verify Claim
          </a>
          <a 
            href="#how-it-works" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('how-it-works');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#examples" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('examples');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            Examples
          </a>
          <a 
            href="#about" 
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection?.('about');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            About
          </a>
        </nav>

        {/* Action Button: + New Check */}
        <div className="flex items-center gap-3">
          {onNewCheck && (
            <button
              type="button"
              onClick={onNewCheck}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Check</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
