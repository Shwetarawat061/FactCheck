import React, { useState, useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';
import { playKeypressSound } from '../services/terminalAudio';

interface TerminalStreamingTextProps {
  text: string;
  speed?: number; // ms per tick
  chunkSize?: number; // chars per tick
  streamSound?: boolean;
  className?: string;
  onComplete?: () => void;
}

export const TerminalStreamingText: React.FC<TerminalStreamingTextProps> = ({
  text,
  speed = 14,
  chunkSize = 3,
  streamSound = true,
  className = '',
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const textRef = useRef<string>(text);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    textRef.current = text;
    setDisplayedLength(0);
    setIsStreaming(true);

    if (!text) {
      setIsStreaming(false);
      return;
    }

    let currentLen = 0;
    let tickCount = 0;

    const interval = setInterval(() => {
      currentLen += chunkSize;

      if (streamSound && tickCount % 3 === 0) {
        playKeypressSound('key');
      }
      tickCount++;

      if (currentLen >= text.length) {
        currentLen = text.length;
        setDisplayedLength(text.length);
        setIsStreaming(false);
        clearInterval(interval);
        onCompleteRef.current?.();
      } else {
        setDisplayedLength(currentLen);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text, speed, chunkSize, streamSound]);

  const handleSkip = () => {
    setDisplayedLength(text.length);
    setIsStreaming(false);
    onCompleteRef.current?.();
  };

  const displayedText = text.slice(0, displayedLength);

  return (
    <div className="relative group">
      <div className={className} aria-live="polite">
        {displayedText}
        {isStreaming && (
          <span
            className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Quick fast-forward button shown while stream is processing */}
      {isStreaming && (
        <button
          type="button"
          onClick={handleSkip}
          className="absolute -top-6 right-0 text-[10px] font-mono text-[#8B949E] hover:text-emerald-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-[#0D1117] border border-[#30363D] hover:border-emerald-500/50 cursor-pointer shadow-2xs"
          title="Skip streaming text and display full transmission immediately"
        >
          <FastForward className="w-2.5 h-2.5" />
          <span>FAST_FORWARD</span>
        </button>
      )}
    </div>
  );
};
