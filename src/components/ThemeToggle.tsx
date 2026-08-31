'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  /** Renders the control at the header's icon-button scale (h-9) rather than
   *  the larger standalone size used on the auth pages. */
  compact?: boolean;
}

/**
 * Day/night switch.
 *
 * Two things were wrong with the previous version and both are worth naming.
 *
 * It was painted in the palette this redesign replaced — `bg-[#1a9fe0]`,
 * `border-sky-*`, `bg-slate-*`. Those are literal hex and Tailwind's stock
 * ramp, so they do not move when the theme does: the control looked correct at
 * night and like a leftover in day, and it was the last sky-blue object in the
 * header. Everything here is a palette token now, which is also what makes it
 * legible in both themes rather than in one.
 *
 * And its motion was a set of independent `transition-*` classes on five
 * elements, all 200–300ms, all starting together. That reads as a snap with
 * some blur on it. The knob now travels on a spring-like overshoot curve while
 * the sky, the stars and the glyphs cross-fade underneath it on a slower, plain
 * curve — the movement leads and the colour follows, which is what makes a
 * switch feel like it has weight.
 *
 * The sun/moon metaphor stays. It is doing real work: this is the one control
 * on the site whose two states need to be distinguishable at a glance and from
 * the corner of the eye.
 */
export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const [pressed, setPressed] = useState(false);

  /* Before hydration the server has no way to know the stored preference, so
     the control renders in its night position and reconciles on mount. Reading
     `mounted` from the context rather than a local effect keeps this in step
     with the pre-paint script instead of racing it. */
  const isDark = mounted ? theme === 'dark' : true;

  /* Track geometry, so the knob's travel is derived rather than hard-coded —
     the old version had `translate-x-[30px]` next to a `w-[64px]` track and a
     `w-[26px]` knob, three numbers that had to be kept in agreement by hand. */
  const W = compact ? 58 : 64;
  const H = compact ? 30 : 34;
  const PAD = 3;
  const KNOB = H - PAD * 2;
  const TRAVEL = W - KNOB - PAD * 2;

  /* Overshoot on the way, settle on arrival. Framer Motion is already a
     dependency but this is a single transform on a single element, so a CSS
     curve is both lighter and immune to the inline-transform conflict that
     bites elsewhere in this codebase. */
  const KNOB_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      title={isDark ? 'Switch to day mode' : 'Switch to night mode'}
      className="group relative inline-flex shrink-0 items-center overflow-hidden rounded-full border transition-[border-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-aurora focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        width: W,
        height: H,
        padding: PAD,
        /* The track reads as the sky it depicts, but built from the palette:
           recessed ink at night, a pale teal-tinted paper by day. Both sit
           against --background with a visible edge in either theme, which is
           the requirement the sky-blue version failed. */
        background: isDark
          ? 'linear-gradient(160deg, hsl(var(--ink-deep)), hsl(var(--ink-void)))'
          : 'linear-gradient(160deg, hsl(var(--aurora) / 0.16), hsl(var(--aurora) / 0.05))',
        borderColor: isDark ? 'hsl(var(--aurora) / 0.28)' : 'hsl(var(--aurora) / 0.35)',
        boxShadow: isDark
          ? 'inset 0 1px 3px hsl(225 60% 2% / 0.7)'
          : 'inset 0 1px 3px hsl(222 40% 40% / 0.14)',
        transform: pressed ? 'scale(0.955)' : 'scale(1)',
      }}
    >
      {/* ── Night sky: stars drift down into place ───────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'translateY(0)' : 'translateY(-8px)',
        }}
      >
        <span
          className="absolute rounded-full bg-aurora"
          style={{ left: '20%', top: '26%', width: 2, height: 2, opacity: 0.85 }}
        />
        <span
          className="absolute rounded-full bg-paper"
          style={{ left: '34%', top: '62%', width: 1.5, height: 1.5, opacity: 0.6 }}
        />
        <span
          className="absolute rounded-full bg-aurora"
          style={{ left: '46%', top: '34%', width: 1.5, height: 1.5, opacity: 0.5 }}
        />
        <span
          className="absolute rounded-full bg-paper"
          style={{ left: '28%', top: '46%', width: 1, height: 1, opacity: 0.45 }}
        />
      </span>

      {/* ── Day sky: a single soft bank of cloud, rising ──────────────────
          One shape rather than the previous three overlapping circle SVGs. At
          this size three clouds resolved to a grey smudge, and a smudge is
          exactly the "cloudy" quality being taken out of the rest of the site. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'translateY(8px)' : 'translateY(0)',
        }}
      >
        <span
          className="absolute rounded-full"
          style={{
            right: '14%',
            bottom: '-30%',
            width: '52%',
            height: '80%',
            background: 'hsl(var(--card) / 0.9)',
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            right: '32%',
            bottom: '6%',
            width: '30%',
            height: '46%',
            background: 'hsl(var(--card) / 0.75)',
          }}
        />
      </span>

      {/* ── The knob ─────────────────────────────────────────────────────── */}
      <span
        aria-hidden="true"
        className="relative z-10 grid place-items-center rounded-full"
        style={{
          width: KNOB,
          height: KNOB,
          transform: `translateX(${isDark ? TRAVEL : 0}px)`,
          transition: `transform 420ms ${KNOB_EASE}, background 440ms ease, box-shadow 440ms ease`,
          background: isDark
            ? 'radial-gradient(circle at 34% 30%, hsl(var(--paper)), hsl(220 30% 78%))'
            : 'radial-gradient(circle at 34% 30%, hsl(var(--aurora-bright)), hsl(var(--aurora)))',
          boxShadow: isDark
            ? '0 2px 6px hsl(225 60% 2% / 0.55)'
            : '0 2px 8px hsl(var(--aurora) / 0.45), 0 0 0 1px hsl(var(--aurora) / 0.25)',
        }}
      >
        {/* Moon craters — the knob *is* the moon at night, so the shading goes
            on it rather than being a separate layer that has to be kept in
            register with it. */}
        <span
          className="absolute inset-0 rounded-full transition-opacity duration-300 ease-out"
          style={{ opacity: isDark ? 1 : 0 }}
        >
          <span
            className="absolute rounded-full"
            style={{ left: '22%', top: '18%', width: '24%', height: '24%', background: 'hsl(220 24% 66% / 0.75)' }}
          />
          <span
            className="absolute rounded-full"
            style={{ left: '52%', top: '46%', width: '30%', height: '30%', background: 'hsl(220 24% 66% / 0.6)' }}
          />
          <span
            className="absolute rounded-full"
            style={{ left: '20%', top: '58%', width: '16%', height: '16%', background: 'hsl(220 24% 66% / 0.65)' }}
          />
        </span>

        {/* Sun corona — scales up as it fades in, so switching to day reads as
            the sun arriving rather than a dot changing colour. */}
        <span
          className="absolute -inset-1 rounded-full transition-all duration-300 ease-out"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'scale(0.7)' : 'scale(1)',
            background: 'hsl(var(--aurora) / 0.28)',
            filter: 'blur(3px)',
          }}
        />
      </span>
    </button>
  );
}
