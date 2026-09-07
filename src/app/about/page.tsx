'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Compass,
  Globe,
  Sparkles,
  MapPin,
  Feather,
  Eye,
  Shield,
  ArrowRight,
  ChevronDown,
  Layers,
  CodeXml,
  Database,
  Palette,
  Zap,
  Lock,
  Heart,
  Quote,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  Volume2,
  Flame,
  Award,
  BookOpen,
  ArrowUpRight,
  HelpCircle,
  Search,
  Navigation as NavIcon,
} from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { smoothScrollTo, smoothScrollToPosition } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Section Anchors for Floating Subnav ── */
const SECTIONS = [
  { id: 'story', label: 'Story & Origin' },
  { id: 'pillars', label: 'Core Pillars' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'technology', label: 'Tech Stack' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'roadmap', label: 'Future Roadmap' },
  { id: 'creator', label: 'Creator Note' },
  { id: 'faq', label: 'FAQ' },
];

/* ── 4 Core Pillars with Dedicated Site Imagery ── */
const PILLARS = [
  {
    letter: 'M',
    title: 'Memory Archive',
    subtitle: 'Coordinate-Pinned Recollections',
    badgeColor: 'text-aurora bg-aurora/10 border-aurora/30',
    dotBg: 'bg-aurora',
    icon: MapPin,
    image: '/images/destinations/salar-de-uyuni-mirror.jpg',
    coord: '20.1338° S, 67.4891° W',
    location: 'Salar de Uyuni, Bolivia',
    summary:
      '50,000+ unvarnished human moments pinned to exact GPS coordinates rather than corporate commercial points of interest.',
    detail:
      'Travelers leave notes at the exact latitude and longitude where something happened to them—a rainstorm in Kyoto, an unexpected sunrise tea in Chefchaouen, or quiet reflection on a Patagonian ridge. You navigate through human experience, not marketing brochures.',
  },
  {
    letter: 'S',
    title: 'Sensory Cartography',
    subtitle: 'Search by Emotion & Atmosphere',
    badgeColor: 'text-violet bg-violet/10 border-violet/30',
    dotBg: 'bg-violet',
    icon: Feather,
    image: '/images/destinations/cappadocia-balloons.jpg',
    coord: '38.6431° N, 34.8289° E',
    location: 'Göreme, Cappadocia',
    summary:
      'No star ratings or arbitrary numerical scores. Explore destinations according to how they feel.',
    detail:
      'Filter destinations by atmospheric moods: Sacred Solitude, Dawn Mist, Kinetic Nightlife, High-Altitude Wonder, and Oceanic Reverie. Discover places matching your interior emotional state rather than an algorithm’s clickbait rankings.',
  },
  {
    letter: 'T',
    title: 'Tactical 3D Telemetry',
    subtitle: 'Real-Time Celestial Globe',
    badgeColor: 'text-primary bg-primary/10 border-primary/30',
    dotBg: 'bg-primary',
    icon: Globe,
    image: '/images/expeditions/expedition_iceland_aurora_1788184898699.jpg',
    coord: '64.9631° N, 19.0208° W',
    location: 'Tromsø & Icelandic Glaciers',
    summary:
      'Engineered with Three.js and custom WebGL shaders for realistic day/night terminators and orbital telemetry.',
    detail:
      'Inspect solar lighting, twilight gradients, satellite terrain, and altitude coordinates across 195 nations. Rotate, zoom, and inspect real-time geographic data with desktop and mobile fluid performance.',
  },
  {
    letter: 'F',
    title: 'Friction Logs & AI Dossiers',
    subtitle: 'Unvarnished Cultural Reality',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    dotBg: 'bg-amber-500',
    icon: Compass,
    image: '/images/destinations/petra-treasury.jpg',
    coord: '30.3285° N, 35.4444° E',
    location: 'Wadi Rum & Petra, Jordan',
    summary:
      'Honest cultural etiquette, local currency realities, and unvarnished friction notes before you land.',
    detail:
      'Traditional apps hide what went wrong. AtlasAura pairs intelligent AI trip assistance with authentic community friction logs—warning you about transit delays, customs rules, real costs, and local respectful customs.',
  },
];

