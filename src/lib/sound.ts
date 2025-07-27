import { Howl, Howler } from 'howler'

interface SoundConfig {
  volume: number
  enabled: boolean
}

class SoundManager {
  private config: SoundConfig = {
    volume: 0.5,
    enabled: true
  }

  private sounds: Map<string, Howl> = new Map()

  constructor() {
    // Set global volume
    Howler.volume(this.config.volume)
  }

  // Create simple synthetic sounds using Web Audio API
  private createBeepSound(frequency: number, duration: number, type: OscillatorType = 'sine'): Howl {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create a buffer for the sound
    const sampleRate = audioContext.sampleRate
    const numSamples = sampleRate * duration
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    // Generate the tone
    for (let i = 0; i < numSamples; i++) {
      const time = i / sampleRate
      switch (type) {
        case 'sine':
          channelData[i] = Math.sin(2 * Math.PI * frequency * time) * 0.3
          break
        case 'square':
          channelData[i] = Math.sign(Math.sin(2 * Math.PI * frequency * time)) * 0.3
          break
        case 'triangle':
          channelData[i] = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * time)) * 0.3
          break
        default:
          channelData[i] = Math.sin(2 * Math.PI * frequency * time) * 0.3
      }
      
      // Apply fade out to prevent clicks
      if (i > numSamples * 0.8) {
        const fade = 1 - (i - numSamples * 0.8) / (numSamples * 0.2)
        channelData[i] *= fade
      }
    }

    // Convert buffer to data URL
    const offlineContext = new OfflineAudioContext(1, numSamples, sampleRate)
    const source = offlineContext.createBufferSource()
    source.buffer = buffer
    source.connect(offlineContext.destination)
    
    return new Howl({
      src: ['data:audio/wav;base64,'], // Placeholder - will be replaced with synthetic generation
      volume: 0.3
    })
  }

  public initializeSounds() {
    // Create synthetic sounds for different actions
    this.sounds.set('click', this.createBeepSound(800, 0.1))
    this.sounds.set('success', this.createBeepSound(600, 0.3))
    this.sounds.set('error', this.createBeepSound(300, 0.5))
    this.sounds.set('achievement', this.createBeepSound(800, 0.2))
    this.sounds.set('collect', this.createBeepSound(1000, 0.15))
  }

  public play(soundName: string) {
    if (!this.config.enabled) return

    const sound = this.sounds.get(soundName)
    if (sound) {
      sound.play()
    } else {
      // Fallback to simple beep
      this.playBeep(440, 0.1)
    }
  }

  // Simple beep using Web Audio API directly
  private playBeep(frequency: number, duration: number) {
    if (!this.config.enabled) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.warn('Audio playback failed:', error)
    }
  }

  public setVolume(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume))
    Howler.volume(this.config.volume)
  }

  public setEnabled(enabled: boolean) {
    this.config.enabled = enabled
  }

  public getConfig() {
    return { ...this.config }
  }
}

// Export singleton instance
export const soundManager = new SoundManager()

// React hook for easy usage
export function useSound() {
  const play = (soundName: string) => {
    soundManager.play(soundName)
  }

  const playSuccess = () => soundManager.play('success')
  const playError = () => soundManager.play('error')
  const playClick = () => soundManager.play('click')
  const playAchievement = () => soundManager.play('achievement')
  const playCollect = () => soundManager.play('collect')

  return {
    play,
    playSuccess,
    playError,
    playClick,
    playAchievement,
    playCollect,
    setVolume: soundManager.setVolume.bind(soundManager),
    setEnabled: soundManager.setEnabled.bind(soundManager),
    getConfig: soundManager.getConfig.bind(soundManager)
  }
}

// Initialize sounds when module loads
soundManager.initializeSounds()