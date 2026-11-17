import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Lock } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EggSelector from './components/EggSelector';
import CookingMethodSelector from './components/CookingMethodSelector';
import EggSizeSelector from './components/EggSizeSelector';
import CookingTimer from './components/CookingTimer';
import CookingInstructions from './components/CookingInstructions';
import Footer from './components/Footer';

import { useTimer } from './components/hook/useTimer';
import { useAlarm } from './components/hooks/useAlarm';
import {
  EGG_TYPES, METHODS, SIZES,
  MIN_SECONDS, MAX_SECONDS,
  clamp, getCookingTime, formatClock,
} from './components/data/cookingTimes';

const DEFAULT_TITLE = 'EggPerfect – Your Perfect Egg, Every Time';

export default function App() {
  const [eggId, setEggId] = useState('medium');
  const [methodId, setMethodId] = useState('hot');
  const [sizeId, setSizeId] = useState('large');
  const [offset, setOffset] = useState(0); // user fine-tuning, in seconds
  const [soundOn, setSoundOn] = useState(true);

  const { prime, play, stop } = useAlarm();

  const egg = EGG_TYPES.find((e) => e.id === eggId);
  const method = METHODS.find((m) => m.id === methodId);
  const size = SIZES.find((s) => s.id === sizeId);

  const recommended = getCookingTime(eggId, methodId, sizeId);
  const duration = clamp(recommended + offset, MIN_SECONDS, MAX_SECONDS);

  const handleComplete = useCallback(() => {
    if (soundOn) play();
    navigator.vibrate?.([300, 150, 300, 150, 300]);
  }, [soundOn, play]);

  const timer = useTimer(duration, { onComplete: handleComplete });
  const { status, remainingMs } = timer;
  const busy = status === 'running' || status === 'paused';

  // Silence the alarm whenever we leave the "finished" state.
  useEffect(() => {
    if (status !== 'finished') stop();
  }, [status, stop]);

  // Live countdown in the browser tab.
  useEffect(() => {
    if (busy) document.title = `${formatClock(Math.ceil(remainingMs / 1000))} · EggPerfect`;
    else if (status === 'finished') document.title = '🥚 Egg ready! · EggPerfect';
    else document.title = DEFAULT_TITLE;
  }, [busy, status, remainingMs]);

  const choose = (setter) => (value) => {
    setter(value);
    setOffset(0);
    if (status === 'finished') timer.reset();
  };

  const handleAdjust = (delta) => {
    const next = clamp(recommended + offset + delta, MIN_SECONDS, MAX_SECONDS);
    setOffset(next - recommended);
  };

  const handleStart = () => {
    prime(); // unlock audio inside the user gesture
    timer.start();
  };

  const handleReset = () => {
    stop();
    timer.reset();
  };

  const handleToggleSound = () => {
    if (soundOn) stop();
    else prime();
    setSoundOn((v) => !v);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />

        <section id="timer" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Your egg timer</p>
          <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Set it. Start it. Enjoy it.</h2>

          {busy && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-yolk/30 px-4 py-2 text-sm font-semibold">
              <Lock size={14} /> Eggs are cooking. Reset the timer to change your choices.
            </p>
          )}

          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div className="space-y-6">
              <EggSelector value={eggId} method={methodId} onChange={choose(setEggId)} disabled={busy} />
              <CookingMethodSelector value={methodId} onChange={choose(setMethodId)} disabled={busy} />
              <EggSizeSelector value={sizeId} onChange={choose(setSizeId)} disabled={busy} />
            </div>

            <div className="lg:sticky lg:top-24">
              <CookingTimer
                egg={egg}
                method={method}
                size={size}
                duration={duration}
                recommended={recommended}
                offset={offset}
                onAdjust={handleAdjust}
                onClearAdjust={() => setOffset(0)}
                timer={timer}
                onStart={handleStart}
                onReset={handleReset}
                soundOn={soundOn}
                onToggleSound={handleToggleSound}
              />
            </div>
          </div>
        </section>

        <CookingInstructions egg={egg} method={method} size={size} seconds={duration} status={status} />
      </main>
      <Footer />
    </MotionConfig>
  );
}