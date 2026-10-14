import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowRight, 
  CornerDownLeft, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Globe, 
  SlidersHorizontal,
  Link as LinkIcon,
  HelpCircle,
  FileSearch,
  Check
} from 'lucide-react';
import { playKeypressSound, playTerminalSound, isTerminalSoundMuted, toggleTerminalSound } from '../services/terminalAudio';
import { CLAIM_CATEGORIES, SAMPLE_CLAIMS } from '../data/categories';

interface ClaimInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (optionalCategory?: string, optionalSourceUrl?: string) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const ClaimInput: React.FC<ClaimInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Paste a statement, news headline, or viral claim to verify...',
  autoFocus = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;
  const [isMuted, setIsMuted] = useState<boolean>(() => isTerminalSoundMuted());
  
  // Optional category and optional source link
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
  const [optionalSourceUrl, setOptionalSourceUrl] = useState<string>('');

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleToggleAudio = () => {
    const nextMuted = toggleTerminalSound();
    setIsMuted(nextMuted);
  };

  const handleSelectSample = (sampleClaimText: string) => {
    playTerminalSound('click');
    onChange(sampleClaimText);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      playKeypressSound('enter');
      if (!e.shiftKey || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (value.trim() && !isLoading) {
          onSubmit(selectedCategory !== 'all' ? selectedCategory : undefined, optionalSourceUrl.trim() || undefined);
        }
      }
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      playKeypressSound('backspace');
      return;
    }

    if (e.key === ' ') {
      playKeypressSound('space');
      return;
    }

    const ignoredKeys = new Set([
      'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab',
      'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown'
    ]);

    if (!ignoredKeys.has(e.key)) {
      playKeypressSound('key');
    }
  };

  const isDisabled = !value.trim() || isLoading;

  return (
    <div className="w-full bg-[#161B22] rounded-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.12)] p-5 sm:p-7 transition-all duration-200 hover:border-emerald-400/60 focus-within:border-emerald-400 focus-within:shadow-[0_0_40px_rgba(16,185,129,0.25)] relative">
      
      {/* Top Header Label: Friendly and clean claim input header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#30363D]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40">
            01 / CLAIM INPUT
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#F0F6FC] font-mono tracking-wide uppercase">
            TEXT VERIFICATION
          </span>
          <span className="hidden md:inline text-xs text-[#8B949E] font-sans">
            · Paste a statement or headline to begin.
          </span>
        </div>

        {/* Right Header Controls: Audio FX toggle & Options drawer */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-cursor="READ"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded border transition-all cursor-pointer ${
              showOptionalFields || selectedCategory !== 'all' || optionalSourceUrl
                ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                : 'border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:text-[#C9D1D9] hover:border-[#484F58]'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
            <span>{selectedCategory !== 'all' ? `Category: ${selectedCategory.toUpperCase()}` : 'Optional Filters'}</span>
          </button>

          <button
            type="button"
            data-cursor="AUDIO_TOGGLE"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded border transition-all cursor-pointer ${
              !isMuted
                ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 shadow-2xs'
                : 'border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:text-[#C9D1D9] hover:border-[#484F58]'
            }`}
            title={isMuted ? 'Enable typing sound effects' : 'Mute typing sound effects'}
            aria-label={isMuted ? 'Audio muted' : 'Audio active'}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>FX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-[#8B949E] shrink-0" />
                <span>FX: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Filter Drawer: Category Selector & Optional Source Link */}
      {showOptionalFields && (
        <div className="mb-4 p-4 rounded-lg bg-[#0D1117] border border-[#30363D] space-y-3.5 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#C9D1D9] font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Claim Category (Optional):
              </span>
              <span className="font-mono text-[10px] text-[#8B949E]">
                Helps focus evidence retrieval
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CLAIM_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { playTerminalSound('click'); setSelectedCategory(cat.id); }}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-[#0D1117] font-bold border-emerald-400 shadow-xs'
                        : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:border-[#484F58]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-[#C9D1D9] font-semibold flex items-center gap-1.5 mb-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              Direct Source or Article Link (Optional):
            </label>
            <input
              type="url"
              value={optionalSourceUrl}
              onChange={(e) => setOptionalSourceUrl(e.target.value)}
              placeholder="https://example.com/article-or-tweet"
              className="w-full px-3 py-1.5 rounded bg-[#161B22] border border-[#30363D] text-xs font-mono text-[#F0F6FC] placeholder:text-[#484F58] focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      )}

      {/* Primary Input Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          data-cursor="QUERY"
          onChange={(e) => {
            const nextVal = e.target.value.slice(0, maxLength);
            if (nextVal.length !== value.length) {
              playKeypressSound(nextVal.length > value.length ? 'key' : 'backspace');
            }
            onChange(nextVal);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={isLoading}
          className="w-full resize-none border-0 bg-transparent p-0 text-base sm:text-lg text-[#F0F6FC] placeholder:text-[#484F58] focus:outline-none focus:ring-0 leading-relaxed font-sans sm:font-mono selection:bg-emerald-500/30 selection:text-emerald-200"
        />

        {/* Interactive "TRY A SAMPLE" Quick Chips */}
        <div className="pt-3 border-t border-[#21262D] mt-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-[#8B949E] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            TRY A SAMPLE:
          </span>
          {SAMPLE_CLAIMS.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              type="button"
              data-cursor="FACT"
              onClick={() => handleSelectSample(sample.claim)}
              className="px-2.5 py-1 rounded bg-[#0D1117] hover:bg-[#21262D] border border-[#30363D] hover:border-emerald-500/50 text-[#C9D1D9] hover:text-white font-mono text-xs transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <span className="text-emerald-400 font-semibold">{sample.chipLabel}</span>
            </button>
          ))}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-3 border-t border-[#30363D]">
          
          <div className="flex items-center gap-3 text-xs font-mono text-[#8B949E]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{value.length} / {maxLength} CHARACTERS</span>
            </span>
            <span className="hidden sm:inline text-[#484F58]">·</span>
            <span className="hidden sm:inline text-[11px]">
              Press <kbd className="px-1 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-[#C9D1D9]">Enter</kbd> to verify
            </span>
          </div>

          <button
            type="button"
            data-cursor="VERIFY"
            onClick={() => {
              playKeypressSound('enter');
              onSubmit(selectedCategory !== 'all' ? selectedCategory : undefined, optionalSourceUrl.trim() || undefined);
            }}
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#21262D] text-[#0D1117] disabled:text-[#484F58] font-mono text-xs sm:text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] active:scale-[0.98] cursor-pointer hover:-translate-y-0.5"
          >
            <span>VERIFY CLAIM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
