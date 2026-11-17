import { useId } from 'react';

const EGG_PATH =
  'M100 8 C148 8 190 96 190 148 C190 204 150 234 100 234 C50 234 10 204 10 148 C10 96 52 8 100 8 Z';

// Concentric yolk layers (largest first). Inner layers are blurred to
// simulate the gradient from set to runny.
const YOLKS = {
  soft: {
    blur: 5,
    layers: [
      { r: 44, color: '#F7A81F' },
      { r: 30, color: '#F58F0A' },
    ],
    glossy: true,
    spill: true,
  },
  medium: {
    blur: 5,
    layers: [
      { r: 41, color: '#F5C645' },
      { r: 29, color: '#F5A623' },
      { r: 15, color: '#F28C0F' },
    ],
  },
  firm: {
    blur: 5,
    layers: [
      { r: 39, color: '#F4CF52' },
      { r: 17, color: '#F2B83C' },
    ],
  },
  hard: {
    blur: 3,
    layers: [{ r: 37, color: '#F6DE75' }],
    speckles: true,
  },
};

const SPECKLES = [
  [-14, -12, 2.4], [10, -18, 2], [18, 6, 2.6], [-6, 14, 2.2],
  [-20, 8, 1.8], [4, -2, 2.4], [14, 20, 1.8], [-10, -26, 1.6],
];

export default function EggIllustration({ type = 'soft', className = '', label }) {
  const uid = useId().replace(/:/g, '');
  const yolk = YOLKS[type];
  const [base, ...inner] = yolk.layers;

  return (
    <svg
      viewBox="0 0 200 244"
      className={className}
      role="img"
      aria-label={label ?? `Cross-section of a ${type}-boiled egg`}
    >
      <defs>
        <radialGradient id={`${uid}-white`} cx="38%" cy="28%" r="85%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F5ECD9" />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={yolk.blur} />
        </filter>
        <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="238" rx="62" ry="5" fill="#382B20" opacity="0.1" />

      {/* shell, membrane, white */}
      <path d={EGG_PATH} fill="#E6CFA5" />
      <path
        d={EGG_PATH}
        fill="#F9F0DE"
        transform="translate(100 121) scale(.955) translate(-100 -121)"
      />
      <path
        d={EGG_PATH}
        fill={`url(#${uid}-white)`}
        transform="translate(100 121) scale(.915) translate(-100 -121)"
      />

      {/* yolk */}
      <g transform="translate(100 150)">
        {yolk.spill && (
          <ellipse
            cx="0" cy="16" rx="52" ry="30"
            fill="#F7A81F" opacity="0.4"
            filter={`url(#${uid}-soft)`}
          />
        )}
        <circle r={base.r} fill={base.color} />
        {inner.map((l) => (
          <circle key={l.r} r={l.r} fill={l.color} filter={`url(#${uid}-blur)`} />
        ))}
        {yolk.speckles &&
          SPECKLES.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#E8C24F" opacity="0.7" />
          ))}
        {yolk.glossy && (
          <>
            <ellipse cx="-16" cy="-20" rx="13" ry="7" fill="#fff" opacity="0.55" transform="rotate(-30 -16 -20)" />
            <circle cx="10" cy="-26" r="3" fill="#fff" opacity="0.6" />
          </>
        )}
      </g>
    </svg>
  );
}