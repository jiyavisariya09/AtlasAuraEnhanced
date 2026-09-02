'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navigation from '@/sections/Navigation';
import { useAuth } from '@/context/AuthContext';
import Hero from '@/sections/Hero';
import MoodSearch from '@/sections/MoodSearch';

/* ── Dynamic imports for below-fold sections ────────────────────────────────
   These components are NOT in the initial viewport, so code-splitting them
   cuts the first-load JS bundle significantly — critical on minimal hardware.
   Each chunk loads in parallel as the browser idles after first paint.        */

const CountryStories = dynamic(() => import('@/sections/CountryStories'));
const HiddenGems = dynamic(() => import('@/sections/HiddenGems'));
const Passage = dynamic(() => import('@/sections/Passage'));
const CuriosityFeed = dynamic(() => import('@/sections/CuriosityFeed'));
const UserFeatures = dynamic(() => import('@/sections/UserFeatures'));
const Footer = dynamic(() => import('@/sections/Footer'));

const WorldMap = dynamic(() => import('@/sections/WorldMap'), {
  ssr: false,
  loading: () => (
    <section id="world-map" className="relative h-[320svh] bg-[#FBF9F5] dark:bg-[#0B0F14]">
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center">
        <div className="shell">
          <div
            className="rounded-3xl border border-border bg-muted/30 w-full max-w-6xl aspect-[16/9] max-h-[68svh] mx-auto"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

interface LoadingScreenProps {
  isReady: boolean;
  onComplete: () => void;
}

function LoadingScreen({ isReady, onComplete }: LoadingScreenProps) {
  const reduced = useReducedMotion();
  const minTimeElapsedRef = useRef(false);
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const tryComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Minimum 1000ms so the brand draw animation plays smoothly and intentionally
    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
      if (isReadyRef.current) {
        tryComplete();
      }
    }, reduced ? 100 : 1100);

    // Maximum safety timeout (2400ms) so user is never blocked on very slow connections
    const maxTimer = setTimeout(() => {
      tryComplete();
    }, reduced ? 200 : 2400);

    const skip = () => tryComplete();
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [tryComplete, reduced]);

  // When video becomes ready and min time has passed, lift the veil
  useEffect(() => {
    if (isReady && minTimeElapsedRef.current) {
      tryComplete();
    }
  }, [isReady, tryComplete]);

  const draw = (delay: number) =>
    reduced
      ? { duration: 0 }
      : { duration: 0.75, delay, ease: EASE };

  return (
    <motion.div
      aria-hidden="true"
      data-splash-veil=""
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#080B14] text-white"
    >
      <div className="graticule pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="aurora-wash pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative flex flex-col items-center px-6 text-center select-none">
        {/* Animated Emblem: Drawing equator, meridian, axis, and glowing pin */}
        <div className="relative">
          <svg viewBox="0 0 32 32" className="h-24 w-24 drop-shadow-[0_0_24px_rgba(62,232,200,0.4)]" aria-hidden="true">
            <motion.circle
              cx="16"
              cy="16"
              r="11"
              fill="none"
              stroke="#3EE8C8"
              strokeWidth="1.25"
              opacity="0.6"
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
              stroke="#3EE8C8"
              strokeWidth="1.25"
              opacity="0.45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={draw(0.15)}
            />
            <motion.line
              x1="5"
              y1="16"
              x2="27"
              y2="16"
              stroke="#3EE8C8"
              strokeWidth="1.25"
              opacity="0.45"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={draw(0.25)}
            />
            <motion.circle
              cx="21.2"
              cy="10.4"
              r="2.5"
              fill="#3EE8C8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, delay: 0.45, ease: EASE }}
              style={{ transformOrigin: '21.2px 10.4px' }}
            />
          </svg>
          <span className="absolute -inset-2 rounded-full bg-aurora/10 blur-xl animate-pulse pointer-events-none" />
        </div>

        <h1 className="mt-6 font-sans text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Atlas<span className="text-[#3EE8C8]">Aura</span>
        </h1>
        
        <p className="font-mono text-xs text-white/60 tracking-[0.2em] uppercase mt-2.5">
          {isReady ? 'Atlas Synchronized' : 'Buffering Chronicles...'}
        </p>

        {/* Hairline Progress Bar */}
        <div className="mt-7 h-[2px] w-44 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border border-white/5">
          <motion.span
            className="block h-full w-full origin-left bg-gradient-to-r from-[#3EE8C8] via-[#2DD4BF] to-[#818CF8]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isReady ? 1 : 0.85 }}
            transition={{
              duration: isReady ? 0.3 : 1.6,
              ease: isReady ? 'easeOut' : 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isLoggedIn, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      signOut();
    }
  };

  const handleVideoReady = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>[data-splash-veil]{display:none !important}</style>',
        }}
      />

      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            isReady={isVideoReady}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      <Navigation isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} />
      <main>
        <Hero onVideoReady={handleVideoReady} />
        <MoodSearch />
        <WorldMap />
        <CountryStories />
        <HiddenGems />
        <Passage />
        <CuriosityFeed isLoggedIn={isLoggedIn} />
        <UserFeatures isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
