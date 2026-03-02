// Web Audio API Synthesizer Helper

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

// Initialize audio context only on first interaction to respect browser auto-play policies
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    // Resume if it was suspended
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Plays a clean, acoustic guitar "plunk" or piano note.
 */
export function playPlunk() {
    try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Pluck sound characteristics
        osc.type = 'sine'; // Sine wave for a clean, rounded sound

        // Randomize pitch slightly around C4 (261.63 Hz) to E4 for a nice plunk
        const freqs = [261.63, 293.66, 329.63, 349.23, 392.00]; // C4, D4, E4, F4, G4
        osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], t);

        // Envelope for a "plunk" (fast attack, exponential decay)
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.02); // Fast attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); // Decay

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.5);
    } catch (e) {
        console.warn("Audio playback failed:", e);
    }
}

/**
 * Plays a 4-part harmony chord (e.g. C major 7th) for a win state.
 */
export function playHarmony() {
    try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;

        // C Major 7th Chord spanning a couple of octaves for richness
        // C4, E4, G4, B4
        const chordFrequencies = [261.63, 329.63, 392.00, 493.88];

        // Master gain for the whole chord
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        // Envelope for the chord (swell up gently, then fade out)
        masterGain.gain.setValueAtTime(0, t);
        masterGain.gain.linearRampToValueAtTime(0.4, t + 0.3); // Swell to peak
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5); // Slow fade

        chordFrequencies.forEach((freq) => {
            const osc = ctx.createOscillator();

            // Mix of sine (vocals) and triangle (warmth)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            // Add slight vibrato/detune for a natural "aaaah" feel
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 5; // 5Hz vibrato
            lfoGain.gain.value = 3;  // Pitch variation amount
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start(t);
            lfo.stop(t + 3);

            osc.connect(masterGain);
            osc.start(t);
            osc.stop(t + 3);
        });

    } catch (e) {
        console.warn("Audio playback failed:", e);
    }
}
