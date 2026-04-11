import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

// Animated background particles
function AnimatedBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-400/20'
        }`}
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] ${
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/15'
        }`}
      />
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] ${
          isDark ? 'bg-purple-500/5' : 'bg-purple-400/10'
        }`}
      />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-amber-400/30' : 'bg-amber-500/40'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Grid pattern */}
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

// Circular progress component
function CircularProgress({ value, max, size = 80, strokeWidth = 8, children }: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
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
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// Stat card with animation
function StatCard({ stat, index, isDark }: { stat: any; index: number; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-6 rounded-2xl overflow-hidden group cursor-pointer ${
        isDark ? 'glass' : 'bg-white shadow-lg'
      }`}
    >
      {/* Glow effect */}
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
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [greeting, setGreeting] = useState('');
  const isDark = theme === 'dark';

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

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
    localStorage.removeItem('atlasaura-user');
    navigate('/');
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-slate-950' : 'bg-slate-50'} overflow-hidden`}>
      {/* Animated Background */}
      <AnimatedBackground isDark={isDark} />

      {/* Top Navigation */}
      <header className={`sticky top-0 z-50 ${isDark ? 'glass' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Atlas<span className="text-amber-500">Aura</span>
              </span>
            </motion.a>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input
                  placeholder="Search memories, countries, questions..."
                  className={`pl-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className={`relative p-2 rounded-full ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'} transition-colors`}>
                <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              </button>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 cursor-pointer"
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                  <span className="text-sm">👤</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-8 rounded-3xl overflow-hidden relative ${
            isDark ? 'glass' : 'bg-white shadow-lg'
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with progress ring */}
            <div className="relative">
              <CircularProgress value={currentUser.contributionScore} max={2000} size={100} strokeWidth={6}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
              </CircularProgress>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 -right-1 w-6 h-6"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-amber-500 text-sm font-medium mb-1"
              >
                {greeting}, Traveler!
              </motion.p>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {currentUser.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 text-sm font-medium"
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  Level 5 Wanderer
                </motion.span>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className={`px-3 py-1 rounded-full text-sm ${isDark ? 'glass text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Award className="w-3 h-3 inline mr-1" />
                  {currentUser.badges.length} Badges
                </motion.span>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className={`px-3 py-1 rounded-full text-sm ${isDark ? 'glass text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                >
                  <Target className="w-3 h-3 inline mr-1" />
                  Top 5%
                </motion.span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className={isDark ? 'border-white/20' : 'border-slate-200'}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" onClick={handleLogout} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isDark={isDark} />
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`${isDark ? 'glass' : 'bg-white shadow-sm'} p-1`}>
            {[
              { id: 'overview', label: 'Overview', icon: Compass },
              { id: 'memories', label: 'Memories', icon: MapPin },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'saved', label: 'Saved', icon: Heart },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Journey Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`lg:col-span-2 p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-amber-500" />
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Your Journey
                    </h3>
                  </div>
                  <span className="text-sm text-amber-500">{currentUser.countriesExplored}/195 countries</span>
                </div>
                
                {/* World map visualization */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <div className={`absolute inset-0 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {/* Simplified world dots */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-12 gap-1">
                        {[...Array(48)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={`w-2 h-2 rounded-full ${
                              i < currentUser.countriesExplored 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                : isDark ? 'bg-slate-700' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  {nextMilestones.map((milestone, index) => {
                    const Icon = milestone.icon;
                    const progress = (milestone.current / milestone.target) * 100;
                    return (
                      <motion.div
                        key={milestone.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${milestone.color} flex items-center justify-center`}>
                              <Icon className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {milestone.label}
                            </span>
                          </div>
                          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {milestone.current} / {milestone.target}
                          </span>
                        </div>
                        <div className="relative h-2 bg-slate-700/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${milestone.color}`}
                          />
                        </div>
                        <p className="text-xs text-amber-500 mt-1">{milestone.reward}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Recent Activity
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentMemories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} hover:bg-amber-500/10 transition-colors cursor-pointer group`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-lg">
                        {memory.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {memory.country}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{memory.note}</p>
                      </div>
                      <span className="text-xs text-slate-500">{memory.date}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Memory
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Saved Destinations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-amber-500" />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Saved Destinations
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="text-amber-500">
                  Explore More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedCountries.map((country, index) => (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                  >
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-amber-400 text-xs uppercase tracking-wider">{country.region}</p>
                      <p className="text-white font-semibold">{country.name}</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  All Memories
                </h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className={isDark ? 'border-white/20' : 'border-slate-200'}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Memory
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memoryPins.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                    className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} hover:shadow-lg transition-all cursor-pointer group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                        {memory.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span className="text-sm text-amber-500">{memory.country}</span>
                        </div>
                        <p className={`text-sm mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          "{memory.note}"
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>{memory.date}</span>
                          <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'} capitalize`}>
                            {memory.mood}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Your Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className={`p-4 rounded-xl text-center transition-all ${
                      badge.earned
                        ? isDark ? 'glass hover:border-amber-500/30' : 'bg-amber-50 border border-amber-200 hover:shadow-lg'
                        : isDark ? 'bg-white/5 opacity-50' : 'bg-slate-100 opacity-50'
                    }`}
                  >
                    <motion.div 
                      className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}
                      whileHover={badge.earned ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {badge.icon}
                    </motion.div>
                    <p className={`text-sm font-medium ${badge.earned ? (isDark ? 'text-white' : 'text-slate-800') : 'text-slate-500'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-amber-500 mt-2">
                        ✓ {badge.earnedDate}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Saved for Later
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country, index) => (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                  >
                    <img
                      src={country.image}
                      alt={country.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-amber-400 text-xs uppercase tracking-wider">{country.region}</p>
                      <p className="text-white text-xl font-bold">{country.name}</p>
                      <p className="text-slate-300 text-sm mt-1 line-clamp-2">{country.description}</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <Heart className="w-5 h-5 text-white fill-white" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
