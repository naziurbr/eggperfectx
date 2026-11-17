import { useCallback, useEffect, useRef } from 'react';

/**
 * Alarm synthesized with the Web Audio API (no audio file needed).
 * Call `prime()` inside a user gesture (e.g. the Start click) so browsers
 * allow sound to play later when the timer finishes.
 */
export function useAlarm() {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  const prime = useCallback(() => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctxRef.current = new AC();
      }
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    } catch {
      /* audio unavailable */
    }
  }, []);

  const stop = useCallback(() => {
    clearTimeout(stopTimeoutRef.current);
    if (masterRef.current) {
      try {
        masterRef.current.disconnect();
      } catch {
        /* already disconnected */
      }
      masterRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    stop();

    const master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    masterRef.current = master;

    const beep = (time, freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + 0.22);
    };

    const t0 = ctx.currentTime + 0.05;
    for (let burst = 0; burst < 6; burst++) {
      for (let i = 0; i < 3; i++) {
        beep(t0 + burst * 1.5 + i * 0.22, i === 2 ? 1175 : 880);
      }
    }
    stopTimeoutRef.current = setTimeout(stop, 9500);
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { prime, play, stop };
}