/* ── 4 Step Interactive Workflow with Images ── */
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Select by Atmosphere, Not Just Destination',
    desc: 'Begin by choosing an emotional mood—Sacred Peace, Solitary Reflection, High Adventure, or Cultural Wonder—or inspect our global 3D sphere.',
    image: '/images/destinations/faroe-gasadalur.jpg',
    location: 'Faroe Islands',
    icon: Feather,
  },
  {
    step: '02',
    title: 'Unearth Exact-Coordinate Whispers',
    desc: 'Click on pins to read genuine notes left by travelers at exact GPS coordinates, detailing the sounds, scents, and unvarnished realities of the moment.',
    image: '/images/destinations/santorini-oia-domes.jpg',
    location: 'Oia, Santorini',
    icon: MapPin,
  },
  {
    step: '03',
    title: 'Simulate Itineraries & Realistic Budgets',
    desc: 'Launch the AI Travel Assistant and Budget Estimator to construct a balanced 7-day journey factoring in cultural etiquette, currency exchange, and true transit friction.',
    image: '/images/destinations/machu-picchu-citadel.jpg',
    location: 'Andes, Peru',
    icon: Sparkles,
  },
  {
    step: '04',
    title: 'Leave Your Trace for Future Wanderers',
    desc: 'Pin your own transformative memory to the global atlas to preserve sacred discoveries and guide fellow deliberate wanderers.',
    image: '/images/destinations/torres-del-paine.jpg',
    location: 'Patagonia, Chile',
    icon: Compass,
  },
];

/* ── Comparison: Traditional vs AtlasAura ── */
const COMPARISONS = [
  {
    feature: 'Core Rating Paradigm',
    traditional: '5-Star reviews prone to review bombing and sponsored boosts',
    atlasAura: 'Zero star ratings. 100% sensory notes and atmospheric descriptions',
  },
  {
    feature: 'Discovery Logic',
    traditional: 'Funneling tourists to the top 10 overcrowded selfie traps',
    atlasAura: 'Curated sanctuaries, secret coordinates, and mood-based mapping across 195 nations',
  },
  {
    feature: 'Authenticity & Friction',
    traditional: 'Polished promotional photos hiding queues, hidden fees, and scams',
    atlasAura: 'Unvarnished friction logs: what it truly cost, what went wrong, and cultural etiquette',
  },
  {
    feature: 'Spatial Experience',
    traditional: 'Static flat maps filled with clutter, banner ads, and sponsored pins',
    atlasAura: 'Cinematic 3D WebGL globe with celestial lighting, day/night terminators, and satellite telemetry',
  },
  {
    feature: 'Planning Assistance',
    traditional: 'Commission-driven affiliate links pushing high-margin tour packages',
    atlasAura: 'Intelligent AI Dossiers calculating multi-currency budgets and cultural customs with zero bias',
  },
  {
    feature: 'Travel Philosophy',
    traditional: 'Checklist consumption: taking quick photos to prove you were there',
    atlasAura: 'Deliberate wandering: slow immersion, environmental reverence, and preserved memories',
  },
];

/* ── Technical Stack ── */
const TECH_STACK = [
  {
    name: 'Next.js 14',
    role: 'React Framework & App Router',
    icon: Layers,
    desc: 'Hybrid SSR & SSG streaming with zero layout shift and instantaneous page transitions.',
  },
  {
    name: 'TypeScript 5',
    role: 'End-to-End Type Safety',
    icon: CodeXml,
    desc: 'Rigid type definitions for all geospatial coordinates, memory pins, and user payloads.',
  },
  {
    name: 'Three.js & WebGL',
    role: '3D Spherical Rendering',
    icon: Globe,
    desc: 'Custom spherical matrix shaders, solar lighting terminators, and smooth orbital controls.',
  },
  {
    name: 'Tailwind CSS & Radix',
    role: 'Design System & HSL Tokens',
    icon: Palette,
    desc: 'Zero-flash dark/light theme switching with meticulously balanced contrast ratios.',
  },
  {
    name: 'Framer Motion',
    role: 'Gesture-Driven Micro-Interactions',
    icon: Zap,
    desc: 'Hardware-accelerated layout transitions and spring physics for smooth, tactile feedback.',
  },
  {
    name: 'JWT & Prisma ORM',
    role: 'Session Security & Auth',
    icon: Lock,
    desc: 'Multi-device session tokens, bcrypt salt hashing, and email OTP verification pipelines.',
  },
];

