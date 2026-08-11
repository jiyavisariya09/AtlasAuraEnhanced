'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  scrolledLight?: boolean;
}

export default function ThemeToggle({ scrolledLight = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === 'dark' : false;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center w-[64px] h-[34px] p-1 rounded-full overflow-hidden transition-colors duration-250 ease-out shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer border transform-gpu ${
        isDark
          ? 'bg-slate-950 border-sky-500/30 shadow-black/60'
          : 'bg-[#1a9fe0] border-sky-300/50 shadow-sky-700/30'
      }`}
    >
      {/* ── Background Elements (Clouds & Stars) ── */}

      {/* Day Mode Clouds */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ease-out pointer-events-none ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Cloud 1 */}
        <svg
          className="absolute left-[30px] top-[14px] w-[36px] fill-white/85"
          viewBox="0 0 100 100"
        >
          <circle cx="30" cy="50" r="30" />
          <circle cx="50" cy="40" r="30" />
          <circle cx="70" cy="50" r="30" />
        </svg>
        {/* Cloud 2 */}
        <svg
          className="absolute left-[44px] top-[8px] w-[20px] fill-white/65"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" />
        </svg>
        {/* Cloud 3 */}
        <svg
          className="absolute left-[18px] top-[22px] w-[28px] fill-white/75"
          viewBox="0 0 100 100"
        >
          <circle cx="40" cy="50" r="35" />
        </svg>
      </div>

      {/* Dark Mode Stars */}
      <div
        className={`absolute inset-0 transition-all duration-200 ease-out pointer-events-none ${
          isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
      >
        {/* Star 1 */}
        <svg
          className="absolute left-[6px] top-[4px] w-[14px] fill-amber-200"
          viewBox="0 0 20 20"
        >
          <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
        </svg>
        {/* Star 2 */}
        <svg
          className="absolute left-[6px] top-[18px] w-[6px] fill-white"
          viewBox="0 0 20 20"
        >
          <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
        </svg>
        {/* Star 3 */}
        <svg
          className="absolute left-[16px] top-[18px] w-[10px] fill-amber-100"
          viewBox="0 0 20 20"
        >
          <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
        </svg>
        {/* Star 4 */}
        <svg
          className="absolute left-[24px] top-[2px] w-[12px] fill-white"
          viewBox="0 0 20 20"
        >
          <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
        </svg>
      </div>

      {/* ── Sun / Moon Sliding Knob (Pure GPU CSS Acceleration) ── */}
      <div
        className={`relative z-10 w-[26px] h-[26px] rounded-full shadow-md flex items-center justify-center transition-transform duration-300 transform-gpu ${
          isDark ? 'bg-slate-100 translate-x-[30px] rotate-180' : 'bg-amber-400 translate-x-0 rotate-0'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.4, 0.64, 1)' }}
      >
        {/* Sun Light Rays Glow */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="absolute -inset-1 rounded-full bg-amber-300/40 blur-[2px]" />
          <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-[4px]" />
        </div>

        {/* Moon Craters */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Crater 1 */}
          <span className="absolute left-[6px] top-[4px] w-[6px] h-[6px] rounded-full bg-slate-300/80" />
          {/* Crater 2 */}
          <span className="absolute left-[13px] top-[11px] w-[8px] h-[8px] rounded-full bg-slate-300/80" />
          {/* Crater 3 */}
          <span className="absolute left-[5px] top-[14px] w-[4px] h-[4px] rounded-full bg-slate-300/80" />
        </div>
      </div>
    </button>
  );
}
