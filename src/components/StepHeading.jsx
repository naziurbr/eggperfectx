export default function StepHeading({ id, number, title, subtitle }) {
  return (
    <div>
      <h3 id={id} className="flex items-center gap-3 font-display text-xl font-bold sm:text-2xl">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-yolk font-sans text-sm font-extrabold">
          {number}
        </span>
        {title}
      </h3>
      {subtitle && <p className="mt-1 pl-11 text-sm text-brown/70">{subtitle}</p>}
    </div>
  );
}