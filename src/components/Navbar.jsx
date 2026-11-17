export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-beige/80 bg-cream/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-yolk text-lg shadow-sm">🥚</span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            Egg<span className="text-accent">Perfect</span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#guide" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-brown/80 transition hover:bg-beige sm:block">
            How it works
          </a>
          <a href="#timer" className="rounded-full bg-brown px-4 py-2 text-sm font-semibold text-cream transition hover:bg-brown/85">
            Open timer
          </a>
        </div>
      </nav>
    </header>
  );
}