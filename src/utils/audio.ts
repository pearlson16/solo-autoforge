// High-fidelity procedural Web Audio API sound synthesizer
class SoundFX {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private pinkNoiseBuffer: AudioBuffer | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Dynamics compressor to prevent digital clipping/distortion
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);

        // Pre-generate noise buffers for organic textures (whooshes, sparks, crunches)
        this.generateNoiseBuffers();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private generateNoiseBuffers() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds

    // 1. White noise
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // 2. Pink noise (for deeper, warmer rumbles & crunches)
    this.pinkNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const pinkOutput = this.pinkNoiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pinkOutput[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  private getDestination(): AudioNode | null {
    return this.masterGain || this.ctx?.destination || null;
  }

  // =========================================================================
  // 1. FORGE & CRAFTING SOUNDS
  // =========================================================================

  /**
   * Realistic metallic anvil strike with inharmonic resonance, spark crunch,
   * and optional high-rarity crystal shimmer.
   */
  playHammer(rarity?: string) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;
      const pitchJitter = 0.96 + Math.random() * 0.08; // Natural organic variance

      // 1. Anvil Body Resonance (Solid low-mid steel ring)
      const baseFreq = 520 * pitchJitter;
      const oscBody = this.ctx.createOscillator();
      const gainBody = this.ctx.createGain();
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(baseFreq, now);
      oscBody.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.22);
      gainBody.gain.setValueAtTime(0.28, now);
      gainBody.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      oscBody.connect(gainBody);
      gainBody.connect(dest);
      oscBody.start(now);
      oscBody.stop(now + 0.23);

      // 2. High Metallic Inharmonic Overtones (Realistic anvil ping)
      const partials = [1760, 2850, 4120];
      partials.forEach((pFreq, idx) => {
        if (!this.ctx) return;
        const oscClang = this.ctx.createOscillator();
        const gainClang = this.ctx.createGain();
        oscClang.type = 'sine';
        oscClang.frequency.setValueAtTime(pFreq * pitchJitter, now);
        oscClang.frequency.exponentialRampToValueAtTime(pFreq * 0.85 * pitchJitter, now + 0.15);

        const vol = 0.18 / (idx + 1);
        gainClang.gain.setValueAtTime(vol, now);
        gainClang.gain.exponentialRampToValueAtTime(0.001, now + 0.15 - idx * 0.03);
        oscClang.connect(gainClang);
        gainClang.connect(dest);
        oscClang.start(now);
        oscClang.stop(now + 0.16);
      });

      // 3. Spark Friction / Hammer Contact Burst (Filtered White Noise)
      if (this.noiseBuffer) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(3600 * pitchJitter, now);
        noiseFilter.Q.setValueAtTime(3.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.22, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(dest);
        noiseSrc.start(now);
        noiseSrc.stop(now + 0.09);
      }

      // 4. High-tier crystalline shimmer for Legendary & Mythic items
      const isHighTier =
        rarity === 'Legendary' ||
        rarity === 'Mythic' ||
        rarity === 'Transcendent' ||
        rarity === 'Epic';
      if (isHighTier) {
        const crystalChords = rarity === 'Mythic' || rarity === 'Transcendent' ? [1568, 2093, 3136] : [1318, 1760];
        crystalChords.forEach((freq, idx) => {
          if (!this.ctx) return;
          const oscC = this.ctx.createOscillator();
          const gainC = this.ctx.createGain();
          oscC.type = 'sine';
          oscC.frequency.setValueAtTime(freq, now + 0.04 * idx);
          gainC.gain.setValueAtTime(0.001, now);
          gainC.gain.linearRampToValueAtTime(0.12, now + 0.04 * idx + 0.02);
          gainC.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + 0.04 * idx);

          oscC.connect(gainC);
          gainC.connect(dest);
          oscC.start(now + 0.04 * idx);
          oscC.stop(now + 0.36 + 0.04 * idx);
        });
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Distinct Armor & Gear Equip sound: Leather buckle snap + metallic slide lock.
   */
  playEquip(rarity?: string) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Heavy leather buckle snap
      const oscSnap = this.ctx.createOscillator();
      const gainSnap = this.ctx.createGain();
      oscSnap.type = 'triangle';
      oscSnap.frequency.setValueAtTime(320, now);
      oscSnap.frequency.exponentialRampToValueAtTime(80, now + 0.09);
      gainSnap.gain.setValueAtTime(0.3, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      oscSnap.connect(gainSnap);
      gainSnap.connect(dest);
      oscSnap.start(now);
      oscSnap.stop(now + 0.1);

      // 2. Metallic slide/lock click
      const oscLock = this.ctx.createOscillator();
      const gainLock = this.ctx.createGain();
      oscLock.type = 'sine';
      oscLock.frequency.setValueAtTime(1400, now + 0.04);
      oscLock.frequency.exponentialRampToValueAtTime(950, now + 0.14);
      gainLock.gain.setValueAtTime(0, now);
      gainLock.gain.linearRampToValueAtTime(0.22, now + 0.05);
      gainLock.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscLock.connect(gainLock);
      gainLock.connect(dest);
      oscLock.start(now + 0.04);
      oscLock.stop(now + 0.16);

      // 3. Shimmer if high rarity
      if (rarity === 'Legendary' || rarity === 'Mythic' || rarity === 'Transcendent') {
        const oscGlow = this.ctx.createOscillator();
        const gainGlow = this.ctx.createGain();
        oscGlow.type = 'sine';
        oscGlow.frequency.setValueAtTime(1760, now + 0.08);
        oscGlow.frequency.exponentialRampToValueAtTime(2640, now + 0.28);
        gainGlow.gain.setValueAtTime(0, now);
        gainGlow.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gainGlow.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        oscGlow.connect(gainGlow);
        gainGlow.connect(dest);
        oscGlow.start(now + 0.08);
        oscGlow.stop(now + 0.31);
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Dismantle / Scrap / Salvage: Crunchy metallic breakdown with clinking ore shards.
   */
  playSalvage() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Gritty metal crunch (Filtered pink noise with fast decay)
      if (this.pinkNoiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now);
        filter.frequency.exponentialRampToValueAtTime(350, now + 0.14);
        filter.Q.setValueAtTime(2.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.15);
      }

      // 2. Downward crunch pitch drop
      const oscCrunch = this.ctx.createOscillator();
      const gainCrunch = this.ctx.createGain();
      oscCrunch.type = 'sawtooth';
      oscCrunch.frequency.setValueAtTime(260, now);
      oscCrunch.frequency.exponentialRampToValueAtTime(65, now + 0.12);
      gainCrunch.gain.setValueAtTime(0.2, now);
      gainCrunch.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      oscCrunch.connect(gainCrunch);
      gainCrunch.connect(dest);
      oscCrunch.start(now);
      oscCrunch.stop(now + 0.13);

      // 3. Clinking scrap particles (2 tiny high pings)
      [1800, 2400].forEach((freq, i) => {
        if (!this.ctx) return;
        const oscShard = this.ctx.createOscillator();
        const gainShard = this.ctx.createGain();
        oscShard.type = 'sine';
        oscShard.frequency.setValueAtTime(freq + Math.random() * 200, now + 0.05 + i * 0.04);
        gainShard.gain.setValueAtTime(0, now);
        gainShard.gain.linearRampToValueAtTime(0.12, now + 0.05 + i * 0.04);
        gainShard.gain.exponentialRampToValueAtTime(0.001, now + 0.14 + i * 0.04);
        oscShard.connect(gainShard);
        gainShard.connect(dest);
        oscShard.start(now + 0.05 + i * 0.04);
        oscShard.stop(now + 0.15 + i * 0.04);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Stat / Gear Upgrade Chime: Bright, shimmering ascending arpeggio.
   */
  playUpgrade() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // Sparkling ascending major pentatonic arpeggio (C5 - E5 - G5 - B5 - C6)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.055);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + idx * 0.055);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.055 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.28);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Major Milestone / Forge Level-Up: Grand triumphant brass fanfare with golden chord cascade.
   */
  playForgeLevelUp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Deep triumphant brass foundation
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(130.81, now); // C3
      bassOsc.frequency.setValueAtTime(196.0, now + 0.2); // G3
      bassGain.gain.setValueAtTime(0.35, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      bassOsc.connect(bassGain);
      bassGain.connect(dest);
      bassOsc.start(now);
      bassOsc.stop(now + 0.66);

      // 2. Rising golden fanfare notes (C4, G4, C5, E5, G5, C6)
      const fanfare = [
        { f: 261.63, t: 0, d: 0.16 },
        { f: 392.0, t: 0.12, d: 0.16 },
        { f: 523.25, t: 0.22, d: 0.2 },
        { f: 659.25, t: 0.32, d: 0.22 },
        { f: 783.99, t: 0.42, d: 0.25 },
        { f: 1046.5, t: 0.54, d: 0.5 },
      ];

      fanfare.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + n.t);
        gain.gain.linearRampToValueAtTime(0.22, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 2. SHOP & TREASURE SOUNDS
  // =========================================================================

  /**
   * Ruby Chest Unlock: Mysterious lock mechanism + radiant magical treasure burst.
   */
  playChestOpen(tier: 'rare' | 'epic' | 'legendary' | 'mythic' = 'rare') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Mechanism unlock clicks
      [0, 0.06].forEach((t, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + i * 400, now + t);
        osc.frequency.exponentialRampToValueAtTime(200, now + t + 0.04);
        gain.gain.setValueAtTime(0.25, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + t);
        osc.stop(now + t + 0.05);
      });

      // 2. Mystical crescendo sweep
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweepOsc.type = 'sine';
      sweepOsc.frequency.setValueAtTime(330, now + 0.08);
      sweepOsc.frequency.exponentialRampToValueAtTime(1320, now + 0.28);
      sweepGain.gain.setValueAtTime(0, now);
      sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.24);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      sweepOsc.connect(sweepGain);
      sweepGain.connect(dest);
      sweepOsc.start(now + 0.08);
      sweepOsc.stop(now + 0.33);

      // 3. Radiant chest burst chords based on tier
      const chordsByTier: Record<string, number[]> = {
        rare: [587.33, 739.99, 880.0], // D Major
        epic: [659.25, 830.61, 987.77, 1318.5], // E Major 7
        legendary: [783.99, 987.77, 1174.66, 1567.98], // G Major 9
        mythic: [880.0, 1108.73, 1318.51, 1760.0, 2217.46], // A Major celestial
      };

      const notes = chordsByTier[tier] || chordsByTier.rare;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.26 + idx * 0.04);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + 0.26 + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.26 + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + 0.26 + idx * 0.04);
        osc.stop(now + 0.78);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Crisp, bright gold coin / resource purchase jingle.
   */
  playCoin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // Two bright metallic coin chimes in rapid succession
      const coins = [
        { f: 2349.32, t: 0 },
        { f: 3135.96, t: 0.06 },
      ];

      coins.forEach((c) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.f + (Math.random() * 80 - 40), now + c.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + c.t);
        gain.gain.linearRampToValueAtTime(0.18, now + c.t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.16);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + c.t);
        osc.stop(now + c.t + 0.18);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Divine Blessing Unlock: Ethereal celestial pad & sparkling bell chime.
   */
  playBlessing() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // Soft divine choir fifths (F#4, C#5, F#5, A#5)
      const choirNotes = [369.99, 554.37, 739.99, 932.33];
      choirNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.08 + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.68);
      });

      // High shimmering sparkle
      const sparkleNotes = [1479.98, 1864.66, 2217.46];
      sparkleNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.12 + idx * 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + 0.12 + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.12 + idx * 0.05 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + 0.12 + idx * 0.05);
        osc.stop(now + 0.52);
      });
    } catch {
      // Audio fallback
    }
  }

  // =========================================================================
  // 3. COMBAT & BATTLE SOUNDS
  // =========================================================================

  /**
   * Melee Blade Slash: Sharp aerodynamic swoosh with cutting metallic resonance.
   * Pitch is dynamically randomized so repeated combat strikes sound organic.
   */
  playSlash() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;
      const jitter = 0.92 + Math.random() * 0.16;

      // 1. Blade air whoosh (Swept bandpass noise)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800 * jitter, now);
        filter.frequency.exponentialRampToValueAtTime(600 * jitter, now + 0.12);
        filter.Q.setValueAtTime(3.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.13);
      }

      // 2. High blade cutting tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(160 * jitter, now + 0.11);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Ranged Shot: Crisp bow twang or high-velocity laser/projectile zip.
   */
  playRangedShot() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;
      const jitter = 0.94 + Math.random() * 0.12;

      // Fast downward laser/projectile whistle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(280 * jitter, now + 0.14);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      // Lowpass to give it punch
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2400, now);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Magic / Arcane Attack: Mysterious swirling energy pulse.
   */
  playMagicCast() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // FM synthesis for arcane magical resonance
      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierOsc = this.ctx.createOscillator();
      const carrierGain = this.ctx.createGain();

      modOsc.type = 'sine';
      modOsc.frequency.setValueAtTime(45, now);
      modGain.gain.setValueAtTime(300, now);
      modGain.gain.exponentialRampToValueAtTime(10, now + 0.22);
      modOsc.connect(modGain);
      modGain.connect(carrierOsc.frequency);

      carrierOsc.type = 'sine';
      carrierOsc.frequency.setValueAtTime(720, now);
      carrierOsc.frequency.exponentialRampToValueAtTime(240, now + 0.22);

      carrierGain.gain.setValueAtTime(0.24, now);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      carrierOsc.connect(carrierGain);
      carrierGain.connect(dest);

      modOsc.start(now);
      carrierOsc.start(now);
      modOsc.stop(now + 0.23);
      carrierOsc.stop(now + 0.23);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Physical Hit Impact: Punchy visceral thud with natural pitch variations.
   */
  playHit() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;
      const jitter = 0.92 + Math.random() * 0.16;

      // 1. Visceral sub-punch thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(45 * jitter, now + 0.11);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.12);

      // 2. Mid-range slap transient
      const oscMid = this.ctx.createOscillator();
      const gainMid = this.ctx.createGain();
      oscMid.type = 'sawtooth';
      oscMid.frequency.setValueAtTime(340 * jitter, now);
      oscMid.frequency.exponentialRampToValueAtTime(90 * jitter, now + 0.07);
      gainMid.gain.setValueAtTime(0.18, now);
      gainMid.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      oscMid.connect(gainMid);
      gainMid.connect(dest);
      oscMid.start(now);
      oscMid.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Heavy Critical Impact: Sub-bass boom + glass/armor crunch shockwave.
   */
  playCrit() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Sub-bass earthquake impact
      const oscSub = this.ctx.createOscillator();
      const gainSub = this.ctx.createGain();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(140, now);
      oscSub.frequency.exponentialRampToValueAtTime(28, now + 0.32);
      gainSub.gain.setValueAtTime(0.5, now);
      gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      oscSub.connect(gainSub);
      gainSub.connect(dest);
      oscSub.start(now);
      oscSub.stop(now + 0.33);

      // 2. Heavy crushing crunch (Pink noise low-pass sweep)
      if (this.pinkNoiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.25);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.26);
      }

      // 3. High shattering clash transient
      const oscClash = this.ctx.createOscillator();
      const gainClash = this.ctx.createGain();
      oscClash.type = 'square';
      oscClash.frequency.setValueAtTime(880, now);
      oscClash.frequency.exponentialRampToValueAtTime(110, now + 0.16);
      gainClash.gain.setValueAtTime(0.25, now);
      gainClash.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      oscClash.connect(gainClash);
      gainClash.connect(dest);
      oscClash.start(now);
      oscClash.stop(now + 0.17);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Agile Dodge / Evade: Silky aerodynamic air glide whoosh.
   */
  playDodge() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Airy whoosh (Bandpass noise)
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.14);
        filter.Q.setValueAtTime(2.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.15);
      }

      // 2. Rising smooth tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Burn DoT Tick: Short sizzling fire crackle.
   */
  playBurn() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200 + Math.random() * 600, now);
        filter.Q.setValueAtTime(4.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.09);
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Poison DoT Tick: Bubbling toxic squelch pop.
   */
  playPoison() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Victory Fanfare: Uplifting triumphant melody. Extra celebratory 6-note fanfare for Boss slain.
   */
  playVictory(isBoss: boolean = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      if (isBoss) {
        // Grand Boss Victory Fanfare (G4, C5, E5, G5, F5, G5 sustained)
        const melody = [
          { f: 392.0, t: 0, d: 0.12 },
          { f: 523.25, t: 0.11, d: 0.12 },
          { f: 659.25, t: 0.22, d: 0.14 },
          { f: 783.99, t: 0.34, d: 0.18 },
          { f: 698.46, t: 0.5, d: 0.14 },
          { f: 783.99, t: 0.62, d: 0.5 },
        ];

        melody.forEach((n) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, now + n.t);

          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0, now + n.t);
          gain.gain.linearRampToValueAtTime(0.24, now + n.t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now + n.t);
          osc.stop(now + n.t + n.d + 0.02);
        });
      } else {
        // Standard floor clear fanfare (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.38);
        });
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Defeat Sound: Somber descending minor progression with low gong decay.
   */
  playDefeat() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // Descending minor chord (D4, Bb3, G3)
      const minorNotes = [
        { f: 293.66, t: 0 },
        { f: 233.08, t: 0.16 },
        { f: 196.0, t: 0.32 },
      ];

      minorNotes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(450, now + n.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + n.t);
        gain.gain.linearRampToValueAtTime(0.22, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.45);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(dest);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.48);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Crisp subtle UI button click.
   */
  playButtonClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Key Drop Sound: Magical golden chime with resonant crystalline overtone.
   */
  playKeyDrop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      const notes = [1318.51, 1760.0, 2637.02, 3520.0];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.04 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.42);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Tech Tree Node Unlock: Cybernetic sci-fi power surge with shimmering chime.
   */
  playTechUnlock() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Cybernetic sub-bass power surge
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      oscBass.type = 'sawtooth';
      oscBass.frequency.setValueAtTime(80, now);
      oscBass.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      gainBass.gain.setValueAtTime(0.25, now);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      oscBass.connect(gainBass);
      gainBass.connect(dest);
      oscBass.start(now);
      oscBass.stop(now + 0.3);

      // 2. High-tech arpeggio (C5, G5, D#6, A#6)
      const sciFiNotes = [523.25, 783.99, 1244.51, 1864.66];
      sciFiNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.045);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + 0.06 + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.06 + idx * 0.045 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06 + idx * 0.045 + 0.35);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + 0.06 + idx * 0.045);
        osc.stop(now + 0.06 + idx * 0.045 + 0.38);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Dungeon Portal Enter: Deep dimensional rift whoosh with ethereal drone.
   */
  playDungeonEnter() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      // 1. Low mysterious drone sweep
      const oscDrone = this.ctx.createOscillator();
      const gainDrone = this.ctx.createGain();
      oscDrone.type = 'triangle';
      oscDrone.frequency.setValueAtTime(110, now);
      oscDrone.frequency.exponentialRampToValueAtTime(55, now + 0.6);
      gainDrone.gain.setValueAtTime(0.3, now);
      gainDrone.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      oscDrone.connect(gainDrone);
      gainDrone.connect(dest);
      oscDrone.start(now);
      oscDrone.stop(now + 0.68);

      // 2. Portal swoosh filter sweep
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.45);
        filter.Q.setValueAtTime(3.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.48);
      }
    } catch {
      // Audio fallback
    }
  }

  /**
   * Dungeon Victory Fanfare: Grand multi-layer fanfare celebrating full dungeon conquest.
   */
  playDungeonVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const dest = this.getDestination();
      if (!dest) return;
      const now = this.ctx.currentTime;

      const grandNotes = [
        { f: 261.63, t: 0, d: 0.15 },      // C4
        { f: 329.63, t: 0.12, d: 0.15 },   // E4
        { f: 392.0, t: 0.24, d: 0.18 },    // G4
        { f: 523.25, t: 0.38, d: 0.22 },   // C5
        { f: 659.25, t: 0.54, d: 0.25 },   // E5
        { f: 783.99, t: 0.72, d: 0.6 },    // G5
        { f: 1046.5, t: 0.85, d: 0.9 },    // C6
      ];

      grandNotes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0, now + n.t);
        gain.gain.linearRampToValueAtTime(0.25, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }
}

export const soundFx = new SoundFX();

