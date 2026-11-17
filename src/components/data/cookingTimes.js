export const EGG_TYPES = [
  {
    id: 'soft',
    name: 'Soft-boiled',
    texture: 'Runny yolk',
    description: 'Just-set whites and a liquid golden yolk. Made for toast soldiers.',
    guide: { hot: '4½ min', cold: '3–4 min' },
    seconds: { hot: 270, cold: 210 },
    finish:
      'Lift the eggs out right away and rinse under cold water for 20–30 seconds to halt cooking, then serve in an egg cup.',
  },
  {
    id: 'medium',
    name: 'Medium-boiled',
    texture: 'Creamy yolk',
    description: 'Jammy, creamy centre with a set outer ring. Great on ramen or salads.',
    guide: { hot: '7 min', cold: '5–6 min' },
    seconds: { hot: 420, cold: 330 },
    finish:
      'Rinse under cold water for about 30 seconds, then peel gently under running water and slice.',
  },
  {
    id: 'firm',
    name: 'Firm-boiled',
    texture: 'Mostly set yolk',
    description: 'A yolk that is firm and sliceable with a touch of softness in the middle.',
    guide: { hot: '11 min', cold: '8–10 min' },
    seconds: { hot: 660, cold: 540 },
    finish:
      'Move the eggs to an ice bath for 2 minutes, then peel. Perfect for sandwiches and grain bowls.',
  },
  {
    id: 'hard',
    name: 'Hard-boiled',
    texture: 'Fully cooked yolk',
    description: 'Completely set, pale-yellow yolk. Ideal for egg salad, deviled eggs and meal prep.',
    guide: { hot: '15 min', cold: '14 min' },
    seconds: { hot: 900, cold: 840 },
    finish:
      'Move the eggs to an ice bath for 5 minutes. It makes peeling easier and helps prevent a grey ring around the yolk.',
  },
];

// ---------- Cooking methods ----------
export const METHODS = [
  {
    id: 'hot',
    name: 'Hot Water',
    tagline: 'Start in boiling water',
    summary: 'Lower eggs into water that is already boiling. Precise, consistent and easy to repeat.',
  },
  {
    id: 'cold',
    name: 'Cold Water',
    tagline: 'Start in cold water',
    summary: 'Eggs warm up gradually with the water. Gentler on shells, so fewer cracks.',
  },
];

// ---------- Egg sizes ----------
// The cooking guide is treated as the baseline for a Large egg (multiplier 1).
export const SIZES = [
  { id: 'small', name: 'Small', weight: 'under 53 g', multiplier: 0.88 },
  { id: 'medium', name: 'Medium', weight: '53–63 g', multiplier: 0.94 },
  { id: 'large', name: 'Large', weight: '63–73 g', multiplier: 1 },
  { id: 'xl', name: 'Extra Large', weight: 'over 73 g', multiplier: 1.08 },
];

export const MIN_SECONDS = 30;
export const MAX_SECONDS = 60 * 60;
export const ADJUST_STEP = 15;

// ---------- Helpers ----------
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/** Recommended cooking time in seconds, rounded to the nearest 5 s. */
export function getCookingTime(typeId, methodId, sizeId) {
  const type = EGG_TYPES.find((t) => t.id === typeId);
  const size = SIZES.find((s) => s.id === sizeId);
  const base = type.seconds[methodId];
  return Math.round((base * size.multiplier) / 5) * 5;
}

/** 425 -> "7:05" */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/** 270 -> "4 min 30 sec" */
export function humanTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s} sec`;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

/** Dynamic instructions based on method + preference + size. */
export function getInstructions({ egg, method, size, seconds }) {
  const countdown = {
    id: 'countdown',
    kind: 'timer',
    title: 'Start the countdown',
    text: `Press Start Cooking now. A ${size.name.toLowerCase()} ${egg.name.toLowerCase()} egg needs about ${humanTime(seconds)}.`,
  };
  const simmer = {
    id: 'simmer',
    title: 'Reduce to a simmer',
    text: 'Turn the heat down until the water bubbles gently, not rolling.',
  };
  const finish = {
    id: 'finish',
    kind: 'finish',
    title: 'Cool & serve',
    text: egg.finish,
  };

  if (method.id === 'hot') {
    return [
      {
        id: 'boil',
        title: 'Bring the water to a boil',
        text: 'Use enough water to cover the eggs by about 2.5 cm (1 in) and bring it to a rolling boil.',
      },
      {
        id: 'add',
        title: 'Add the eggs gently',
        text: 'Use a spoon to lower room-temperature eggs into the water so they don’t crack.',
      },
      simmer,
      countdown,
      finish,
    ];
  }
  return [
    {
      id: 'fill',
      title: 'Fill the saucepan',
      text: 'Place eggs in a single layer and cover with cold water by about 2.5 cm (1 in).',
    },
    {
      id: 'boil',
      title: 'Bring the water to a boil',
      text: 'Heat uncovered over high heat until the water reaches a full boil.',
    },
    simmer,
    countdown,
    finish,
  ];
}