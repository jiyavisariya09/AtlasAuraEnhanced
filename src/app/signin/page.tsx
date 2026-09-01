'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, 
  MapPin, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const CINEMATIC_DESTINATIONS = [
  {
    imageNight: '/country-japan.jpg',
    imageDay: '/hero-bg-day.jpg',
    country: 'Japan',
    location: 'Kyoto & Mount Fuji',
    coords: '35.3606° N, 138.7274° E',
    title: 'Ancient Temples & Zen Gardens',
    quote: 'Morning mist filtering through the bamboo groves feels like entering a living watercolor scroll.',
    author: 'Kenji Takahashi',
    role: 'Heritage Photographer',
  },
  {
    imageNight: '/country-norway.jpg',
    imageDay: '/welcome-journey-day.jpg',
    country: 'Norway',
    location: 'Senja & Lofoten Fjords',
    coords: '69.3789° N, 17.5028° E',
    title: 'Glacial Fjords & Midnight Sun',
    quote: 'Standing beneath the emerald dancing lights of the aurora borealis, the world feels vast and alive.',
    author: 'Astrid Lindholm',
    role: 'Arctic Cartographer',
  },
  {
    imageNight: '/hero-bg.jpg',
    imageDay: '/country-greece.jpg',
    country: 'Greece',
    location: 'Santorini & Cyclades',
    coords: '36.3932° N, 25.4615° E',
    title: 'Cliffside Alleys & Volcanic Horizons',
    quote: 'The Aegean twilight turns whitewashed stone into pure gold. A place where time slows down.',
    author: 'Elena Rostova',
    role: 'Mediterranean Explorer',
  },
  {
    imageNight: '/country-morocco.jpg',
    imageDay: '/welcome-story-day.jpg',
    country: 'Morocco',
    location: 'Chefchaouen & Sahara',
    coords: '31.7917° N, 7.0926° W',
    title: 'Cobalt Streets & Golden Dunes',
    quote: 'The cobalt blue alleyways echo with the warmth of spiced mint tea and centuries of desert songs.',
    author: 'Tariq Mansour',
    role: 'Cultural Wanderer',
  },
];

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get('next') || '/dashboard';
  const initialEmail = searchParams?.get('email') || '';
  const { theme, mounted } = useTheme();
  const { signIn } = useAuth();
  const isDark = mounted ? theme === 'dark' : true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: initialEmail, password: '' });

  // Sync email if query param changes
  useEffect(() => {
    if (initialEmail) {
      setFormData((prev) => (prev.email ? prev : { ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  // Preload all background images on mount
  useEffect(() => {
    CINEMATIC_DESTINATIONS.forEach((dest) => {
      const imgN = new Image();
      imgN.src = dest.imageNight;
      const imgD = new Image();
      imgD.src = dest.imageDay;
    });
  }, []);

  // Comfortable 9-second rotation pacing
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % CINEMATIC_DESTINATIONS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const switchSlide = (nextIndex: number) => {
    if (nextIndex === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const activeDest = CINEMATIC_DESTINATIONS[currentIndex];
  const prevDest = CINEMATIC_DESTINATIONS[prevIndex];

  const currentImage = isDark ? activeDest.imageNight : activeDest.imageDay;
  const prevImage = isDark ? prevDest.imageNight : prevDest.imageDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn({ email: formData.email, password: formData.password });

    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
      setIsLoading(false);
      return;
    }

    router.push(nextUrl);
  };

  const forgotPasswordHref = formData.email 
    ? `/forgot-password?email=${encodeURIComponent(formData.email)}` 
    : '/forgot-password';

  const signupHref = formData.email 
    ? `/signup?email=${encodeURIComponent(formData.email)}` 
    : '/signup';

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      {/* ── Seamless Full-Screen Photography ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Base Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={prevImage}
            alt=""
            className="w-full h-full object-cover object-center transform-gpu"
          />
        </div>

        {/* Top Active Layer */}
        <AnimatePresence>
          <motion.div
            key={`${currentImage}-${isDark}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 z-1"
          >
            <img
              src={currentImage}
              alt={activeDest.country}
              className="w-full h-full object-cover object-center transform-gpu"
            />
          </motion.div>
        </AnimatePresence>

        {/* Natural Full-Width Cinematic Scrim */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* ── Top Header Controls ───────────────────────────────────────────── */}
      <header className="absolute top-6 inset-x-6 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <motion.div
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-sans font-semibold shadow-md transition-colors ${
              isDark 
                ? 'bg-black/50 hover:bg-black/75 text-white/90 hover:text-white ring-1 ring-white/10 hover:ring-aurora/40' 
                : 'bg-white/85 hover:bg-white text-slate-800 hover:text-slate-950 ring-1 ring-black/5 hover:ring-aurora/40'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-aurora transition-transform group-hover:-translate-x-1" />
            <span>Return to Atlas</span>
          </motion.div>
        </Link>
        <div className="pointer-events-auto">
          <ThemeToggle compact />
        </div>
      </header>

      {/* ── CENTER: Fixed-Size Auth Card with High-Contrast BorderBeam ────── */}
      <main className="relative z-20 w-full max-w-[440px] px-4 sm:px-0 my-auto py-12">
        <div className="relative overflow-hidden w-full min-h-[580px] flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-card/90 dark:bg-card/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]">
          {/* Animated High-Contrast Glowing Border Beam (Day & Night Adaptive) */}
          <BorderBeam
            size={180}
            duration={7}
            colorFrom={isDark ? '#2dd4bf' : '#0d9488'}
            colorTo={isDark ? '#a78bfa' : '#6366f1'}
            borderWidth={2}
          />
          
          {/* Brand Logo & Header */}
          <div className="text-center space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-1">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              >
                <svg viewBox="0 0 32 32" className="h-7 w-7 text-aurora" aria-hidden="true">
                  <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
                  <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
                </svg>
              </motion.div>
              <span className="font-sans text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-aurora">
                Atlas<span className="text-aurora">Aura</span>
              </span>
            </Link>

            <div>
              <span className="text-aurora font-sans text-[11px] font-bold tracking-wider uppercase block">MEMBER PASSPORT</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-0.5 tracking-normal">
                Sign in to your journal
              </h1>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                Access your pinned memories, custom itineraries, and community stories.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-destructive/15 text-destructive text-xs sm:text-sm my-2 font-sans"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 my-auto font-sans">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                <Input
                  type="email"
                  placeholder="traveler@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href={forgotPasswordHref}
                  className="text-xs text-aurora hover:underline font-medium transition-all active:scale-95 inline-block"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                  required
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            {/* Keep Signed In */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-0.5 select-none group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-aurora focus:ring-aurora accent-[hsl(var(--aurora))] transition-transform group-hover:scale-105"
              />
              <span className="text-xs text-muted-foreground font-sans transition-colors group-hover:text-foreground">
                Remember me on this browser
              </span>
            </label>

            {/* Submit CTA */}
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] active:brightness-95 disabled:opacity-70 mt-2 text-xs sm:text-sm group cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Verifying Passport...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Enter AtlasAura
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <div className="pt-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/80" />
              <span className="text-[11px] text-muted-foreground font-mono">NEW TO ATLAS?</span>
              <div className="flex-1 h-px bg-border/80" />
            </div>

            <Link href={signupHref} className="block w-full">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full border-border hover:border-aurora hover:bg-aurora/5 hover:text-aurora text-xs sm:text-sm font-sans font-semibold transition-all duration-200 cursor-pointer"
                >
                  Create a Free Traveler Account
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </main>

      {/* ── BOTTOM LEFT: Pure Floating Typography ─────────────────────────── */}
      <div className="absolute bottom-8 left-8 sm:bottom-10 sm:left-10 z-30 pointer-events-auto max-w-sm sm:max-w-md hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDest.location}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="space-y-2 font-sans"
          >
            {/* Header: Location & Full Coordinates */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-aurora shrink-0" />
                <span className="text-xs font-bold text-aurora tracking-wider uppercase font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {activeDest.location} · {activeDest.country}
                </span>
              </div>
              <span className="text-[10px] font-mono whitespace-nowrap px-2.5 py-0.5 rounded-full text-white/90 bg-black/40 backdrop-blur-md ring-1 ring-white/10">
                {activeDest.coords}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-sans font-semibold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {activeDest.title}
            </h2>

            {/* Quote */}
            <p className="text-xs sm:text-sm font-sans text-white/90 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              &ldquo;{activeDest.quote}&rdquo;
            </p>

            {/* Footer Author & Navigation Dots */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs text-white/75 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {activeDest.author}
              </span>
              <div className="flex items-center gap-1.5">
                {CINEMATIC_DESTINATIONS.map((dest, i) => (
                  <motion.button
                    key={dest.country}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => switchSlide(i)}
                    aria-label={`View ${dest.country}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentIndex 
                        ? 'w-6 bg-aurora shadow-aurora' 
                        : 'w-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile compact location indicator */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-auto md:hidden">
        <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-white drop-shadow-md">
          <MapPin className="w-3.5 h-3.5 text-aurora" />
          <span>{activeDest.location}</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignInContent />
    </Suspense>
  );
}
