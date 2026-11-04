import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, CornerDownLeft, Terminal, Volume2, VolumeX } from 'lucide-react';
import { playKeypressSound, isTerminalSoundMuted, toggleTerminalSound } from '../services/terminalAudio';

interface ClaimInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const ClaimInput: React.FC<ClaimInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Enter any factual assertion, quote, or claim to verify...',
  autoFocus = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;
  const [isMuted, setIsMuted] = useState<boolean>(() => isTerminalSoundMuted());

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleToggleAudio = () => {
    const nextMuted = toggleTerminalSound();
    setIsMuted(nextMuted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Enter key handling
    if (e.key === 'Enter') {
      playKeypressSound('enter');
      // Submit on Enter (without Shift) OR on Cmd/Ctrl + Enter
      if (!e.shiftKey || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (value.trim() && !isLoading) {
          onSubmit();
        }
      }
      return;
    }

    // 2. Backspace / Delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      playKeypressSound('backspace');
      return;
    }

    // 3. Spacebar
    if (e.key === ' ') {
      playKeypressSound('space');
      return;
    }

    // 4. Regular characters (ignore isolated navigation & modifier keys)
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
    <div className="w-full bg-[#161B22] rounded-xl border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] p-5 sm:p-6 transition-all duration-200 hover:border-emerald-400/70 focus-within:border-emerald-400 focus-within:shadow-[0_0_35px_rgba(16,185,129,0.3)] relative">
      
      {/* Top Header Label, Audio FX Toggle, & Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-3.5 border-b border-[#30363D]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#F0F6FC]">
            // FACTUAL_STATEMENT_INPUT
          </span>
          <span className="font-mono text-[10px] text-emerald-400/90 px-1.5 py-0.5 rounded border border-emerald-900/50 bg-emerald-950/30">
            TEXT_INQUEST
          </span>
        </div>

        {/* Right Header Controls: Audio FX toggle & Shortcut */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
              !isMuted
                ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 shadow-2xs'
                : 'border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:text-[#C9D1D9] hover:border-[#484F58]'
            }`}
            title={isMuted ? 'Enable mechanical terminal keystroke sound effects' : 'Mute mechanical terminal keystroke sound effects'}
            aria-label={isMuted ? 'Keystroke sound effects muted' : 'Keystroke sound effects active'}
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

          <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#8B949E]">
            <CornerDownLeft className="w-3 h-3 text-emerald-400" />
            <span>ENTER TO VERIFY <span className="text-[#484F58]">·</span> SHIFT+ENTER FOR NEWLINE</span>
          </div>
        </div>
      </div>

      {/* Primary Input Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={isLoading}
          className="w-full resize-none border-0 bg-transparent p-0 text-base sm:text-lg text-[#F0F6FC] placeholder:text-[#484F58] focus:outline-none focus:ring-0 leading-relaxed font-mono selection:bg-emerald-500/30 selection:text-emerald-200"
        />

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#30363D]">
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
            <span>{value.length} / {maxLength} CHARACTERS</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#21262D] text-[#0D1117] disabled:text-[#484F58] font-mono text-xs sm:text-sm font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-[0.98] cursor-pointer hover:-translate-y-0.5"
          >
            <span>AUDIT_CLAIM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
