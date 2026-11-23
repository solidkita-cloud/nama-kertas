import type { Rasa } from '../types';

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentRasa: Rasa | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.25; // default 25% quiet volume as per PRD
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private intervalIds: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentRasa(): Rasa | null {
    return this.currentRasa;
  }

  public play(rasa: Rasa) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentRasa === rasa) {
      return;
    }

    this.stopAllSoundGenerators();
    this.currentRasa = rasa;
    this.isPlaying = true;

    switch (rasa) {
      case 'KALUT':
        this.generateKalutRain();
        break;
      case 'GUNJING':
        this.generateGunjingClockPiano();
        break;
      case 'HARDIK':
        this.generateHardikLowDrone();
        break;
      case 'RINDU':
        this.generateRinduSeaPluck();
        break;
      case 'TENANG':
        this.generateTenangBreeze();
        break;
    }
  }

  public pause() {
    if (!this.isPlaying) return;
    this.stopAllSoundGenerators();
    this.isPlaying = false;
  }

  private stopAllSoundGenerators() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];

    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
  }

  // 1. KALUT: Gentle pink noise rain + low contemplative drone
  private generateKalutRain() {
    if (!this.ctx || !this.masterGain) return;

    // White/Pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start();

    // Subtle warm sub-drone (F1 ~ 43.65Hz)
    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();

    this.activeNodes.push(whiteNoise, filter, gain, drone, droneGain);
  }

  // 2. GUNJING: Antique ticking clock + distant gentle piano notes
  private generateGunjingClockPiano() {
    if (!this.ctx || !this.masterGain) return;

    // Antique clock tick interval (1 second)
    const tickInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }, 1000);

    // Distant piano-like tones every ~4.5 seconds
    const pianoNotes = [220, 261.63, 293.66, 329.63, 392.00]; // A3, C4, D4, E4, G4
    const pianoInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const freq = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 3.0);
      osc2.stop(this.ctx.currentTime + 3.0);
    }, 4500);

    this.intervalIds.push(tickInterval, pianoInterval);
  }

  // 3. HARDIK: Heavy cello tone + slow wind sweep
  private generateHardikLowDrone() {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65.41, this.ctx.currentTime); // C2

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.Q.setValueAtTime(4, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    // LFO for slow vibrato
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.3, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    lfo.start();

    this.activeNodes.push(osc, filter, gain, lfo, lfoGain);
  }

  // 4. RINDU: Ocean wave swell + warm acoustic guitar arpeggio
  private generateRinduSeaPluck() {
    if (!this.ctx || !this.masterGain) return;

    // Ocean swell noise
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(300, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    // LFO for ocean wave swells (7 second period)
    const swellLfo = this.ctx.createOscillator();
    swellLfo.frequency.setValueAtTime(0.14, this.ctx.currentTime);
    const swellGain = this.ctx.createGain();
    swellGain.gain.setValueAtTime(180, this.ctx.currentTime);
    swellLfo.connect(swellGain);
    swellGain.connect(waveFilter.frequency);

    noise.connect(waveFilter);
    waveFilter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    swellLfo.start();

    // Warm plucked guitar notes every 3.2 seconds
    const guitarNotes = [196.0, 246.94, 293.66, 392.0, 440.0]; // G3, B3, D4, G4, A4
    const pluckInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const note = guitarNotes[Math.floor(Math.random() * guitarNotes.length)];
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(note * 2, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start();
      oscHarmonic.start();
      osc.stop(this.ctx.currentTime + 2.4);
      oscHarmonic.stop(this.ctx.currentTime + 2.4);
    }, 3200);

    this.activeNodes.push(noise, waveFilter, waveGain, swellLfo, swellGain);
    this.intervalIds.push(pluckInterval);
  }

  // 5. TENANG: Gentle morning breeze + calm harmonic breath
  private generateTenangBreeze() {
    if (!this.ctx || !this.masterGain) return;

    // Soft airy chord (D major 9th warm pad)
    const chordFreqs = [146.83, 220.0, 277.18, 329.63, 440.0];
    chordFreqs.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      // Tremolo
      const tremolo = this.ctx.createOscillator();
      tremolo.frequency.setValueAtTime(0.18 + Math.random() * 0.1, this.ctx.currentTime);
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      tremolo.connect(tremoloGain);
      tremoloGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      tremolo.start();
      this.activeNodes.push(osc, gain, tremolo, tremoloGain);
    });
  }
}

export const audioEngine = new ProceduralAudioEngine();
