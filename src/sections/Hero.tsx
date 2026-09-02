'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Compass, Map, BookOpen } from 'lucide-react';
import { smoothScrollTo } from '@/lib/utils';

/* Footage is opt-in and needs no code change: put a file in public/ and add
   NEXT_PUBLIC_HERO_VIDEO=/hero.mp4 to .env.local. The photographs below stay as
   the poster and as the fallback, so the hero is never empty — if the variable
   is unset, or the file 404s, or the browser refuses to autoplay, what remains
   is the still. That is why the video sits *over* the stills rather than
   replacing them. */
const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO ?? '';

/* The three ways into the site — which are also the next three sections of this
   page, in the order they appear. The strip along the bottom of the hero is the
   page's table of contents, so the reader's first scroll is a choice they have
   already been offered rather than a surprise. Not a 01/02/03 sequence: these
   are alternatives, and numbering them would imply an order that isn't real. */
const WAYS_IN = [
  { href: '#explore', label: 'By feeling', detail: 'Describe the mood, not the place', Icon: Compass },
  { href: '#world-map', label: 'By place', detail: 'Open the map and wander', Icon: Map },
  { href: '#stories', label: 'By story', detail: "Read someone's account first", Icon: BookOpen },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Fluid Spring Physics Damper: Converts discrete mousewheel notches into buttery-smooth continuous momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0001,
  });

  // Hardware GPU-Accelerated Balloon Ascension Physics (Pure composited transforms)
  const copyY = useTransform(smoothProgress, [0, 1], [0, -220]);
  const copyScale = useTransform(smoothProgress, [0, 0.7], [1, 0.96]);
  const copyFade = useTransform(smoothProgress, [0, 0.65], [1, 0]);
  const copyStyle = { y: copyY, scale: copyScale, opacity: copyFade };

  // Planetary altitude camera depth
  const backdropY = useTransform(smoothProgress, [0, 1], [0, 90]);
  const backdropScale = useTransform(smoothProgress, [0, 1], [1.0, 1.08]);
  const backdropStyle = { y: backdropY, scale: backdropScale };

  // Floating bottom ways-in strip
  const waysY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const waysFade = useTransform(smoothProgress, [0, 0.45], [1, 0]);
  const waysStyle = { y: waysY, opacity: waysFade };

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* ── Backdrop (Hardware-Accelerated Altitude Parallax) ───────────────── */}
      <motion.div 
        style={backdropStyle}
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transform-gpu will-change-transform"
      >
        {/* Night Layer (Image + Scrim + Seam Blend) */}
        <div aria-hidden="true" className="hero-layer theme-night-only">
          <img
            src="/hero-bg.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="hero-media"
          />
          <div className="hero-scrim-night pointer-events-none absolute inset-0" />
        </div>

        {/* Day Layer (Image + Scrim + Seam Blend) */}
        <div aria-hidden="true" className="hero-layer theme-day-only">
          <img
            src="/hero-bg-day.jpg"
            alt=""
            decoding="async"
            className="hero-media"
          />
          <div className="hero-scrim-day pointer-events-none absolute inset-0" />
        </div>

        {HERO_VIDEO && (
          <video
            src={HERO_VIDEO}
            poster="/hero-bg.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="hero-media"
          />
        )}
      </motion.div>

      {/* ── Copy (Hot Air Balloon Buoyant Ascent) ─────────────────────────── */}
      <motion.div
        className="shell flex flex-1 flex-col justify-center pb-8 pt-28 lg:pt-32"
        style={copyStyle}
      >
        <div className="max-w-[46rem]">
          <div className="animate-rise-in flex items-center gap-4" style={{ animationDelay: '80ms' }}>
            <span className="t-label text-aurora font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              A travel atlas with no star ratings
            </span>
            <span className="h-px flex-1 bg-white/20" />
          </div>

          <h1
            className="t-display animate-rise-in mt-7 text-balance text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
            style={{ animationDelay: '180ms' }}
          >
            Somewhere in here is the trip you&rsquo;ll still be describing in ten years.
          </h1>

          <p
            className="t-lead animate-rise-in mt-7 max-w-xl text-foreground/90 font-medium"
            style={{ animationDelay: '300ms' }}
          >
            First-hand accounts from 120 countries — what people saw, what it cost, and
            what they&rsquo;d do differently.
          </p>

          <div
            className="animate-rise-in mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '400ms' }}
          >
            <Link
              href="#explore"
              onClick={(e) => smoothScrollTo('#explore', e)}
              className="lift group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-md hover:scale-105 transition-all duration-300"
            >
              Start with a feeling
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:text-aurora hover:border-aurora/40 hover:scale-105 shadow-sm"
            >
              Start your own atlas
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── The three ways in ────────────────────────────────────────────── */}
      <motion.div style={waysStyle} className="relative border-t border-white/15">
        <div className="shell">
          <ul className="grid grid-cols-1 sm:grid-cols-3">
            {WAYS_IN.map(({ href, label, detail, Icon }, i) => (
              <li key={href} className={i > 0 ? 'sm:border-l sm:border-white/15' : undefined}>
                <Link
                  href={href}
                  onClick={(e) => smoothScrollTo(href, e)}
                  className="group flex items-center gap-3 px-0 py-5 transition-colors duration-200 sm:px-6"
                >
                  <Icon
                    className="h-5 w-5 shrink-0 text-aurora transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold tracking-widest text-white uppercase transition-colors duration-200 group-hover:text-aurora drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {label}
                    </span>
                    <span className="block truncate text-sm font-medium text-white/90 transition-colors duration-200 group-hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {detail}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
