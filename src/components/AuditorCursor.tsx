import React, { useEffect, useRef, useState } from 'react';

type IndicatorState = 'IDLE' | 'VERIFY' | 'QUERY' | 'READ' | 'FACT';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface LensPulse {
  id: number;
  x: number;
  y: number;
}

export const AuditorCursor: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [cursorState, setCursorState] = useState<IndicatorState>('IDLE');
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [pulses, setPulses] = useState<LensPulse[]>([]);

  // Direct 60/120fps physics mutable refs
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const lensPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const trailPoints = useRef<Point[]>([]);

  const dotRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only enable on desktop / fine-pointer devices (mouse/trackpad, not touch)
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      setIsEnabled(false);
      return;
    }

    // Enable custom cursor styles on body
    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Record trail point
      trailPoints.current.unshift({ x: e.clientX, y: e.clientY, time: now });
      if (trailPoints.current.length > 8) {
        trailPoints.current.pop();
      }

      // Detect interactive element category
      const target = e.target as HTMLElement | null;
      if (target) {
        const customCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        if (customCursor) {
          const upper = customCursor.toUpperCase();
          if (upper.includes('VERIFY') || upper.includes('AUDIT')) {
            setCursorState('VERIFY');
            return;
          } else if (upper.includes('QUERY') || upper.includes('INPUT')) {
            setCursorState('QUERY');
            return;
          } else if (upper.includes('READ') || upper.includes('LINK') || upper.includes('NAV')) {
            setCursorState('READ');
            return;
          } else if (upper.includes('FACT') || upper.includes('CHIP') || upper.includes('DOSSIER')) {
            setCursorState('FACT');
            return;
          }
        }

        // Automatic element heuristics for universal everyday fact-checking
        const inputEl = target.closest('textarea, input, [contenteditable="true"]');
        if (inputEl) {
          setCursorState('QUERY');
          return;
        }

        const buttonEl = target.closest('button, [role="button"]');
        if (buttonEl) {
          const text = (buttonEl.textContent || '').trim().toLowerCase();
          if (
            text.includes('verify') ||
            text.includes('audit') ||
            text.includes('check') ||
            text.includes('search') ||
            buttonEl.classList.contains('bg-emerald-500')
          ) {
            setCursorState('VERIFY');
            return;
          } else if (text.includes('query') || text.includes('new')) {
            setCursorState('VERIFY');
            return;
          } else {
            setCursorState('FACT');
            return;
          }
        }

        const linkEl = target.closest('a, .citation-link, [data-source-url]');
        if (linkEl) {
          setCursorState('READ');
          return;
        }

        const factEl = target.closest(
          '[data-dossier], [data-category], .cursor-pointer, .evidence-card, .verdict-badge'
        );
        if (factEl) {
          setCursorState('FACT');
          return;
        }

        // Default neutral lens
        setCursorState('IDLE');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newPulse: LensPulse = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setPulses((prev) => [...prev.slice(-3), newPulse]);
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
      }, 500);
    };

    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Smooth physics loop
    let animId: number;
    const updatePhysics = () => {
      const now = Date.now();

      // 1. Instant precision focal dot at mouse coordinates
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Smooth trailing lens interpolation
      const dx = mousePos.current.x - lensPos.current.x;
      const dy = mousePos.current.y - lensPos.current.y;
      lensPos.current.x += dx * 0.24;
      lensPos.current.y += dy * 0.24;

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${lensPos.current.x}px, ${lensPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 3. Delicate luminous optical trail
      const canvas = trailCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          trailPoints.current = trailPoints.current.filter((p) => now - p.time < 220);
          const pts = trailPoints.current;

          if (pts.length > 1) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < pts.length - 1; i++) {
              const p1 = pts[i];
              const p2 = pts[i + 1];
              const age = (now - p1.time) / 220;
              const alpha = Math.max(0, 1 - age) * 0.28;

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
              ctx.lineWidth = Math.max(1.5, (1 - age) * 3);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);

    const resizeCanvas = () => {
      if (trailCanvasRef.current) {
        trailCanvasRef.current.width = window.innerWidth;
        trailCanvasRef.current.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animId);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (!isEnabled) return null;

  const isMorphed = cursorState !== 'IDLE';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Delicate optical trail canvas */}
      <canvas ref={trailCanvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Optical Verification Click Waves */}
      {pulses.map((pulse) => (
        <div
          key={pulse.id}
          style={{
            transform: `translate3d(${pulse.x}px, ${pulse.y}px, 0) translate(-50%, -50%)`,
          }}
          className="absolute top-0 left-0 w-8 h-8 rounded-full border border-emerald-400/80 pointer-events-none animate-ping opacity-75 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        />
      ))}

      {/* Center Precision Focal Dot (0 Latency) */}
      <div
        ref={dotRef}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
      >
        <div
          className={`w-[6px] h-[6px] rounded-full transition-all duration-150 ${
            isClicking
              ? 'scale-75 bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,1)]'
              : isMorphed
              ? 'scale-110 bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]'
              : 'bg-emerald-400/90 shadow-[0_0_4px_rgba(16,185,129,0.6)]'
          }`}
        />
      </div>

      {/* Universal Inspection Lens & Morphing Verification Ring */}
      <div
        ref={lensRef}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
        className={`absolute top-0 left-0 pointer-events-none will-change-transform transition-all duration-200 ease-out flex items-center justify-center ${
          isMorphed
            ? 'h-7 px-3 rounded-full border border-emerald-500/80 bg-[#0D1117]/95 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.4)] backdrop-blur-xs gap-1.5'
            : isClicking
            ? 'w-7 h-7 rounded-full border border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.4)] scale-90'
            : 'w-8 h-8 rounded-full border border-[#8B949E]/50 hover:border-emerald-500/60 bg-[#161B22]/30 shadow-[0_0_8px_rgba(0,0,0,0.4)]'
        }`}
      >
        {isMorphed ? (
          <>
            {/* Live Indicator Dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />

            {/* Live Status Label: VERIFY | QUERY | READ | FACT */}
            <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-300 uppercase leading-none">
              {cursorState}
            </span>
          </>
        ) : (
          /* Idle Clean Inspection Ring Accent */
          <span className="w-1 h-1 rounded-full bg-[#8B949E]/30" />
        )}
      </div>
    </div>
  );
};
