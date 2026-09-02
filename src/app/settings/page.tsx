'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Check, LayoutDashboard, LogOut, Upload, 
  Camera, Globe, Languages, MapPin, Mountain, Compass, 
  Sparkles, Save, User, Heart, ShieldCheck, Lock, Eye, EyeOff,
  Smartphone, Laptop, KeyRound, Download, Trash2, AlertTriangle,
  RefreshCw, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency, SUPPORTED_CURRENCIES } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { type AuthUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PREVIEWS = {
  dark: {
    name: 'Night',
    note: 'Deep ink and aurora light. The default.',
    bg: '#080B14',
    surface: '#11172A',
    line: '#1C2440',
    text: '#E8EDF7',
    dim: '#94A3C4',
    dots: ['#3EE8C8', '#8B7FF5', '#F2789F'],
  },
  light: {
    name: 'Day',
    note: 'Cool paper and ink. Not an inversion — a second palette.',
    bg: '#F5F8FC',
    surface: '#FFFFFF',
    line: '#DCE5F0',
    text: '#0B1020',
    dim: '#55658A',
    dots: ['#0E9C86', '#5A4CD1', '#C93F72'],
  },
} as const;

const AVAILABLE_LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'es', label: 'Spanish', native: 'Español' },
  { id: 'fr', label: 'French', native: 'Français' },
  { id: 'ja', label: 'Japanese', native: '日本語' },
  { id: 'de', label: 'German', native: 'Deutsch' },
  { id: 'ar', label: 'Arabic', native: 'العربية' },
  { id: 'zh', label: 'Mandarin', native: '中文' },
  { id: 'it', label: 'Italian', native: 'Italiano' },
  { id: 'pt', label: 'Portuguese', native: 'Português' },
];

const TRAVEL_TASTES = [
  { id: 'mountains', label: 'Mountains & Alpine', icon: '⛰️' },
  { id: 'coastal', label: 'Islands & Coral Beaches', icon: '🏝️' },
  { id: 'desert', label: 'Desert & Sand Dunes', icon: '🏜️' },
  { id: 'forests', label: 'Ancient Forests & Wildlife', icon: '🌲' },
  { id: 'ancient', label: 'Ancient Temples & Heritage', icon: '🏛️' },
  { id: 'polar', label: 'Arctic & Aurora Glow', icon: '❄️' },
  { id: 'streetfood', label: 'Authentic Street Food', icon: '🍜' },
  { id: 'solitude', label: 'Off-Grid Solitude', icon: '🧭' },
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
];

function ThemePreview({ variant }: { variant: 'dark' | 'light' }) {
  const p = PREVIEWS[variant];
  return (
    <span
      aria-hidden="true"
      className="block overflow-hidden rounded-xl"
      style={{ background: p.bg, border: `1px solid ${p.line}` }}
    >
      <span className="flex h-[104px] flex-col justify-between p-3.5">
        <span className="flex items-start justify-between">
          <span
            style={{ color: p.text, fontFamily: 'var(--font-serif), Georgia, serif' }}
            className="text-[1.375rem] leading-none font-semibold"
          >
            Aa
          </span>
          <span className="flex gap-1.5 pt-1">
            {p.dots.map((d) => (
              <span key={d} className="h-2 w-2 rounded-full" style={{ background: d }} />
            ))}
          </span>
        </span>
        <span className="block space-y-1.5">
          <span className="block h-1.5 w-full rounded-full" style={{ background: p.dim, opacity: 0.5 }} />
          <span className="block h-1.5 w-3/5 rounded-full" style={{ background: p.dim, opacity: 0.3 }} />
        </span>
        <span
          className="block rounded-md px-2.5 py-1 text-[0.625rem] font-semibold font-mono"
          style={{ background: p.surface, color: p.dim, border: `1px solid ${p.line}`, width: 'fit-content' }}
        >
          {p.name}
        </span>
      </span>
    </span>
  );
}

