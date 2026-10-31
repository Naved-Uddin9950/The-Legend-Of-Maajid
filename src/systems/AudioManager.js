/**
 * AudioManager.js
 * Comprehensive audio system powered by Web Audio API synthesis.
 * Provides zero-latency, cross-platform audio without needing external assets.
 * Supports Master, Music, SFX, and Dialogue volume channels.
 */

import { SaveManager } from './SaveManager.js';

export class AudioManager {
  static instance = null;

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.dialogueGain = null;

    this.settings = {
      master: 0.8,
      music: 0.7,
      sfx: 0.8,
      dialogue: 0.9,
      muted: false
    };

    // Synchronize initial volumes from saved settings if available
    try {
      const saved = SaveManager.getInstance().loadSettings();
      if (saved) {
        if (saved.masterVolume !== undefined) this.settings.master = saved.masterVolume / 100;
        if (saved.musicVolume !== undefined) this.settings.music = saved.musicVolume / 100;
        if (saved.sfxVolume !== undefined) this.settings.sfx = saved.sfxVolume / 100;
        if (saved.dialogueVolume !== undefined) this.settings.dialogue = saved.dialogueVolume / 100;
      }
    } catch (e) {}

    this.currentTrack = null;
    this.activeTrackNodes = [];
    this.musicTimer = null;

