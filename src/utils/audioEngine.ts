// Web Audio API Synthesizer Engine for ProjectFlow AI
// Generates low-latency, high-fidelity alert chimes, chords, alarms, and emergency sirens directly in code.
// Zero external sound asset dependencies.

export type SoundEffectType =
  | 'direct_message'
  | 'channel_message'
  | 'mention'
  | 'task_assigned'
  | 'deadline_warning'
  | 'task_overdue'
  | 'approval_request'
  | 'approval_result'
  | 'meeting_reminder'
  | 'critical_risk'
  | 'emergency_alarm'
  | 'ai_recommendation';

export class WebAudioEngine {
  private static instance: WebAudioEngine;
  private audioCtx: AudioContext | null = null;
  private isAudioUnlocked = false;
  private emergencyIntervalId: any = null;
  private isEmergencyPlaying = false;

  private masterVolume = 0.8;
  private chatVolume = 0.8;
  private alertVolume = 0.9;
  private isMuted = false;
  private isDndActive = false;
  private soundOnlyForMentions = false;
  private quietHoursEnabled = false;
  private quietHoursStart = '22:00';
  private quietHoursEnd = '07:00';

  private constructor() {
    // Lazy AudioContext initialization on first user gesture
  }

  public static getInstance(): WebAudioEngine {
    if (!WebAudioEngine.instance) {
      WebAudioEngine.instance = new WebAudioEngine();
    }
    return WebAudioEngine.instance;
  }

