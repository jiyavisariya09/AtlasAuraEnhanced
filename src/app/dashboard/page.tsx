'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Globe, MapPin, MessageCircle, Trophy, Award, Star, 
  Zap, Settings, LogOut, Plus, Heart, Compass,
  Map, ChevronRight, Bell, Search, Filter, Plane,
  Target, Sparkles, TrendingUp, Clock, PenLine, X, Camera, Check, Save,
  Luggage, IndianRupee, Calendar, ExternalLink, ShieldCheck, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { currentUser, badges as allBadges, memoryPins as initialPins, countries } from '@/data/mockData';
import { DESTINATIONS, type DestinationItem } from '@/data/destinationsData';
import ThemeToggle from '@/components/ThemeToggle';
import DestinationGlobeModal from '@/components/DestinationGlobeModal';
import AIBudgetEstimatorModal from '@/components/AIBudgetEstimatorModal';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth';
import { BorderBeam } from '@/components/ui/border-beam';

const EASE = [0.22, 1, 0.36, 1] as const;

function CircularProgress({ value, max, size = 88, strokeWidth = 6, children }: { 
  value: number; max: number; size?: number; strokeWidth?: number; children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--aurora))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'memories' | 'trips' | 'badges' | 'saved'>('memories');
  const [greeting, setGreeting] = useState('Welcome back');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userPrefs, setUserPrefs] = useState<{
    name: string;
    travelStyle: string[];
    dreamDestinations: string;
    budgetTier?: string;
    bio?: string;
    avatar?: string;
  } | null>(null);
  const [userPins, setUserPins] = useState<any[]>([]);
  const [tripPlans, setTripPlans] = useState<any[]>([]);
  const [favoriteDestinations, setFavoriteDestinations] = useState<DestinationItem[]>([]);
  const [globeDestination, setGlobeDestination] = useState<DestinationItem | null>(null);
  const [budgetDestination, setBudgetDestination] = useState<DestinationItem | null>(null);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editTravelStyle, setEditTravelStyle] = useState<string[]>([]);
  const [editDestinations, setEditDestinations] = useState('');
  const [editHomeLocation, setEditHomeLocation] = useState('Mumbai, India');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Add memory modal
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [memoryText, setMemoryText] = useState('');
  const [placeInput, setPlaceInput] = useState('');
  const [formMood, setFormMood] = useState('adventure');
  const [formEmoji, setFormEmoji] = useState('📍');
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [memorySuccess, setMemorySuccess] = useState(false);

  const TRAVEL_STYLES = [
    { id: 'solo', label: 'Solo Explorer' },
    { id: 'couple', label: 'Romantic' },
    { id: 'adventure', label: 'Adventurer' },
    { id: 'culture', label: 'Culture Seeker' },
    { id: 'photography', label: 'Photographer' },
    { id: 'relaxed', label: 'Easy Going' },
  ];

  const MOODS = [
    { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
    { id: 'solo', label: 'Solo', emoji: '🎒' },
    { id: 'honeymoon', label: 'Romance', emoji: '💕' },
    { id: 'culture', label: 'Culture', emoji: '🏛️' },
    { id: 'calm', label: 'Peace', emoji: '🧘' },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const user = getCurrentUser();
    if (!user) {
      router.push('/signin');
      return;
    }
    setAuthUser(user);

    // 1. Load profile
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.name) {
          setUserPrefs({
            name: data.name,
            bio: data.bio ?? '',
            avatar: data.avatar ?? '',
            travelStyle: data.travelStyle ?? [],
            dreamDestinations: data.dreamDestinations ?? '',
            budgetTier: data.budgetTier ?? 'explorer',
          });
        }
      })
      .catch(() => {
        const raw = localStorage.getItem('atlasaura-preferences');
        if (raw) setUserPrefs(JSON.parse(raw));
      });

    // 2. Load pins
    fetch('/api/user/pins')
      .then((r) => r.json())
      .then((data) => {
        if (data.pins && data.pins.length > 0) {
          setUserPins(data.pins);
        } else {
          setUserPins(initialPins.slice(0, 4));
        }
      })
      .catch(() => {
        const pins = localStorage.getItem('atlasaura-user-pins');
        if (pins) setUserPins(JSON.parse(pins));
        else setUserPins(initialPins.slice(0, 4));
      });

    // 4. Load favorite destinations
    try {
      const favIds = JSON.parse(localStorage.getItem('atlasaura-favorite-destinations') || '[]');
      const matched = DESTINATIONS.filter((d) => favIds.includes(d.id));
      setFavoriteDestinations(matched.length > 0 ? matched : DESTINATIONS.slice(0, 4));

      const rawPrefs = localStorage.getItem('atlasaura-preferences');
      if (rawPrefs) {
        const parsed = JSON.parse(rawPrefs);
        if (parsed.homeLocation) setEditHomeLocation(parsed.homeLocation);
      }
    } catch (err) {
      console.error(err);
      setFavoriteDestinations(DESTINATIONS.slice(0, 4));
    }
  }, [router]);

  const openSettings = () => {
    setEditName(userPrefs?.name || authUser?.name || '');
    setEditBio(userPrefs?.bio || '');
    setEditAvatar(userPrefs?.avatar || '');
    setEditTravelStyle(userPrefs?.travelStyle || []);
    setEditDestinations(userPrefs?.dreamDestinations || '');
    try {
      const rawPrefs = localStorage.getItem('atlasaura-preferences');
      if (rawPrefs) {
        const parsed = JSON.parse(rawPrefs);
        if (parsed.homeLocation) setEditHomeLocation(parsed.homeLocation);
      }
    } catch (e) {}
    setSaveSuccess(false);
    setShowSettings(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleStyle = (id: string) => {
    setEditTravelStyle((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const updated = {
      name: editName,
      avatar: editAvatar,
      bio: editBio,
      travelStyle: editTravelStyle,
      dreamDestinations: editDestinations,
      homeLocation: editHomeLocation,
    };
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
    setUserPrefs((prev) => ({ ...prev!, ...updated }));
    const rawPrev = JSON.parse(localStorage.getItem('atlasaura-preferences') || '{}');
    localStorage.setItem('atlasaura-preferences', JSON.stringify({ ...rawPrev, ...updated }));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSettings(false);
    }, 1000);
  };

  const handleAddMemory = async () => {
    if (!memoryText.trim() || !placeInput.trim()) {
      setGeoError('Please provide both the place name and your memory.');
      return;
    }
    setGeocoding(true);
    setGeoError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeInput)}&format=json&limit=1`
      );
      const data = await res.json();
      if (!data.length) {
        setGeoError('Location could not be geocoded. Please try a major city or country.');
        setGeocoding(false);
        return;
      }
      const newPin = {
        id: `user-${Date.now()}`,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        country: placeInput,
        note: memoryText,
        emoji: formEmoji,
        mood: formMood,
        author: userPrefs?.name || authUser?.name || 'You',
        date: new Date().toISOString().split('T')[0],
        isPublic: true,
      };
      const saveRes = await fetch('/api/user/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPin),
      });
      const saveData = await saveRes.json();
      const nextPins = saveData.pins ?? [newPin, ...userPins];
      setUserPins(nextPins);
      localStorage.setItem('atlasaura-user-pins', JSON.stringify(nextPins));
      setMemorySuccess(true);
      setTimeout(() => {
        setMemorySuccess(false);
        setShowMemoryModal(false);
        setMemoryText('');
        setPlaceInput('');
        setFormEmoji('📍');
        setFormMood('adventure');
      }, 1200);
    } catch {
      setGeoError('Network error. Please check your connection.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const stats = [
    { icon: Globe, label: 'Countries Explored', value: currentUser.countriesExplored, trend: '+2 this year' },
    { icon: MapPin, label: 'Memories Pinned', value: userPins.length, trend: '+5 stories' },
    { icon: Trophy, label: 'Traveler Score', value: `${currentUser.contributionScore} pts`, trend: 'Top 5%' },
    { icon: MessageCircle, label: 'Community Answers', value: currentUser.questionsAnswered, trend: '+3 helpful' },
  ];

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      {/* ── Ambient Background Glows ───────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="aurora-wash absolute inset-0 opacity-30" />
        <div className="graticule absolute inset-0 opacity-15" />
      </div>

      {/* ── Top Navigation Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/80 glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg viewBox="0 0 32 32" className="h-7 w-7 text-aurora" aria-hidden="true">
                <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
                <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
              </svg>
              <span className="font-sans font-bold text-lg text-foreground tracking-tight">
                Atlas<span className="text-aurora">Aura</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-aurora/15 text-aurora border border-aurora/30">
                Dashboard
              </Link>
              <Link href="/trip-planner" className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                Trip Planner
              </Link>
              <Link href="/destinations" className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                Explore Destinations
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMemoryModal(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold rounded-full border-aurora/40 text-aurora hover:bg-aurora/10"
            >
              <Plus className="w-3.5 h-3.5" />
              Pin Memory
            </Button>
            <button
              onClick={openSettings}
              className="p-2 rounded-full border border-border bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full border border-border bg-card/60 hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Container ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Hero Passport Banner ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative rounded-3xl p-6 sm:p-8 glass border border-border shadow-cast overflow-hidden"
        >
          <BorderBeam
            size={180}
            duration={12}
            colorFrom="hsl(var(--aurora))"
            colorTo="hsl(var(--violet))"
            borderWidth={1.5}
          />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
            {/* Avatar with Progress Ring */}
            <div className="relative group cursor-pointer" onClick={openSettings}>
              <CircularProgress value={currentUser.contributionScore} max={2000}>
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-background shadow-cast bg-card flex items-center justify-center">
                  {userPrefs?.avatar ? (
                    <img src={userPrefs.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🌍</span>
                  )}
                </div>
              </CircularProgress>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-aurora text-primary-foreground flex items-center justify-center shadow-md">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
                <span className="t-label text-aurora text-xs">{greeting},</span>
                <span className="text-xs text-muted-foreground font-mono">Passport #AA-2026-904</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground mt-1">
                {userPrefs?.name || authUser?.name || 'Fellow Traveler'}
              </h1>
              {userPrefs?.bio ? (
                <p className="text-sm text-muted-foreground mt-1 max-w-xl italic">
                  &ldquo;{userPrefs.bio}&rdquo;
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  Explorer of hidden trails, quiet coasts, and local street stories.
                </p>
              )}

              {/* Badges & Tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-aurora/15 border border-aurora/30 text-aurora">
                  <Zap className="w-3.5 h-3.5" />
                  Level 5 Wanderer
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-violet" />
                  {currentUser.badges.length} Badges Earned
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-muted-foreground font-mono">
                  <Target className="w-3.5 h-3.5 text-rose" />
                  Rank #142 (Top 5%)
                </span>
              </div>

              {/* User Selected Styles */}
              {userPrefs?.travelStyle && userPrefs.travelStyle.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-3">
                  {userPrefs.travelStyle.map((style) => (
                    <span key={style} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {style}
                    </span>
                  ))}
                  {userPrefs.dreamDestinations && (
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      🎯 {userPrefs.dreamDestinations}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
              <Button
                onClick={() => setShowMemoryModal(true)}
                className="h-10 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs px-5 flex items-center justify-center gap-2"
              >
                <PenLine className="w-3.5 h-3.5" />
                Pin New Memory
              </Button>
              <Link href="/trip-planner" className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-full border-border text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Luggage className="w-3.5 h-3.5 text-aurora" />
                  Trip Planner (₹)
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Key Metrics Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                className="lift rounded-2xl p-5 glass border border-border shadow-cast flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-aurora/15 border border-aurora/30 text-aurora flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-aurora bg-aurora/10 px-2 py-0.5 rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Interactive Multi-Tab Section ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'memories', label: 'My Pinned Memories', count: userPins.length, icon: MapPin },
                { id: 'trips', label: 'Itineraries & Budgets', count: tripPlans.length, icon: Luggage },
                { id: 'badges', label: 'Badges & Milestones', count: allBadges.length, icon: Award },
                { id: 'saved', label: 'Saved Destinations', count: 4, icon: Star },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-aurora/15 text-aurora border border-aurora/30 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-aurora/20 text-aurora' : 'bg-muted text-muted-foreground'}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'memories' && (
              <Button
                size="sm"
                onClick={() => setShowMemoryModal(true)}
                className="hidden sm:flex items-center gap-1 text-xs rounded-full bg-primary hover:bg-primary-hover text-primary-foreground px-4 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pin
              </Button>
            )}
          </div>

          {/* ── Tab 1: Pinned Memories ─────────────────────────────────────── */}
          {activeTab === 'memories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userPins.map((pin, i) => (
                <motion.div
                  key={pin.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="lift rounded-2xl p-5 glass border border-border shadow-cast flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pin.emoji || '📍'}</span>
                        <div>
                          <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-aurora" />
                            {pin.country}
                          </h2>
                          <span className="text-[11px] font-mono text-muted-foreground">{pin.date}</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {pin.mood || 'travel'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic line-clamp-3">
                      &ldquo;{pin.note}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono text-[11px]">
                      {pin.lat ? `${pin.lat.toFixed(2)}°, ${pin.lng.toFixed(2)}°` : 'Coordinates logged'}
                    </span>
                    <span className="text-aurora font-medium">Public Memory</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Tab 2: Trip Plans & Itineraries ─────────────────────────────── */}
          {activeTab === 'trips' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-aurora/10 border border-aurora/20">
                <div className="flex items-center gap-3">
                  <Luggage className="w-5 h-5 text-aurora" />
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Plan Your Next Adventure in Indian Rupees (₹)</h2>
                    <p className="text-xs text-muted-foreground">Build day-by-day itineraries, track expenses, and checklist packing essentials.</p>
                  </div>
                </div>
                <Link href="/trip-planner">
                  <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full text-xs">
                    Open Trip Planner →
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tripPlans.length > 0 ? (
                  tripPlans.map((trip) => (
                    <div key={trip.id || trip._id} className="lift rounded-2xl p-6 glass border border-border shadow-cast space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="t-label text-aurora text-[11px]">{trip.destination}</span>
                          <h3 className="font-serif text-xl font-normal text-foreground mt-0.5">{trip.title}</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-foreground bg-card border border-border px-2.5 py-1 rounded-full">
                          ₹{Number(trip.budgetINR || trip.budgetUSD * 83 || 50000).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-aurora" />
                          {trip.startDate || 'Upcoming'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-violet" />
                          {trip.days?.length || 3} Days
                        </span>
                      </div>

                      <Link href="/trip-planner">
                        <Button variant="outline" size="sm" className="w-full text-xs rounded-full border-border">
                          View Itinerary &amp; Budget
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 border border-dashed border-border rounded-3xl p-8">
                    <Luggage className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-foreground">No active itineraries yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Create your first custom day-by-day trip plan with full budget breakdown in Rupees.
                    </p>
                    <Link href="/trip-planner" className="inline-block mt-4">
                      <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs rounded-full px-6">
                        Create Trip Plan
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab 3: Badges & Milestones ─────────────────────────────────── */}
          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {allBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`lift rounded-2xl p-4 text-center border shadow-cast ${
                    badge.earned
                      ? 'glass border-border'
                      : 'border-border/40 bg-card/40 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="text-xs font-semibold text-foreground">{badge.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">{badge.description}</p>
                  {badge.earned && (
                    <span className="inline-block font-mono text-[10px] text-aurora mt-2 bg-aurora/10 px-2 py-0.5 rounded-full">
                      Earned {badge.earnedDate || '2026'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Tab 4: Saved Destinations ──────────────────────────────────── */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-medium text-foreground">Saved World Expeditions</h3>
                  <p className="text-xs text-muted-foreground">Your bookmarked hidden sanctuaries and destinations</p>
                </div>
                <Link href="/destinations">
                  <Button variant="outline" size="sm" className="rounded-full text-xs border-border hover:border-aurora">
                    Explore All 12+ Destinations →
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {favoriteDestinations.map((dest) => (
                  <div key={dest.id} className="lift rounded-3xl overflow-hidden bg-card border border-border/80 shadow-cast group flex flex-col justify-between">
                    <div className="relative h-44 overflow-hidden bg-black">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-md">
                        <Star className="w-3 h-3 text-aurora fill-aurora" />
                        {dest.rating}
                      </div>
                      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/90">
                        📍 {dest.country}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="t-label text-aurora text-[10px] uppercase font-mono">{dest.region}</span>
                        <h4 className="font-serif text-lg font-normal text-foreground mt-0.5">{dest.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{dest.description}</p>
                      </div>

                      {/* Quick triggers */}
                      <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-1.5 text-[11px]">
                        <Link href={`/globe?destination=${dest.id}`} className="block">
                          <button
                            type="button"
                            className="w-full py-1.5 px-2 rounded-xl border border-aurora/40 bg-aurora/10 hover:bg-aurora hover:text-ink-void text-aurora font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <Globe className="w-3 h-3" />
                            <span>3D Earth</span>
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setBudgetDestination(dest)}
                          className="py-1.5 px-2 rounded-xl border border-border bg-card/60 hover:bg-card text-foreground font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Calculator className="w-3 h-3 text-orchid" />
                          <span>AI Budget</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Pin Memory Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showMemoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowMemoryModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl glass border border-border p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-aurora/15 text-aurora flex items-center justify-center">
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-normal text-foreground">Pin a World Memory</h2>
                    <p className="text-xs text-muted-foreground">Share your travel reflection with the community</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMemoryModal(false)}
                  className="p-1.5 rounded-full hover:bg-card text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Place / Landmark
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Oia, Santorini or Kyoto, Japan"
                      value={placeInput}
                      onChange={(e) => {
                        setPlaceInput(e.target.value);
                        setGeoError('');
                      }}
                      className="pl-10 h-11 bg-card/60 border-border text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Your Memory Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the aroma, the twilight breeze, the laughter in that quiet café..."
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-card/60 border border-border text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-aurora"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Pin Emoji
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['📍', '🌸', '🏔️', '🌊', '🍵', '✨', '🙏', '💍', '🚗', '🎒', '🏛️', '🌅'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                          formEmoji === emoji
                            ? 'bg-aurora text-primary-foreground scale-110 shadow-sm'
                            : 'bg-card border border-border hover:border-aurora/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Travel Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormMood(m.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                          formMood === m.id
                            ? 'bg-aurora/20 text-aurora border border-aurora'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {geoError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    {geoError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowMemoryModal(false)}
                    className="w-1/3 h-11 rounded-full border-border text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMemory}
                    disabled={geocoding || memorySuccess}
                    className="w-2/3 h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs"
                  >
                    {memorySuccess ? '✓ Memory Pinned!' : geocoding ? 'Geolocating...' : 'Pin Memory to Map'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Settings Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl glass border border-border p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-serif text-xl text-foreground">Edit Traveler Profile</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 rounded-full hover:bg-card text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Avatar upload */}
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-aurora cursor-pointer flex items-center justify-center bg-card group"
                  >
                    {editAvatar ? (
                      <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <div>
                    <span className="text-xs font-semibold text-foreground">Avatar Photo</span>
                    <p className="text-[11px] text-muted-foreground">Click to upload a custom picture</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Display Name
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-10 bg-card/60 border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Travel Bio / Motto
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-card/60 border border-border text-foreground outline-none resize-none focus:border-aurora"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Travel Styles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleStyle(s.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                          editTravelStyle.includes(s.id)
                            ? 'bg-aurora/20 text-aurora border border-aurora'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {editTravelStyle.includes(s.id) && <Check className="w-3 h-3" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Dream Destinations
                  </label>
                  <Input
                    value={editDestinations}
                    onChange={(e) => setEditDestinations(e.target.value)}
                    placeholder="Japan, Iceland, Patagonia..."
                    className="h-10 bg-card/60 border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    📍 Default Departure City (For AI Location Budgeting)
                  </label>
                  <Input
                    value={editHomeLocation}
                    onChange={(e) => setEditHomeLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India or London, UK"
                    className="h-10 bg-card/60 border-border text-foreground"
                  />
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={saving || saveSuccess}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs mt-2"
                >
                  {saveSuccess ? '✓ Profile Updated!' : saving ? 'Saving changes...' : 'Save Profile Changes'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3D Earth Globe Modal ───────────────────────────────────────────── */}
      {globeDestination && (
        <DestinationGlobeModal
          destination={globeDestination}
          userLocationName={editHomeLocation}
          onClose={() => setGlobeDestination(null)}
        />
      )}

      {/* ── AI Budget Estimator Modal ─────────────────────────────────────── */}
      {budgetDestination && (
        <AIBudgetEstimatorModal
          destination={budgetDestination}
          initialOrigin={editHomeLocation}
          onClose={() => setBudgetDestination(null)}
          onSaveOrigin={(newOrigin) => setEditHomeLocation(newOrigin)}
        />
      )}
    </div>
  );
}
