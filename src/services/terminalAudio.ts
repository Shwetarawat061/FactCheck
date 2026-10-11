// Retro Terminal / Typewriter Synthesizer using Web Audio API
// Self-contained, zero external asset dependencies, instant response.

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

// Check stored audio preference if available
try {
  const stored = localStorage.getItem('factcheck_terminal_audio_muted');
  if (stored !== null) {
    isAudioMuted = stored === 'true';
  }
} catch {
  // Ignore storage restrictions
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isTerminalSoundMuted(): boolean {
  return isAudioMuted;
}

export function toggleTerminalSound(): boolean {
  isAudioMuted = !isAudioMuted;
  try {
    localStorage.setItem('factcheck_terminal_audio_muted', String(isAudioMuted));
  } catch {}
  if (!isAudioMuted) {
    playKeypressSound('key');
  }
  return isAudioMuted;
}

export type KeySoundType = 'key' | 'enter' | 'backspace' | 'space';

/**
 * Plays a vintage typewriter / mechanical terminal click sound.
 */
export function playKeypressSound(type: KeySoundType = 'key'): void {
  if (isAudioMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master gain for subtle, gentle audio level
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.06, now);
    masterGain.connect(ctx.destination);

    // 1. High-frequency click / snap transient (typewriter striker)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    // Randomize base pitch slightly (+/- 8%) for authentic physical mechanical feel
    const jitter = 0.92 + Math.random() * 0.16;

    let baseFreq = 1600 * jitter;
    let duration = 0.022;

    if (type === 'enter') {
      baseFreq = 850 * jitter;
      duration = 0.045;
    } else if (type === 'backspace') {
      baseFreq = 1200 * jitter;
      duration = 0.028;
    } else if (type === 'space') {
      baseFreq = 1100 * jitter;
      duration = 0.025;
    }

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + duration);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration);

    // 2. Mechanical body resonance thud (keyboard chassis impact)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    const thudDuration = type === 'enter' ? 0.05 : 0.028;

    thud.type = 'sine';
    const thudFreq = type === 'enter' ? 140 : (180 + Math.random() * 30);
    thud.frequency.setValueAtTime(thudFreq, now);
    thud.frequency.exponentialRampToValueAtTime(50, now + thudDuration);

    thudGain.gain.setValueAtTime(0.5, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + thudDuration);

    thud.connect(thudGain);
    thudGain.connect(masterGain);

    thud.start(now);
    thud.stop(now + thudDuration);

    // 3. Subtle noise click burst (platen/spring friction)
    const bufferSize = Math.floor(ctx.sampleRate * 0.012);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(type === 'enter' ? 1200 : 2800 * jitter, now);
    filter.Q.setValueAtTime(2.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(now);
  } catch {
    // Fail quietly if audio context is blocked
  }
}
