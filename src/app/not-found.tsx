'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, Home, Globe2, MapPin, ArrowRight, Sparkles, Footprints } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-16 overflow-hidden selection:bg-aurora selection:text-black">
      {/* ── Ambient Background Glow Washes ─────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0 opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-aurora/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <div className="shell max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* ── Top Status Pill ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-aurora/40 bg-card/75 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.22em] text-[#0B4F52] dark:text-aurora shadow-sm mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora" />
          </span>
          <span>Uncharted Coordinates • 404 Error</span>
        </motion.div>

        {/* ── Animated 404 Illustration with Playful Explorer Cat ─────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center my-4 select-none"
        >
          {/* Ambient Backdrop Circle */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#dcfce7]/60 dark:bg-emerald-950/40 blur-sm pointer-events-none transition-transform duration-700 hover:scale-105" />

          {/* SVG Composition: 404 + Hanging Cat + Yarn/Globe + Plant */}
          <svg
            viewBox="0 0 500 380"
            className="w-full h-full relative z-10 drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Line */}
            <path
              d="M 50 310 L 450 310"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
              strokeDasharray="6 6"
            />

            {/* First "4" */}
            <text
              x="50"
              y="230"
              fontSize="160"
              fontWeight="900"
              fontFamily="var(--font-display), 'Instrument Serif', serif"
              className="fill-foreground/90 select-none"
              letterSpacing="-4"
            >
              4
            </text>

            {/* Last "4" */}
            <text
              x="330"
              y="230"
              fontSize="160"
              fontWeight="900"
              fontFamily="var(--font-display), 'Instrument Serif', serif"
              className="fill-foreground/90 select-none"
              letterSpacing="-4"
            >
              4
            </text>

            {/* The "0" Oval Ring in Center */}
            <ellipse
              cx="250"
              cy="165"
              rx="62"
              ry="82"
              stroke="currentColor"
              strokeWidth="26"
              className="stroke-foreground/90"
              fill="none"
            />

            {/* Hanging Animated Explorer Cat */}
            <g>
              {/* Cat Body & Arms Group with Bobbing / Swinging Animation */}
              <motion.g
                animate={{
                  y: [0, -8, 0],
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '250px 110px' }}
              >
                {/* Cat Tail with Swaying Motion */}
                <motion.path
                  animate={{
                    d: [
                      'M 230 220 Q 200 245 205 275 Q 210 290 230 280',
                      'M 230 220 Q 185 240 195 265 Q 205 285 220 270',
                      'M 230 220 Q 200 245 205 275 Q 210 290 230 280',
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    ease: 'easeInOut',
                  }}
                  stroke="#2DD4BF"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Cat Torso */}
                <ellipse
                  cx="250"
                  cy="175"
                  rx="34"
                  ry="40"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                />

                {/* Lime / Aurora Belly Marking */}
                <path
                  d="M 238 185 Q 250 200 262 185 Q 250 170 238 185 Z"
                  fill="#A3E635"
                  opacity="0.85"
                />

                {/* Cat Head */}
                <circle
                  cx="250"
                  cy="125"
                  r="30"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                />

                {/* Left Ear */}
                <path
                  d="M 226 105 L 218 80 L 240 96 Z"
                  fill="#A3E635"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Right Ear */}
                <path
                  d="M 274 105 L 282 80 L 260 96 Z"
                  fill="#A3E635"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Head Stripes */}
                <path d="M 245 98 L 245 110" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
                <path d="M 250 96 L 250 112" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />
                <path d="M 255 98 L 255 110" stroke="#A3E635" strokeWidth="4" strokeLinecap="round" />

                {/* Eyes (Blinking Animation) */}
                <motion.g
                  animate={{
                    scaleY: [1, 1, 0.1, 1, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    times: [0, 0.45, 0.48, 0.52, 1],
                  }}
                  style={{ transformOrigin: '250px 122px' }}
                >
                  <circle cx="240" cy="122" r="3.5" fill="#1E293B" />
                  <circle cx="260" cy="122" r="3.5" fill="#1E293B" />
                  <circle cx="241" cy="120" r="1" fill="#ffffff" />
                  <circle cx="261" cy="120" r="1" fill="#ffffff" />
                </motion.g>

                {/* Cute Nose & Mouth */}
                <polygon points="248,128 252,128 250,131" fill="#F472B6" />
                <path
                  d="M 246 132 Q 250 135 254 132"
                  stroke="#1E293B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Whiskers */}
                <line x1="228" y1="128" x2="214" y2="126" stroke="#1E293B" strokeWidth="1.5" />
                <line x1="228" y1="132" x2="216" y2="135" stroke="#1E293B" strokeWidth="1.5" />
                <line x1="272" y1="128" x2="286" y2="126" stroke="#1E293B" strokeWidth="1.5" />
                <line x1="272" y1="132" x2="284" y2="135" stroke="#1E293B" strokeWidth="1.5" />

                {/* Left Paws Clinging to the Zero Ring */}
                <ellipse
                  cx="220"
                  cy="140"
                  rx="9"
                  ry="13"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                <circle cx="218" cy="142" r="2" fill="#A3E635" />

                {/* Right Paws Clinging */}
                <ellipse
                  cx="280"
                  cy="140"
                  rx="9"
                  ry="13"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                <circle cx="282" cy="142" r="2" fill="#A3E635" />

                {/* Hanging Back Paws */}
                <ellipse
                  cx="236"
                  cy="210"
                  rx="8"
                  ry="10"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                <ellipse
                  cx="264"
                  cy="210"
                  rx="8"
                  ry="10"
                  fill="#ffffff"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
              </motion.g>
            </g>

            {/* Rolling Celestial Yarn Ball / Mini Globe on Floor */}
            <g transform="translate(265, 265)">
              <motion.g
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: 'linear',
                }}
                style={{ transformOrigin: '25px 25px' }}
              >
                <circle cx="25" cy="25" r="24" fill="#ffffff" stroke="#1E293B" strokeWidth="3" />
                <path
                  d="M 5 25 Q 25 5 45 25"
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M 5 25 Q 25 45 45 25"
                  stroke="#2DD4BF"
                  strokeWidth="2.5"
                  fill="none"
                />
                <ellipse
                  cx="25"
                  cy="25"
                  rx="12"
                  ry="24"
                  stroke="#1E293B"
                  strokeWidth="2"
                  fill="none"
                />
                <ellipse
                  cx="25"
                  cy="25"
                  rx="24"
                  ry="12"
                  stroke="#1E293B"
                  strokeWidth="2"
                  fill="none"
                />
              </motion.g>

              {/* Unraveled Thread on Floor */}
              <path
                d="M 2 40 Q -30 46 -80 44 Q -120 42 -140 46"
                stroke="#2DD4BF"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Cute Potted Plant on the Right with Swaying Leaves */}
            <g transform="translate(370, 245)">
              {/* Pot */}
              <polygon points="15,45 35,45 30,65 20,65" fill="#1E293B" />

              {/* Leaves */}
              <motion.path
                animate={{
                  rotate: [-3, 4, -3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '25px 45px' }}
                d="M 25 45 Q 10 25 0 20 Q 15 15 25 45 Z"
                fill="#A3E635"
                stroke="#1E293B"
                strokeWidth="2"
              />
              <motion.path
                animate={{
                  rotate: [3, -4, 3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.4,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '25px 45px' }}
                d="M 25 45 Q 40 25 50 18 Q 35 15 25 45 Z"
                fill="#A3E635"
                stroke="#1E293B"
                strokeWidth="2"
              />
              <motion.path
                animate={{
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '25px 45px' }}
                d="M 25 45 Q 25 15 25 5 Q 32 20 25 45 Z"
                fill="#84CC16"
                stroke="#1E293B"
                strokeWidth="2"
              />
            </g>
          </svg>
        </motion.div>

        {/* ── Poetic & Cinematic Editorial Copy ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-2 mb-8 max-w-xl"
        >
          <h1 className="t-display text-3xl sm:text-4xl text-foreground font-normal tracking-tight mb-3">
            Lost off the edge of the{' '}
            <span className="font-serif italic text-[#0B4F52] dark:text-[#2DD4BF] drop-shadow-sm">
              living atlas.
            </span>
          </h1>

          <p className="t-lead text-muted-foreground text-sm sm:text-base leading-relaxed">
            Even seasoned wanderers stray from charted paths. These coordinates haven&rsquo;t been discovered yet, but thousands of authentic traveler chronicles await.
          </p>
        </motion.div>

        {/* ── Action Buttons with Harmonious Luxury Styling ───────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-full bg-foreground text-background px-7 py-3 text-sm font-semibold transition-all duration-300 hover:bg-foreground/90 hover:scale-[1.03] shadow-lg"
          >
            <Home className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span>Return to Base Camp</span>
          </Link>

          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/75 backdrop-blur-md px-7 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-aurora hover:text-aurora hover:bg-card hover:scale-[1.03] shadow-sm"
          >
            <Compass className="w-4 h-4 text-aurora transition-transform duration-500 group-hover:rotate-45" />
            <span>Explore Destinations</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100" />
          </Link>
        </motion.div>

        {/* ── Quick Coordinate Shortcuts ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-6 border-t border-border/60 w-full max-w-lg"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
            Or jump straight to popular horizons:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {[
              { label: '3D Globe', href: '/globe' },
              { label: 'Trip Planner', href: '/trip-planner' },
              { label: 'Traveler Stories', href: '/story' },
              { label: 'Community Feed', href: '/dashboard' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full border border-border/70 bg-card/60 hover:bg-card hover:border-aurora/50 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
