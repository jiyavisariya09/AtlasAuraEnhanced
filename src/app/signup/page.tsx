'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, 
  Phone, Check, X, AlertCircle, MapPin, KeyRound, RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { sendOtp } from '@/lib/auth';

const CINEMATIC_STORIES = [
  {
    imageNight: '/country-norway.jpg',
    imageDay: '/welcome-journey-day.jpg',
    country: 'Norway',
    location: 'Senja & Lofoten Fjords',
    coords: '69.3789° N, 17.5028° E',
    highlight: 'Glacial Fjords & Midnight Sun',
    story: 'Join over 40,000 global wanderers mapping authentic hidden trails and midnight sun viewpoints.',
  },
  {
    imageNight: '/country-japan.jpg',
    imageDay: '/hero-bg-day.jpg',
    country: 'Japan',
    location: 'Kyoto & Mount Fuji',
    coords: '35.3606° N, 138.7274° E',
    highlight: 'Ancient Temples & Zen Gardens',
    story: 'Discover secret tea houses, local etiquette, and unscripted culinary passages.',
  },
  {
    imageNight: '/hero-bg.jpg',
    imageDay: '/country-greece.jpg',
    country: 'Greece',
    location: 'Santorini & Cyclades',
    coords: '36.3932° N, 25.4615° E',
    highlight: 'Cliffside Alleys & Volcanic Horizons',
    story: 'Pin your sunsets and serendipitous encounters to an interactive living global canvas.',
  },
  {
    imageNight: '/country-morocco.jpg',
    imageDay: '/welcome-story-day.jpg',
    country: 'Morocco',
    location: 'Chefchaouen & Sahara',
    coords: '31.7917° N, 7.0926° W',
    highlight: 'Cobalt Streets & Golden Dunes',
    story: 'Experience the aromatic spice bazaars and starlit desert caravan routes.',
  },
];

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special symbol', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const score = checks.filter((c) => c.met).length;
  const colors = ['bg-destructive', 'bg-rose', 'bg-violet', 'bg-aurora', 'bg-aurora'];
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="mt-2 space-y-1.5 font-sans">
      <div className="flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground font-medium">Password strength:</span>
        <span className={`font-semibold ${score >= 4 ? 'text-aurora' : score >= 3 ? 'text-violet' : 'text-destructive'}`}>
          {password ? labels[score - 1] || 'Too weak' : ''}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1 pt-0.5">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {check.met ? (
              <Check className="w-3 h-3 text-aurora shrink-0" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground/40 shrink-0" />
            )}
            <span className={`text-[10px] ${check.met ? 'text-foreground' : 'text-muted-foreground'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams?.get('email') || '';
  const { theme, mounted } = useTheme();
  const { signUp } = useAuth();
  const isDark = mounted ? theme === 'dark' : true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail,
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Sync initial email
  useEffect(() => {
    if (initialEmail) {
      setFormData((prev) => (prev.email ? prev : { ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  // 6-digit OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Preload background images
  useEffect(() => {
    CINEMATIC_STORIES.forEach((story) => {
      const imgN = new Image();
      imgN.src = story.imageNight;
      const imgD = new Image();
      imgD.src = story.imageDay;
    });
  }, []);

  // Background rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % CINEMATIC_STORIES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const switchSlide = (nextIndex: number) => {
    if (nextIndex === currentIndex) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const activeStory = CINEMATIC_STORIES[currentIndex];
  const prevStory = CINEMATIC_STORIES[prevIndex];

  const currentImage = isDark ? activeStory.imageNight : activeStory.imageDay;
  const prevImage = isDark ? prevStory.imageNight : prevStory.imageDay;

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const passwordScore = [
    formData.password.length >= 8,
    /[A-Z]/.test(formData.password),
    /[a-z]/.test(formData.password),
    /\d/.test(formData.password),
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  ].filter(Boolean).length;

  const canProceedStep1 = formData.name.trim().length >= 2 && formData.email.includes('@');
  const canProceedStep2 = passwordScore >= 3 && passwordsMatch;

  // Handle Requesting OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canProceedStep2) return;

    setError('');
    setIsSendingOtp(true);

    const result = await sendOtp({
      email: formData.email,
      name: formData.name,
      purpose: 'signup',
    });

    setIsSendingOtp(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setInfoMessage(result.message);
    setResendTimer(60);
    setStep(3);
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 200);
  };

  // Handle OTP digit changes
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

  // Final Registration Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    setError('');
    setIsLoading(true);

    const result = await signUp({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      otp: otpCode,
    });

    if (!result.success) {
      setError(result.error || 'Failed to verify passcode. Please try again.');
      setIsLoading(false);
      return;
    }

    router.push('/welcome');
  };

  const signinHref = formData.email ? `/signin?email=${encodeURIComponent(formData.email)}` : '/signin';

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
              alt={activeStory.country}
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

      {/* ── CENTER: Fixed-Size Auth Card with Animated BorderBeam ─────────── */}
      <main className="relative z-20 w-full max-w-[440px] px-4 sm:px-0 my-auto py-12">
        <div className="relative overflow-hidden w-full min-h-[580px] flex flex-col justify-between rounded-3xl p-8 sm:p-9 bg-card/95 dark:bg-card/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75)]">
          {/* Animated Glowing Border Beam */}
          <BorderBeam
            size={180}
            duration={7}
            colorFrom={isDark ? '#2dd4bf' : '#0d9488'}
            colorTo={isDark ? '#a78bfa' : '#6366f1'}
            borderWidth={2}
          />

          {/* Step Progress Header & Brand Logo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                >
                  <svg viewBox="0 0 32 32" className="h-6 w-6 text-aurora" aria-hidden="true">
                    <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
                    <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
                  </svg>
                </motion.div>
                <span className="font-sans text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-aurora">
                  Atlas<span className="text-aurora">Aura</span>
                </span>
              </Link>

              <div className="flex items-center gap-1.5 bg-card/60 px-2.5 py-1 rounded-full border border-border">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-aurora shadow-aurora scale-110' : 'bg-muted-foreground/30'}`} />
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-aurora shadow-aurora scale-110' : 'bg-muted-foreground/30'}`} />
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 3 ? 'bg-aurora shadow-aurora scale-110' : 'bg-muted-foreground/30'}`} />
                <span className="text-[10px] font-mono text-muted-foreground ml-1">
                  {step}/3
                </span>
              </div>
            </div>

            <div>
              <span className="text-aurora font-sans text-[11px] font-bold tracking-wider uppercase block">
                {step === 3 ? 'EMAIL VERIFICATION' : 'PASSPORT APPLICATION'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-0.5 tracking-normal">
                {step === 1 && 'Create your account'}
                {step === 2 && 'Set master credentials'}
                {step === 3 && 'Verify your email'}
              </h1>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                {step === 1 && 'Step 1 of 3 · Traveler identity'}
                {step === 2 && 'Step 2 of 3 · Master password'}
                {step === 3 && `Step 3 of 3 · 6-digit code sent to ${formData.email}`}
              </p>
            </div>
          </div>

          {/* Error & Info Banners */}
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

          {infoMessage && !error && step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-aurora/15 text-aurora text-xs my-2 font-sans"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{infoMessage}</span>
            </motion.div>
          )}

          {/* ── STEP 1: Traveler Details ──────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-3.5 my-auto font-sans">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type="text"
                    placeholder="Marco Polo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type="email"
                    placeholder="wanderer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Phone <span className="text-[10px] text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast text-xs sm:text-sm mt-2 transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] group cursor-pointer"
                >
                  Continue to Password Setup
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          )}

          {/* ── STEP 2: Password Setup ────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-3.5 my-auto font-sans">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Create Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create strong password"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                </div>
                {formData.password && <PasswordStrengthBar password={formData.password} />}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 h-11 bg-card/60 border-border text-foreground placeholder:text-muted-foreground/60 focus:border-aurora focus:ring-2 focus:ring-aurora/20 text-sm font-sans transition-all duration-200"
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
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-[11px] text-destructive mt-1 font-sans">Passwords do not match.</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-1/3"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full h-11 rounded-full border-border hover:border-aurora/50 hover:bg-aurora/5 text-xs font-sans font-semibold cursor-pointer"
                  >
                    Back
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-2/3"
                >
                  <Button
                    type="button"
                    disabled={!canProceedStep2 || isSendingOtp}
                    onClick={() => handleRequestOtp()}
                    className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast text-xs sm:text-sm transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] group cursor-pointer"
                  >
                    {isSendingOtp ? 'Sending Code...' : 'Send Verification OTP'}
                    <KeyRound className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:rotate-12" />
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {/* ── STEP 3: 6-Digit OTP Verification ──────────────────────────── */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 my-auto font-sans">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-aurora/15 text-aurora mb-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                >
                  <KeyRound className="w-6 h-6" />
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit passcode sent to <span className="font-semibold text-foreground">{formData.email}</span>
                </p>
              </div>

              {/* 6 Digit Input Grid */}
              <div className="flex justify-center gap-2 sm:gap-2.5 my-3">
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
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-card/80 border border-border text-foreground focus:border-aurora focus:ring-2 focus:ring-aurora/20 focus:scale-105 outline-none transition-all duration-200"
                  />
                ))}
              </div>

              {/* Resend Action & Back Link */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className="hover:text-aurora hover:underline transition-colors"
                >
                  Change email
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: resendTimer === 0 ? 1.05 : 1 }}
                  whileTap={{ scale: resendTimer === 0 ? 0.95 : 1 }}
                  disabled={resendTimer > 0 || isSendingOtp}
                  onClick={() => handleRequestOtp()}
                  className="flex items-center gap-1 text-aurora hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  <RotateCcw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP'}
                </motion.button>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-1/3"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="w-full h-11 rounded-full border-border hover:border-aurora/50 hover:bg-aurora/5 text-xs font-sans font-semibold cursor-pointer"
                  >
                    Back
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-2/3"
                >
                  <Button
                    type="submit"
                    disabled={!isOtpComplete || isLoading}
                    className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast text-xs sm:text-sm transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] cursor-pointer"
                  >
                    {isLoading ? 'Verifying Passport...' : 'Verify & Launch Journal'}
                  </Button>
                </motion.div>
              </div>
            </form>
          )}

          {/* Footer Card Navigation */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/80" />
              <span className="text-[11px] text-muted-foreground font-mono">ALREADY REGISTERED?</span>
              <div className="flex-1 h-px bg-border/80" />
            </div>

            <Link href={signinHref} className="block w-full">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full border-border hover:border-aurora hover:bg-aurora/5 hover:text-aurora text-xs sm:text-sm font-sans font-semibold transition-all duration-200 cursor-pointer"
                >
                  Sign In to Existing Journal
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
            key={activeStory.location}
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
                  {activeStory.location} · {activeStory.country}
                </span>
              </div>
              <span className="text-[10px] font-mono whitespace-nowrap px-2.5 py-0.5 rounded-full text-white/90 bg-black/40 backdrop-blur-md ring-1 ring-white/10">
                {activeStory.coords}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-sans font-semibold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {activeStory.highlight}
            </h2>

            {/* Story */}
            <p className="text-xs sm:text-sm font-sans text-white/90 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {activeStory.story}
            </p>

            {/* Footer Navigation Dots */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs text-white/75 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Explore Destination
              </span>
              <div className="flex items-center gap-1.5">
                {CINEMATIC_STORIES.map((story, i) => (
                  <motion.button
                    key={story.country}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => switchSlide(i)}
                    aria-label={`View ${story.country}`}
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
          <span>{activeStory.location}</span>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignUpContent />
    </Suspense>
  );
}
