import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import EggIllustration from './EggIllustration';

export default function EggOption({ egg, method, selected, disabled, onSelect }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(egg.id)}
      whileHover={disabled ? undefined : { y: -4 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={[
        'relative flex flex-col items-center rounded-3xl border-2 p-3 pb-4 text-center transition-colors',
        selected
          ? 'border-accent bg-white shadow-lg shadow-yolk/30'
          : 'border-transparent bg-white/70 hover:bg-white',
        disabled && !selected ? 'opacity-50' : '',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-white"
        >
          <Check size={14} strokeWidth={3} />
        </motion.span>
      )}

      <EggIllustration type={egg.id} className="w-20 sm:w-24" />
      <span className="mt-2 font-display text-base font-bold leading-tight">{egg.name}</span>
      <span className="text-xs font-medium text-brown/65">{egg.texture}</span>
      <span className="mt-2 rounded-full bg-yolk/40 px-2.5 py-0.5 text-xs font-bold">
        {egg.guide[method]}
      </span>
    </motion.button>
  );
}