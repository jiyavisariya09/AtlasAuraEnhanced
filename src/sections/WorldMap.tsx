'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { MapPin } from 'lucide-react';

/* ── Memory Data ───────────────────────────────────────────────────────────
   Five travel memories that assemble into a masonry grid as the user scrolls.
   The primary memory starts full-screen and shrinks; the other four fly in
   from off-screen edges.                                                    */

interface Memory {
  id: string;
  country: string;
  city: string;
  location: string;
  coordinates: string;
  author: string;
  date: string;
  quote: string;
  dayImage: string;
  nightImage: string;
}

const MEMORIES: Memory[] = [
  {
    id: 'japan',
    country: 'Japan',
    city: 'Kyoto',
    location: 'Kyoto & Ueno Dawn',
    coordinates: '35.6762° N, 139.6503° E',
    author: 'Sarah Chen',
    date: 'April 2024',
    quote:
      'First cherry blossom dawn in Ueno. As the morning mist lifted off the pond, the petals fell with quiet, breathless grace.',
    dayImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    nightImage:
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'morocco',
    country: 'Morocco',
    city: 'Chefchaouen',
    location: 'Blue Medina Twilight',
    coordinates: '35.1688° N, 5.2636° W',
    author: 'Elena Vasquez',
    date: 'March 2024',
    quote:
      'Lost for three hours in blue-painted alleyways. That was the best part of the whole trip.',
    dayImage:
      'https://images.unsplash.com/photo-1553603227-2358aabe821e?auto=format&fit=crop&w=1600&q=85',
    nightImage:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'norway',
    country: 'Norway',
    city: 'Lofoten',
    location: 'Arctic Fjord Silence',
    coordinates: '68.2094° N, 13.6103° E',
    author: 'Lars Eriksson',
    date: 'June 2024',
    quote:
      'At two in the morning it was still bright enough to read a map. Nobody else was awake.',
    dayImage:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85',
    nightImage:
      'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'greece',
    country: 'Greece',
    city: 'Santorini',
    location: 'Aegean Golden Hour',
    coordinates: '36.3932° N, 25.4615° E',
    author: 'Maia Kostas',
    date: 'September 2024',
    quote:
      'The domes turned gold at sunset. Nobody on the terrace spoke for a full minute.',
    dayImage:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
    nightImage:
      'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'indonesia',
    country: 'Indonesia',
    city: 'Bali',
    location: 'Tegallalang Terraces',
    coordinates: '8.4312° S, 115.2792° E',
    author: 'Ravi Patel',
    date: 'November 2024',
    quote:
      'Emerald steps carved into the mountain, old as the island itself. Time moved differently here.',
    dayImage:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85',
    nightImage:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=85',
  },
];

/* ── Fly-in vectors per secondary tile ─────────────────────────────────── */
const FLY_IN = [
  { x: 320, y: -240 },  // Morocco:   from top-right
  { x: 380, y: 0 },     // Norway:    from right
  { x: -320, y: 260 },  // Greece:    from bottom-left
  { x: 320, y: 260 },   // Indonesia: from bottom-right
];

/* ── Spring config shared across all scroll-driven motion values ───────── */
const SPRING = { stiffness: 60, damping: 26, mass: 0.65, restDelta: 0.0001 };

