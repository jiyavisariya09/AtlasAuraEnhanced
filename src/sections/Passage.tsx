'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

/* ============================================================================
   The passage — the page's one cinematic set-piece.

   WHY THE TYPE IS NOT ON THE PHOTOGRAPH
   The picture is left completely unscrimmed and the words sit beside it on solid
   `--background`, where the token contrast is already verified in both themes.

   WHY IT IS PINNED
   Four accounts share one frame: the photograph and words transition smoothly as
   the reader scrolls through the pinned runway. This relies on `position: sticky`
   reaching the viewport.
   ========================================================================== */

const VIDEOS = (process.env.NEXT_PUBLIC_PASSAGE_VIDEOS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

type Account = {
  id: string;
  place: string;
  country: string;
  coord: string;
  quote: string;
  meta: string;
  image: string;
};

const ACCOUNTS: Account[] = [
  {
    id: 'arashiyama',
    place: 'Arashiyama',
    country: 'Japan',
    coord: '35.0094° N  135.6667° E',
    quote: 'The bamboo made a sound I have never been able to describe to anyone since.',
    meta: '9 days · ₹94,000 · went in November',
    image: '/images/memories/japan.jpg',
  },
  {
    id: 'chefchaouen',
    place: 'Chefchaouen',
    country: 'Morocco',
    coord: '35.1688° N  5.2636° W',
    quote: 'We were lost for three hours. That turned out to be the part I still think about.',
    meta: '6 days · ₹58,000 · went in March',
    image: '/images/memories/morocco.jpg',
  },
  {
    id: 'vik',
    place: 'Vík í Mýrdal',
    country: 'Iceland',
    coord: '63.4187° N  19.0060° W',
    quote: 'It rained the entire week. I would leave again tomorrow.',
    meta: '8 days · ₹1,42,000 · went in September',
    image: '/images/memories/iceland.jpg',
  },
  {
    id: 'lofoten',
    place: 'Lofoten',
    country: 'Norway',
    coord: '68.2094° N  13.6103° E',
    quote: 'At two in the morning it was still bright enough to read a map.',
    meta: '7 days · ₹1,18,000 · went in June',
    image: '/images/memories/norway.jpg',
  },
];

const TOTAL = ACCOUNTS.length;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Passage() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progressVal, setProgressVal] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const updateFromProgress = useCallback((latest: number) => {
    const clamped = Math.max(0, Math.min(0.9999, latest));
    setProgressVal(clamped);
    const nextIndex = Math.min(TOTAL - 1, Math.max(0, Math.floor(clamped * TOTAL)));
    setActive(nextIndex);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    updateFromProgress(latest);
  });

  useEffect(() => {
    updateFromProgress(scrollYProgress.get());
  }, [scrollYProgress, updateFromProgress]);

  const goTo = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      const targetScroll = top + travel * ((index + 0.5) / TOTAL);
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: targetScroll,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });
    },
    [],
  );

  const currentAccount = ACCOUNTS[active] ?? ACCOUNTS[0];
  const currentVideo = VIDEOS[active];

  return (
    <section ref={ref} id="passage" className="hairline-t relative h-[570svh]">
      <div className="sticky top-0 h-[100svh] pt-16 pb-6 lg:pb-10 short:pb-3 flex flex-col justify-between">
        <div className="shell flex h-full flex-col justify-between gap-4 lg:gap-8 short:gap-2">
          {/* Eyebrow Header */}
          <div className="flex shrink-0 items-center gap-4">
            <h2 className="t-label shrink-0 text-aurora uppercase tracking-widest text-xs">
              Nobody gave these places a score
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Core Content Grid */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 short:gap-y-3 items-center">
            {/* ── Left Column: Words with AnimatePresence (No Overlap) ──────── */}
            <div className="relative w-full flex min-h-[260px] sm:min-h-[300px] flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAccount.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse" aria-hidden="true" />
                    <p className="t-data font-mono text-xs sm:text-sm tracking-wider text-muted-foreground">
                      {currentAccount.coord}
                    </p>
                  </div>

                  <blockquote className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-normal leading-[1.2] text-foreground text-balance">
                    <span aria-hidden="true" className="text-aurora mr-1 font-serif">&ldquo;</span>
                    {currentAccount.quote}
                    <span aria-hidden="true" className="text-aurora ml-1 font-serif">&rdquo;</span>
                  </blockquote>

                  <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="t-label text-base sm:text-lg font-semibold tracking-tight text-foreground">
                      {currentAccount.place}
                    </span>
                    <span className="text-sm text-muted-foreground">· {currentAccount.country}</span>
                  </div>

                  <p className="t-data mt-2 text-xs sm:text-sm text-muted-foreground font-mono">
                    {currentAccount.meta}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right Column: Photographic Frame with Smooth Cross-Fade ───── */}
            <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[480px] xl:h-[540px] max-h-[62svh] min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-card/60 shadow-cast shorter:hidden">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentAccount.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentAccount.image}
                    alt={`${currentAccount.place}, ${currentAccount.country}`}
                    decoding="async"
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
                  {/* Subtle dark vignette overlay for depth */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                  {currentVideo && (
                    <video
                      src={currentVideo}
                      poster={currentAccount.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Navigation Rail ───────────────────────────────────────────── */}
          <nav aria-label="Accounts in this passage" className="shrink-0 pt-2 pb-1">
            <ul className="grid grid-cols-4 gap-3 sm:gap-6">
              {ACCOUNTS.map((account, i) => {
                const segStart = i / TOTAL;
                const segEnd = (i + 1) / TOTAL;
                let fillPct = 0;
                if (progressVal >= segEnd) {
                  fillPct = 1;
                } else if (progressVal > segStart) {
                  fillPct = (progressVal - segStart) / (segEnd - segStart);
                }
                const isCurrent = active === i;

                return (
                  <li key={account.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isCurrent ? 'true' : undefined}
                      className="group block w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aurora rounded-sm"
                    >
                      <div className="relative h-1 w-full overflow-hidden rounded-full bg-border transition-colors group-hover:bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 bg-aurora rounded-full transition-all duration-75"
                          style={{ width: `${Math.max(0, Math.min(1, fillPct)) * 100}%` }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`t-label block truncate text-xs sm:text-sm transition-colors duration-200 ${
                            isCurrent
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        >
                          {account.place}
                        </span>
                        <span className={`text-[10px] hidden sm:inline-block font-mono ${isCurrent ? 'text-aurora font-medium' : 'text-muted-foreground/50'}`}>
                          0{i + 1}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
