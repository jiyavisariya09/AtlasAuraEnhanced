'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Compass,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import AITravelAssistantModal from '@/components/AITravelAssistantModal';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { countries } from '@/data/mockData';
import { getAuthorAvatar, smoothScrollTo } from '@/lib/utils';

interface NavigationProps {
  isLoggedIn?: boolean;
  onLoginToggle?: () => void;
}

/* Four, not five. Curiosity lives on the home page and in the footer; putting
   every section in the header is what made it feel crowded. */
const NAV_LINKS = [
  { name: 'Destinations', href: '/destinations' },
  { name: '3D Globe', href: '/globe' },
  { name: 'World map', href: '/#world-map' },
  { name: 'Trip planner', href: '/trip-planner' },
];

const PURPOSES = [
  { id: 'solo', label: 'Solo', emoji: '🎒' },
  { id: 'honeymoon', label: 'Honeymoon', emoji: '💕' },
  { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'calm', label: 'Peace', emoji: '🧘' },
];

const FOCUS_COORDS: Record<string, [number, number]> = {
  Japan: [36.2048, 138.2529],
  Morocco: [31.7917, -7.0926],
  Norway: [60.472, 8.4689],
  Indonesia: [-0.7893, 113.9213],
  Greece: [39.0742, 21.8243],
};