function SettingsCard({
  label,
  title,
  description,
  children,
}: {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase font-bold tracking-wider text-aurora">{label}</p>
        <h2 className="font-serif text-2xl font-medium mt-1 text-foreground">{title}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="pt-2">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { theme, setTheme, mounted } = useTheme();
  const { currency, setCurrency, rates, formatPrice } = useCurrency();
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile preferences state
  const [name, setName] = useState('Ansh Tank');
  const [avatar, setAvatar] = useState('');
  const [homeLocation, setHomeLocation] = useState('Mumbai, India');
  const [languages, setLanguages] = useState<string[]>(['en', 'hi']);
  const [travelTasteBio, setTravelTasteBio] = useState('I love high-altitude mountain trekking, misty pine forests, remote trails, and authentic street food.');
  const [selectedTastes, setSelectedTastes] = useState<string[]>(['mountains', 'forests', 'streetfood']);
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Security & Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwUpdating, setPwUpdating] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { user: authUser, isLoggedIn, signOut, updateUser } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  useEffect(() => {
    setUser(authUser);
    if (authUser?.name) setName(authUser.name);
    if (authUser?.avatar) setAvatar(authUser.avatar);

    try {
      const prefs = localStorage.getItem('atlasaura-preferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.name) setName(parsed.name);
        if (parsed.avatar) setAvatar(parsed.avatar);
        if (parsed.homeLocation) setHomeLocation(parsed.homeLocation);
        if (parsed.languages) setLanguages(parsed.languages);
        if (parsed.bio) setTravelTasteBio(parsed.bio);
        if (parsed.tastes) setSelectedTastes(parsed.tastes);
      }
    } catch (e) {
      console.error(e);
    }
  }, [authUser]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast client-side image compression via HTML5 Canvas (keeps avatar crisp while taking ~30KB)
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setAvatar(compressed);
        } else {
          setAvatar(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleLanguage = (langId: string) => {
    setLanguages((prev) => 
      prev.includes(langId) ? (prev.length > 1 ? prev.filter((l) => l !== langId) : prev) : [...prev, langId]
    );
  };

  const toggleTaste = (tasteId: string) => {
    setSelectedTastes((prev) =>
      prev.includes(tasteId) ? prev.filter((t) => t !== tasteId) : [...prev, tasteId]
    );
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profileData = {
        name,
        avatar,
        homeLocation,
        languages,
        bio: travelTasteBio,
        tastes: selectedTastes,
      };

      // 1. Save directly to MongoDB database
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      // 2. Safe local preferences storage
      try {
        const localData = {
          name,
          homeLocation,
          languages,
          bio: travelTasteBio,
          tastes: selectedTastes,
          avatar: avatar && avatar.length < 50000 ? avatar : undefined,
        };
        localStorage.setItem('atlasaura-preferences', JSON.stringify(localData));
      } catch (storageErr) {
        console.warn('LocalStorage quota limit reached, persisted to MongoDB database.');
      }

      updateUser({ name, avatar });

      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to save profile settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (newPassword.length < 6) {
      setPwMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPwUpdating(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPwMessage({ text: data.message || 'Password updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwMessage({ text: data.message || 'Failed to update password.', type: 'error' });
      }
    } catch (err) {
      setPwMessage({ text: 'An unexpected network error occurred.', type: 'error' });
    } finally {
      setPwUpdating(false);
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: user || { name, homeLocation },
      preferences: { languages, bio: travelTasteBio, tastes: selectedTastes, currency },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlasaura-passport-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: 'None', color: 'bg-muted' };
    let score = 0;
    if (pw.length >= 6) score += 1;
    if (pw.length >= 10) score += 1;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-aurora' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <header className="glass-bar sticky top-0 z-40 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 text-aurora" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {savedFeedback && (
              <span className="text-xs font-mono text-aurora flex items-center gap-1.5 bg-aurora/10 border border-aurora/30 px-3.5 py-1.5 rounded-full shadow-sm">
                <Check className="w-3.5 h-3.5" /> Changes Saved
              </span>
            )}
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full text-xs px-6 py-4 shadow-md transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? 'Saving...' : 'Save All Preferences'}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Wide 7XL Container ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-10">
        {/* Title Header */}
        <div className="border-b border-border/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase font-bold text-aurora tracking-wider">Passport & Account Calibration</p>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium mt-1 text-foreground tracking-tight">Account Settings</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Personalize your explorer identity, travel preferences, language fluencies, and configure account security and password.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full text-xs text-rose-500 border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* ── 2-Column Wide Grid Layout ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols): Identity, Avatar & Preferences */}
          <div className="lg:col-span-5 space-y-8">
            {/* 1. Profile Picture & Explorer Persona */}
            <SettingsCard
              label="Explorer Identity"
              title="Profile Picture & Persona"
              description="Upload your personal travel photo or choose a curated explorer avatar."
            >
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-muted/40 border border-border/70">
                  <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-full shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-aurora/50 hover:border-aurora transition-colors group flex items-center justify-center bg-card shadow-md"
                    title="Click to upload custom photo"
                  >
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                  <input 
                    ref={avatarInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    className="hidden" 
                  />

                  <div className="space-y-1.5 flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => avatarInputRef.current?.click()}
                      className="rounded-full text-xs gap-1.5 h-8 w-full sm:w-auto"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </Button>
                    <p className="text-[11px] text-muted-foreground">PNG, JPG, WebP up to 5MB.</p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-2">
                    Or Select Curated Explorer Avatar:
                  </label>
                  <div className="flex gap-2.5">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(av)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                          avatar === av ? 'border-aurora scale-110 shadow-md' : 'border-border/60 hover:border-border'
                        }`}
                      >
                        <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Name & Departure City */}
                <div className="space-y-4 pt-2 border-t border-border/60">
                  <div>
                    <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                      Display Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Explorer Name"
                      className="h-10 text-xs rounded-xl bg-card"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                      Home Departure City (For Flight AI Calculations)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aurora" />
                      <Input
                        value={homeLocation}
                        onChange={(e) => setHomeLocation(e.target.value)}
                        placeholder="e.g. Mumbai, India or London, UK"
                        className="pl-10 h-10 text-xs rounded-xl bg-card"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                      Travel Taste Bio
                    </label>
                    <textarea
                      value={travelTasteBio}
                      onChange={(e) => setTravelTasteBio(e.target.value)}
                      rows={3}
                      className="w-full p-3 text-xs rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-aurora outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* 2. Visual Palette & Currency */}
            <SettingsCard
              label="Visuals & Finances"
              title="Theme & Currency"
              description="Customize the platform palette and base calculation currency."
            >
              <div className="space-y-6">
                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-3">
                    Palette Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['dark', 'light'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setTheme(mode)}
                        className={`text-left p-2 rounded-2xl border transition-all ${
                          mounted && theme === mode
                            ? 'border-aurora ring-2 ring-aurora/30 shadow-md'
                            : 'border-border hover:border-border/80'
                        }`}
                      >
                        <ThemePreview variant={mode} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Currency Calibration */}
                <div className="pt-4 border-t border-border/60">
                  <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-2">
                    Default Currency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => setCurrency(curr.code)}
                        className={`py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                          currency === curr.code
                            ? 'bg-aurora text-ink-void border-aurora font-bold shadow-sm'
                            : 'bg-card border-border hover:border-border/80 text-foreground'
                        }`}
                      >
                        <span>{curr.symbol} {curr.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>

          {/* Right Column (7 Cols): Travel Passions, Security & Password, Active Sessions */}
          <div className="lg:col-span-7 space-y-8">
            {/* 3. Destination Passions & Landscape Vibe */}
            <SettingsCard
              label="Travel Passions"
              title="Preferred Landscapes & Vibes"
              description="Select the terrains and sensations that match your expedition style."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRAVEL_TASTES.map((taste) => {
                  const isSelected = selectedTastes.includes(taste.id);
                  return (
                    <button
                      key={taste.id}
                      type="button"
                      onClick={() => toggleTaste(taste.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-aurora/10 border-aurora text-foreground font-semibold shadow-sm'
                          : 'bg-card border-border/70 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <span className="text-xs flex items-center gap-2">
                        <span className="text-base">{taste.icon}</span>
                        <span>{taste.label}</span>
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-aurora shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Language Fluency */}
              <div className="mt-6 pt-5 border-t border-border/60">
                <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-2.5">
                  Languages Known / Preferred
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSelected = languages.includes(lang.id);
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => toggleLanguage(lang.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                          isSelected
                            ? 'bg-aurora text-ink-void border-aurora font-bold shadow-sm'
                            : 'bg-card border-border/70 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {lang.label} ({lang.native})
                      </button>
                    );
                  })}
                </div>
              </div>
            </SettingsCard>

            {/* 4. Security, Change Password & Two-Factor Authentication */}
            <SettingsCard
              label="Account Security"
              title="Password & Authentication"
              description="Manage your account password, multi-factor verification, and session security."
            >
              <form onSubmit={handleChangePassword} className="space-y-5">
                {/* Status Message */}
                {pwMessage && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                      pwMessage.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {pwMessage.type === 'success' ? <BadgeCheck className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{pwMessage.text}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="pl-10 pr-10 h-10 text-xs rounded-xl bg-muted/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Strength */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="pl-10 pr-10 h-10 text-xs rounded-xl bg-muted/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPw ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="pl-10 pr-10 h-10 text-xs rounded-xl bg-muted/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted-foreground">Strength: {pwStrength.label}</span>
                        <span className="text-muted-foreground">{pwStrength.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${pwStrength.color}`}
                          style={{ width: `${pwStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={pwUpdating || !newPassword}
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs px-5 py-4 shadow-sm active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  {pwUpdating ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>

              {/* Two-Factor Authentication Status */}
              <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Two-Factor Email OTP Protection
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Requires a 6-digit verification code sent to your registered email upon sign in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    twoFactorEnabled ? 'bg-aurora' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ink-void shadow-lg ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </SettingsCard>

            {/* 5. Active Sessions & Privacy Controls */}
            <SettingsCard
              label="Device & Data Privacy"
              title="Active Sessions & Data Export"
              description="Review connected devices and download your complete AtlasAura travel passport history."
            >
              <div className="space-y-6">
                {/* Active Device Session */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">Windows PC · Chrome 128</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-500 font-bold">
                          Current Device
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Mumbai, India · Active Now</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-aurora font-bold">Online</span>
                </div>

                {/* Data Export & Session Termination */}
                <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Export Passport Archive</span>
                    <p className="text-[11px] text-muted-foreground">Download your pinned memories, preferences and bookmarks.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    className="rounded-full text-xs gap-1.5 h-9 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </Button>
                </div>

                {/* Sign Out Action */}
                <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-foreground block">Terminate Session</span>
                    <p className="text-[11px] text-muted-foreground">Sign out and securely wipe all cached traveler artifacts on this device.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut();
                      router.push('/');
                    }}
                    className="rounded-full text-xs gap-1.5 h-9 shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>
      </main>
    </div>
  );
}
