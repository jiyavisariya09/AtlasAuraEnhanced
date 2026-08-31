'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navigation from '@/sections/Navigation';
import { getCurrentUser, type AuthUser } from '@/lib/auth';
import Hero from '@/sections/Hero';
import MoodSearch from '@/sections/MoodSearch';
import CountryStories from '@/sections/CountryStories';
import HiddenGems from '@/sections/HiddenGems';
import Passage from '@/sections/Passage';
import CuriosityFeed from '@/sections/CuriosityFeed';
import UserFeatures from '@/sections/UserFeatures';
import Footer from '@/sections/Footer';

/* `ssr: false` is not optional here — Leaflet reaches for `window` as it loads.
   But that alone would leave `#world-map` out of the server HTML entirely, so a
   cold visit to /#world-map (and the hero's own "Explore the atlas" link) would
   have no element to scroll to. The fallback holds the anchor and the 600px the
   map will occupy, so the document does not jump when the real one arrives. */
const WorldMap = dynamic(() => import('@/sections/WorldMap'), {
  ssr: false,
  loading: () => (
    <section id="world-map" className="hairline-t section-y">
      <div className="shell">
        <div
          className="rounded-3xl border border-border bg-muted/30"
          style={{ height: '600px' }}
          aria-hidden="true"
        />
      </div>
    </section>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const SPLASH_MS = 1400;

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    /* The old hold was 2200ms and the page below wasn't mounted until it ended,
       so every visit began with two and a bit seconds of a spinner. The global
       reduced-motion rule zeroes CSS durations but cannot touch a JS timer, so
       that case is shortened here as well. */
    const timer = setTimeout(onComplete, reduced ? 200 : SPLASH_MS);
    /* And nobody should be held at a splash they have already seen. */
    const skip = () => onComplete();
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [onComplete, reduced]);

  const draw = (delay: number) =>
    reduced
      ? { duration: 0 }
      : { duration: 0.75, delay, ease: EASE };

  return (
    /* aria-hidden rather than role="status": the real page is mounted underneath
       this veil, so there is nothing to announce as loading and a screen reader
       should go straight to the content. */
    <motion.div
      aria-hidden="true"
      data-splash-veil=""
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
    >
      <div className="graticule pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="aurora-wash pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-col items-center px-6">
        {/* The mark draws itself — equator, then meridian, then the axis, then
            the pin lands. It is the header's logo at three times the size, so
            the first thing the site does is construct its own emblem. */}
        <svg viewBox="0 0 32 32" className="h-24 w-24" aria-hidden="true">
          <motion.circle
            cx="16"
            cy="16"
            r="11"
            fill="none"
            stroke="hsl(var(--aurora))"
            strokeWidth="1.25"
            opacity="0.55"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={draw(0)}
          />
          <motion.ellipse
            cx="16"
            cy="16"
            rx="4.6"
            ry="11"
            fill="none"
            stroke="hsl(var(--aurora))"
            strokeWidth="1.25"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={draw(0.18)}
          />
          <motion.line
            x1="5"
            y1="16"
            x2="27"
            y2="16"
            stroke="hsl(var(--aurora))"
            strokeWidth="1.25"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={draw(0.3)}
          />
          <motion.circle
            cx="21.2"
            cy="10.4"
            r="2.5"
            fill="hsl(var(--aurora))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.52, ease: EASE }}
            style={{ transformOrigin: '21.2px 10.4px' }}
          />
        </svg>

        <h1 className="mt-6 font-sans text-2xl font-semibold tracking-tight text-foreground">
          Atlas<span className="text-aurora">Aura</span>
        </h1>
        <p className="t-label mt-3 text-muted-foreground">Memories, mapped</p>

        {/* A hairline that fills, echoing the rule between the hero's label and
            its coordinates. It reports the real wait rather than looping. */}
        <div className="mt-8 h-px w-40 bg-border">
          <motion.span
            className="block h-px w-full origin-left bg-aurora"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.2 : SPLASH_MS / 1000, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLoginToggle = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    if (!newState) {
      localStorage.removeItem('atlasaura-user');
      setCurrentUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Without JS, `isLoading` never flips and an opaque veil would sit over a
          page that is otherwise perfectly readable. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>[data-splash-veil]{display:none !important}</style>',
        }}
      />

      <Navigation isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} />
      <main>
        <Hero />
        <MoodSearch />
        <WorldMap />
        <CountryStories />
        <HiddenGems />
        {/* The set-piece sits here deliberately. By this point the reader has
            been through a search, a map and two card grids, so a pinned
            full-bleed frame is a genuine change of gear rather than a second
            helping of the hero. It also re-states the thesis in someone else's
            words right before the feed and the sign-up prompt. */}
        <Passage />
        <CuriosityFeed isLoggedIn={isLoggedIn} />
        <UserFeatures isLoggedIn={isLoggedIn} />
      </main>
      <Footer />

      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed bottom-24 right-8 z-40"
          >
            {/* `.glass` sets the `border` shorthand, so a `border-*` utility
                beside it is decided by stylesheet order. The pill carries its
                own single ring instead. */}
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="animate-pin-pulse absolute inset-0 rounded-full bg-aurora" />
                <span className="relative h-2 w-2 rounded-full bg-aurora" />
              </span>
              <span className="text-sm text-muted-foreground">
                Signed in as{' '}
                <span className="font-medium text-foreground">
                  {currentUser?.name || 'Traveller'}
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
