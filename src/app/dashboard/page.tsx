'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Globe, MapPin, MessageCircle, Trophy, Award, Star, 
  Zap, Settings, LogOut, Plus, Heart, Compass,
  Map, ChevronRight, Bell, Search, Filter, Plane,
  Target, Sparkles, TrendingUp, Clock, PenLine, X, Camera, Check, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, badges, memoryPins, countries } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth';

function AnimatedBackground({ isDark }: { isDark: boolean }) {
  const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number }[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? 'bg-amber-500/10' : 'bg-amber-400/20'}`}
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/15'}`}
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] ${isDark ? 'bg-purple-500/5' : 'bg-purple-400/10'}`}
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/30' : 'bg-amber-500/40'}`}
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
      <div
        className={`absolute inset-0 opacity-[0.02] ${isDark ? 'text-white' : 'text-slate-900'}`}
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

function CircularProgress({ value, max, size = 80, strokeWidth = 8, children }: { 
  value: number; max: number; size?: number; strokeWidth?: number; children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-slate-700/30" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke="url(#gradient)" strokeWidth={strokeWidth} fill="none"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function StatCard({ stat, index, isDark }: { stat: any; index: number; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-6 rounded-2xl overflow-hidden group cursor-pointer ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
        >
          {stat.value}
        </motion.p>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="text-xs text-emerald-500">{stat.trend}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [greeting, setGreeting] = useState('');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userPrefs, setUserPrefs] = useState<{ name: string; travelStyle: string[]; dreamDestinations: string; bio?: string; avatar?: string } | null>(null);
  const [userPins, setUserPins] = useState<any[]>([]);
  // Settings modal
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editTravelStyle, setEditTravelStyle] = useState<string[]>([]);
  const [editDestinations, setEditDestinations] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // Add memory form
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [memoryText, setMemoryText] = useState('');
  const [placeInput, setPlaceInput] = useState('');
  const [formMood, setFormMood] = useState('adventure');
  const [formEmoji, setFormEmoji] = useState('📍');
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [memorySuccess, setMemorySuccess] = useState(false);
  const isDark = theme === 'dark';

  const TRAVEL_STYLES = [
    { id: 'solo', label: 'Solo Explorer' },
    { id: 'couple', label: 'Romantic' },
    { id: 'adventure', label: 'Adventurer' },
    { id: 'culture', label: 'Culture Seeker' },
    { id: 'photography', label: 'Photographer' },
    { id: 'relaxed', label: 'Easy Going' },
  ];

  const openSettings = () => {
    setEditName(authUser?.name || '');
    setEditBio(userPrefs?.bio || '');
    setEditAvatar(userPrefs?.avatar || '');
    setEditTravelStyle(userPrefs?.travelStyle || []);
    setEditDestinations(userPrefs?.dreamDestinations || '');
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
    setEditTravelStyle(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const updated = {
      avatar: editAvatar,
      bio: editBio,
      travelStyle: editTravelStyle,
      dreamDestinations: editDestinations,
    };
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
    setUserPrefs(prev => ({ ...prev!, name: editName, ...updated }));
    localStorage.setItem('atlasaura-preferences', JSON.stringify({ name: editName, ...updated }));
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setShowSettings(false); }, 1200);
  };

  const MOODS = [
    { id: 'solo', label: 'Solo', emoji: '🎒' },
    { id: 'honeymoon', label: 'Romance', emoji: '💕' },
    { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
    { id: 'culture', label: 'Culture', emoji: '🏛️' },
    { id: 'calm', label: 'Peace', emoji: '🧘' },
  ];

  const handleAddMemory = async () => {
    if (!memoryText.trim() || !placeInput.trim()) { setGeoError('Please fill in both fields.'); return; }
    setGeocoding(true); setGeoError('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeInput)}&format=json&limit=1`);
      const data = await res.json();
      if (!data.length) { setGeoError('Place not found. Try a more specific name.'); setGeocoding(false); return; }
      const newPin = {
        id: `user-${Date.now()}`,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        country: placeInput,
        note: memoryText,
        emoji: formEmoji,
        mood: formMood,
        author: authUser?.name || 'You',
        date: new Date().toISOString().split('T')[0],
        isPublic: true,
      };
      // Save to MongoDB
      const saveRes = await fetch('/api/user/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPin),
      });
      const saveData = await saveRes.json();
      setUserPins(saveData.pins ?? [...userPins, newPin]);
      // Also keep localStorage in sync for WorldMap
      localStorage.setItem('atlasaura-user-pins', JSON.stringify(saveData.pins ?? [...userPins, newPin]));
      setMemorySuccess(true);
      setTimeout(() => {
        setMemorySuccess(false); setShowMemoryForm(false);
        setMemoryText(''); setPlaceInput(''); setFormEmoji('📍'); setFormMood('adventure');
      }, 1500);
    } catch { setGeoError('Network error. Please try again.'); }
    setGeocoding(false);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const user = getCurrentUser();
    if (!user) { router.push('/signin'); return; }
    setAuthUser(user);

    // Load profile + pins from MongoDB
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        if (data.name) {
          setUserPrefs({
            name: data.name,
            bio: data.bio ?? '',
            avatar: data.avatar ?? '',
            travelStyle: data.travelStyle ?? [],
            dreamDestinations: data.dreamDestinations ?? '',
          });
        }
      }).catch(() => {
        // fallback to localStorage
        const raw = localStorage.getItem('atlasaura-preferences');
        if (raw) setUserPrefs(JSON.parse(raw));
      });

    fetch('/api/user/pins')
      .then(r => r.json())
      .then(data => { if (data.pins) setUserPins(data.pins); })
      .catch(() => {
        const pins = localStorage.getItem('atlasaura-user-pins');
        if (pins) setUserPins(JSON.parse(pins));
      });
  }, [router]);

  const stats = [
    { icon: Globe, label: 'Countries', value: currentUser.countriesExplored, color: 'from-amber-500 to-orange-500', trend: '+2 this month' },
    { icon: MapPin, label: 'Memories', value: currentUser.memoryPins, color: 'from-cyan-500 to-blue-500', trend: '+5 this week' },
    { icon: MessageCircle, label: 'Answers', value: currentUser.questionsAnswered, color: 'from-emerald-500 to-teal-500', trend: '+3 today' },
    { icon: Trophy, label: 'Score', value: currentUser.contributionScore, color: 'from-purple-500 to-indigo-500', trend: 'Top 5%' },
  ];

  const nextMilestones = [
    { label: 'Hidden Gem Hunter', current: 1, target: 3, icon: Star, reward: 'Unlock secret locations', color: 'from-pink-500 to-rose-500' },
    { label: 'Community Guide', current: 8, target: 10, icon: MessageCircle, reward: 'Expert badge', color: 'from-cyan-500 to-blue-500' },
    { label: 'World Explorer', current: 12, target: 20, icon: Globe, reward: 'Legendary status', color: 'from-amber-500 to-orange-500' },
  ];

  const recentMemories = memoryPins.slice(0, 4);
  const savedCountries = countries.slice(0, 4);

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-slate-950' : 'bg-slate-50'} overflow-hidden`}>
      <AnimatedBackground isDark={isDark} />
      <header className={`sticky top-0 z-50 ${isDark ? 'glass' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.a href="/" className="flex items-center gap-2" whileHover={{ scale: 1.02 }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Atlas<span className="text-sky-500">Aura</span>
              </span>
            </motion.a>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input placeholder="Search memories, countries, questions..." className={`pl-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className={`relative p-2 rounded-full ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-colors`}>
                <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              </button>
              <motion.div whileHover={{ scale: 1.05 }} className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 cursor-pointer">
                <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <span className="text-sm">👤</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mb-8 p-8 rounded-3xl overflow-hidden relative ${isDark ? 'glass' : 'bg-white shadow-lg'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <CircularProgress value={currentUser.contributionScore} max={2000} size={100} strokeWidth={6}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
                  {userPrefs?.avatar
                    ? <img src={userPrefs.avatar} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-3xl">👤</span>
                  }
                </div>
              </CircularProgress>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-1 -right-1 w-6 h-6">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </motion.div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sky-500 text-sm font-medium mb-1">
                {greeting}, Traveler!
              </motion.p>
              <h1 className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{authUser?.name || currentUser.name}</h1>
              {userPrefs?.bio && (
                <p className={`text-sm mb-2 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{userPrefs.bio}</p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 text-sm font-medium">
                  <Zap className="w-3 h-3 inline mr-1" />Level 5 Wanderer
                </motion.span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'glass text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <Award className="w-3 h-3 inline mr-1" />{currentUser.badges.length} Badges
                </motion.span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'glass text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <Target className="w-3 h-3 inline mr-1" />Top 5%
                </motion.span>
              </div>
              {userPrefs && (
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  {userPrefs.travelStyle.map((style) => (
                    <span key={style} className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 text-xs font-medium capitalize">
                      <Compass className="w-3 h-3 inline mr-1" />{style}
                    </span>
                  ))}
                  {userPrefs.dreamDestinations && (
                    <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'glass text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      <MapPin className="w-3 h-3 inline mr-1" />{userPrefs.dreamDestinations}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={openSettings} className={isDark ? 'border-white/20' : 'border-slate-200'}>
                  <Settings className="w-4 h-4 mr-2" />Settings
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={handleLogout} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  <LogOut className="w-4 h-4 mr-2" />Sign Out
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isDark={isDark} />
          ))}
        </div>

        {/* Add Memory Panel — logged in users only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`mb-8 rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/60 border-white/8' : 'bg-white border-sky-100 shadow-lg'}`}
        >
          <button
            onClick={() => setShowMemoryForm(v => !v)}
            className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-sky-50'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center">
                <PenLine className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>Pin a Memory to the Map</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Share your travel story with the world</p>
              </div>
            </div>
            <motion.div animate={{ rotate: showMemoryForm ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showMemoryForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className={`px-6 pb-6 pt-2 border-t ${isDark ? 'border-white/8' : 'border-sky-100'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:col-span-2">
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Your Memory</label>
                      <textarea
                        value={memoryText} onChange={e => setMemoryText(e.target.value)}
                        placeholder="Describe your travel memory..."
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl text-sm resize-none outline-none border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-sky-500/50'
                            : 'bg-sky-50 border-sky-100 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Place on Map</label>
                      <div className="relative">
                        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          value={placeInput} onChange={e => { setPlaceInput(e.target.value); setGeoError(''); }}
                          placeholder="e.g. Santorini, Greece"
                          className={`w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none border transition-all ${
                            isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-sky-500/50'
                              : 'bg-sky-50 border-sky-100 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Pin Emoji</label>
                      <div className="flex gap-2 flex-wrap">
                        {['📍','🌸','🏔️','🌊','🍵','✨','🙏','💍','🚗','🎒','🏛️','🌅'].map(e => (
                          <button key={e} onClick={() => setFormEmoji(e)}
                            className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                              formEmoji === e ? 'bg-gradient-to-br from-sky-500 to-indigo-500 scale-110 shadow-md'
                                : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-sky-50 hover:bg-sky-100 border border-sky-100'
                            }`}>{e}</button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Travel Mood</label>
                      <div className="flex flex-wrap gap-2">
                        {MOODS.map(m => (
                          <button key={m.id} onClick={() => setFormMood(m.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                              formMood === m.id ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
                                : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-sky-50 text-slate-600 hover:bg-sky-100 border border-sky-100'
                            }`}>
                            <span>{m.emoji}</span>{m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {geoError && <p className="mt-3 text-xs text-rose-500 flex items-center gap-1"><X className="w-3 h-3" />{geoError}</p>}
                  <div className="flex items-center gap-3 mt-5">
                    <Button
                      onClick={handleAddMemory} disabled={geocoding || memorySuccess}
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold px-6"
                    >
                      {memorySuccess ? '✓ Memory Pinned!' : geocoding ? 'Locating...' : <><MapPin className="w-4 h-4 mr-2" />Pin to Map</>}
                    </Button>
                    <button onClick={() => { setShowMemoryForm(false); setGeoError(''); }} className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* My Pinned Memories */}
        {userPins.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              My Pinned Memories
              <span className={`ml-2 text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({userPins.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPins.map((pin, i) => (
                <motion.div
                  key={pin.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border ${isDark ? 'glass border-white/8' : 'bg-white border-sky-100 shadow-sm'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-lg flex-shrink-0">
                      {pin.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-sky-500" />
                        <span className="text-sm text-sky-500 truncate">{pin.country}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>You</span>
                      </div>
                      <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{pin.note}"</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{pin.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        {/* Tabs content continues... */}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Edit Profile</h2>
                <button onClick={() => setShowSettings(false)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      onClick={() => avatarInputRef.current?.click()}
                      className="w-20 h-20 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-amber-500/50 hover:border-amber-400 transition-colors flex items-center justify-center bg-gradient-to-br from-amber-400/20 to-orange-400/20"
                    >
                      {editAvatar
                        ? <img src={editAvatar} alt="avatar" className="w-full h-full object-cover" />
                        : <span className="text-3xl">👤</span>
                      }
                    </div>
                    <div onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center cursor-pointer shadow-lg">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </div>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Profile Photo</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to upload a new photo</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Display Name</label>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Your name"
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Bio</label>
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Tell the world about yourself..."
                    rows={3}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border resize-none transition-colors ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Travel Style */}
                <div>
                  <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Travel Style</label>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleStyle(s.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          editTravelStyle.includes(s.id)
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : isDark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500/50' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {editTravelStyle.includes(s.id) && <Check className="w-3 h-3" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dream Destinations */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Dream Destinations</label>
                  <input
                    value={editDestinations}
                    onChange={e => setEditDestinations(e.target.value)}
                    placeholder="Japan, Iceland, Morocco..."
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                    }`}
                  />
                </div>

                {/* Save */}
                <button
                  onClick={handleSaveSettings}
                  disabled={saving || saveSuccess}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    saveSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg disabled:opacity-70'
                  }`}
                >
                  {saveSuccess ? <><Check className="w-4 h-4" />Saved!</> : saving ? 'Saving...' : <><Save className="w-4 h-4" />Save Changes</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
