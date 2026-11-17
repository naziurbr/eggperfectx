import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Volume2, VolumeX } from 'lucide-react';
import { ADJUST_STEP, formatClock } from './data/cookingTimes';
import TimerControls from './TimerControls';

const R = 130;
const C = 2 * Math.PI * R;

const BUBBLES = [
  { left: '18%', size: 10, duration: 3.2, delay: 0 },
  { left: '35%', size: 16, duration: 4.1, delay: 0.8 },
  { left: '52%', size: 8, duration: 3.6, delay: 1.6 },
  { left: '68%', size: 14, duration: 4.4, delay: 0.4 },
  { left: '82%', size: 9, duration: 3.4, delay: 2.1 },
];

const STATUS_TEXT = {
  idle: 'Ready when you are',
  running: 'Cooking…',
  paused: 'Paused',
  finished: 'Egg ready!',
};

export default function CookingTimer({
  egg, method, size,
  duration, recommended, offset,
  onAdjust, onClearAdjust,
  timer, onStart, onReset,
  soundOn, onToggleSound,
}) {
  const { status, remainingMs } = timer;
  const running = status === 'running';
  const finished = status === 'finished';
  const idle = status === 'idle';

  const seconds = Math.ceil(remainingMs / 1000);
  const progress = finished ? 1 : remainingMs / (duration * 1000);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-xl shadow-brown/10 sm:p-7">
      <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yolk/25 blur-2xl" />

      {/* header */}
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{STATUS_TEXT[status]}</p>
          <h3 className="font-display text-xl font-bold sm:text-2xl">{egg.name} egg</h3>
          <p className="text-sm text-brown/65">
            {method.name} · {size.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute alarm' : 'Unmute alarm'}
          className="grid h-11 w-11 place-items-center rounded-full bg-beige transition hover:bg-yolk/50"
        >
          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* ring */}
      <div className="relative mx-auto mt-4 aspect-square w-full max-w-[300px]">
        <svg viewBox="0 0 300 300" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="150" cy="150" r={R} fill="none" stroke="#F1E6D2" strokeWidth="16" />
          <circle
            cx="150" cy="150" r={R}
            fill="none"
            stroke={finished ? '#E89B35' : '#F5C542'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            className={finished ? 'animate-pulse' : ''}
          />
        </svg>

        {/* inner disc with bubbles */}
        <div className="absolute inset-5 overflow-hidden rounded-full bg-cream" aria-hidden>
          {running &&
            BUBBLES.map((b, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full bg-yolk/50"
                style={{ left: b.left, width: b.size, height: b.size }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -230, opacity: [0, 0.9, 0] }}
                transition={{ duration: b.duration, repeat: Infinity, delay: b.delay, ease: 'easeOut' }}
              />
            ))}
        </div>

        {/* content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            aria-hidden
            className="text-4xl"
            animate={
              running
                ? { rotate: [-10, 10, -10], y: [0, -4, 0] }
                : finished
                ? { scale: [1, 1.25, 1] }
                : { rotate: 0 }
            }
            transition={{ duration: running ? 1.2 : 0.8, repeat: running || finished ? Infinity : 0 }}
          >
            🥚
          </motion.span>

          {finished ? (
            <span className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">Ready!</span>
          ) : (
            <span
              role="timer"
              aria-label={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`}
              className="mt-1 font-display text-6xl font-extrabold tabular-nums tracking-tight sm:text-7xl"
            >
              {formatClock(seconds)}
            </span>
          )}
          <span className="text-xs font-semibold uppercase tracking-widest text-brown/50">
            {finished ? 'Take it off the heat' : 'min : sec'}
          </span>
        </div>

        {/* burst */}
        {finished &&
          Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                aria-hidden
                className={`absolute left-1/2 top-1/2 h-3 w-3 rounded-full ${i % 2 ? 'bg-accent' : 'bg-yolk'}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 165, y: Math.sin(a) * 165, opacity: 0, scale: 0.4 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            );
          })}
      </div>

      {/* completion message */}
      <AnimatePresence>
        {finished && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-2xl bg-yolk/30 p-4 text-center"
          >
            <p className="font-display text-lg font-bold">Your egg is ready! 🎉</p>
            <p className="mt-1 text-sm text-brown/80">{egg.finish}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* fine-tune (idle only) */}
      {idle && (
        <div className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-cream p-2">
          <button
            type="button"
            onClick={() => onAdjust(-ADJUST_STEP)}
            aria-label={`Subtract ${ADJUST_STEP} seconds`}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-bold shadow-sm transition hover:bg-yolk/40"
          >
            <Minus size={16} /> {ADJUST_STEP}s
          </button>
          <div className="text-center text-xs leading-tight">
            <p className="font-semibold">
              {offset === 0 ? 'Recommended' : `Adjusted ${offset > 0 ? '+' : '−'}${formatClock(Math.abs(offset))}`}
            </p>
            {offset !== 0 ? (
              <button type="button" onClick={onClearAdjust} className="font-bold text-accent underline">
                Back to {formatClock(recommended)}
              </button>
            ) : (
              <p className="text-brown/60">{formatClock(recommended)} · tap to fine-tune</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onAdjust(ADJUST_STEP)}
            aria-label={`Add ${ADJUST_STEP} seconds`}
            className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-bold shadow-sm transition hover:bg-yolk/40"
          >
            <Plus size={16} /> {ADJUST_STEP}s
          </button>
        </div>
      )}

      <div className="mt-5">
        <TimerControls
          status={status}
          onStart={onStart}
          onPause={timer.pause}
          onResume={timer.resume}
          onReset={onReset}
        />
      </div>

      <p className="mt-4 text-center text-xs text-brown/55">
        Times are starting presets. Results vary with egg size, starting temperature and altitude, so adjust to taste.
      </p>

      <p className="sr-only" aria-live="polite">{STATUS_TEXT[status]}</p>
    </div>
  );
}