    this.initAudioContext();
  }

  applySettings(settings) {
    if (!settings) return;
    if (settings.masterVolume !== undefined) this.settings.master = Math.max(0, Math.min(1, settings.masterVolume / 100));
    if (settings.musicVolume !== undefined) this.settings.music = Math.max(0, Math.min(1, settings.musicVolume / 100));
    if (settings.sfxVolume !== undefined) this.settings.sfx = Math.max(0, Math.min(1, settings.sfxVolume / 100));
    if (settings.dialogueVolume !== undefined) this.settings.dialogue = Math.max(0, Math.min(1, settings.dialogueVolume / 100));
    this.updateGains();
  }

  initAudioContext() {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.dialogueGain = this.ctx.createGain();

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.dialogueGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.updateGains();

    // Unlock audio context on user touch/click
    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  updateGains() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const isMuted = this.settings.muted;

    this.masterGain.gain.setValueAtTime(isMuted ? 0 : this.settings.master, t);
    this.musicGain.gain.setValueAtTime(this.settings.music, t);
    this.sfxGain.gain.setValueAtTime(this.settings.sfx, t);
    this.dialogueGain.gain.setValueAtTime(this.settings.dialogue, t);
  }

  setVolume(channel, value) {
    if (this.settings[channel] !== undefined) {
      this.settings[channel] = Math.max(0, Math.min(1, value));
      this.updateGains();
    }
  }

  setMute(muted) {
    this.settings.muted = !!muted;
    this.updateGains();
  }

  // ==========================================
  // MUSIC TRACKS
  // ==========================================
  playMusic(trackName) {
    if (this.currentTrack === trackName) return;
    this.stopMusic();

    this.currentTrack = trackName;
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    switch (trackName) {
      case 'title':
        this.startTitleMusic();
        break;
      case 'tension':
        this.startTensionMusic();
        break;
      case 'muharram':
        this.startMuharramMusic();
        break;
      case 'reflection':
        this.startReflectionMusic();
        break;
      case 'tuition':
        this.startTuitionMusic();
        break;
      case 'exploration':
        this.startExplorationMusic();
        break;
      default:
        break;
    }
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.activeTrackNodes.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeTrackNodes = [];
    this.currentTrack = null;
  }

  // Title: Golden ambient melody with warm bass drone
  startTitleMusic() {
    if (!this.ctx) return;
    const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25]; // A minor pentatonic / serene
    let step = 0;

    const playStep = () => {
      if (this.currentTrack !== 'title' || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const note = notes[step % notes.length];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.9);

      // Deep drone note on every 4th step
      if (step % 4 === 0) {
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'triangle';
        drone.frequency.setValueAtTime(110, this.ctx.currentTime);
        droneGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.8);
        drone.connect(droneGain);
        droneGain.connect(this.musicGain);
        drone.start();
        drone.stop(this.ctx.currentTime + 3.0);
      }

      step++;
    };

    playStep();
    this.musicTimer = setInterval(playStep, 700);
  }

  // Tension Music: Chapter 1 Firoz confrontation
  startTensionMusic() {
    if (!this.ctx) return;
    let step = 0;
    const playStep = () => {
      if (this.currentTrack !== 'tension' || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const freq = step % 2 === 0 ? 73.42 : 77.78; // Low menacing D/Eb dissonance
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.48);
      step++;
    };
    playStep();
    this.musicTimer = setInterval(playStep, 350);
  }

  // Muharram: Ceremonial percussion and Elathalam (Chhayyam) metallic rhythm
  startMuharramMusic() {
    if (!this.ctx) return;
    let beat = 0;
    const playBeat = () => {
      if (this.currentTrack !== 'muharram' || !this.ctx) return;

      // Deep drum beat
      if (beat % 2 === 0) {
        this.playDrumBeat(90, 0.25);
      }

      // Elathalam brass chime on beats 1 and 3
      if (beat % 4 === 1 || beat % 4 === 3) {
        this.playElathalamClash(0.12);
      }

      beat++;
    };
    playBeat();
    this.musicTimer = setInterval(playBeat, 280);
  }

  // Reflection: Chapter 3 Change of Heart
  startReflectionMusic() {
    if (!this.ctx) return;
    const melody = [261.63, 329.63, 392, 329.63, 246.94, 293.66, 369.99, 293.66]; // Gentle reflective piano arpeggio
    let idx = 0;
    const playNote = () => {
      if (this.currentTrack !== 'reflection' || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[idx % melody.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
      idx++;
    };
    playNote();
    this.musicTimer = setInterval(playNote, 900);
  }

  // Tuition: Chapter 4 Study with Basharat Bhai
  startTuitionMusic() {
    if (!this.ctx) return;
    const studyNotes = [329.63, 392, 440, 493.88, 587.33, 493.88]; // Uplifting scholarly tone
    let idx = 0;
    const playNote = () => {
      if (this.currentTrack !== 'tuition' || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(studyNotes[idx % studyNotes.length], this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.85);
      idx++;
    };
    playNote();
    this.musicTimer = setInterval(playNote, 600);
  }

  // Exploration: Chapter 5 Adult Mohalla RPG
  startExplorationMusic() {
    if (!this.ctx) return;
    const coastalScale = [261.63, 293.66, 329.63, 349.23, 392, 440, 523.25];
    let step = 0;
    const playStep = () => {
      if (this.currentTrack !== 'exploration' || !this.ctx) return;
      // Melody
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const note = coastalScale[(step * 2) % coastalScale.length];
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);

      // Gentle acoustic bass
      if (step % 2 === 0) {
        const bass = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bass.type = 'triangle';
        bass.frequency.setValueAtTime(130.81, this.ctx.currentTime);
        bassGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        bass.connect(bassGain);
        bassGain.connect(this.musicGain);
        bass.start();
        bass.stop(this.ctx.currentTime + 0.55);
      }

      step++;
    };
    playStep();
    this.musicTimer = setInterval(playStep, 450);
  }

  // ==========================================
  // SOUND EFFECTS (SFX & INSTRUMENTS)
  // ==========================================
  playSFX(type) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.06);
        break;
      }

      case 'hover': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.04);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case 'typewriter': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750 + Math.random() * 150, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
        osc.connect(gain);
        gain.connect(this.dialogueGain);
        osc.start(t);
        osc.stop(t + 0.03);
        break;
      }

      case 'elathalam':
        this.playElathalamClash(0.35);
        break;

      case 'punch':
      case 'hit': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.2);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.23);
        break;
      }

      case 'knife_slash': {
        // High white-noise slash
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, t);
        noise.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        break;
      }

      case 'quest_complete': {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.2, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.45);
        });
        break;
      }

      case 'door': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.linearRampToValueAtTime(80, t + 0.3);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.32);
        break;
      }

      case 'footstep': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(110 + Math.random() * 20, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      default:
        break;
    }
  }

  // Realistic Elathalam (Chhayyam) brass clash
  playElathalamClash(intensity = 0.3) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Metallic ring frequencies
    const freqs = [1200, 1580, 2240, 3100];
    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(intensity * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  playDrumBeat(freq = 90, vol = 0.25) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }
}