/* ── Future Roadmap ── */
const ROADMAP_PHASES = [
  {
    phase: 'Phase 1 · Foundation',
    status: 'LIVE NOW',
    statusColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    title: 'The Global Coordinate Archive & 3D Celestial Globe',
    desc: 'Over 50,000 coordinate-pinned memories mapped across 195 nations. Tactical Three.js WebGL globe with solar lighting, mood-based discovery search, and the AI Travel Dossier assistant.',
    milestones: [
      'Interactive 3D WebGL Spherical Explorer with day/night terminator',
      'Atmospheric mood search engine across 5 emotional vectors',
      'AI Budget Estimator & Cultural Itinerary Assistant',
      'Dual theme engine (Default Night & Sunlit Day)',
    ],
  },
  {
    phase: 'Phase 2 · Active Development',
    status: 'Q2 2026',
    statusColor: 'bg-aurora/15 text-aurora border-aurora/30',
    title: 'Offline Field Journal & PWA GPS Beacon',
    desc: 'Empowering travelers in remote mountains, deserts, and oceans to capture moments with zero cellular connectivity. Automatic background sync seamlessly activates once an internet connection is re-established.',
    milestones: [
      'Offline Service Worker caching for all saved sanctuaries',
      'Device GPS-linked field notes without cellular data',
      'Optimistic background synchronization via IndexedDB',
      'Sub-meter elevation and barometric sensor logging',
    ],
  },
  {
    phase: 'Phase 3 · In Design',
    status: 'Q3 2026',
    statusColor: 'bg-violet/15 text-violet border-violet/30',
    title: 'Spatial Audio & Acoustic Field Recordings',
    desc: 'Sound is half of memory. We are introducing binaural acoustic recordings tied directly to coordinates—listening to monsoon rain on Kyoto temple tiles, Patagonian wind gusts, or evening calls to prayer.',
    milestones: [
      'Lossless binaural audio player embedded into coordinate pins',
      'Ambient soundscape mixer for travel meditation and study',
      'Traveler community field recording contribution portal',
      'Acoustic decibel & quiet sanctuary preservation indexing',
    ],
  },
  {
    phase: 'Phase 4 · Planned',
    status: 'Q4 2026',
    statusColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    title: 'Local Culture Guardian Micro-Grants',
    desc: 'Direct regenerative support for the real guardians of places. 10% of AtlasAura premium patronage will be distributed to indigenous guides, heritage conservationists, and sustainable trail stewards.',
    milestones: [
      'Direct peer-to-peer patronage for verified local elders and artisans',
      'Transparent on-platform impact ledger for every funded sanctuary',
      'Sacred ground protection alerts preventing over-tourism',
      'Indigenous language phrasebooks and dialect audio guides',
    ],
  },
  {
    phase: 'Phase 5 · Horizon',
    status: '2027 VISION',
    statusColor: 'bg-muted text-muted-foreground border-border',
    title: 'Collaborative Expedition Telemetry & Shared Logs',
    desc: 'Real-time multi-traveler route synchronization for overland expeditions, sailing journeys, and high-altitude treks with decentralized, tamper-proof memory chronicles.',
    milestones: [
      'Multi-user shared expedition maps with live waypoint telemetry',
      'Satellite messenger integration (Garmin InReach / Apple SOS)',
      'Decentralized immutable travel chronicle backups',
      'Global university ethnography and cartography research access',
    ],
  },
];

