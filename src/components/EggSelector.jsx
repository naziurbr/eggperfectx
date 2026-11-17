import { EGG_TYPES } from './data/cookingTimes';
import EggOption from './EggOption';
import StepHeading from './StepHeading';

export default function EggSelector({ value, method, onChange, disabled }) {
  const selected = EGG_TYPES.find((e) => e.id === value);
  return (
    <section aria-labelledby="egg-heading" className="rounded-[2rem] bg-beige/60 p-5 sm:p-6">
      <StepHeading
        id="egg-heading"
        number={1}
        title="How do you like your egg?"
        subtitle="Choose your yolk."
      />
      <div
        role="radiogroup"
        aria-labelledby="egg-heading"
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {EGG_TYPES.map((egg) => (
          <EggOption
            key={egg.id}
            egg={egg}
            method={method}
            selected={egg.id === value}
            disabled={disabled}
            onSelect={onChange}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-brown/75">{selected.description}</p>
    </section>
  );
}