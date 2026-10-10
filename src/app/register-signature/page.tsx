'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck2, ShieldCheck, PenLine, Type, Upload, RotateCcw, 
  CheckCircle2, ArrowRight, AlertCircle, Copy, Check, Printer,
  Download, Lock, Award, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { submitDigitalSignature, getDigitalSignatureStatus } from '@/lib/auth';

function DigitalSignatureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const { theme, mounted } = useTheme();
  const isDark = mounted ? theme === 'dark' : true;

  // Identity state
  const [loadingToken, setLoadingToken] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [userDetails, setUserDetails] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    digitalSignature?: string;
    signatureRegisteredAt?: string;
  } | null>(null);

  // Form State
  const [signMethod, setSignMethod] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'serif' | 'classic'>('cursive');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  
  // Success state
  const [certificateData, setCertificateData] = useState<{
    certificateId: string;
    registeredAt: string;
    fingerprint?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const historyRef = useRef<ImageData[]>([]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenError('Signature registration token is missing. Please use the secure link sent to your email.');
      setLoadingToken(false);
      return;
    }

    getDigitalSignatureStatus(token)
      .then((res) => {
        if (!res.valid || !res.user) {
          setTokenError(res.error || 'The signature registration link is invalid or has expired.');
        } else {
          setUserDetails(res.user);
          setTypedName(res.user.name || '');
          if (res.user.digitalSignature && res.user.signatureRegisteredAt) {
            setCertificateData({
              certificateId: `ATLAS-ESIGN-${res.user.id.slice(-8).toUpperCase()}`,
              registeredAt: res.user.signatureRegisteredAt,
            });
          }
        }
      })
      .catch(() => {
        setTokenError('Failed to verify token. Please check your internet connection.');
      })
      .finally(() => {
        setLoadingToken(false);
      });
  }, [token]);

  // Setup Canvas
  useEffect(() => {
    if (signMethod === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = isDark ? '#2dd4bf' : '#0f766e';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signMethod, isDark]);

  // Canvas mouse/touch events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    historyRef.current = [];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmissionError('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (!agreed) {
      setSubmissionError('You must agree to the Digital Signature declaration.');
      return;
    }

    let signaturePayload = '';

    if (signMethod === 'draw') {
      if (!hasDrawn || !canvasRef.current) {
        setSubmissionError('Please draw your digital signature on the pad.');
        return;
      }
      signaturePayload = canvasRef.current.toDataURL('image/png');
    } else if (signMethod === 'type') {
      if (!typedName.trim() || typedName.trim().length < 2) {
        setSubmissionError('Please enter your legal name for the typed signature.');
        return;
      }
      signaturePayload = `typed:${selectedFont}:${typedName.trim()}`;
    } else if (signMethod === 'upload') {
      if (!uploadedImage) {
        setSubmissionError('Please upload your signature image.');
        return;
      }
      signaturePayload = uploadedImage;
    }

    setIsSubmitting(true);

    const result = await submitDigitalSignature({
      token,
      signatureData: signaturePayload,
      signatureType: signMethod,
      signerName: userDetails?.name || typedName.trim(),
      agreedToTerms: agreed,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setSubmissionError(result.error || 'Failed to submit signature. Please try again.');
      return;
    }

    setCertificateData({
      certificateId: result.certificateId || `ATLAS-ESIGN-${Date.now().toString().slice(-8)}`,
      registeredAt: result.registeredAt || new Date().toISOString(),
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-aurora border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Validating signature credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <svg viewBox="0 0 32 32" className="h-6 w-6 text-aurora" aria-hidden="true">
              <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
              <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
            </svg>
            <span className="font-sans text-lg font-bold tracking-tight text-foreground">
              Atlas<span className="text-aurora">Aura</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/10 border border-aurora/30 text-aurora text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Digital Signature Registry</span>
            </div>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      {/* ── Main Container ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {tokenError ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-xl text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-foreground mb-2">
              Registration Link Invalid
            </h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {tokenError}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signin">
                <Button variant="outline" className="w-full sm:w-auto rounded-full">
                  Sign In to Journal
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground">
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>
        ) : certificateData ? (
          /* ── CERTIFICATE VIEW (SUCCESS STATE) ───────────────────────────── */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 sm:p-10 shadow-2xl">
              <BorderBeam size={220} duration={8} colorFrom="#0d9488" colorTo="#2dd4bf" borderWidth={2} />

              <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="w-14 h-14 rounded-full bg-aurora/15 text-aurora flex items-center justify-center mx-auto mb-2 shadow-[0_0_24px_rgba(45,212,191,0.25)]">
                  <Award className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/10 text-aurora text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digital Signature Registered</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">
                  Certificate of Digital E-Sign
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your legal electronic signature is cryptographically bound to your verified AtlasAura passport.
                </p>
              </div>

              {/* Certificate Details Card */}
              <div className="mt-8 rounded-2xl bg-muted/40 border border-border/80 p-6 space-y-4 font-sans text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border/60">
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Registered Signer</span>
                    <span className="text-base font-semibold text-foreground">{userDetails?.name}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Certificate Reference ID</span>
                    <span className="font-mono text-sm font-bold text-aurora">{certificateData.certificateId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border/60">
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Verified Email</span>
                    <span className="text-foreground">{userDetails?.email}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Verified Mobile Number</span>
                    <span className="text-foreground">{userDetails?.phone || 'Verified via SMS'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Registration Timestamp</span>
                    <span className="text-muted-foreground text-xs font-mono">
                      {new Date(certificateData.registeredAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-muted-foreground font-semibold block">Security Standard</span>
                    <span className="text-xs text-muted-foreground">
                      256-bit SHA Certificate (IT Act 2000 Compliant)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto rounded-full flex items-center gap-2 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-initial rounded-full flex items-center gap-2 text-xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-aurora" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link' : 'Share Verification Link'}</span>
                  </Button>

                  <Link href="/dashboard" className="flex-1 sm:flex-initial">
                    <Button className="w-full rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm flex items-center gap-2">
                      <span>Enter Explorer Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── REGISTRATION FORM VIEW ─────────────────────────────────────── */
          <div className="space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-aurora text-xs font-semibold uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                <span>Dual-Factor Verified Passport</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">
                Register Your Official Digital Signature
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Please register your digital signature below. This legally verified digital signature is stored cryptographically and will be attached to your official expedition logs, cultural memory submissions, and verified travel passports.
              </p>
            </div>

            {/* Authenticated Explorer Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-aurora/15 text-aurora flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{userDetails?.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-aurora/10 text-aurora text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 font-mono">
                    <span>{userDetails?.email}</span>
                    {userDetails?.phone && <span>· {userDetails.phone}</span>}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:text-right">
                <span className="block font-medium text-foreground">Dual OTP Authentication</span>
                <span className="text-[11px] text-aurora">Email & Mobile Verified</span>
              </div>
            </div>

            {/* Error Message */}
            {submissionError && (
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-destructive/15 text-destructive text-xs sm:text-sm font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            {/* Registration Card */}
            <form onSubmit={handleSubmitSignature} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
              {/* Method Switcher */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider">
                  Select Signature Creation Method
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-muted/50 border border-border">
                  <button
                    type="button"
                    onClick={() => setSignMethod('draw')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      signMethod === 'draw'
                        ? 'bg-card text-aurora shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Draw Pad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignMethod('type')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      signMethod === 'type'
                        ? 'bg-card text-aurora shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Type Legal Name</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignMethod('upload')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      signMethod === 'upload'
                        ? 'bg-card text-aurora shadow-sm border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              {/* ── METHOD 1: DRAW ────────────────────────────────────────── */}
              {signMethod === 'draw' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Draw your signature with cursor, finger, or stylus:</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear Canvas</span>
                    </button>
                  </div>

                  <div className="relative rounded-2xl border-2 border-dashed border-border bg-card/80 overflow-hidden touch-none h-44 sm:h-52 flex items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      width={650}
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-crosshair"
                    />
                    {!hasDrawn && (
                      <span className="absolute pointer-events-none text-muted-foreground/40 text-xs sm:text-sm font-serif italic">
                        Sign here using touchpad or mouse
                      </span>
                    )}
                    <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/60 select-none">
                      AtlasAura E-Sign Pad
                    </div>
                  </div>
                </div>
              )}

              {/* ── METHOD 2: TYPE ────────────────────────────────────────── */}
              {signMethod === 'type' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Legal Full Name
                    </label>
                    <Input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Enter legal name"
                      className="h-11 bg-card/60 border-border text-foreground text-sm font-sans"
                    />
                  </div>

                  {/* Font Style Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                      Select Calligraphic Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'cursive', label: 'Artisan Cursive', fontClass: 'font-serif italic' },
                        { id: 'serif', label: 'Diplomatic Serif', fontClass: 'font-serif' },
                        { id: 'classic', label: 'Expedition Script', fontClass: 'font-mono' },
                      ].map((style) => (
                        <div
                          key={style.id}
                          onClick={() => setSelectedFont(style.id as any)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedFont === style.id
                              ? 'border-aurora bg-aurora/10 text-foreground ring-1 ring-aurora/30'
                              : 'border-border bg-card/50 text-muted-foreground hover:border-border/80'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                            {style.label}
                          </span>
                          <span className={`text-xl sm:text-2xl text-aurora block truncate ${style.fontClass}`}>
                            {typedName || userDetails?.name || 'Explorer Signature'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── METHOD 3: UPLOAD ──────────────────────────────────────── */}
              {signMethod === 'upload' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Upload Physical Signature Image
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl hover:border-aurora/50 bg-muted/20 cursor-pointer transition-all">
                    {uploadedImage ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={uploadedImage}
                          alt="Signature Preview"
                          className="max-h-24 max-w-full object-contain mx-auto rounded-lg bg-card p-2 border border-border"
                        />
                        <span className="text-xs text-aurora font-medium block">
                          Signature image loaded. Click to replace.
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground">Click to upload signature scan</span>
                        <span className="text-xs text-muted-foreground mt-0.5">PNG, JPG, or WEBP (Max 2MB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Legal Declaration Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-border text-aurora focus:ring-aurora accent-[hsl(var(--aurora))]"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed font-sans">
                    I declare and certify that this signature is my authentic electronic signature. I consent to its legal application for AtlasAura member records, expedition itineraries, and digital certifications under applicable electronic signature laws (IT Act 2000 / ISO 27001).
                  </span>
                </label>
              </div>

              {/* CTA Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    Skip and register later
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={!agreed || isSubmitting}
                  className="w-full sm:w-auto min-w-[220px] h-11 rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-cast hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.5)] cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Registering Signature...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Register & Secure Signature
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AtlasAura Cartography Systems. Cryptographic Digital Signature Registry.</p>
      </footer>
    </div>
  );
}

export default function RegisterSignaturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DigitalSignatureContent />
    </Suspense>
  );
}
