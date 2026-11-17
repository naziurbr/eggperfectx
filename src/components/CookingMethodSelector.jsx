import { motion } from 'framer-motion';
import { Flame, Snowflake } from 'lucide-react';
import { METHODS } from './data/cookingTimes';
import StepHeading from './StepHeading';

const ICONS = { hot: Flame, cold: Snowflake };

export default function CookingMethodSelector({ value, onChange, disabled }) {
  return (
    <section aria-labelledby="method-heading" className="rounded-[2rem] bg-beige/60 p-5 sm:p-6">
      <StepHeading
        id="method-heading"
        number={2}
        title="Choose your method"
        subtitle="Start with boiling water or cold water."
      />
      <div role="radiogroup" aria-labelledby="method-heading" className="mt-5 grid gap-3 sm:grid-cols-2">
        {METHODS.map((m) => {
          const Icon = ICONS[m.id];
          const selected = m.id === value;
          return (
            <motion.button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(m.id)}
              whileTap={disabled ? undefined : { scale: 0.98 }}
              className={[
                'flex items-start gap-4 rounded-3xl border-2 p-4 text-left transition-colors',
                selected ? 'border-accent bg-white shadow-lg shadow-yolk/30' : 'border-transparent bg-white/70 hover:bg-white',
                disabled && !selected ? 'opacity-50' : '',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                  selected ? 'bg-yolk' : 'bg-beige'
                }`}
              >
                <Icon size={24} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold">{m.name}</span>
                <span className="block text-sm font-semibold text-accent">{m.tagline}</span>
                <span className="mt-1 block text-sm text-brown/70">{m.summary}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}