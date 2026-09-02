'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

export default function Passage() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Switch story index when crossing segment threshold
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(0.9999, latest));
    const nextIndex = Math.min(TOTAL - 1, Math.max(0, Math.floor(clamped * TOTAL)));
    setActive((prev) => (prev !== nextIndex ? nextIndex : prev));
  });

  useEffect(() => {
    const initial = scrollYProgress.get();
    const clamped = Math.max(0, Math.min(0.9999, initial));
    const nextIndex = Math.min(TOTAL - 1, Math.max(0, Math.floor(clamped * TOTAL)));
    setActive(nextIndex);
  }, [scrollYProgress]);

  // Smooth GPU Progress Bars for each segment
  const bar0 = useTransform(scrollYProgress, [0, 0.25], ['0%', '100%'], { clamp: true });
  const bar1 = useTransform(scrollYProgress, [0.25, 0.50], ['0%', '100%'], { clamp: true });
  const bar2 = useTransform(scrollYProgress, [0.50, 0.75], ['0%', '100%'], { clamp: true });
  const bar3 = useTransform(scrollYProgress, [0.75, 1.0], ['0%', '100%'], { clamp: true });
  const progressBars = [bar0, bar1, bar2, bar3];

  const goTo = useCallback((index: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const targetScroll = top + travel * ((index + 0.15) / TOTAL);
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  }, []);

  const nextStory = () => {
    goTo((active + 1) % TOTAL);
  };

  const prevStory = () => {
    goTo((active - 1 + TOTAL) % TOTAL);
  };

  const currentAccount = ACCOUNTS[active] ?? ACCOUNTS[0];
  const currentVideo = VIDEOS[active];

  return (
    <section ref={ref} id="passage" className="relative h-[485svh] bg-background text-foreground">
      {/* ── Sticky Viewport Window (Centered & Balanced Layout) ───────────── */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center pt-20 pb-10">
        <div className="shell flex flex-col justify-center gap-6 sm:gap-8 w-full max-w-7xl">
          {/* Eyebrow Header (Sits with clean, natural proximity to the quote) */}
          <div className="flex shrink-0 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-aurora animate-pulse" />
              <h2 className="t-label text-aurora uppercase tracking-[0.22em] text-xs font-semibold">
                Nobody gave these places a score
              </h2>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center min-h-[360px] lg:min-h-[420px]">
            {/* ── Left Column: Words with AnimatePresence (Zero Overlapping Text) ─ */}
            <div className="lg:col-span-6 relative min-h-[240px] sm:min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAccount.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="w-full"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-aurora" />
                    <span>{currentAccount.coord}</span>
                  </div>

                  <blockquote className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-normal leading-[1.2] text-foreground text-balance">
                    <span aria-hidden="true" className="text-aurora mr-1 font-serif">&ldquo;</span>
                    {currentAccount.quote}
                    <span aria-hidden="true" className="text-aurora ml-1 font-serif">&rdquo;</span>
                  </blockquote>

                  <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                      {currentAccount.place}
                    </span>
                    <span className="text-sm text-muted-foreground">&bull; {currentAccount.country}</span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-mono">
                    {currentAccount.meta}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right Column: Photographic Frame with Smooth Cross-Fade (No Border) ── */}
            <div className="lg:col-span-6 relative h-[280px] sm:h-[360px] lg:h-[480px] xl:h-[520px] max-h-[62svh] min-h-0 flex-1 overflow-hidden rounded-3xl bg-card shadow-2xl">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentAccount.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentAccount.image}
                    alt={`${currentAccount.place}, ${currentAccount.country}`}
                    decoding="async"
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
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

          {/* ── Navigation Progress Rail at Bottom (Scroll Scrubbed) ───────── */}
          <nav aria-label="Accounts in this passage" className="shrink-0 pt-2 pb-1">
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {ACCOUNTS.map((account, i) => {
                const isCurrent = active === i;

                return (
                  <li key={account.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isCurrent ? 'true' : undefined}
                      className="group block w-full text-left focus:outline-none cursor-pointer"
                    >
                      {/* Progress Bar Line Driven by Scroll Progress */}
                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border transition-colors group-hover:bg-muted">
                        <motion.div
                          style={{ width: progressBars[i] }}
                          className="h-full bg-aurora rounded-full transform-gpu"
                        />
                      </div>

                      {/* Place Label & Index */}
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className={`block truncate text-xs sm:text-sm transition-colors duration-200 ${
                            isCurrent
                              ? 'text-foreground font-semibold'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        >
                          {account.place}
                        </span>
                        <span
                          className={`text-xs font-mono font-medium transition-colors ${
                            isCurrent ? 'text-aurora' : 'text-muted-foreground/40'
                          }`}
                        >
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
