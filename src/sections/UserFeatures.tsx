'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Globe, Compass, Shield, Clock, MapPin, Sparkles, 
  ArrowRight, Radio, Bell, TrendingUp, Wallet, CheckCircle2,
  Navigation, ChevronLeft, ChevronRight, Pause, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/ui/border-beam';

const EASE = [0.22, 1, 0.36, 1] as const;

interface UserFeaturesProps {
  isLoggedIn: boolean;
}

interface JourneyRoute {
  id: string;
  title: string;
  backdropImage: string;
  origin: { name: string; country: string; coords: string; flag: string };
  destination: { name: string; country: string; coords: string; flag: string };
  explorer: { name: string; role: string; avatar: string; location: string };
  quote: string;
  status: string;
  dayCount: string;
  distanceKm: string;
  distanceTrend: string;
  spentRupees: string;
  totalBudgetRupees: string;
  budgetPercentage: number;
  dailyAvgRupees: string;
  latestMemory: {
    title: string;
    location: string;
    timeAgo: string;
    image: string;
    mood: string;
  };
  waypoints: string[];
}

const ACTIVE_JOURNEYS: JourneyRoute[] = [
  {
    id: 'rohan-meera-iceland',
    title: 'Vatnajökull Glacier to Arctic Aurora',
    backdropImage: '/images/expeditions/expedition_iceland_aurora_1788184898699.jpg',
    origin: { name: 'Reykjavik', country: 'IS', coords: '64.1466° N, 21.9426° W', flag: '🇮🇸' },
    destination: { name: 'Akureyri', country: 'IS', coords: '65.6885° N, 18.1262° W', flag: '🇮🇸' },
    explorer: {
      name: 'Rohan & Meera Sharma',
      role: 'Landscape Photographers',
      avatar: '/avatars/avatar-1.jpg',
      location: 'Vatnajökull Ice Cave, Iceland',
    },
    quote: 'Standing beneath the glacial ice cavern with green aurora curtains dancing overhead is an experience that stays with you forever.',
    status: 'AURORA EXPEDITION',
    dayCount: 'DAY 12/21',
    distanceKm: '1,480 km',
    distanceTrend: '+22% THIS TRIP',
    spentRupees: '₹1,24,600',
    totalBudgetRupees: '₹1,90,000',
    budgetPercentage: 65,
    dailyAvgRupees: '₹10,383/day',
    latestMemory: {
      title: 'Glacial ice cave twilight illumination',
      location: 'Vatnajökull National Park',
      timeAgo: '4m ago',
      image: '/images/expeditions/expedition_iceland_aurora_1788184898699.jpg',
      mood: '🌌 Arctic Wonder',
    },
    waypoints: ['Reykjavik', 'Vik', 'Vatnajökull', 'Egilsstaðir', 'Akureyri'],
  },
  {
    id: 'chloe-kyoto',
    title: 'Gion Lantern Walk & Bamboo Sanctuary',
    backdropImage: '/images/expeditions/expedition_kyoto_twilight_1788184945800.jpg',
    origin: { name: 'Kyoto', country: 'JP', coords: '35.0116° N, 135.7681° E', flag: '🇯🇵' },
    destination: { name: 'Mount Koya', country: 'JP', coords: '34.2136° N, 135.5866° E', flag: '🇯🇵' },
    explorer: {
      name: 'Chloe Dubois',
      role: 'Cultural Anthropologist',
      avatar: '/avatars/avatar-2.jpg',
      location: 'Higashiyama District, Kyoto',
    },
    quote: 'Walking down stone temple paths illuminated only by warm paper lanterns and evening blossoms feels like stepping into living history.',
    status: 'PILGRIMAGE TRAIL',
    dayCount: 'DAY 8/18',
    distanceKm: '620 km',
    distanceTrend: '+14% THIS TRIP',
    spentRupees: '₹72,400',
    totalBudgetRupees: '₹1,30,000',
    budgetPercentage: 55,
    dailyAvgRupees: '₹9,050/day',
    latestMemory: {
      title: 'Twilight lantern path in temple courtyard',
      location: 'Arashiyama Bamboo Grove',
      timeAgo: '18m ago',
      image: '/images/expeditions/expedition_kyoto_twilight_1788184945800.jpg',
      mood: '🧘 Serene & Mindful',
    },
    waypoints: ['Kyoto', 'Uji', 'Nara', 'Yoshino', 'Mount Koya'],
  },
  {
    id: 'lucas-hannah-swiss',
    title: 'Bernese Oberland Alpine Traverse',
    backdropImage: '/images/expeditions/expedition_swiss_alps_1788184969837.jpg',
    origin: { name: 'Interlaken', country: 'CH', coords: '46.6863° N, 7.8632° E', flag: '🇨🇭' },
    destination: { name: 'Zermatt', country: 'CH', coords: '45.9763° N, 7.7491° E', flag: '🇨🇭' },
    explorer: {
      name: 'Lucas & Hannah Weber',
      role: 'Alpine Trail Guides',
      avatar: '/avatars/avatar-sarah.jpg',
      location: 'Bachalpsee Lake, Switzerland',
    },
    quote: 'Resting by crystal clear turquoise waters with the majestic snow-capped peaks reflecting in the dusk is pure mountain serenity.',
    status: 'HIGH ALPINE TREK',
    dayCount: 'DAY 6/15',
    distanceKm: '380 km',
    distanceTrend: '+19% THIS TRIP',
    spentRupees: '₹98,200',
    totalBudgetRupees: '₹1,60,000',
    budgetPercentage: 61,
    dailyAvgRupees: '₹16,366/day',
    latestMemory: {
      title: 'Golden hour reflection over alpine lake',
      location: 'Bachalpsee Glacier Basin',
      timeAgo: '9m ago',
      image: '/images/expeditions/expedition_swiss_alps_1788184969837.jpg',
      mood: '⛰️ High Alpine',
    },
    waypoints: ['Interlaken', 'Grindelwald', 'First', 'Mürren', 'Zermatt'],
  },
  {
    id: 'mateo-peru',
    title: 'Inca Sacred Valley to High Andes',
    backdropImage: '/memories/peru.jpg',
    origin: { name: 'Cusco', country: 'PE', coords: '13.5319° S, 71.9675° W', flag: '🇵🇪' },
    destination: { name: 'Machu Picchu', country: 'PE', coords: '13.1631° S, 72.5450° W', flag: '🇵🇪' },
    explorer: {
      name: 'Mateo Alvarez',
      role: 'Heritage Trekker',
      avatar: '/avatars/avatar-3.jpg',
      location: 'Salkantay Pass, Peru',
    },
    quote: 'Crossing ancient cobblestone trails through cloud forests at 4,600 meters elevation connects you deeply to ancestral footsteps.',
    status: 'SACRED TRAIL',
    dayCount: 'DAY 5/10',
    distanceKm: '120 km',
    distanceTrend: '+8% THIS TRIP',
    spentRupees: '₹42,800',
    totalBudgetRupees: '₹75,000',
    budgetPercentage: 57,
    dailyAvgRupees: '₹8,560/day',
    latestMemory: {
      title: 'Morning cloud forest ascent through Salkantay',
      location: 'Sacred Valley Ridge',
      timeAgo: '31m ago',
      image: '/memories/peru.jpg',
      mood: '🏛️ Sacred History',
    },
    waypoints: ['Cusco', 'Mollepata', 'Soraypampa', 'Aguas Calientes', 'Machu Picchu'],
  },
];

