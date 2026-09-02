'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, 
  MapPin, KeyRound, RotateCcw, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { sendOtp, resetPasswordWithOtp } from '@/lib/auth';

const CINEMATIC_DESTINATIONS = [
  {
    imageNight: '/country-norway.jpg',
    imageDay: '/welcome-journey-day.jpg',
    country: 'Norway',
    location: 'Lofoten Islands',
    coords: '68.1678° N, 13.7588° E',
  },
  {
    imageNight: '/country-japan.jpg',
    imageDay: '/hero-bg-day.jpg',
    country: 'Japan',
    location: 'Kyoto & Mount Fuji',
    coords: '35.3606° N, 138.7274° E',
  },
  {
    imageNight: '/hero-bg.jpg',
    imageDay: '/country-greece.jpg',
    country: 'Greece',
    location: 'Oia, Santorini',
    coords: '36.4618° N, 25.3753° E',
  },
];

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get('email') || '';
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === 'dark' : true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [successReset, setSuccessReset] = useState(false);

  // Sync initial email if query param is present
  useEffect(() => {
    if (initialEmail) {
      setEmail((prev) => prev || initialEmail);
    }
  }, [initialEmail]);

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Preload background images
  useEffect(() => {
    CINEMATIC_DESTINATIONS.forEach((dest) => {
      const imgN = new Image();
      imgN.src = dest.imageNight;
      const imgD = new Image();
      imgD.src = dest.imageDay;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % CINEMATIC_DESTINATIONS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const activeDest = CINEMATIC_DESTINATIONS[currentIndex];
  const prevDest = CINEMATIC_DESTINATIONS[prevIndex];

  const currentImage = isDark ? activeDest.imageNight : activeDest.imageDay;
  const prevImage = isDark ? prevDest.imageNight : prevDest.imageDay;

  // Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await sendOtp({
      email,
      purpose: 'forgot_password',
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setInfoMessage(result.message);
    setResendTimer(60);
    setStep(2);
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 200);
  };

  // OTP handlers
  const handleOtpChange = (index: number, val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = sanitized;
    setOtpDigits(newDigits);

    if (sanitized && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 5);
    otpRefs.current[nextFocus]?.focus();
  };

  const otpCode = otpDigits.join('');
  const isOtpComplete = otpCode.length === 6;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';
  const canReset = isOtpComplete && newPassword.length >= 8 && passwordsMatch;

  // Submit Password Reset
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReset) return;

    setError('');
    setIsLoading(true);

    const result = await resetPasswordWithOtp({
      email,
      otp: otpCode,
      newPassword,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccessReset(true);
  };

  const signinHref = email ? `/signin?email=${encodeURIComponent(email)}` : '/signin';

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
        <Link href={signinHref} className="pointer-events-auto">
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
            <span>Back to Sign In</span>
          </motion.div>
        </Link>
        <div className="pointer-events-auto">
          <ThemeToggle compact />
        </div>
      </header>

      {/* ── CENTER: Fixed-Size Borderless Auth Card ───────────────────────── */}
      <main className="relative z-20 w-full max-w-[440px] px-4 sm:px-0 my-auto py-12">
        <div className="relative overflow-hidden w-full min-h-[500px] flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-card/90 dark:bg-card/85 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]">
          {/* Animated Glowing Border Beam */}
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
              <span className="text-aurora font-sans text-[11px] font-bold tracking-wider uppercase block">PASSPORT RECOVERY</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-0.5 tracking-normal">
                {successReset ? 'Password updated!' : step === 1 ? 'Reset your password' : 'Enter security passcode'}
              </h1>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                {successReset
                  ? 'Your master credentials have been securely updated.'
                  : step === 1
                  ? 'We will send a 6-digit OTP to your registered email.'
                  : `Enter the code sent to ${email}`}
              </p>
            </div>
          </div>

          {/* Success Screen */}
          {successReset ? (
            <div className="text-center py-4 space-y-4 my-auto font-sans">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-14 h-14 rounded-full bg-aurora/15 flex items-center justify-center shadow-[0_0_25px_rgba(45,212,191,0.35)]"
                >
                  <CheckCircle className="w-7 h-7 text-aurora" />
                </motion.div>
              </div>
              <div>
                <h2 className="text-lg font-sans font-semibold text-foreground">Ready to explore</h2>
                <p className="text-xs font-sans text-muted-foreground mt-1">
                  You can now sign in to your explorer journal with your new password.
                </p>
              </div>
              <Link href={signinHref} className="block pt-2">
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <Button className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast text-xs sm:text-sm transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] cursor-pointer">
                    Sign In to Journal
                  </Button>
                </motion.div>
              </Link>
            </div>
          ) : (
            <div className="my-auto space-y-4 font-sans">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-destructive/15 text-destructive text-xs sm:text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {infoMessage && !error && step === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-aurora/15 text-aurora text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{infoMessage}</span>
                </motion.div>
              )}

              {/* ── STEP 1: Email Form ──────────────────────────────────────── */}
              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] active:brightness-95 disabled:opacity-70 text-xs sm:text-sm group cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          Sending OTP Code...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Recovery OTP
                          <KeyRound className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              )}

              {/* ── STEP 2: OTP + New Password Form ─────────────────────────── */}
              {step === 2 && (
                <form onSubmit={handleResetSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider text-center">
                      6-Digit Recovery Passcode
                    </label>
                    <div className="flex justify-center gap-2 my-2">
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={handleOtpPaste}
                          className="w-10 h-11 sm:w-11 sm:h-12 text-center text-xl font-bold rounded-xl bg-card/80 border border-border text-foreground focus:border-aurora focus:ring-2 focus:ring-aurora/20 focus:scale-105 outline-none transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                        required
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-10 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                        required
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep(1)}
                      className="hover:text-aurora hover:underline cursor-pointer"
                    >
                      Change email
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: resendTimer === 0 ? 1.05 : 1 }}
                      whileTap={{ scale: resendTimer === 0 ? 0.95 : 1 }}
                      disabled={resendTimer > 0 || isLoading}
                      onClick={() => handleRequestOtp()}
                      className="flex items-center gap-1 text-aurora hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                    </motion.button>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Button
                      type="submit"
                      disabled={!canReset || isLoading}
                      className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] active:brightness-95 disabled:opacity-70 text-xs sm:text-sm mt-1 cursor-pointer"
                    >
                      {isLoading ? 'Updating Credentials...' : 'Save New Password & Sign In'}
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-xs font-sans text-muted-foreground pt-2">
            Remembered your credentials?{' '}
            <Link href={signinHref} className="text-aurora hover:underline font-semibold transition-all inline-block hover:scale-105 active:scale-95">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* ── BOTTOM LEFT: Location Pill ────────────────────────────────────── */}
      <div className="absolute bottom-8 left-8 sm:bottom-10 sm:left-10 z-30 pointer-events-auto hidden md:block">
        <div className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full text-xs font-sans shadow-md bg-black/40 text-white ring-1 ring-white/10">
          <MapPin className="w-3.5 h-3.5 text-aurora shrink-0" />
          <span className="font-semibold">{activeDest.location}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90">
            {activeDest.coords}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
