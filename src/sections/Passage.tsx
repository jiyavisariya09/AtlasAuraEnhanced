'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

/* ============================================================================
   The passage — the page's one cinematic set-piece.
   Four accounts share one frame with silky-smooth concurrent cross-fading.
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
    // Smooth, stable segmentation giving generous 185svh scroll runway per story
    const nextIndex = Math.min(TOTAL - 1, Math.max(0, Math.floor(clamped * TOTAL)));
    setActive((prev) => (prev !== nextIndex ? nextIndex : prev));
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
      const rect = el.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const travel = el.offsetHeight - window.innerHeight;
      const targetScroll = top + travel * ((index + 0.5) / TOTAL);
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    },
    [],
  );

  return (
    <section ref={ref} id="passage" className="hairline-t relative h-[750svh]">
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
            {/* ── Left Column: Words with Smooth Parallel Fade (Zero Blank Frames) ──────── */}
            <div className="relative w-full min-h-[260px] sm:min-h-[300px] flex items-center">
              {ACCOUNTS.map((account, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={account.id}
                    className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'opacity-100 translate-y-0 relative pointer-events-auto z-10'
                        : 'opacity-0 translate-y-3 absolute inset-x-0 pointer-events-none z-0'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-aurora animate-pulse" aria-hidden="true" />
                      <p className="t-data font-mono text-xs sm:text-sm tracking-wider text-muted-foreground">
                        {account.coord}
                      </p>
                    </div>

                    <blockquote className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[2.6rem] font-normal leading-[1.2] text-foreground text-balance">
                      <span aria-hidden="true" className="text-aurora mr-1 font-serif">&ldquo;</span>
                      {account.quote}
                      <span aria-hidden="true" className="text-aurora ml-1 font-serif">&rdquo;</span>
                    </blockquote>

                    <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="t-label text-base sm:text-lg font-semibold tracking-tight text-foreground">
                        {account.place}
                      </span>
                      <span className="text-sm text-muted-foreground">· {account.country}</span>
                    </div>

                    <p className="t-data mt-2 text-xs sm:text-sm text-muted-foreground font-mono">
                      {account.meta}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ── Right Column: Photographic Frame with Smooth Hardware Cross-Fade ───── */}
            <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[480px] xl:h-[540px] max-h-[62svh] min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-card/60 shadow-cast shorter:hidden">
              {ACCOUNTS.map((account, i) => {
                const isActive = i === active;
                const videoSrc = VIDEOS[i];
                return (
                  <div
                    key={account.id}
                    className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-[1.03] pointer-events-none z-0'
                    }`}
                  >
                    <img
                      src={account.image}
                      alt={`${account.place}, ${account.country}`}
                      decoding="async"
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                    {/* Subtle dark vignette overlay for depth */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {videoSrc && isActive && (
                      <video
                        src={videoSrc}
                        poster={account.image}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
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
                          className="absolute inset-y-0 left-0 bg-aurora rounded-full transition-all duration-100 ease-linear"
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
