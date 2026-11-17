import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drift-proof countdown. It stores an absolute end timestamp, so it stays
 * accurate even when the browser throttles timers in background tabs.
 *
 * status: 'idle' | 'running' | 'paused' | 'finished'
 * Changing `duration` (seconds) resets the timer.
 */
export function useTimer(duration, { onComplete } = {}) {
  const [status, setStatus] = useState('idle');
  const [remainingMs, setRemainingMs] = useState(duration * 1000);

  const endRef = useRef(0);
  const remainingRef = useRef(duration * 1000);
  const durationRef = useRef(duration);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const clear = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const setRemaining = useCallback((ms) => {
    remainingRef.current = ms;
    setRemainingMs(ms);
  }, []);

  const run = useCallback(() => {
    clear();
    endRef.current = Date.now() + remainingRef.current;
    setStatus('running');
    intervalRef.current = setInterval(() => {
      const left = endRef.current - Date.now();
      if (left <= 0) {
        clear();
        setRemaining(0);
        setStatus('finished');
        onCompleteRef.current?.();
      } else {
        setRemaining(left);
      }
    }, 100);
  }, [clear, setRemaining]);

  const start = useCallback(() => {
    setRemaining(durationRef.current * 1000);
    run();
  }, [run, setRemaining]);

  const pause = useCallback(() => {
    clear();
    setRemaining(Math.max(0, endRef.current - Date.now()));
    setStatus('paused');
  }, [clear, setRemaining]);

  const resume = useCallback(() => run(), [run]);

  const reset = useCallback(() => {
    clear();
    setRemaining(durationRef.current * 1000);
    setStatus('idle');
  }, [clear, setRemaining]);

  // New duration (different egg, method, size or manual tweak) -> reset.
  useEffect(() => {
    durationRef.current = duration;
    clear();
    setRemaining(duration * 1000);
    setStatus('idle');
  }, [duration, clear, setRemaining]);

  useEffect(() => clear, [clear]);

  return { status, remainingMs, start, pause, resume, reset };
}