class AudioManager {
  constructor() {
    this.context = null
    this.sounds = {}
    this.enabled = false
  }

  async init() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
      this.enabled = true
      this.createSounds()
      return Promise.resolve()
    } catch (e) {
      console.warn('Audio not available:', e)
      return Promise.reject(e)
    }
  }

  createSounds() {
    this.sounds.ballHit = this.createTone(400, 0.1, 'square', 0.3)
    this.sounds.cushionHit = this.createTone(300, 0.15, 'sawtooth', 0.4)
    this.sounds.pocket = this.createTone(200, 0.3, 'sine', 0.6)
    this.sounds.cueShot = this.createTone(150, 0.2, 'triangle', 0.8)
  }

  createTone(frequency, duration, type = 'sine', volume = 0.5) {
    return () => {
      if (!this.enabled || !this.context) return
      
      const oscillator = this.context.createOscillator()
      const gainNode = this.context.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.context.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(volume, this.context.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration)
      
      oscillator.start(this.context.currentTime)
      oscillator.stop(this.context.currentTime + duration)
    }
  }

  play(soundName, volume = 1) {
    if (this.sounds[soundName]) {
      this.sounds[soundName](volume)
    }
  }

  enable() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume()
    }
    this.enabled = true
  }
}

export const audioManager = new AudioManager()