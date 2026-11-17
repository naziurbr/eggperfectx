import { motion } from 'framer-motion';
import { Check, Mountain, Ruler, Snowflake, Thermometer } from 'lucide-react';
import { EGG_TYPES, getInstructions } from './data/cookingTimes';

const TIPS = [
  { Icon: Ruler, title: 'Egg size matters', text: 'Smaller eggs cook faster and bigger ones slower. Choose your size above and the time updates.' },
  { Icon: Thermometer, title: 'Fridge-cold eggs', text: 'Eggs straight from the fridge can need 30–60 seconds extra. Use the +15s button to tune it.' },
  { Icon: Mountain, title: 'High altitude', text: 'Water boils at a lower temperature up high, so eggs take a bit longer. Taste-test and adjust.' },
  { Icon: Snowflake, title: 'Ice bath', text: 'Cooling eggs quickly stops the cooking and makes them much easier to peel.' },
];

function StepBadge({ state, index }) {
  if (state === 'done') {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-yolk">
        <Check size={18} strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
        state === 'active' ? 'animate-pulse bg-accent text-white' : 'bg-beige'
      }`}
    >
      {index + 1}
    </span>
  );
}

function GuideTable({ eggId, methodId }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md shadow-brown/5">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Cooking time reference</caption>
        <thead className="bg-beige/70 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Egg</th>
            <th className="px-4 py-3">Hot water</th>
            <th className="px-4 py-3">Cold water</th>
          </tr>
        </thead>
        <tbody>
          {EGG_TYPES.map((e) => (
            <tr key={e.id} className={e.id === eggId ? 'bg-yolk/20 font-semibold' : ''}>
              <th scope="row" className="px-4 py-3 font-semibold">{e.name.replace('-boiled', '')}</th>
              {['hot', 'cold'].map((m) => (
                <td
                  key={m}
                  className={`px-4 py-3 ${e.id === eggId && m === methodId ? 'font-extrabold text-accent' : ''}`}
                >
                  {e.guide[m]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookingInstructions({ egg, method, size, seconds, status }) {
  const steps = getInstructions({ egg, method, size, seconds });
  const timerIdx = steps.findIndex((s) => s.kind === 'timer');

  const stateOf = (i) => {
    if (status === 'finished') return i === steps.length - 1 ? 'active' : 'done';
    if (status === 'running' || status === 'paused') {
      return i < timerIdx ? 'done' : i === timerIdx ? 'active' : 'todo';
    }
    return 'todo';
  };

  return (
    <section id="guide" className="scroll-mt-20 bg-beige/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-accent">Step by step</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
          How to cook your {egg.name.toLowerCase()} egg
        </h2>
        <p className="mt-2 max-w-xl text-brown/70">
          {method.name} method · {size.name} egg. These steps update as you change your choices.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <motion.ol
            key={`${method.id}-${egg.id}-${size.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {steps.map((step, i) => {
              const state = stateOf(i);
              return (
                <li
                  key={step.id}
                  className={`flex gap-4 rounded-3xl p-4 transition-colors sm:p-5 ${
                    state === 'active' ? 'bg-white shadow-lg shadow-yolk/30 ring-2 ring-accent' : 'bg-white/70'
                  } ${state === 'done' ? 'opacity-70' : ''}`}
                >
                  <StepBadge state={state} index={i} />
                  <div>
                    <h3 className="font-display text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-brown/75 sm:text-base">{step.text}</p>
                  </div>
                </li>
              );
            })}
          </motion.ol>

          <div className="space-y-6">
            <GuideTable eggId={egg.id} methodId={method.id} />
            <div id="tips" className="rounded-3xl bg-white p-5 shadow-md shadow-brown/5">
              <h3 className="font-display text-lg font-bold">Why timings vary</h3>
              <ul className="mt-3 space-y-3">
                {TIPS.map(({ Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-yolk/40">
                      <Icon size={18} />
                    </span>
                    <p className="text-sm text-brown/75">
                      <strong className="text-brown">{title}.</strong> {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}