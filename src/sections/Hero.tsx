'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Compass, Map, BookOpen } from 'lucide-react';
import { smoothScrollTo } from '@/lib/utils';
import SeamlessHeroVideo from '@/components/SeamlessHeroVideo';

const HERO_VIDEO_NIGHT =
  process.env.NEXT_PUBLIC_HERO_VIDEO_NIGHT ||
  process.env.NEXT_PUBLIC_HERO_VIDEO ||
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

const HERO_VIDEO_DAY =
  process.env.NEXT_PUBLIC_HERO_VIDEO_DAY ||
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

/* ── Fallback hero images — used ONLY if video fails or cannot load ── */
const HERO_POSTER_NIGHT = '/hero-bg.jpg';
const HERO_POSTER_DAY = '/hero-bg-day.jpg';

const WAYS_IN = [
  { href: '#explore', label: 'By feeling', detail: 'Describe the mood, not the place', Icon: Compass },
  { href: '#world-map', label: 'By place', detail: 'Open the map and wander', Icon: Map },
  { href: '#stories', label: 'By story', detail: "Read someone's account first", Icon: BookOpen },
];

interface HeroProps {
  onVideoReady?: () => void;
}

export default function Hero({ onVideoReady }: HeroProps = {}) {
  const ref = useRef<HTMLElement>(null);

  /* Fallback triggers only if video fails or times out */
  const [useNightFallback, setUseNightFallback] = useState(false);
  const [useDayFallback, setUseDayFallback] = useState(false);

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
        {/* Night Layer (Pure Seamless Infinite Video + Scrim) */}
        <div aria-hidden="true" className="hero-layer theme-night-only bg-[#080B14]">
          {useNightFallback ? (
            <Image
              src={HERO_POSTER_NIGHT}
              alt=""
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-out opacity-100"
            />
          ) : (
            <SeamlessHeroVideo
              src={HERO_VIDEO_NIGHT}
              crossfadeDuration={1.4}
              className="hero-media z-0"
              onPlaying={onVideoReady}
              onError={() => {
                setUseNightFallback(true);
                onVideoReady?.();
              }}
            />
          )}
          <div className="hero-scrim-night pointer-events-none absolute inset-0 z-[3]" />
        </div>

        {/* Day Layer (Pure Seamless Infinite Day Video + Scrim) */}
        <div aria-hidden="true" className="hero-layer theme-day-only bg-[#F5F8FC]">
          {useDayFallback ? (
            <Image
              src={HERO_POSTER_DAY}
              alt=""
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-out opacity-100"
            />
          ) : (
            <SeamlessHeroVideo
              src={HERO_VIDEO_DAY}
              crossfadeDuration={1.4}
              className="hero-media z-0"
              onPlaying={onVideoReady}
              onError={() => {
                setUseDayFallback(true);
                onVideoReady?.();
              }}
            />
          )}
          <div className="hero-scrim-day pointer-events-none absolute inset-0 z-[3]" />
        </div>
      </motion.div>

      {/* ── Copy (Hot Air Balloon Buoyant Ascent) ─────────────────────────── */}
      <motion.div
        className="shell flex flex-1 flex-col justify-center pb-8 pt-28 lg:pt-32"
        style={copyStyle}
      >
        <div className="max-w-[46rem]">
          <div className="animate-fade-rise flex items-center gap-4">
            <span className="t-label text-aurora font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              A travel atlas with no star ratings
            </span>
            <span className="h-px flex-1 bg-white/20" />
          </div>

          <h1
            className="t-display animate-fade-rise mt-7 text-balance text-foreground leading-[1.08] tracking-[-0.015em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
          >
            <span className="font-serif italic font-normal text-[#0B4F52] dark:text-[#2DD4BF] drop-shadow-[0_2px_14px_rgba(11,79,82,0.35)]">
              Somewhere
            </span>{' '}
            <span className="font-normal text-foreground/95">in here is the trip</span>{' '}
            <span className="font-normal text-foreground/80">you&rsquo;ll still be describing</span>{' '}
            <span className="font-serif italic font-medium text-[#0B4F52] dark:text-aurora">
              in ten years.
            </span>
          </h1>

          <p
            className="t-lead animate-fade-rise-delay mt-6 max-w-xl text-foreground/90 font-normal leading-relaxed text-base sm:text-lg drop-shadow-[0_1px_8px_rgba(0,0,0,0.1)]"
          >
            First-hand accounts from <strong className="font-semibold text-foreground">120 countries</strong> — what people saw, what it cost, and what they&rsquo;d do differently.
          </p>

          <div
            className="animate-fade-rise-delay-2 mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="#explore"
              onClick={(e) => smoothScrollTo('#explore', e)}
              className="lift group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              <span>Start with a feeling</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-white/45 hover:bg-white/20 hover:scale-[1.02] shadow-sm"
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
