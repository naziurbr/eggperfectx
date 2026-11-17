export default function Footer() {
  return (
    <footer className="border-t border-beige bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center sm:px-6">
        <p className="font-display text-xl font-extrabold">
          Egg<span className="text-accent">Perfect</span> 🥚
        </p>
        <p className="text-sm font-medium">Your Perfect Egg, Every Time.</p>
        <p className="max-w-md text-xs text-brown/55">
          Cooking times are guidelines. Always adjust for your own eggs, stove and altitude.
        </p>
        <p className="text-xs text-brown/45">© {new Date().getFullYear()} EggPerfect</p>
      </div>
    </footer>
  );
}