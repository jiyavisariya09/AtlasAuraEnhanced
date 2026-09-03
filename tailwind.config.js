/** @type {import('tailwindcss').Config} */
module.exports = {
  /* Night is the default; `[data-theme="light"]` opts into day. Tailwind's
     `dark:` variant is therefore "anything that is not explicitly light".
     Without this the 44 `dark:` variants inside components/ui/* would never
     fire and shadcn primitives would render day styling over night tokens. */
  darkMode: ['selector', 'html:not([data-theme="light"])'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* A height breakpoint, not a width one. Any section pinned to `100svh`
         has a fixed budget, and the viewports that break it are short rather
         than narrow — a phone in landscape is 844px wide and 331px tall, so
         every `sm:`/`lg:` variant fires there while the vertical space is the
         worst on any real device. `raw` because Tailwind's own `screens` only
         emit `min-width`. Use it to tighten vertical rhythm, never to hide a
         control. */
      screens: {
        short: { raw: '(max-height: 700px)' },
        shorter: { raw: '(max-height: 420px)' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        display: ['var(--font-serif)', 'var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          /* Gives `hover:bg-primary-hover`, which each theme resolves in its own
             direction — night brightens the teal, day deepens it. Pointing the
             hover at a fixed colour instead breaks in whichever theme aliases
             --primary to that same value. */
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        /* ── Aurora Ink ──────────────────────────────────────────────────
           Deliberately named off Tailwind's own scales so that `violet-500`
           and friends keep their stock meaning and nothing is clobbered. */
        ink: {
          void: 'hsl(var(--ink-void))',
          deep: 'hsl(var(--ink-deep))',
          raised: 'hsl(var(--ink-raised))',
          line: 'hsl(var(--ink-line))',
        },
        aurora: {
          DEFAULT: 'hsl(var(--aurora))',
          bright: 'hsl(var(--aurora-bright))',
        },
        orchid: 'hsl(var(--violet))',
        blush: 'hsl(var(--rose))',
        paper: {
          DEFAULT: 'hsl(var(--paper))',
          dim: 'hsl(var(--paper-dim))',
        },
      },
      borderRadius: {
        '2xl': 'calc(var(--radius) + 10px)',
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'calc(var(--radius) - 6px)',
      },
      transitionTimingFunction: {
        /* Retained: 47 existing usages of `ease-smooth` depend on this key. */
        smooth: 'cubic-bezier(0.25, 1, 0.5, 1)',
        entrance: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        cast: 'var(--shadow-cast)',
        aurora: 'var(--glow-aurora)',
      },
      letterSpacing: {
        label: '0.2em',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'caret-blink': { '0%,70%,100%': { opacity: '1' }, '20%,50%': { opacity: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