const AUTO_CYCLE_MS = 5500;

export default function UserFeatures({ isLoggedIn }: UserFeaturesProps) {
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMemoryExpanded, setIsMemoryExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeJourney = ACTIVE_JOURNEYS[activeJourneyIndex];

  // Auto-cycle timer with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const step = (interval / AUTO_CYCLE_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveJourneyIndex((curr) => (curr + 1) % ACTIVE_JOURNEYS.length);
          setIsMemoryExpanded(false);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, activeJourneyIndex]);

  const handlePrev = () => {
    setActiveJourneyIndex((curr) => (curr - 1 + ACTIVE_JOURNEYS.length) % ACTIVE_JOURNEYS.length);
    setProgress(0);
    setIsMemoryExpanded(false);
  };

  const handleNext = () => {
    setActiveJourneyIndex((curr) => (curr + 1) % ACTIVE_JOURNEYS.length);
    setProgress(0);
    setIsMemoryExpanded(false);
  };

  return (
    <section 
      id="journey-feed" 
      className="hairline-t section-y relative isolate overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      {/* Decorative Aurora Glow Blooms */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-aurora-drift absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-aurora/10 blur-[120px]" />
        <div 
          className="animate-aurora-drift absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-orchid/10 blur-[140px]" 
          style={{ animationDelay: '5s' }}
        />
        {/* Coordinate Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="shell relative">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          {/* Live Journey Badge + Hover-Pause Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-2 mb-4"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-aurora/30 bg-aurora/10 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora" />
              </span>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-aurora">
                LIVE JOURNEY FEED
              </span>
            </div>

            {/* Hover to pause status pill */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono transition-all duration-300 border ${
              isPaused 
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                : 'bg-muted/60 border-border text-muted-foreground'
            }`}>
              {isPaused ? <Pause className="w-3 h-3 animate-pulse" /> : <Play className="w-3 h-3" />}
              <span>{isPaused ? 'Paused for reading' : 'Hover anywhere to pause'}</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="t-title max-w-3xl text-foreground font-serif tracking-tight text-3xl sm:text-4xl lg:text-5xl"
          >
            Track your adventure,{' '}
            <span className="italic text-aurora font-normal">as it unfolds.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="t-lead mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            Real-time journeys charted across the globe — mood, live telemetry, 
            and authentic stories woven together as one living atlas.
          </motion.p>
        </div>

        {/* Main Cinematic Grid Showcase (PAUSES ON HOVER) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: Cinematic Photo Backdrop & Clean Flight HUD (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-7 flex flex-col min-h-[480px] sm:min-h-[520px]"
          >
            <div className="relative flex-1 rounded-3xl overflow-hidden border border-border shadow-cast flex flex-col justify-between p-6 sm:p-8 group isolate">
              <BorderBeam size={90} duration={8} colorFrom="hsl(var(--aurora))" colorTo="hsl(var(--orchid))" />

              {/* Stacked Direct Crossfade Background (Zero black/white flash) */}
              <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
                {ACTIVE_JOURNEYS.map((journey, idx) => {
                  const isActive = idx === activeJourneyIndex;
                  return (
                    <div
                      key={journey.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out [transform:translateZ(0)] ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={journey.backdropImage}
                        alt={journey.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      {/* Crisp lightweight scrim: bright image while maintaining 100% HUD readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />
                    </div>
                  );
                })}
              </div>

              {/* Top HUD: Origin & Destination Coordinate Badges + Nav Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <motion.div 
                    key={`origin-${activeJourney.id}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 backdrop-blur-md shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-aurora" />
                    <span className="text-xs font-semibold text-white">
                      {activeJourney.origin.name}, {activeJourney.origin.country}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono text-white/70 border-l border-white/20 pl-2">
                      {activeJourney.origin.coords}
                    </span>
                  </motion.div>

                  <motion.div 
                    key={`dest-${activeJourney.id}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 backdrop-blur-md shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-orchid" />
                    <span className="text-xs font-semibold text-white">
                      {activeJourney.destination.name}, {activeJourney.destination.country}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono text-white/70 border-l border-white/20 pl-2">
                      {activeJourney.destination.coords}
                    </span>
                  </motion.div>
                </div>

                {/* Prev / Next Controls with Sleek Dot Indicators */}
                <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-full px-2.5 py-1.5 backdrop-blur-md shadow-sm">
                  <button 
                    onClick={handlePrev}
                    aria-label="Previous Journey"
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="flex items-center gap-1.5 px-1">
                    {ACTIVE_JOURNEYS.map((_, i) => {
                      const isActive = i === activeJourneyIndex;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveJourneyIndex(i)}
                          aria-label={`Go to journey ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? 'w-5 bg-aurora shadow-sm'
                              : 'w-1.5 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleNext}
                    aria-label="Next Journey"
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Clean unobstructed photography space */}
              <div className="my-auto py-16" />

              {/* Bottom Explorer Telemetry Strip */}
              <div className="relative z-10 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full border-2 border-emerald-400 p-0.5 shadow-md overflow-hidden bg-black/60">
                      <img 
                        src={activeJourney.explorer.avatar} 
                        alt={activeJourney.explorer.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {activeJourney.explorer.name}
                      <span className="text-xs font-normal text-white/85 font-mono">({activeJourney.explorer.role})</span>
                    </p>
                    <p className="text-xs font-mono text-emerald-300 font-medium">
                      {activeJourney.status} · {activeJourney.dayCount} · {activeJourney.explorer.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link href="/trip-planner">
                    <Button size="sm" className="h-8 rounded-full text-xs font-semibold gap-1 bg-white/20 hover:bg-white text-white hover:text-black border border-white/30 backdrop-blur-md transition-all">
                      View Itinerary
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Subtle Auto-cycle timer progress line */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                <motion.div 
                  className="h-full bg-aurora"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT: 3 Modern Glass Telemetry Cards (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {/* CARD 1: Expedition Route, Waypoints & Explorer Story (Image 2 Content) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="lift relative rounded-3xl p-6 border border-border bg-card/85 shadow-cast backdrop-blur-xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-aurora/15 border border-aurora/30 text-aurora text-xs font-mono">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{activeJourney.title}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {activeJourney.distanceTrend}
                  </span>
                </div>

                {/* Route Headline */}
                <motion.h3 
                  key={`route-${activeJourney.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-2xl sm:text-3xl font-medium text-foreground flex items-center justify-between flex-wrap gap-2 mt-1"
                >
                  <span className="flex items-center gap-2">
                    <span>{activeJourney.origin.name}</span>
                    <span className="text-aurora font-sans font-light">➔</span>
                    <span>{activeJourney.destination.name}</span>
                  </span>
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                    {activeJourney.distanceKm}
                  </span>
                </motion.h3>

                {/* Waypoints line */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-muted-foreground mt-2">
                  {activeJourney.waypoints.map((wp, i) => (
                    <span key={wp} className="flex items-center gap-1.5">
                      <span className={i === 0 ? 'text-aurora font-semibold' : i === activeJourney.waypoints.length - 1 ? 'text-orchid font-semibold' : 'text-foreground/80'}>
                        {wp}
                      </span>
                      {i < activeJourney.waypoints.length - 1 && <span className="opacity-40">·</span>}
                    </span>
                  ))}
                </div>

                {/* Explorer Quote */}
                <motion.p 
                  key={`quote-${activeJourney.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="italic text-xs sm:text-sm text-foreground/90 leading-relaxed mt-3 pt-3 border-t border-border/60"
                >
                  &ldquo;{activeJourney.quote}&rdquo;
                </motion.p>
              </div>

              {/* Mini visual indicator */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5 text-aurora">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  GPS High Precision
                </span>
                <span>Active: {activeJourney.explorer.name.split(' ')[0]}</span>
              </div>
            </motion.div>

            {/* CARD 2: Rupee Smart Budget & Daily Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="lift relative rounded-3xl p-6 border border-border bg-card/85 shadow-cast backdrop-blur-xl group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orchid/15 text-orchid flex items-center justify-center border border-orchid/20 shadow-sm">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    EXPEDITION BUDGET
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                  DAY-BY-DAY
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <motion.span 
                  key={`spent-${activeJourney.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-3xl sm:text-4xl font-normal text-foreground"
                >
                  {activeJourney.spentRupees}
                </motion.span>
                <span className="text-sm font-normal text-muted-foreground">
                  spent of {activeJourney.totalBudgetRupees}
                </span>
              </div>

              {/* Interactive Animated Budget Bar */}
              <div className="space-y-2 mt-3">
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
                  <motion.div 
                    key={`bar-${activeJourney.id}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeJourney.budgetPercentage}%` }}
                    transition={{ duration: 1, ease: EASE }}
                    className="h-full rounded-full bg-gradient-to-r from-aurora via-teal-400 to-orchid"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{activeJourney.budgetPercentage}% utilized</span>
                  <span>Daily Pace: {activeJourney.dailyAvgRupees}</span>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Real-Time Memory Pinned Alert Card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="lift relative rounded-3xl p-6 border border-border bg-card/85 shadow-cast backdrop-blur-xl group cursor-pointer"
              onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-aurora/15 text-aurora flex items-center justify-center border border-aurora/20 shrink-0 shadow-sm relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-aurora animate-ping" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      New memory pinned
                      <Sparkles className="w-3.5 h-3.5 text-aurora fill-aurora" />
                    </p>
                    <span className="text-[11px] font-mono text-aurora bg-aurora/10 px-2 py-0.5 rounded-full">
                      {activeJourney.latestMemory.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {activeJourney.latestMemory.title} · {activeJourney.latestMemory.location}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-muted/80 text-foreground border border-border">
                      {activeJourney.latestMemory.mood}
                    </span>
                    <span className="text-[11px] font-medium text-aurora flex items-center gap-1 hover:underline ml-auto">
                      {isMemoryExpanded ? 'Hide Story' : 'Expand Story'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Memory Preview Modal/Strip */}
              <AnimatePresence>
                {isMemoryExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden mt-4 pt-4 border-t border-border/80"
                  >
                    <div className="relative h-32 rounded-2xl overflow-hidden mb-2">
                      <img 
                        src={activeJourney.latestMemory.image} 
                        alt={activeJourney.latestMemory.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 text-white text-xs">
                        <p className="font-semibold drop-shadow-md">{activeJourney.latestMemory.title}</p>
                        <p className="text-[10px] text-white/80">{activeJourney.latestMemory.location}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM GUARANTEES & CTA BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 p-6 sm:p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-xl shadow-cast flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* 3 Pillar Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-aurora/10 text-aurora flex items-center justify-center border border-aurora/20 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">120+ countries mapped</p>
                <p className="text-xs text-muted-foreground font-mono">Global coordinate indexing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orchid/10 text-orchid flex items-center justify-center border border-orchid/20 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Synced every 30s</p>
                <p className="text-xs text-muted-foreground font-mono">Real-time memory sync</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">End-to-end encrypted</p>
                <p className="text-xs text-muted-foreground font-mono">Zero-knowledge location</p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 shadow-cast text-xs sm:text-sm">
                <span>{isLoggedIn ? "Open Personal Dashboard" : "Start Your Living Atlas"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
