import { SIZES } from './data/cookingTimes';
import StepHeading from './StepHeading';

const EGG_ICON_WIDTH = { small: 18, medium: 22, large: 26, xl: 30 };

export default function EggSizeSelector({ value, onChange, disabled }) {
  return (
    <section aria-labelledby="size-heading" className="rounded-[2rem] bg-beige/60 p-5 sm:p-6">
      <StepHeading
        id="size-heading"
        number={3}
        title="Pick your egg size"
        subtitle="Bigger eggs need a little longer. Times are tuned for Large."
      />
      <div role="radiogroup" aria-labelledby="size-heading" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SIZES.map((s) => {
          const selected = s.id === value;
          const w = EGG_ICON_WIDTH[s.id];
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(s.id)}
              className={[
                'flex flex-col items-center gap-1 rounded-3xl border-2 px-2 py-3 transition-colors',
                selected ? 'border-accent bg-white shadow-md shadow-yolk/30' : 'border-transparent bg-white/70 hover:bg-white',
                disabled && !selected ? 'opacity-50' : '',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="flex h-9 items-end">
                <span
                  aria-hidden
                  style={{ width: w, height: w * 1.28 }}
                  className={`block rounded-[50%_50%_50%_50%/62%_62%_38%_38%] ${selected ? 'bg-yolk' : 'bg-brown/20'}`}
                />
              </span>
              <span className="text-sm font-bold">{s.name}</span>
              <span className="text-xs text-brown/60">{s.weight}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}