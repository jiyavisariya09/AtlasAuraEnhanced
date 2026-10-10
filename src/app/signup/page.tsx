'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, User, 
  Phone, Check, X, AlertCircle, MapPin, KeyRound, RotateCcw,
  CheckCircle2, Copy, ShieldCheck, FileSignature, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { sendOtp } from '@/lib/auth';
import { CountryPhoneInput } from '@/components/ui/phone-input';
import { validatePhone } from '@/lib/phone-validation';
import { DEFAULT_COUNTRY } from '@/data/countries';

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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Form input fields
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail,
    phone: '',
    fullPhone: '',
    countryCode: 'IN',
    password: '',
    confirmPassword: '',
  });

  // Inline Validation Touch & Error states
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // 6-digit OTP states for Email and Mobile SMS
  const [emailOtpDigits, setEmailOtpDigits] = useState(['', '', '', '', '', '']);
  const [phoneOtpDigits, setPhoneOtpDigits] = useState(['', '', '', '', '', '']);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Signature link dispatch state after step 3
  const [signatureData, setSignatureData] = useState<{
    signatureLink: string;
    signatureToken: string;
    userEmail: string;
    userPhone: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [devSmsNotice, setDevSmsNotice] = useState<string | null>(null);

  // Sync initial email
  useEffect(() => {
    if (initialEmail) {
      setFormData((prev) => (prev.email ? prev : { ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

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

  // Validation helpers
  const validateField = (fieldName: string, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Full legal name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';

      case 'email':
        if (!value.trim()) return 'Email address is required.';
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address (e.g. traveler@domain.com).';
        return '';

      case 'phone': {
        if (!value.trim()) return 'Mobile phone number is required.';
        const res = validatePhone(value, formData.countryCode);
        if (!res.isValid) return res.error || 'Please enter a valid phone number.';
        return '';
      }

      case 'password': {
        if (!value) return 'Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(value)) return 'Must include at least 1 uppercase letter.';
        if (!/[a-z]/.test(value)) return 'Must include at least 1 lowercase letter.';
        if (!/\d/.test(value)) return 'Must include at least 1 number.';
        return '';
      }

      case 'confirmPassword':
        if (!value) return 'Please confirm your password.';
        if (value !== formData.password) return 'Passwords do not match.';
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    const errorMsg = validateField(fieldName, (formData as any)[fieldName]);
    setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  };

  const handlePhoneChange = (val: string, fullE164: string, country: any, isValid: boolean) => {
    setFormData((prev) => ({
      ...prev,
      phone: val,
      fullPhone: fullE164,
      countryCode: country.code,
    }));

    if (touchedFields.phone) {
      const res = validatePhone(val, country.code);
      setFieldErrors((prev) => ({ ...prev, phone: res.isValid ? '' : res.error }));
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const passwordScore = [
    formData.password.length >= 8,
    /[A-Z]/.test(formData.password),
    /[a-z]/.test(formData.password),
    /\d/.test(formData.password),
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  ].filter(Boolean).length;

  const phoneValidation = validatePhone(formData.phone, formData.countryCode);
  const isStep1Valid = 
    formData.name.trim().length >= 2 && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && 
    phoneValidation.isValid;

  const isStep2Valid = passwordScore >= 3 && passwordsMatch;

  // Step 1 Proceed
  const handleProceedToStep2 = () => {
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const phoneErr = validateField('phone', formData.phone);

    setTouchedFields({ name: true, email: true, phone: true });
    setFieldErrors({ name: nameErr, email: emailErr, phone: phoneErr });

    if (nameErr || emailErr || phoneErr) {
      setError('Please resolve all highlighted fields before continuing.');
      return;
    }

    setError('');
    setStep(2);
  };

  // Step 2: Request Dual OTP (Email + Mobile)
  const handleRequestDualOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStep2Valid) {
      setError('Please ensure your master password meets the security requirements.');
      return;
    }

    setError('');
    setIsSendingOtp(true);

    const fullPhone = formData.fullPhone || phoneValidation.e164 || `${DEFAULT_COUNTRY.dialCode}${formData.phone.replace(/\D/g, '')}`;

    const result = await sendOtp({
      email: formData.email,
      phone: fullPhone,
      name: formData.name,
      purpose: 'signup',
    });

    setIsSendingOtp(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.devPhoneOtp) {
      setDevSmsNotice(result.devPhoneOtp);
    }

    setInfoMessage(result.message || `Verification codes dispatched to ${formData.email} and ${fullPhone}`);
    setResendTimer(60);
    setStep(3);
    setTimeout(() => {
      emailOtpRefs.current[0]?.focus();
    }, 200);
  };

  // Digit Input Handlers for Email OTP
  const handleEmailOtpChange = (index: number, val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...emailOtpDigits];
    newDigits[index] = sanitized;
    setEmailOtpDigits(newDigits);

    if (sanitized && index < 5) {
      emailOtpRefs.current[index + 1]?.focus();
    } else if (sanitized && index === 5) {
      // auto-focus first phone OTP field if empty
      if (!phoneOtpDigits[0]) {
        phoneOtpRefs.current[0]?.focus();
      }
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailOtpDigits[index] && index > 0) {
      emailOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleEmailOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...emailOtpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setEmailOtpDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 5);
    emailOtpRefs.current[nextFocus]?.focus();
  };

  // Digit Input Handlers for Phone OTP
  const handlePhoneOtpChange = (index: number, val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...phoneOtpDigits];
    newDigits[index] = sanitized;
    setPhoneOtpDigits(newDigits);

    if (sanitized && index < 5) {
      phoneOtpRefs.current[index + 1]?.focus();
    }
  };

  const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !phoneOtpDigits[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  const handlePhoneOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...phoneOtpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setPhoneOtpDigits(newDigits);
    const nextFocus = Math.min(pasted.length, 5);
    phoneOtpRefs.current[nextFocus]?.focus();
  };

  const emailOtpCode = emailOtpDigits.join('');
  const phoneOtpCode = phoneOtpDigits.join('');
  const isBothOtpsComplete = emailOtpCode.length === 6 && phoneOtpCode.length === 6;

  // Final Dual Verification Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBothOtpsComplete) {
      setError('Please enter both the 6-digit Email code and the 6-digit Mobile SMS code.');
      return;
    }

    setError('');
    setIsLoading(true);

    const fullPhone = formData.fullPhone || phoneValidation.e164 || `${DEFAULT_COUNTRY.dialCode}${formData.phone.replace(/\D/g, '')}`;

    const result = await signUp({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: fullPhone,
      password: formData.password,
      emailOtp: emailOtpCode,
      phoneOtp: phoneOtpCode,
      otp: emailOtpCode,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Dual verification failed. Please check both passcodes.');
      return;
    }

    // Success! Store digital signature link and transition to Step 4
    if (result.signatureLink && result.signatureToken) {
      setSignatureData({
        signatureLink: result.signatureLink,
        signatureToken: result.signatureToken,
        userEmail: formData.email,
        userPhone: fullPhone,
      });
      setStep(4);
    } else {
      router.push('/welcome');
    }
  };

  const handleCopySignatureLink = () => {
    if (signatureData?.signatureLink) {
      navigator.clipboard.writeText(signatureData.signatureLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const signinHref = formData.email ? `/signin?email=${encodeURIComponent(formData.email)}` : '/signin';

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      {/* ── Seamless Full-Screen Photography ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0">
          <img
            src={prevImage}
            alt=""
            className="w-full h-full object-cover object-center transform-gpu"
          />
        </div>

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

        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-black/45" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
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

      {/* ── CENTER: Fixed-Size Auth Card with BorderBeam ──────────────────── */}
      <main className="relative z-20 w-full max-w-[460px] px-4 sm:px-0 my-auto py-10">
        <div className="relative overflow-hidden w-full min-h-[590px] flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-card/95 dark:bg-card/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
          <BorderBeam
            size={180}
            duration={7}
            colorFrom={isDark ? '#2dd4bf' : '#0d9488'}
            colorTo={isDark ? '#a78bfa' : '#6366f1'}
            borderWidth={2}
          />

          {/* Header Progress & Identity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <svg viewBox="0 0 32 32" className="h-6 w-6 text-aurora" aria-hidden="true">
                  <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
                  <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
                </svg>
                <span className="font-sans text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-aurora">
                  Atlas<span className="text-aurora">Aura</span>
                </span>
              </Link>

              <div className="flex items-center gap-1.5 bg-card/60 px-2.5 py-1 rounded-full border border-border">
                {[1, 2, 3, 4].map((s) => (
                  <span
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step >= s ? 'bg-aurora shadow-aurora scale-110' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-1">
                  {step}/4
                </span>
              </div>
            </div>

            <div>
              <span className="text-aurora font-sans text-[11px] font-bold tracking-wider uppercase block">
                {step === 1 && 'STEP 1 · TRAVELER IDENTITY'}
                {step === 2 && 'STEP 2 · MASTER CREDENTIALS'}
                {step === 3 && 'STEP 3 · DUAL OTP VERIFICATION'}
                {step === 4 && 'STEP 4 · DIGITAL SIGNATURE DISPATCH'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-0.5 tracking-normal">
                {step === 1 && 'Create your passport'}
                {step === 2 && 'Set master credentials'}
                {step === 3 && 'Dual-Channel Verification'}
                {step === 4 && 'Identity Authenticated'}
              </h1>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                {step === 1 && 'Enter your full name, verified email, and phone with country code.'}
                {step === 2 && 'Create your cryptographic master password for journal access.'}
                {step === 3 && 'Verify Email and Mobile SMS passcodes simultaneously at once.'}
                {step === 4 && 'Your official Digital Signature link has been dispatched.'}
              </p>
            </div>
          </div>

          {/* Error and Alert Banners */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-destructive/15 text-destructive text-xs my-2 font-sans"
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

          {/* Sandbox SMS Simulator Notice (for painless QA without live telco billing) */}
          {devSmsNotice && step === 3 && (
            <div className="p-2.5 rounded-xl bg-muted/60 border border-border text-[11px] text-muted-foreground font-mono flex items-center justify-between">
              <span>SMS Gateway Sandbox Code:</span>
              <span className="font-bold text-aurora bg-card px-2 py-0.5 rounded border border-aurora/30">
                {devSmsNotice}
              </span>
            </div>
          )}

          {/* ── STEP 1: Traveler Details with Country Phone Code ──────────── */}
          {step === 1 && (
            <div className="space-y-3.5 my-auto font-sans">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Full Legal Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type="text"
                    placeholder="Marco Polo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (touchedFields.name) {
                        setFieldErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('name')}
                    className={`pl-10 h-11 bg-card/60 border text-foreground placeholder:text-muted-foreground/60 text-sm font-sans transition-all duration-200 ${
                      fieldErrors.name
                        ? 'border-destructive ring-1 ring-destructive/30'
                        : 'border-border focus:border-aurora focus:ring-2 focus:ring-aurora/20'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-destructive mt-1 font-sans">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
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
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (touchedFields.email) {
                        setFieldErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`pl-10 h-11 bg-card/60 border text-foreground placeholder:text-muted-foreground/60 text-sm font-sans transition-all duration-200 ${
                      fieldErrors.email
                        ? 'border-destructive ring-1 ring-destructive/30'
                        : 'border-border focus:border-aurora focus:ring-2 focus:ring-aurora/20'
                    }`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-destructive mt-1 font-sans">{fieldErrors.email}</p>
                )}
              </div>

              {/* Country-wise Phone Input (Default India +91) */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Mobile Phone Number <span className="text-[10px] text-aurora font-bold">(REQUIRED FOR DUAL OTP)</span>
                </label>
                <CountryPhoneInput
                  value={formData.phone}
                  countryCode={formData.countryCode}
                  onChange={handlePhoneChange}
                  error={touchedFields.phone ? fieldErrors.phone : undefined}
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                <Button
                  type="button"
                  disabled={!isStep1Valid}
                  onClick={handleProceedToStep2}
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
                  Create Master Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create strong password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (touchedFields.password) {
                        setFieldErrors((prev) => ({ ...prev, password: validateField('password', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('password')}
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
                  Confirm Master Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-aurora" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (touchedFields.confirmPassword) {
                        setFieldErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-11 rounded-full border-border hover:border-aurora/50 hover:bg-aurora/5 text-xs font-sans font-semibold cursor-pointer"
                >
                  Back
                </Button>

                <Button
                  type="button"
                  disabled={!isStep2Valid || isSendingOtp}
                  onClick={() => handleRequestDualOtp()}
                  className="w-2/3 h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-sans font-semibold rounded-full shadow-cast text-xs sm:text-sm transition-all hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] group cursor-pointer"
                >
                  {isSendingOtp ? 'Sending Dual OTPs...' : 'Send Dual Verification OTPs'}
                  <KeyRound className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Dual OTP Verification (Email + Mobile at Once) ─────── */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 my-auto font-sans">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-aurora/15 text-aurora mb-1 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Dual Endpoint Authorization</h3>
                <p className="text-[11px] text-muted-foreground">
                  Enter both passcodes to complete verification simultaneously.
                </p>
              </div>

              {/* Panel A: Email OTP */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Mail className="w-3.5 h-3.5 text-aurora" />
                    <span>Email Code</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[170px]">
                    {formData.email}
                  </span>
                </div>

                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {emailOtpDigits.map((digit, i) => (
                    <input
                      key={`email-${i}`}
                      ref={(el) => { emailOtpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleEmailOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleEmailOtpKeyDown(i, e)}
                      onPaste={handleEmailOtpPaste}
                      className="w-9 h-11 sm:w-11 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-xl bg-card border border-border text-foreground focus:border-aurora focus:ring-2 focus:ring-aurora/20 outline-none transition-all duration-150"
                    />
                  ))}
                </div>
              </div>

              {/* Panel B: Mobile SMS OTP */}
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Smartphone className="w-3.5 h-3.5 text-aurora" />
                    <span>Mobile SMS Code</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {formData.fullPhone || formData.phone}
                  </span>
                </div>

                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {phoneOtpDigits.map((digit, i) => (
                    <input
                      key={`phone-${i}`}
                      ref={(el) => { phoneOtpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePhoneOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handlePhoneOtpKeyDown(i, e)}
                      onPaste={handlePhoneOtpPaste}
                      className="w-9 h-11 sm:w-11 sm:h-12 text-center text-lg sm:text-xl font-bold rounded-xl bg-card border border-border text-foreground focus:border-aurora focus:ring-2 focus:ring-aurora/20 outline-none transition-all duration-150"
                    />
                  ))}
                </div>
              </div>

              {/* Resend and Edit Actions */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-aurora hover:underline cursor-pointer"
                >
                  Edit details
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || isSendingOtp}
                  onClick={() => handleRequestDualOtp()}
                  className="flex items-center gap-1 text-aurora hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  <RotateCcw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend codes in ${resendTimer}s` : 'Resend both OTPs'}
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-1/3 h-11 rounded-full border-border text-xs cursor-pointer"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={!isBothOtpsComplete || isLoading}
                  className="w-2/3 h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs sm:text-sm cursor-pointer"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Verify Both & Register'}
                </Button>
              </div>
            </form>
          )}

          {/* ── STEP 4: Digital Signature Registration Dispatch Screen ──────── */}
          {step === 4 && signatureData && (
            <div className="space-y-4 my-auto font-sans">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-aurora/15 text-aurora flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(45,212,191,0.25)]">
                  <FileSignature className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-aurora/10 text-aurora text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Dual Verification Complete</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground">
                  Register Your Digital Signature
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  In compliance with electronic authentication regulations, an official Digital Signature Registration link has been generated and dispatched to your verified email and mobile number.
                </p>
              </div>

              {/* Secure Link Box */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="font-medium text-foreground">Your Signature Registration Link:</span>
                  <button
                    type="button"
                    onClick={handleCopySignatureLink}
                    className="flex items-center gap-1 text-aurora hover:underline cursor-pointer font-medium"
                  >
                    {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-card border border-border/80 font-mono text-[11px] text-foreground truncate select-all">
                  {signatureData.signatureLink}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-2">
                <Link href={`/register-signature?token=${signatureData.signatureToken}`} className="block w-full">
                  <Button className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer">
                    <span>Proceed to Register Digital Signature</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full h-10 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Skip and continue to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Footer Card Navigation */}
          {step !== 4 && (
            <div className="pt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-border/80" />
                <span className="text-[11px] text-muted-foreground">ALREADY REGISTERED?</span>
                <div className="flex-1 h-px bg-border/80" />
              </div>

              <Link href={signinHref} className="block w-full">
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-full border-border hover:border-aurora hover:bg-aurora/5 hover:text-aurora text-xs sm:text-sm font-sans font-semibold transition-all duration-200 cursor-pointer"
                >
                  Sign In to Existing Journal
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* ── BOTTOM LEFT: Floating Photography Location ────────────────────── */}
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
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-aurora shrink-0" />
                <span className="text-xs font-bold text-aurora tracking-wider uppercase font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {activeStory.location} · {activeStory.country}
                </span>
              </div>
              <span className="text-[10px] whitespace-nowrap px-2.5 py-0.5 rounded-full text-white/90 bg-black/40 backdrop-blur-md ring-1 ring-white/10">
                {activeStory.coords}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-sans font-semibold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {activeStory.highlight}
            </h2>

            <p className="text-xs sm:text-sm font-sans text-white/90 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {activeStory.story}
            </p>

            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs text-white/75 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Explore Destination
              </span>
              <div className="flex items-center gap-1.5">
                {CINEMATIC_STORIES.map((story, i) => (
                  <button
                    key={story.country}
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
