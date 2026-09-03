'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navigation from '@/sections/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
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
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [stage, setStage] = useState(0);
  const minTimeElapsedRef = useRef(false);
  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  // Immediate theme detection prior to hydration
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'light' || attr === 'dark') {
        setResolvedTheme(attr);
        return;
      }
      try {
        const saved = localStorage.getItem('atlasaura-theme');
        if (saved === 'light' || saved === 'dark') {
          setResolvedTheme(saved);
          return;
        }
      } catch {}
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        setResolvedTheme('light');
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (theme) setResolvedTheme(theme);
  }, [theme]);

  const isDay = resolvedTheme === 'light';

  // Smart stage messages advancing as resources buffer
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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
    }, reduced ? 100 : 1050);

    // Maximum safety timeout (2600ms) so user is never blocked on very slow connections
    const maxTimer = setTimeout(() => {
      tryComplete();
    }, reduced ? 200 : 2600);

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

  // Smart status label
  const statusMessage = isReady
    ? 'Atlas Synchronized'
    : isDay
    ? stage === 0
      ? 'Calibrating Coordinates...'
      : stage === 1
      ? 'Mapping Sunlit Horizons...'
      : 'Buffering Panoramic Media...'
    : stage === 0
    ? 'Aligning Celestial Grid...'
    : stage === 1
    ? 'Tracing Cosmic Meridians...'
    : 'Buffering Aurora Chronicles...';

  // Dynamic progress value (0 -> 0.35 -> 0.65 -> 1.0)
  const progressScale = isReady ? 1 : stage === 0 ? 0.35 : stage === 1 ? 0.65 : 0.88;

  return (
    <motion.div
      aria-hidden="true"
      data-splash-veil=""
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, scale: 1.015 }}
      transition={{ duration: 0.65, ease: EASE }}
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden select-none transition-colors duration-500 ${
        isDay ? 'bg-[#F5F8FC] text-[#0B1020]' : 'bg-[#080B14] text-white'
      }`}
    >
      {/* Ambient background atmosphere */}
      {isDay ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(10, 122, 105, 0.08) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 80%)',
            }}
          />
          <div className="graticule pointer-events-none absolute inset-0 opacity-20 invert" aria-hidden="true" />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(62, 232, 200, 0.12) 0%, rgba(139, 127, 245, 0.08) 50%, transparent 80%)',
            }}
          />
          <div className="graticule pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="aurora-wash pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        </>
      )}

      <div className="relative flex flex-col items-center px-6 text-center select-none">
        {/* Animated Astrolabe & Meridian Navigation Emblem */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="relative"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              viewBox="0 0 48 48"
              className={`h-24 w-24 ${
                isDay
                  ? 'drop-shadow-[0_4px_16px_rgba(10,122,105,0.25)]'
                  : 'drop-shadow-[0_0_24px_rgba(62,232,200,0.4)]'
              }`}
              aria-hidden="true"
            >
              {/* Outer Azimuth Compass Ring with Graduations */}
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke={isDay ? '#0A7A69' : '#3EE8C8'}
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity={isDay ? 0.45 : 0.4}
              />
              <motion.circle
                cx="24"
                cy="24"
                r="18"
                fill="none"
                stroke={isDay ? '#0A7A69' : '#3EE8C8'}
                strokeWidth="1.3"
                opacity={isDay ? 0.75 : 0.65}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={draw(0)}
              />
              {/* Inclined Ellipse (Orbital Latitude) */}
              <motion.ellipse
                cx="24"
                cy="24"
                rx="8"
                ry="18"
                fill="none"
                stroke={isDay ? '#0D9488' : '#3EE8C8'}
                strokeWidth="1.2"
                opacity={isDay ? 0.6 : 0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={draw(0.15)}
              />
              {/* Equator Axis */}
              <motion.line
                x1="6"
                y1="24"
                x2="42"
                y2="24"
                stroke={isDay ? '#D97706' : '#818CF8'}
                strokeWidth="1.2"
                opacity={isDay ? 0.65 : 0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={draw(0.25)}
              />
            </svg>
          </motion.div>

          {/* Central Beacon Coordinate Node (Fixed, Pulsing) */}
          <div className="absolute pointer-events-none">
            <motion.div
              className={`h-3 w-3 rounded-full ${
                isDay ? 'bg-[#0A7A69] shadow-[0_0_12px_#0A7A69]' : 'bg-[#3EE8C8] shadow-[0_0_14px_#3EE8C8]'
              }`}
              initial={{ scale: 0 }}
              animate={
                reduced
                  ? { scale: 1 }
                  : { scale: [1, 1.35, 1], opacity: [0.9, 1, 0.9] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Glowing Ambient Aura behind emblem */}
          <span
            className={`absolute -inset-4 rounded-full blur-2xl pointer-events-none ${
              isDay ? 'bg-[#0A7A69]/15' : 'bg-[#3EE8C8]/15'
            }`}
          />
        </div>

        {/* Brand Title */}
        <h1
          className={`mt-6 font-sans text-2xl font-semibold tracking-tight ${
            isDay
              ? 'text-[#0B1020] drop-shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
              : 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
          }`}
        >
          Atlas<span className={isDay ? 'text-[#0A7A69]' : 'text-[#3EE8C8]'}>Aura</span>
        </h1>

        {/* Dynamic Status Capsule */}
        <div
          className={`mt-3.5 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
            isDay
              ? 'bg-[#0A7A69]/8 border border-[#0A7A69]/20 text-[#0A7A69]'
              : 'bg-white/5 border border-white/10 text-white/70'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isReady
                ? isDay
                  ? 'bg-[#0A7A69] animate-ping'
                  : 'bg-[#3EE8C8] animate-ping'
                : 'bg-current animate-pulse'
            }`}
          />
          <span>{statusMessage}</span>
        </div>

        {/* Hairline Smart Progress Bar */}
        <div
          className={`mt-6 h-[2px] w-48 rounded-full overflow-hidden border ${
            isDay
              ? 'bg-[#0B1020]/10 border-[#0B1020]/5'
              : 'bg-white/10 border-white/5 backdrop-blur-sm'
          }`}
        >
          <motion.span
            className={`block h-full w-full origin-left ${
              isDay
                ? 'bg-gradient-to-r from-[#0A7A69] via-[#0D9488] to-[#D97706]'
                : 'bg-gradient-to-r from-[#3EE8C8] via-[#2DD4BF] to-[#818CF8]'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progressScale }}
            transition={{
              duration: isReady ? 0.35 : 0.8,
              ease: isReady ? 'easeOut' : 'easeInOut',
            }}
          />
        </div>

        {/* Skip hint */}
        <p
          className={`mt-4 text-[10px] font-mono tracking-widest uppercase transition-opacity duration-300 ${
            isDay ? 'text-[#55658A]/50' : 'text-white/30'
          }`}
        >
          Press any key or click to enter
        </p>
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