  // Initialize or resume AudioContext after a user gesture
  public unlockAudio(): boolean {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.isAudioUnlocked = true;
      return true;
    } catch (e) {
      console.warn('AudioContext initialization deferred:', e);
      return false;
    }
  }

  public isUnlocked(): boolean {
    return this.isAudioUnlocked && this.audioCtx?.state === 'running';
  }

  // Configure audio preferences
  public setPreferences(prefs: {
    masterVolume?: number;
    chatVolume?: number;
    alertVolume?: number;
    isMuted?: boolean;
    isDndActive?: boolean;
    soundOnlyForMentions?: boolean;
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  }) {
    if (prefs.masterVolume !== undefined) this.masterVolume = prefs.masterVolume;
    if (prefs.chatVolume !== undefined) this.chatVolume = prefs.chatVolume;
    if (prefs.alertVolume !== undefined) this.alertVolume = prefs.alertVolume;
    if (prefs.isMuted !== undefined) this.isMuted = prefs.isMuted;
    if (prefs.isDndActive !== undefined) this.isDndActive = prefs.isDndActive;
    if (prefs.soundOnlyForMentions !== undefined) this.soundOnlyForMentions = prefs.soundOnlyForMentions;
    if (prefs.quietHoursEnabled !== undefined) this.quietHoursEnabled = prefs.quietHoursEnabled;
    if (prefs.quietHoursStart !== undefined) this.quietHoursStart = prefs.quietHoursStart;
    if (prefs.quietHoursEnd !== undefined) this.quietHoursEnd = prefs.quietHoursEnd;
  }

  // Check if current time falls within configured quiet hours
  private isInQuietHours(): boolean {
    if (!this.quietHoursEnabled) return false;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = this.quietHoursStart.split(':').map(Number);
    const [endH, endM] = this.quietHoursEnd.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (startMin < endMin) {
      return currentMin >= startMin && currentMin < endMin;
    } else {
      // Crosses midnight (e.g. 22:00 to 07:00)
      return currentMin >= startMin || currentMin < endMin;
    }
  }

  // Helper to play synthesized tone bursts with envelope
  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainLevel = 0.3
  ) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // ADSR Envelope
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch (err) {
      console.warn('Error synthesizing tone:', err);
    }
  }

  // Master method to play sound presets
  public playSound(effect: SoundEffectType, forceOverride = false) {
    if (this.isMuted && !forceOverride) return;
    if (this.isDndActive && effect !== 'emergency_alarm' && !forceOverride) return;
    if (this.isInQuietHours() && effect !== 'emergency_alarm' && !forceOverride) return;

    if (this.soundOnlyForMentions && effect !== 'mention' && effect !== 'emergency_alarm' && !forceOverride) {
      return;
    }

    this.unlockAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const isChat = effect === 'direct_message' || effect === 'channel_message' || effect === 'mention';
    const volumeFactor = this.masterVolume * (isChat ? this.chatVolume : this.alertVolume);

    switch (effect) {
      case 'direct_message': {
        // Soft harmonic dual chime (C6 - G6)
        this.playTone(1046.5, now, 0.12, 'sine', 0.22 * volumeFactor);
        this.playTone(1567.98, now + 0.08, 0.18, 'sine', 0.26 * volumeFactor);
        break;
      }

      case 'channel_message': {
        // Subtle ambient single chime (E5)
        this.playTone(659.25, now, 0.15, 'sine', 0.18 * volumeFactor);
        break;
      }

      case 'mention': {
        // Bright energetic rising triple tone (F5 - A5 - C6)
        this.playTone(698.46, now, 0.1, 'sine', 0.25 * volumeFactor);
        this.playTone(880.0, now + 0.07, 0.12, 'sine', 0.28 * volumeFactor);
        this.playTone(1046.5, now + 0.14, 0.22, 'triangle', 0.32 * volumeFactor);
        break;
      }

      case 'task_assigned': {
        // Motivating ascending major triad (C5 - E5 - G5 - C6)
        this.playTone(523.25, now, 0.12, 'triangle', 0.25 * volumeFactor);
        this.playTone(659.25, now + 0.08, 0.12, 'triangle', 0.25 * volumeFactor);
        this.playTone(783.99, now + 0.16, 0.12, 'triangle', 0.25 * volumeFactor);
        this.playTone(1046.5, now + 0.24, 0.3, 'sine', 0.3 * volumeFactor);
        break;
      }

      case 'deadline_warning': {
        // Warning dual pulse (A4 - F4)
        this.playTone(440.0, now, 0.15, 'sawtooth', 0.18 * volumeFactor);
        this.playTone(349.23, now + 0.18, 0.25, 'triangle', 0.22 * volumeFactor);
        break;
      }

      case 'task_overdue': {
        // Urgent 3-pulse dissonant tone (Ab4 - D5 - Ab4)
        this.playTone(415.3, now, 0.14, 'sawtooth', 0.24 * volumeFactor);
        this.playTone(587.33, now + 0.12, 0.14, 'sawtooth', 0.28 * volumeFactor);
        this.playTone(415.3, now + 0.24, 0.28, 'sawtooth', 0.24 * volumeFactor);
        break;
      }

      case 'approval_request': {
        // Distinctive high bell chime (G5 - D6)
        this.playTone(783.99, now, 0.15, 'sine', 0.25 * volumeFactor);
        this.playTone(1174.66, now + 0.1, 0.35, 'sine', 0.3 * volumeFactor);
        break;
      }

      case 'approval_result': {
        // Triumphant major chord (C5 + G5 + E6)
        this.playTone(523.25, now, 0.35, 'triangle', 0.25 * volumeFactor);
        this.playTone(783.99, now + 0.04, 0.35, 'triangle', 0.25 * volumeFactor);
        this.playTone(1318.51, now + 0.08, 0.45, 'sine', 0.35 * volumeFactor);
        break;
      }

      case 'meeting_reminder': {
        // Gentle calendar notification chime (D5 - A5 - D6)
        this.playTone(587.33, now, 0.14, 'sine', 0.2 * volumeFactor);
        this.playTone(880.0, now + 0.12, 0.14, 'sine', 0.22 * volumeFactor);
        this.playTone(1174.66, now + 0.24, 0.3, 'sine', 0.25 * volumeFactor);
        break;
      }

      case 'critical_risk': {
        // High priority red alert chord (E5 - Bb5 dissonant sweep)
        this.playTone(659.25, now, 0.2, 'sawtooth', 0.28 * volumeFactor);
        this.playTone(932.33, now + 0.05, 0.25, 'sawtooth', 0.32 * volumeFactor);
        this.playTone(659.25, now + 0.22, 0.3, 'sawtooth', 0.28 * volumeFactor);
        break;
      }

      case 'ai_recommendation': {
        // Modern futuristic sparkle tone (A5 - C#6 - E6 - G#6)
        this.playTone(880.0, now, 0.08, 'sine', 0.2 * volumeFactor);
        this.playTone(1108.73, now + 0.06, 0.08, 'sine', 0.22 * volumeFactor);
        this.playTone(1318.51, now + 0.12, 0.08, 'sine', 0.24 * volumeFactor);
        this.playTone(1661.22, now + 0.18, 0.28, 'sine', 0.28 * volumeFactor);
        break;
      }

      case 'emergency_alarm': {
        this.startRepeatingEmergencyAlarm();
        break;
      }
    }
  }

  // Repeating alarm siren for system emergency / military deployment failure
  public startRepeatingEmergencyAlarm() {
    if (this.isEmergencyPlaying) return;
    this.isEmergencyPlaying = true;
    this.unlockAudio();

    const triggerSirenPulse = () => {
      if (!this.audioCtx || !this.isEmergencyPlaying) return;
      const now = this.audioCtx.currentTime;
      const vol = this.masterVolume * this.alertVolume;

      // Frequency modulated emergency siren sweep (600Hz -> 1200Hz -> 600Hz)
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1100, now + 0.4);
        osc.frequency.linearRampToValueAtTime(600, now + 0.8);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35 * vol, now + 0.1);
        gain.gain.setValueAtTime(0.35 * vol, now + 0.7);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.9);
      } catch (e) {
        console.warn('Siren synthesis error:', e);
      }
    };

    triggerSirenPulse();
    this.emergencyIntervalId = setInterval(() => {
      if (this.isEmergencyPlaying) {
        triggerSirenPulse();
      }
    }, 1000);
  }

  // Stop the repeating emergency alarm immediately
  public stopEmergencyAlarm() {
    this.isEmergencyPlaying = false;
    if (this.emergencyIntervalId) {
      clearInterval(this.emergencyIntervalId);
      this.emergencyIntervalId = null;
    }
  }

  public isEmergencyAlarmActive(): boolean {
    return this.isEmergencyPlaying;
  }
}

export const audioEngine = WebAudioEngine.getInstance();
