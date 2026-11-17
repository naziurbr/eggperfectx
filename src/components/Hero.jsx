import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import EggIllustration from './EggIllustration';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-yolk/30 blur-3xl" />
      <div aria-hidden className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-beige px-4 py-1.5 text-sm font-semibold">
            🥚 The perfect egg timer
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Your Perfect Egg, <span className="text-accent">Every Time.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-brown/75">
            Pick your yolk, your method and your egg size. EggPerfect does the
            timing, so you get exactly the egg you love.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#timer"
              className="inline-flex items-center gap-2 rounded-full bg-yolk px-7 py-3.5 font-bold shadow-lg shadow-yolk/40 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Start cooking <ArrowDown size={18} />
            </a>
            <a
              href="#guide"
              className="rounded-full border-2 border-brown/15 px-7 py-3.5 font-semibold transition hover:bg-beige"
            >
              How it works
            </a>
          </div>

          <dl className="mt-10 flex gap-8">
            {[
              ['4', 'textures'],
              ['2', 'methods'],
              ['4', 'egg sizes'],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl font-extrabold">{n}</dt>
                <dd className="text-sm text-brown/65">{label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="relative mx-auto h-[22rem] w-full max-w-sm sm:h-[26rem]" aria-hidden>
          <motion.div
            className="absolute left-0 top-4 w-44 sm:w-52"
            animate={{ y: [0, -14, 0], rotate: [-7, -4, -7] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <EggIllustration type="soft" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 w-36 sm:w-44"
            animate={{ y: [0, 12, 0], rotate: [9, 6, 9] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <EggIllustration type="medium" />
          </motion.div>
          <span className="absolute right-2 top-10 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-md">Runny ✨</span>
          <span className="absolute bottom-16 left-0 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-md">Creamy 😋</span>
        </div>
      </div>
    </section>
  );
}