export default function WorldMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll tracking ─────────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /* Fluid Spring Physics Damper: converts discrete mousewheel notches
     into buttery-smooth continuous momentum — slightly weighted for luxurious gliding. */
  const smooth = useSpring(scrollYProgress, SPRING);

  /* ═══════════════════════════════════════════════════════════════════════
     PHASE MAP  (all values are scroll progress 0 → 1)
     ───────────────────────────────────────────────────────────────────────
     0.00 – 0.04  Section enters viewport
     0.02 – 0.12  Section header fades in
     0.00 – 0.16  Full hero image holds
     0.12 – 0.28  Full hero fades out
     0.10 – 0.26  Primary masonry tile fades in + slight scale-down
     0.18 – 0.36  Morocco tile flies in from top-right
     0.225 – 0.405 Norway tile flies in from right
     0.27 – 0.45  Greece tile flies in from bottom-left
     0.315 – 0.495 Indonesia tile flies in from bottom-right
     0.50 – 0.64  Text overlays + location badges fade in on all tiles
     0.64 – 1.00  Hold — masonry complete, serene rest
     ═══════════════════════════════════════════════════════════════════════ */

  // ── Section Header ──────────────────────────────────────────────────
  const headerOpacity = useTransform(smooth, [0, 0.02, 0.12], [0, 0, 1]);
  const headerY = useTransform(smooth, [0, 0.02, 0.12], [25, 25, 0]);

  // ── Full Hero Image (Layer 1 — fades away) ──────────────────────────
  const heroOpacity = useTransform(smooth, [0, 0.12, 0.28], [1, 1, 0]);
  const heroScale = useTransform(smooth, [0, 0.28], [1, 1.03]);

  // ── Primary Masonry Tile (Japan — fades in) ─────────────────────────
  const primaryOpacity = useTransform(smooth, [0.10, 0.26], [0, 1]);
  const primaryScale = useTransform(smooth, [0.10, 0.28], [1.08, 1]);

  // ── Secondary Tiles: staggered fly-in custom hook ──────────────────
  const useSecondaryTile = (i: number) => {
    const start = 0.18 + i * 0.045;
    const end = start + 0.18;
    return {
      opacity: useTransform(smooth, [start, start + 0.09], [0, 1]),
      x: useTransform(smooth, [start, end], [FLY_IN[i].x, 0]),
      y: useTransform(smooth, [start, end], [FLY_IN[i].y, 0]),
      scale: useTransform(smooth, [start, end], [0.85, 1]),
    };
  };

  const sec0 = useSecondaryTile(0);
  const sec1 = useSecondaryTile(1);
  const sec2 = useSecondaryTile(2);
  const sec3 = useSecondaryTile(3);

  const secondaryStyles = [sec0, sec1, sec2, sec3];

  // ── Text Overlay Phase ──────────────────────────────────────────────
  const overlayOpacity = useTransform(smooth, [0.50, 0.64], [0, 1]);
  const overlayY = useTransform(smooth, [0.50, 0.64], [14, 0]);

  return (
    <section
      ref={sectionRef}
      id="world-map"
      className="relative h-[340svh] bg-[#FBF9F5] dark:bg-[#0B0F14] text-foreground transition-colors duration-300"
    >
      {/* ── Sticky Viewport Window ─────────────────────────────────────── */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center pt-14 sm:pt-16 lg:pt-20 pb-6 sm:pb-10">
        <div className="shell flex flex-col items-center w-full max-w-7xl h-full">

          {/* ── Section Header ─────────────────────────────────────────── */}
          <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="text-center mb-6 sm:mb-8 max-w-xl mx-auto z-30 shrink-0 select-none transform-gpu"
          >
            <span className="t-label text-aurora font-semibold uppercase tracking-[0.22em] text-xs">
              Living Chronicles &bull; Atlas Memory
            </span>
            <h2 className="t-title mt-1.5 text-foreground text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
              Some places become{' '}
              <span className="font-serif italic text-aurora">memories.</span>
            </h2>
          </motion.div>

          {/* ── Animation Container ────────────────────────────────────── */}
          <div className="relative w-full max-w-6xl flex-1 min-h-0 max-h-[68svh]">

            {/* ─── Layer 1: Full Hero Image (fades out) ─────────────────
                 This is the original single-image hero state. It sits on
                 top so the user sees the full photo first, then it fades
                 away to reveal the assembling masonry underneath.         */}
            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              className="absolute inset-0 rounded-3xl sm:rounded-[32px] overflow-hidden bg-card shadow-2xl transform-gpu will-change-transform z-20"
            >
              <img
                src={isDark ? MEMORIES[0].nightImage : MEMORIES[0].dayImage}
                alt={MEMORIES[0].country}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

              {/* Floating Location Tag */}
              <div className="absolute top-5 left-5 text-xs font-mono text-white/90 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                <span>{MEMORIES[0].country} &bull; {MEMORIES[0].city}</span>
              </div>

              {/* Bottom Chronicle Content */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white max-w-2xl">
                <span className="text-xs font-mono text-aurora font-semibold uppercase tracking-wider">
                  {MEMORIES[0].coordinates}
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-white mt-1 leading-tight">
                  {MEMORIES[0].location}
                </h3>
                <p className="font-serif italic text-sm sm:text-base lg:text-lg text-white/90 mt-1.5 line-clamp-2 leading-relaxed">
                  &ldquo;{MEMORIES[0].quote}&rdquo;
                </p>
                <p className="text-xs font-mono text-white/60 mt-2">
                  Chronicled by {MEMORIES[0].author} &bull; {MEMORIES[0].date}
                </p>
              </div>
            </motion.div>

            {/* ─── Layer 2: Masonry Grid (tiles assemble) ───────────────
                 The grid is always rendered in its final layout. Each tile
                 starts with transforms applied (off-screen / invisible)
                 and animates to identity as scroll progresses.

                 Layout:
                 ┌───────────────┬──────────┐
                 │               │ Morocco  │  row 1
                 │    Japan      ├──────────┤
                 │   (primary)   │  Norway  │  row 2
                 ├───────────────┼──────────┤
                 │    Greece     │Indonesia │  row 3
                 └───────────────┴──────────┘                              */}
            <div className="absolute inset-0 grid grid-cols-[1.35fr_1fr] grid-rows-[1.1fr_0.9fr_0.85fr] gap-2.5 sm:gap-3.5 z-10">

              {/* ── Primary Tile: Japan (tall left, rows 1–2) ─────────── */}
              <motion.div
                style={{ opacity: primaryOpacity, scale: primaryScale }}
                className="row-span-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transform-gpu will-change-transform relative group"
              >
                <img
                  src={isDark ? MEMORIES[0].nightImage : MEMORIES[0].dayImage}
                  alt={MEMORIES[0].country}
                  className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10 pointer-events-none" />

                {/* Text overlay — fades in during the final phase */}
                <motion.div
                  style={{ opacity: overlayOpacity, y: overlayY }}
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white transform-gpu"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3 h-3 text-aurora shrink-0" />
                    <span className="text-[10px] sm:text-xs font-mono text-aurora font-semibold uppercase tracking-wider">
                      {MEMORIES[0].coordinates}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-normal text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {MEMORIES[0].location}
                  </h3>
                  <p className="font-serif italic text-xs sm:text-sm text-white/85 mt-1 line-clamp-2 leading-relaxed hidden sm:block drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                    &ldquo;{MEMORIES[0].quote}&rdquo;
                  </p>
                  <p className="text-[10px] font-mono text-white/50 mt-1.5 hidden sm:block">
                    {MEMORIES[0].author} &bull; {MEMORIES[0].date}
                  </p>
                </motion.div>
              </motion.div>

              {/* ── Secondary Tiles (fly in from edges) ────────────────── */}
              {[MEMORIES[1], MEMORIES[2], MEMORIES[3], MEMORIES[4]].map(
                (memory, i) => (
                  <motion.div
                    key={memory.id}
                    style={secondaryStyles[i]}
                    className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transform-gpu will-change-transform relative group"
                  >
                    <img
                      src={isDark ? memory.nightImage : memory.dayImage}
                      alt={memory.country}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                    {/* Text overlay */}
                    <motion.div
                      style={{ opacity: overlayOpacity, y: overlayY }}
                      className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white transform-gpu"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-aurora shrink-0" />
                        <span className="text-[9px] sm:text-[10px] font-mono text-aurora font-semibold uppercase tracking-wider">
                          {memory.city}, {memory.country}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-lg font-serif font-normal text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                        {memory.location}
                      </h3>
                      <p className="font-serif italic text-[10px] sm:text-xs text-white/80 mt-0.5 line-clamp-1 leading-relaxed hidden sm:block drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                        &ldquo;{memory.quote}&rdquo;
                      </p>
                    </motion.div>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}