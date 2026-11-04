// Retro Terminal / Typewriter Synthesizer using Web Audio API
// Self-contained, zero external asset dependencies, instant tactile response.

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

// Check stored audio preference if available
try {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('factcheck_terminal_audio_muted');
    if (stored !== null) {
      isAudioMuted = stored === 'true';
    }
  }
} catch {
  // Ignore storage restrictions
}

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

// Global user-gesture unlocker to bypass browser autoplay policies immediately
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((event) => {
    window.addEventListener(event, unlockAudio, { passive: true, capture: true });
  });
}

export function isTerminalSoundMuted(): boolean {
  return isAudioMuted;
}

export function toggleTerminalSound(): boolean {
  isAudioMuted = !isAudioMuted;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('factcheck_terminal_audio_muted', String(isAudioMuted));
    }
  } catch {}

  // When unmuted, immediately unlock and play a clear feedback sound
  if (!isAudioMuted) {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        playTerminalSound('start');
      }).catch(() => {
        playTerminalSound('key');
      });
    } else {
      playTerminalSound('start');
    }
  }

  return isAudioMuted;
}

export type TerminalSoundType =
  | 'key'
  | 'enter'
  | 'backspace'
  | 'space'
  | 'click'
  | 'start'
  | 'success'
  | 'error';

/**
 * Synthesizes vintage mechanical typewriter and retro terminal cyber sounds.
 */
function playToneSequence(ctx: AudioContext, type: TerminalSoundType): void {
  const now = ctx.currentTime;

  // 1. Terminal Initiation Chirp
  if (type === 'start') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.04);
    osc.frequency.setValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
    return;
  }

  // 2. Success / Dossier Verified Chime
  if (type === 'success') {
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.045;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.16, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
    return;
  }

  // 3. Warning / Error Buzz
  if (type === 'error') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(160, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
    return;
  }

  // 4. Clean UI Button Click
  if (type === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
    return;
  }

  // 5. Mechanical Terminal / Typewriter Keystroke
  const masterGain = ctx.createGain();
  // Distinct, clearly audible volume
  masterGain.gain.setValueAtTime(type === 'enter' ? 0.28 : 0.22, now);
  masterGain.connect(ctx.destination);

  // A. High-frequency click transient (striker impact)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  const jitter = 0.94 + Math.random() * 0.12;
  let baseFreq = 1800 * jitter;
  let duration = 0.025;

  if (type === 'enter') {
    baseFreq = 950 * jitter;
    duration = 0.055;
  } else if (type === 'backspace') {
    baseFreq = 1400 * jitter;
    duration = 0.032;
  } else if (type === 'space') {
    baseFreq = 1200 * jitter;
    duration = 0.03;
  }

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + duration);

  oscGain.gain.setValueAtTime(0.9, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration);

  // B. Mechanical body resonance thud (keyboard switch chassis)
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  const thudDuration = type === 'enter' ? 0.06 : 0.035;

  thud.type = 'sine';
  const thudFreq = type === 'enter' ? 130 : 190 + Math.random() * 40;
  thud.frequency.setValueAtTime(thudFreq, now);
  thud.frequency.exponentialRampToValueAtTime(50, now + thudDuration);

  thudGain.gain.setValueAtTime(0.65, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + thudDuration);

  thud.connect(thudGain);
  thudGain.connect(masterGain);
  thud.start(now);
  thud.stop(now + thudDuration);

  // C. Platen/spring friction noise burst
  const sampleRate = ctx.sampleRate || 44100;
  const bufferSize = Math.max(1, Math.floor(sampleRate * 0.015));
  const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(type === 'enter' ? 1400 : 3200 * jitter, now);
  filter.Q.setValueAtTime(2.2, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.45, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(masterGain);

  whiteNoise.start(now);
}

/**
 * Main public sound trigger with automatic AudioContext wake-up.
 */
export function playTerminalSound(type: TerminalSoundType = 'key'): void {
  if (isAudioMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        playToneSequence(ctx, type);
      }).catch(() => {});
      return;
    }

    playToneSequence(ctx, type);
  } catch {
    // Fail gracefully if audio is unsupported
  }
}

// Backward-compatible alias for existing imports
export const playKeypressSound = playTerminalSound;
export type KeySoundType = TerminalSoundType;
