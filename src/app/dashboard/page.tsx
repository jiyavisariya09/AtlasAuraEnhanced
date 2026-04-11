'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Globe, MapPin, MessageCircle, Trophy, Award, Star, 
  Zap, Settings, LogOut, Plus, Heart, Compass,
  Map, ChevronRight, Bell, Search, Filter, Plane,
  Target, Sparkles, TrendingUp, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, badges, memoryPins, countries } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth';

function AnimatedBackground({ isDark }: { isDark: boolean }) {
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
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/30' : 'bg-amber-500/40'}`}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
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
  const isDark = theme === 'dark';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const user = getCurrentUser();
    if (!user) { router.push('/signin'); return; }
    setAuthUser(user);
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
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
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>{authUser?.name || currentUser.name}</h1>
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
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className={isDark ? 'border-white/20' : 'border-slate-200'}>
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
        {/* Tabs content continues... */}
      </div>
    </div>
  );
}