export default function Navigation({ isLoggedIn: propIsLoggedIn, onLoginToggle }: NavigationProps) {
  const { user, isLoggedIn: authIsLoggedIn, signOut } = useAuth();
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : authIsLoggedIn;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [purpose, setPurpose] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const results = countries.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchesName =
      c.name.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.vibe.toLowerCase().includes(q);
    const matchesPurpose = !purpose || c.purposes.includes(purpose);
    return (query.trim() || purpose) && matchesName && matchesPurpose;
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openSearch = useCallback(() => {
    setShowSearch(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => {
    setShowSearch(false);
    setQuery('');
    setPurpose(null);
  }, []);

  /* ⌘K / Ctrl+K opens search, Escape closes whatever is open. Means the search
     control can be a compact icon rather than a labelled button. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }
      if (e.key === 'Escape') {
        if (showSearch) closeSearch();
        if (menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch, closeSearch, showSearch, menuOpen]);

  // Click-outside for the account menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  // A body-scroll lock, so the search overlay doesn't scroll the page behind it.
  //
  // This is the one place on the site that puts an `overflow` on `body`, and it
  // is deliberately temporary. A permanent one would make `body` an
  // intermediate scroll container, and every `position: sticky` element on the
  // site would then resolve against `body` instead of the viewport and silently
  // stop pinning — see the comment on the `html` rule in globals.css. It is
  // harmless here because the page cannot be scrolled while the overlay is up
  // anyway, and the previous value is restored on close. If this ever needs to
  // become a persistent lock, use a class on `html` instead.
  useEffect(() => {
    if (!showSearch) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showSearch]);

  const handleSignOut = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    signOut();
    onLoginToggle?.();
  };

  const focusCountry = (name: string) => {
    closeSearch();
    document.getElementById('world-map')?.scrollIntoView({ behavior: 'smooth' });
    const coord = FOCUS_COORDS[name];
    if (coord) {
      setTimeout(
        () =>
          window.dispatchEvent(
            new CustomEvent('atlasaura-focus-map', { detail: { lat: coord[0], lng: coord[1] } }),
          ),
        600,
      );
    }
  };

  /* Two states, because the header lives in two completely different lighting
     conditions and one set of colours cannot serve both.

     Scrolled, it is a glass bar over the page's own background, so the dim
     secondary colour is correct and gives the hierarchy its refinement.

     Unscrolled, it is over the hero photograph — and no amount of veil makes
     `--muted-foreground` legible there. Measured against a worst-case photo it
     stays under AA even at 0.90 alpha in day mode. So over imagery the links
     and icons take the full-strength foreground colour and lean on the veil
     below for their field. */
  const overPhoto = !isScrolled;

  const iconButton = `inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-muted/60 hover:text-foreground ${
    overPhoto ? 'text-foreground' : 'text-muted-foreground'
  }`;

  const navLink = `rounded-full px-3.5 py-2 text-sm font-semibold tracking-[-0.01em] transition-all duration-200 hover:text-aurora hover:bg-foreground/5 ${
    overPhoto ? 'text-foreground font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'text-foreground/90 font-semibold'
  }`;

  /* The bar is deliberately not `transform-gpu`: framer-motion writes an inline
     transform for the entrance, which beats the class, leaving a dead rule. */
  return (
    <motion.header
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent border-b-0'
      }`}
    >
      {/* Seamless Feathered Mist Gradient — No hard borders, softly dissolves into the sky */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 transition-opacity duration-300 ease-out ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--background) / 0.72) 0%, hsl(var(--background) / 0.35) 50%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        }}
      />

      <div className="shell">
        <div className="flex h-16 items-center gap-2">
          <Link href="/" className="group mr-auto flex items-center gap-2.5 md:mr-8">
            {/* The mark is the atlas itself: a meridian ring around a pin. */}
            <span className="relative flex h-8 w-8 items-center justify-center">
              <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
                <circle
                  cx="16"
                  cy="16"
                  r="11"
                  fill="none"
                  stroke="hsl(var(--aurora))"
                  strokeWidth="1.25"
                  opacity="0.55"
                />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="4.6"
                  ry="11"
                  fill="none"
                  stroke="hsl(var(--aurora))"
                  strokeWidth="1.25"
                  opacity="0.4"
                />
                <line
                  x1="5"
                  y1="16"
                  x2="27"
                  y2="16"
                  stroke="hsl(var(--aurora))"
                  strokeWidth="1.25"
                  opacity="0.4"
                />
                <circle cx="21.2" cy="10.4" r="2.5" fill="hsl(var(--aurora))" />
              </svg>
            </span>
            <span className="text-[1.125rem] font-bold tracking-tight text-foreground">
              Atlas<span className="text-aurora font-extrabold">Aura</span>
            </span>
          </Link>

          <nav className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => smoothScrollTo(link.href, e)}
                className={navLink}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {/* Day/night, on the landing header. It was reachable from six other
                pages and from /settings but not from the one page most visitors
                see first, which made the site look like it had no light mode.
                Sits before search because it changes the whole page and the two
                icon buttons only open one thing each. */}
            <ThemeToggle compact />

            <span className="mx-1.5 hidden h-5 w-px bg-border sm:block" aria-hidden="true" />

            <button
              type="button"
              onClick={openSearch}
              aria-label="Search countries"
              className={iconButton}
            >
              <Search className="h-[1.05rem] w-[1.05rem]" />
            </button>

            {/* Hidden on the narrowest screens and offered in the mobile menu
                instead. Adding the toggle put six controls in a 360px bar,
                which overflows; the assistant is the one of them that reads
                just as well as a labelled row in the menu. */}
            <button
              type="button"
              onClick={() => setShowAI(true)}
              aria-label="Plan a trip with the AI assistant"
              title="AI trip assistant"
              className={`${iconButton} hidden sm:inline-flex`}
            >
              <Sparkles className="h-[1.05rem] w-[1.05rem]" />
            </button>

            {isLoggedIn ? (
              <div className="relative ml-1 hidden md:block">
                {/* The avatar is decorative (alt="") and the chevron is a glyph,
                    so without a label this announced only as "button, collapsed". */}
                <button
                  ref={menuButtonRef}
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label={user?.name ? `Account menu for ${user.name}` : 'Account menu'}
                  className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition-colors duration-200 hover:bg-muted/60"
                >
                  <img
                    src={getAuthorAvatar(user?.name, user?.avatar)}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                      menuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      ref={menuRef}
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="ink-panel absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-xl p-1.5"
                    >
                      <div className="px-2.5 pb-2 pt-1.5">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user?.name || 'Traveller'}
                        </p>
                        {user?.email && (
                          <p className="t-data truncate text-[0.75rem] text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                      <div className="my-1 h-px bg-border" />
                      {[
                        { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                        { href: '/settings', label: 'Settings', Icon: Settings },
                      ].map(({ href, label, Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Link>
                      ))}
                      <div className="my-1 h-px bg-border" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/signin"
                className="ml-1 hidden rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-aurora hover:text-aurora md:inline-flex"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              className={`${iconButton} md:hidden`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh] backdrop-blur-sm"
            style={{ background: 'hsl(var(--ink-void) / 0.72)' }}
            onClick={closeSearch}
            role="dialog"
            aria-modal="true"
            aria-label="Search countries"
          >
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="ink-panel w-full max-w-xl overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries, regions, vibes…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
                />
                <kbd className="t-data hidden rounded border border-border px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground sm:block">
                  esc
                </kbd>
              </div>

              <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
                {PURPOSES.map((p) => {
                  const on = purpose === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose((prev) => (prev === p.id ? null : p.id))}
                      aria-pressed={on}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                        on
                          ? 'bg-aurora text-primary-foreground'
                          : 'bg-muted/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span aria-hidden="true">{p.emoji}</span>
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  results.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => focusCountry(country.name)}
                      className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/50"
                    >
                      <img
                        src={country.image}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{country.name}</span>
                          <span className="t-label text-aurora">{country.region}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {country.vibe}
                        </span>
                      </span>
                      <Compass className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {query || purpose
                      ? 'No countries match that. Try another word or purpose.'
                      : 'Type a country, region or vibe — or pick a purpose above.'}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="glass-sheet overflow-hidden md:hidden"
          >
            <div className="shell py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    smoothScrollTo(link.href, e);
                    setMobileOpen(false);
                  }}
                  className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}

              {/* The assistant lives here below `sm`, where it is out of the
                  bar. Labelled rather than an icon, which is the better form
                  for it anyway. */}
              <button
                type="button"
                onClick={() => {
                  setShowAI(true);
                  setMobileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground sm:hidden"
              >
                <Sparkles className="h-4 w-4" />
                Plan a trip with AI
              </button>

              <div className="my-2 h-px bg-border" />

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted/60 hover:text-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-1 pb-1 pt-1">
                  {/* Settings carries the theme and currency controls now, so it
                      has to be reachable before you have an account. */}
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      router.push('/signup');
                      setMobileOpen(false);
                    }}
                    className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Create an account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push('/signin');
                      setMobileOpen(false);
                    }}
                    className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AITravelAssistantModal isOpen={showAI} onClose={() => setShowAI(false)} />
    </motion.header>
  );
}
