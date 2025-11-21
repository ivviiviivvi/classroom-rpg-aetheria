type SoundEffect = 'planet-click' | 'quest-complete' | 'quest-fail' | 'level-up' | 'artifact-drop' | 'crystal-attune'

class SoundEffectPlayer {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private enabled: boolean = true

  private initAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = 0.3
      this.masterGain.connect(this.audioContext.destination)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.initAudio()
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  play(effect: SoundEffect) {
    if (!this.enabled) return
    
    this.initAudio()
    if (!this.audioContext || !this.masterGain) return

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }

    switch (effect) {
      case 'planet-click':
        this.playPlanetClick()
        break
      case 'quest-complete':
        this.playQuestComplete()
        break
      case 'quest-fail':
        this.playQuestFail()
        break
      case 'level-up':
        this.playLevelUp()
        break
      case 'artifact-drop':
        this.playArtifactDrop()
        break
      case 'crystal-attune':
        this.playCrystalAttune()
        break
    }
  }

  private playPlanetClick() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const osc1 = this.audioContext.createOscillator()
    const osc2 = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc1.type = 'sine'
    osc2.type = 'sine'
    
    osc1.frequency.setValueAtTime(400, now)
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    
    osc2.frequency.setValueAtTime(600, now)
    osc2.frequency.exponentialRampToValueAtTime(800, now + 0.1)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.masterGain)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.15)
    osc2.stop(now + 0.15)
  }

  private playQuestComplete() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const frequencies = [523.25, 659.25, 783.99, 1046.50]
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.1)

      gain.gain.setValueAtTime(0, now + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3)

      osc.connect(gain)
      gain.connect(this.masterGain!)

      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.3)
    })
  }

  private playQuestFail() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.5)
  }

  private playLevelUp() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const frequencies = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + i * 0.08)

      gain.gain.setValueAtTime(0, now + i * 0.08)
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.4)

      osc.connect(gain)
      gain.connect(this.masterGain!)

      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 0.4)
    })
  }

  private playArtifactDrop() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    
    const osc1 = this.audioContext.createOscillator()
    const osc2 = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    osc1.type = 'sine'
    osc2.type = 'triangle'
    
    osc1.frequency.setValueAtTime(1200, now)
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.3)
    
    osc2.frequency.setValueAtTime(1600, now)
    osc2.frequency.exponentialRampToValueAtTime(1000, now + 0.3)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.masterGain)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.4)
    osc2.stop(now + 0.4)
  }

  private playCrystalAttune() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    
    for (let i = 0; i < 3; i++) {
      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.15)

      gain.gain.setValueAtTime(0, now + i * 0.15)
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.5)

      osc.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.5)
    }
  }
}

export const soundEffects = new SoundEffectPlayer()