/* ── FAQ Items ── */
const FAQS = [
  {
    q: 'What is AtlasAura, and how is it different from Google Maps or TripAdvisor?',
    a: 'Google Maps and TripAdvisor are commercial directories built around commercial businesses, ratings, and advertising algorithms. AtlasAura is a sensory travel archive. We do not rate mountains or temples out of five stars; instead, travelers record what happened to them at exact coordinates—the sounds, the smells, the cultural lessons, and the unvarnished friction. Our focus is how a place feels rather than commercial promotions.',
  },
  {
    q: 'Can anyone pin a memory to the map?',
    a: 'Yes. Anyone who creates a free wanderer account can drop memory pins at coordinates they have visited. To preserve sanctuary sanctity and prevent commercial spam, pins undergo community peer verification and automatic anti-advertising filters.',
  },
  {
    q: 'Is AtlasAura free to use?',
    a: 'AtlasAura is completely free for exploring, reading memories, spinning the 3D globe, searching by mood, and creating personal travel itineraries. In the future, optional Patron memberships will fund our Local Culture Guardian Grants and unlock high-definition offline map downloads.',
  },
  {
    q: 'What are "Friction Logs"?',
    a: 'Friction logs are honest notes about the realities of a journey—visa difficulties, high-altitude acclimation, seasonal closures, cultural customs that must be honored, and real transportation costs. We believe travel is only transformative when approached with honesty and preparation.',
  },
  {
    q: 'How does the 3D Globe perform on mobile devices?',
    a: 'Our Three.js WebGL engine features dynamic level-of-detail (LOD) and hardware performance detection. On mobile phones and battery saver modes, geometry detail and frame budgets adapt automatically to ensure silky smooth 60fps interaction without draining battery.',
  },
  {
    q: 'What is the long-term vision of AtlasAura?',
    a: 'Our long-term goal is to build the world’s most reverent, human-centered atlas—preserving cultural memories, promoting regenerative travel, and ensuring that future wanderers explore with curiosity, humility, and care for local communities.',
  },
];

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('story');
  const [showNavPill, setShowNavPill] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Show floating pill after scrolling past hero
      setShowNavPill(currentScroll > 360);

      // Identify active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubnavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    smoothScrollTo(`#${id}`, e);
    setActiveSection(id);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void relative">
      {/* Top Hairline Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
        <div
          id="scroll-progress"
          className="h-full bg-gradient-to-r from-aurora via-primary to-violet transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Top Header Navigation */}
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Floating Subnav Pill for Quick Jumps */}
      <AnimatePresence>
        {showNavPill && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed top-20 left-0 right-0 z-40 px-4 pointer-events-none"
            aria-label="About page section navigation"
          >
            <div className="max-w-4xl mx-auto flex justify-center">
              <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-md border border-border/80 shadow-lg overflow-x-auto max-w-full scrollbar-none">
                <button
                  type="button"
                  onClick={() => smoothScrollToPosition(0)}
                  className="px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-aurora transition-colors whitespace-nowrap rounded-full hover:bg-muted/50"
                  title="Scroll to top"
                >
                  Top
                </button>
                <span className="h-3 w-px bg-border/60" aria-hidden="true" />
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={(e) => handleSubnavClick(e, sec.id)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-aurora/15 text-aurora font-semibold border border-aurora/30 shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="relative isolate pt-36 pb-20 overflow-hidden hairline-b">
        {/* Ambient atmospheric lighting */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[820px] h-[400px] rounded-full bg-aurora/10 blur-[140px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-violet/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-35" />
          <div className="aurora-wash absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-aurora/30 text-aurora text-xs font-mono font-medium tracking-wider uppercase mb-6 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '18s' }} />
            <span>AtlasAura · Sensory Cartography Manifesto</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.06] tracking-tight mb-8"
          >
            A travel atlas with <br />
            <span className="font-serif-italic text-aurora relative inline-block">
              no star ratings.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-aurora opacity-75"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 C 60 2, 140 2, 198 9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          {/* Subtitle addressing the survey confusion */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed mb-6"
          >
            Traditional travel platforms funnel millions into the exact same 10 tourist traps using biased algorithms. 
            <strong className="text-foreground font-medium"> AtlasAura is a sensory archive</strong> of 50,000+ real human memories 
            pinned to exact GPS coordinates—mapping atmosphere, emotional truth, and cultural reverence.
          </motion.p>

          {/* Creator Attribution & Core Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs sm:text-sm text-muted-foreground mb-10"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border">
              <Sparkles className="w-3.5 h-3.5 text-aurora" />
              <span>Created by <strong>Ansh Tank</strong></span>
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>3D WebGL Spherical Telemetry</span>
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Commercial Algorithm Bias</span>
            </span>
          </motion.div>

          {/* Metric Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-14"
          >
            {[
              { label: 'Nations Mapped', value: '195', highlight: 'text-foreground' },
              { label: 'Coordinate Whispers', value: '50k+', highlight: 'text-aurora' },
              { label: 'Star Ratings', value: '0', highlight: 'text-violet' },
              { label: 'Authentic Wanderers', value: '45,000+', highlight: 'text-emerald-500' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/80 text-center shadow-sm hover:border-aurora/40 transition-colors"
              >
                <div className={`font-serif text-3xl sm:text-4xl font-bold mb-1 ${stat.highlight}`}>
                  {stat.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── HERO SHOWCASE IMAGE (Inspiring visual from the site) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border/80 shadow-2xl group"
          >
            <div className="aspect-[16/9] relative overflow-hidden bg-muted">
              <img
                src="/images/expeditions/expedition_kyoto_twilight_1788184945800.jpg"
                alt="Kyoto Arashiyama twilight sanctuary pinned in AtlasAura"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              
              {/* Telemetry and Memory Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] font-mono text-aurora font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  35.0116° N, 135.7681° E
                </span>
                <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] font-mono text-muted-foreground">
                  Twilight Elevation: 340m
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-left">
                <div>
                  <span className="text-[11px] font-mono text-aurora uppercase tracking-widest font-semibold block mb-1">
                    Featured Memory Pin #4,821
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    Arashiyama Bamboo Grove at Dusk
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mt-1 italic">
                    &quot;Temple bells reverberating through the rain. The crowd had already boarded the evening trains back to Osaka. Just silence and wet cedar.&quot;
                  </p>
                </div>
                <Link
                  href="/destinations"
                  className="px-4 py-2 rounded-full bg-aurora/90 hover:bg-aurora text-ink-void font-semibold text-xs shadow-md backdrop-blur-sm transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Explore Kyoto Pin</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Scroll Down Cue */}
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={(e) => handleSubnavClick(e, 'story')}
              className="inline-flex flex-col items-center gap-2 text-xs font-mono text-muted-foreground hover:text-aurora transition-colors group cursor-pointer"
            >
              <span className="tracking-widest uppercase text-[10px]">Read Our Story</span>
              <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: STORY & SURVEY TRANSPARENCY ── */}
      <section id="story" className="section-y relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Origin & Survey Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              Why We Built AtlasAura
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We recently conducted a survey of travelers and website visitors. Many told us: 
              <em className="text-foreground"> &quot;We want to understand the exact purpose of this website and how it differs from ordinary travel tools.&quot;</em> 
              Here is our candid story.
            </p>
          </div>

          {/* The Narrative Grid with Story Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
                <p>
                  Modern travel is in crisis. Algorithmic feeds push tens of thousands of people into the same ten 
                  instagrammable viewpoints every day. Historic towns have been turned into gift shop queues, 
                  and centuries-old monastic sanctuaries are graded like vacuum cleaners with star ratings.
                </p>
                <p>
                  When someone gives a 1,000-year-old Norwegian fjord or Kyoto bamboo grove <strong className="text-foreground font-medium">3.2 stars</strong> because 
                  <em> &quot;the parking lot was crowded on a Sunday,&quot;</em> something fundamental has fractured in our relationship with exploration.
                </p>
                <p>
                  <strong className="text-foreground font-medium">AtlasAura was engineered as the antidote.</strong> A quiet sanctuary 
                  where places are cataloged not by commercial popularity, but by emotional atmosphere: the sound of rain on temple tiles, 
                  the scent of mountain mist at dawn, the real financial friction, and the humble gratitude required when arriving.
                </p>
              </div>

              {/* Creator Quote Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-aurora/5 rounded-full blur-2xl group-hover:bg-aurora/10 transition-colors" />
                <Quote className="w-8 h-8 text-aurora/40 mb-3" />
                <blockquote className="font-serif text-lg sm:text-xl text-foreground italic leading-relaxed mb-4">
                  &quot;Places are not products to be rated. They are ancient spaces holding centuries of human feeling. 
                  AtlasAura exists to pin memory back to latitude and longitude.&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-aurora/20 border border-aurora/40 flex items-center justify-center font-bold text-aurora text-xs">
                    AT
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground text-sm">Ansh Tank</span>
                    <span className="font-mono text-xs text-muted-foreground">Creator &amp; Lead Architect, AtlasAura</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Column with Image Showcase & Contrast Cards */}
            <div className="lg:col-span-6 space-y-6">
              {/* Authentic Story Photograph Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-border shadow-lg group">
                <div className="aspect-[4/3] relative bg-muted">
                  <img
                    src="/images/destinations/kumano-kodo-nachi.jpg"
                    alt="Kumano Kodo ancient pilgrimage trail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-[10px] text-aurora uppercase tracking-widest block font-semibold mb-1">
                      Historical Pilgrimage Archive
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white drop-shadow-sm">
                      Kumano Kodo Sacred Trails, Wakayama
                    </h4>
                    <p className="text-xs text-white/80 italic drop-shadow-sm">
                      &quot;Over 1,000 years of footsteps. Not a single 5-star review needed.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Problem vs Solution Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-2">
                  <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                    <XCircle className="w-4 h-4" />
                    <span>The Broken Reality</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Commercial star ratings, fake review bots, tourist trap queues, and hidden affiliate commissions.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-aurora/5 border border-aurora/25 space-y-2">
                  <div className="flex items-center gap-2 text-aurora font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>The AtlasAura Remedy</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sensory mood searches, real GPS coordinate chronicles, unvarnished friction notes, and 3D globe telemetry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE 4 CORE PILLARS (With Images) ── */}
      <section id="pillars" className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              The Architecture of Purpose
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              The 4 Pillars of AtlasAura
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every system in AtlasAura was built around four foundational pillars designed to foster 
              mindful, reverent exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl bg-card border border-border hover:border-aurora/40 transition-all duration-300 shadow-sm relative group overflow-hidden flex flex-col justify-between"
                >
                  {/* Visual Image Header */}
                  <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    
                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] font-mono text-foreground">
                      <MapPin className="w-3.5 h-3.5 text-aurora" />
                      <span>{pillar.coord}</span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs font-mono text-white/90 drop-shadow-sm font-semibold">
                        {pillar.location}
                      </span>
                      <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-serif text-xs font-bold ${pillar.badgeColor}`}>
                        {pillar.letter}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-aurora" />
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                        {pillar.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-aurora block">
                      {pillar.subtitle}
                    </span>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {pillar.summary}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {pillar.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS (With Images) ── */}
      <section id="how-it-works" className="section-y relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Interactive User Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              How to Experience AtlasAura
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you are preparing for your next international expedition or exploring from your desk, 
              here is how to navigate the atlas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="rounded-3xl bg-card border border-border flex flex-col justify-between hover:border-aurora/40 transition-all shadow-sm group overflow-hidden"
                >
                  {/* Step Image */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-background/80 backdrop-blur-md border border-border flex items-center justify-center font-mono text-xs font-bold text-aurora">
                      {step.step}
                    </div>

                    <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/90 drop-shadow-sm">
                      {step.location}
                    </div>
                  </div>

                  {/* Step Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-7 h-7 rounded-lg bg-aurora/10 text-aurora flex items-center justify-center mb-2">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-serif text-base font-bold text-foreground mb-2 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Step {step.step}</span>
                      <span className="text-aurora">Ready</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Jump Interactive Action Banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-card via-card/90 to-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-aurora/10 text-aurora flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Ready to test the 3D globe?
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Experience real-time celestial lighting and satellite coordinate mapping right now.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/globe"
                className="px-5 py-2.5 rounded-full bg-aurora text-ink-void font-semibold text-xs transition-all hover:bg-aurora-bright active:scale-95 shadow-sm"
              >
                Open 3D Globe
              </Link>
              <Link
                href="/destinations"
                className="px-5 py-2.5 rounded-full bg-muted/60 text-foreground font-semibold text-xs border border-border hover:bg-muted transition-colors"
              >
                Browse Sanctuaries
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: COMPARISON MATRIX ── */}
      <section id="comparison" className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Unvarnished Differences
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              Traditional Platforms vs. AtlasAura
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              A transparent comparison of how we approach travel differently than the mainstream platforms.
            </p>
          </div>

          {/* Responsive Comparison Table */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-muted/40 p-4 sm:p-5 border-b border-border font-mono text-xs font-semibold uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-3 text-muted-foreground">Dimension</div>
              <div className="col-span-4 sm:col-span-4 text-destructive flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Traditional Sites</span>
              </div>
              <div className="col-span-4 sm:col-span-5 text-aurora flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>AtlasAura Approach</span>
              </div>
            </div>

            <div className="divide-y divide-border">
              {COMPARISONS.map((comp) => (
                <div key={comp.feature} className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm hover:bg-muted/10 transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-semibold text-foreground pr-2">
                    {comp.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-muted-foreground pr-2 leading-relaxed">
                    {comp.traditional}
                  </div>
                  <div className="col-span-4 sm:col-span-5 text-foreground font-medium leading-relaxed">
                    {comp.atlasAura}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TECHNICAL ARCHITECTURE ── */}
      <section id="technology" className="section-y relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Under The Hood
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              Engineered with Technical Rigor
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Behind the atmospheric aesthetic is a high-performance stack built for sub-second hydration, 
              high-concurrency geospatial queries, and zero layout shift.
            </p>
          </div>

          {/* Technical Telemetry Illustration Card */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-lg mb-12 max-w-4xl mx-auto group">
            <div className="aspect-[21/9] relative overflow-hidden bg-muted">
              <img
                src="/images/destinations/ladakh-pangong-tso.jpg"
                alt="Technical telemetry and coordinate mapping"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-background/70 backdrop-blur-xs" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-xs text-aurora">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-aurora animate-ping" />
                    &lt;Three.js WebGL Engine /&gt;
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {`{ coordinates: 'WGS-84', target_fps: 60, status: 'calibrated' }`}
                  </span>
                </div>

                <div className="text-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-aurora block mb-1">
                    Spatial Telemetry Layer
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Spherical Mathematics &amp; Edge Streaming
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                    Solar terminator vector computation running directly on client GPU shaders.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Geospatial Cache: IndexedDB</span>
                  <span className="text-aurora">Sub-second First Paint</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_STACK.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-6 rounded-3xl bg-card border border-border hover:border-aurora/40 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-aurora/10 text-aurora flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground">
                        {tech.name}
                      </h3>
                      <span className="font-mono text-[11px] text-muted-foreground block">
                        {tech.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Performance Specs Strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Type Safety', value: '100% Strict TypeScript' },
              { label: 'Accessibility', value: 'WCAG 2.1 AA Compliant' },
              { label: 'Device Support', value: 'PWA Ready & Offline Cache' },
              { label: 'Architecture', value: 'App Router + Edge Streaming' },
            ].map((spec) => (
              <div
                key={spec.label}
                className="p-4 rounded-2xl border border-dashed border-border bg-card/40 text-center"
              >
                <div className="font-mono text-xs font-bold text-aurora mb-0.5">
                  {spec.value}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: PHILOSOPHY ── */}
      <section id="philosophy" className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              Our Guiding Philosophy
            </h2>
          </div>

          <div className="text-center mb-14">
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground leading-snug">
              &quot;Design is not merely how it looks. <br />
              <span className="font-serif-italic text-aurora">Design is how it honors human reverence and memory.&quot;</span>
            </blockquote>
            <div className="w-16 h-px bg-aurora/40 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Sensory Over Statistical',
                desc: 'We decline to score ancient landmarks out of 5 stars. Atmosphere cannot be reduced to numerical decimals; it can only be felt and chronicled.',
              },
              {
                num: '02',
                title: 'The Deliberate Wanderer',
                desc: 'We design for slow travelers who stay in one village for weeks, study local etiquette, and respect indigenous traditions rather than rushing for selfies.',
              },
              {
                num: '03',
                title: 'Zero Algorithmic Hype',
                desc: 'Traditional travel apps create ecological and community devastation by funneling millions of visitors into the exact same delicate photo spots. We distribute discovery.',
              },
              {
                num: '04',
                title: 'Unvarnished Truth',
                desc: 'Every memory and guide contains honest friction—what it truly cost, seasonal dangers, transit exhaustion, and what to avoid—written by authentic wanderers.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-3xl bg-card border border-border hover:border-aurora/40 transition-all shadow-sm relative group"
              >
                <span className="font-mono text-xs text-aurora font-bold mb-2 block">
                  Principle {item.num}
                </span>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FUTURE ROADMAP ── */}
      <section id="roadmap" className="section-y relative">
        <div className="shell max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Where We Are Heading
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              The Future Roadmap
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              You asked in our survey: <em>&quot;What is the future plan for AtlasAura?&quot;</em> 
              Here is our transparent multi-phase development timeline.
            </p>
          </div>

          <div className="relative border-l border-border/80 ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-8">
            {ROADMAP_PHASES.map((phase) => (
              <div key={phase.phase} className="relative group">
                {/* Status Dot on Line */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-aurora group-hover:bg-aurora transition-colors shadow-sm" />

                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border group-hover:border-aurora/40 transition-all shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="font-mono text-xs text-muted-foreground font-semibold">
                      {phase.phase}
                    </span>
                    <span className={`text-[11px] px-3 py-1 rounded-full font-mono font-semibold border ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {phase.desc}
                  </p>

                  <div className="pt-4 border-t border-border/60">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground block mb-3 font-semibold">
                      Key Deliverables:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {phase.milestones.map((milestone) => (
                        <li key={milestone} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-aurora shrink-0 mt-0.5" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CREATOR'S NOTE (With Image Dispatch) ── */}
      <section id="creator" className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-md relative overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-aurora/10 blur-3xl" />
            
            {/* Left Letter Content */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-aurora/15 border border-aurora/30 flex items-center justify-center font-serif text-2xl font-bold text-aurora">
                  AT
                </div>
                <div>
                  <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-wider block">
                    A Personal Dispatch
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    A Letter from Ansh Tank
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    Creator of AtlasAura &amp; Never Break The Chain
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                <p>
                  To everyone who has explored AtlasAura, pinned a memory, or responded to our community survey: 
                  <strong> thank you.</strong>
                </p>
                <p>
                  When our survey respondents noted that they were initially unsure what AtlasAura does or where it was heading, 
                  I felt a duty to build this dedicated About page. AtlasAura is not an affiliate marketing engine, 
                  nor is it another generic travel blog. It is an independent, non-commercial cartographic endeavor to preserve 
                  the soul of exploration.
                </p>
                <p>
                  Every memory pinned represents a genuine chapter in someone&apos;s life. As we expand into offline 
                  GPS tracking, spatial audio, and community heritage micro-grants, my commitment remains the same: 
                  to build software with craftsmanship, reverence, and uncompromised technical rigor.
                </p>
              </div>

              <div className="pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-serif italic text-base text-foreground block">
                    Ansh Tank
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    Founder &amp; Engineer
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-full bg-muted border border-border text-xs font-semibold text-foreground hover:border-aurora/40 transition-colors"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    href="/story"
                    className="px-4 py-2 rounded-full bg-aurora/10 text-aurora border border-aurora/25 text-xs font-semibold hover:bg-aurora/20 transition-colors"
                  >
                    Origin Story
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Field Dispatch Photograph */}
            <div className="md:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg relative aspect-[3/4] bg-muted group">
                <img
                  src="/images/destinations/shirakawago-village.jpg"
                  alt="Shirakawa-go alpine sanctuary in winter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="font-mono text-[10px] text-aurora uppercase tracking-widest font-semibold block">
                    Field Journal #082
                  </span>
                  <p className="font-serif text-sm font-bold text-white leading-snug">
                    Shirakawa-gō Historic Mountain Settlement
                  </p>
                  <span className="text-[11px] font-mono text-white/70">
                    36.2562° N, 136.9066° E
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FREQUENTLY ASKED QUESTIONS ── */}
      <section id="faq" className="section-y relative">
        <div className="shell max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-aurora font-semibold uppercase tracking-widest">
              Community Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl mt-3 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Addressing the top questions raised in our recent community feedback survey.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-card border border-border overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-aurora' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: CALL TO ACTION STRIP ── */}
      <section className="section-y relative overflow-hidden text-center bg-card hairline-t">
        <div className="shell max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 text-aurora text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Embark on Your Next Journey</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 text-foreground">
            Wander with Purpose.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Rotate our 3D celestial globe, explore secluded sanctuaries, or generate an honest cultural dossier with our AI trip planner.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/globe"
              className="px-6 py-3 rounded-full bg-aurora hover:bg-aurora-bright text-ink-void font-semibold text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Launch 3D Globe</span>
            </Link>
            <Link
              href="/destinations"
              className="px-6 py-3 rounded-full bg-muted/60 hover:bg-muted text-foreground font-semibold text-sm transition-all border border-border flex items-center gap-2"
            >
              <span>Explore Sanctuaries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/trip-planner"
              className="px-6 py-3 rounded-full bg-card hover:bg-muted/80 text-foreground font-semibold text-sm transition-all border border-border flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>AI Trip Planner</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
