import { Pause, Play, RotateCcw } from 'lucide-react';

const PRIMARY = {
  idle: { label: 'Start cooking', Icon: Play, action: 'onStart' },
  running: { label: 'Pause', Icon: Pause, action: 'onPause' },
  paused: { label: 'Resume', Icon: Play, action: 'onResume' },
  finished: { label: 'Cook another egg', Icon: RotateCcw, action: 'onReset' },
};

export default function TimerControls({ status, onStart, onPause, onResume, onReset }) {
  const handlers = { onStart, onPause, onResume, onReset };
  const { label, Icon, action } = PRIMARY[status];
  const canReset = status === 'running' || status === 'paused';

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handlers[action]}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yolk px-6 py-4 text-lg font-extrabold shadow-lg shadow-yolk/40 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      >
        <Icon size={22} fill={status === 'idle' || status === 'paused' ? 'currentColor' : 'none'} />
        {label}
      </button>

      {canReset && (
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset timer"
          className="grid w-16 place-items-center rounded-full border-2 border-brown/15 transition hover:bg-beige"
        >
          <RotateCcw size={22} />
        </button>
      )}
    </div>
  );
}