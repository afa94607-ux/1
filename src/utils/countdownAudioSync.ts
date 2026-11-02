// Real-Time Sound & Figure Synchronization for Cambodian Lottery 12 Countdown
// Audio file: /assets/aistudio/tts_c3510720_e0f87616.mp3

export interface CountdownSyncSegment {
  number: number; // 10 down to 0
  khmerWord: string; // «ដប់», «ប្រាំបួន», ..., «សូមសំណាងល្អ»
  romanized: string; // Dop, Pram Buon, ..., Som Samnang Laor
  khmerDigit: string; // ១០, ៩, ..., ០
  start: number; // in seconds
  end: number;   // in seconds
}

export const COUNTDOWN_AUDIO_URL = '/assets/aistudio/tts_c3510720_e0f87616.mp3';

export const COUNTDOWN_SEGMENTS: CountdownSyncSegment[] = [
  { number: 10, khmerWord: '«ដប់»', romanized: 'Dop', khmerDigit: '១០', start: 0.0, end: 1.36 },
  { number: 9, khmerWord: '«ប្រាំបួន»', romanized: 'Pram Buon', khmerDigit: '៩', start: 1.36, end: 2.90 },
  { number: 8, khmerWord: '«ប្រាំបី»', romanized: 'Pram Bei', khmerDigit: '៨', start: 2.90, end: 4.44 },
  { number: 7, khmerWord: '«ប្រាំពីរ»', romanized: 'Pram Pir', khmerDigit: '៧', start: 4.44, end: 5.98 },
  { number: 6, khmerWord: '«ប្រាំមួយ»', romanized: 'Pram Muoy', khmerDigit: '៦', start: 5.98, end: 7.52 },
  { number: 5, khmerWord: '«ប្រាំ»', romanized: 'Pram', khmerDigit: '៥', start: 7.52, end: 8.90 },
  { number: 4, khmerWord: '«បួន»', romanized: 'Buon', khmerDigit: '៤', start: 8.90, end: 10.15 },
  { number: 3, khmerWord: '«បី»', romanized: 'Bei', khmerDigit: '៣', start: 10.15, end: 11.40 },
  { number: 2, khmerWord: '«ពីរ»', romanized: 'Pir', khmerDigit: '២', start: 11.40, end: 12.61 },
  { number: 1, khmerWord: '«មួយ»', romanized: 'Muoy', khmerDigit: '១', start: 12.61, end: 13.92 },
  { number: 0, khmerWord: '«សូមសំណាងល្អ»', romanized: 'Som Samnang Laor', khmerDigit: '០', start: 13.92, end: 15.00 },
];

export function getSegmentForTime(currentTime: number): CountdownSyncSegment {
  for (const seg of COUNTDOWN_SEGMENTS) {
    if (currentTime >= seg.start && currentTime < seg.end) {
      return seg;
    }
  }
  return COUNTDOWN_SEGMENTS[COUNTDOWN_SEGMENTS.length - 1];
}

class CountdownAudioController {
  private audio: HTMLAudioElement | null = null;
  private animFrameId: number | null = null;
  private fallbackIntervalId: NodeJS.Timeout | null = null;
  private safetyTimeoutId: NodeJS.Timeout | null = null;
  private active: boolean = false;
  private onUpdateCallback: ((segment: CountdownSyncSegment, currentTime: number) => void) | null = null;
  private onCompleteCallback: (() => void) | null = null;
  private startTime: number = 0;
  private totalDuration: number = 15.00; // Voice completes «សូមសំណាងល្អ» at 14.91s
  private onEndedHandler: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio(COUNTDOWN_AUDIO_URL);
        this.audio.preload = 'auto';

        const unlock = () => {
          if (this.audio) {
            this.audio.load();
          }
          window.removeEventListener('pointerdown', unlock);
          window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('pointerdown', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
      } catch (e) {
        console.warn('Could not initialize Audio element', e);
      }
    }
  }

  public isRunning(): boolean {
    return this.active;
  }

  public start(
    onUpdate: (segment: CountdownSyncSegment, currentTime: number) => void,
    onComplete: () => void,
    isMuted: boolean = false
  ) {
    this.stop();
    this.active = true;
    this.onUpdateCallback = onUpdate;
    this.onCompleteCallback = onComplete;
    this.startTime = performance.now();

    // Immediately trigger step 10
    onUpdate(COUNTDOWN_SEGMENTS[0], 0);

    // Guaranteed hard safety timeout so draw sequence ALWAYS triggers
    this.safetyTimeoutId = setTimeout(() => {
      if (this.active) {
        this.complete();
      }
    }, 15100);

    if (!this.audio && typeof window !== 'undefined') {
      try {
        this.audio = new Audio(COUNTDOWN_AUDIO_URL);
        this.audio.preload = 'auto';
      } catch (e) {
        console.warn('Could not initialize Audio element in start():', e);
      }
    }

    if (this.audio) {
      try {
        this.audio.currentTime = 0;
        this.audio.muted = isMuted;
        this.audio.volume = isMuted ? 0 : 1;

        // Clean up previous event listener
        if (this.onEndedHandler) {
          this.audio.removeEventListener('ended', this.onEndedHandler);
        }
        this.onEndedHandler = () => {
          this.complete();
        };
        this.audio.addEventListener('ended', this.onEndedHandler, { once: true });

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play restricted or failed, falling back to timer-synced loop:', err);
            this.startFallbackLoop();
          });
        }
      } catch (e) {
        console.warn('Audio play threw error, using fallback:', e);
        this.startFallbackLoop();
      }
    } else {
      this.startFallbackLoop();
    }

    // High frequency update loop via requestAnimationFrame
    const updateLoop = () => {
      if (!this.active) return;

      let currentTime = 0;
      if (this.audio && !this.audio.paused && this.audio.currentTime > 0) {
        currentTime = this.audio.currentTime;
      } else {
        currentTime = (performance.now() - this.startTime) / 1000;
      }

      const segment = getSegmentForTime(currentTime);
      if (this.onUpdateCallback) {
        this.onUpdateCallback(segment, currentTime);
      }

      // Finish once speech completes (at 15.00s) or audio ended
      if (
        currentTime >= this.totalDuration ||
        (this.audio && (this.audio.ended || this.audio.currentTime >= this.totalDuration))
      ) {
        this.complete();
        return;
      }

      this.animFrameId = requestAnimationFrame(updateLoop);
    };

    this.animFrameId = requestAnimationFrame(updateLoop);
  }

  private startFallbackLoop() {
    if (this.fallbackIntervalId) clearInterval(this.fallbackIntervalId);
    this.fallbackIntervalId = setInterval(() => {
      if (!this.active) return;
      const elapsed = (performance.now() - this.startTime) / 1000;
      if (elapsed >= this.totalDuration) {
        this.complete();
      }
    }, 100);
  }

  private complete() {
    if (!this.active) return;
    const cb = this.onCompleteCallback;
    this.stop();
    if (cb) {
      cb();
    }
  }

  public stop() {
    this.active = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.fallbackIntervalId) {
      clearInterval(this.fallbackIntervalId);
      this.fallbackIntervalId = null;
    }
    if (this.safetyTimeoutId) {
      clearTimeout(this.safetyTimeoutId);
      this.safetyTimeoutId = null;
    }
    if (this.audio) {
      try {
        if (this.onEndedHandler) {
          this.audio.removeEventListener('ended', this.onEndedHandler);
          this.onEndedHandler = null;
        }
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (e) {
        // ignore
      }
    }
    this.onUpdateCallback = null;
    this.onCompleteCallback = null;
  }
}

export const countdownAudioSync = new CountdownAudioController();
