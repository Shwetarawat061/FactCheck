import React, { useRef, useEffect } from 'react';
import { ArrowRight, CornerDownLeft } from 'lucide-react';

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
  placeholder = 'Enter a claim to verify...',
  autoFocus = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 1000;

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const isDisabled = !value.trim() || isLoading;

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 transition-all focus-within:border-stone-400 focus-within:shadow-md">
      
      {/* Top Header Label & Shortcut */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 text-xs">
        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-stone-700">
          Factual Statement
        </span>

        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
          <CornerDownLeft className="w-3 h-3" />
          <span>⌘ + Enter to verify</span>
        </span>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={isLoading}
          className="w-full resize-none border-0 p-0 text-base sm:text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 leading-relaxed font-serif"
        />

        <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
          <span className="font-mono text-xs text-stone-400">
            {value.length} / {maxLength}
          </span>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <span>Check This Claim</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
