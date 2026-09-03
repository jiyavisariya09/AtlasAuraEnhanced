'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Star, Calendar, ShieldCheck, Utensils, 
  Compass, ChevronLeft, Heart, Sparkles, MessageSquare, 
  ThumbsUp, AlertCircle, Globe, Bus, Send, 
  Calculator, Plane, Mountain, Hotel, CloudSun, HelpCircle,
  ChevronDown, CheckCircle2, Luggage, BookOpen, Clock,
  ArrowRight, Eye, Thermometer, Droplets, Users,
  Camera, ImageIcon, Play, Upload, X
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import AIBudgetEstimatorModal from '@/components/AIBudgetEstimatorModal';
import { DESTINATIONS, type DestinationItem } from '@/data/destinationsData';
import { getEnrichedDestinationData, type DestinationEnrichedData } from '@/data/destinationDetails';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { BorderBeam } from '@/components/ui/border-beam';

const DestinationGlobeModal = dynamic(
  () => import('@/components/DestinationGlobeModal'),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

type ActiveTab = 'overview' | 'roadmap' | 'hotels' | 'seasons' | 'culinary' | 'faq' | 'reviews' | 'gallery';

type GalleryItem = {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  author: string;
  date: string;
};

const TABS: { id: ActiveTab; label: string; icon: typeof Compass }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'roadmap', label: 'Roadmap', icon: Compass },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'seasons', label: 'Best Time', icon: CloudSun },
  { id: 'culinary', label: 'Food', icon: Utensils },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'reviews', label: 'Stories', icon: MessageSquare },
  { id: 'gallery', label: 'Gallery', icon: Camera },
];

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const destinationId = params?.id as string;

  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const isDark = theme === 'dark';

  const [destination, setDestination] = useState<any | null>(null);
  const [enriched, setEnriched] = useState<DestinationEnrichedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeRoadmapDay, setActiveRoadmapDay] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modals
  const [showGlobe, setShowGlobe] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [userOrigin, setUserOrigin] = useState('Mumbai, India');

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80', caption: 'Sunset view from the coastline', author: 'Ansh T.', date: '2 days ago' },
    { id: '2', type: 'photo', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', caption: 'Morning mist over the valley', author: 'Priya K.', date: '5 days ago' },
    { id: '3', type: 'video', url: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?auto=format&fit=crop&w=800&q=80', caption: 'Drone footage of the trail', author: 'Ravi M.', date: '1 week ago' },
    { id: '4', type: 'photo', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', caption: 'Crystal clear waters', author: 'Maya S.', date: '1 week ago' },
    { id: '5', type: 'photo', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80', caption: 'Golden hour at the peak', author: 'Arjun P.', date: '2 weeks ago' },
    { id: '6', type: 'video', url: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=800&q=80', caption: 'Time-lapse of the starry sky', author: 'Neha R.', date: '2 weeks ago' },
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Parallax via scroll listener (avoids framer-motion useScroll hydration issue)
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const heroParallax = Math.min(scrollY * 0.25, 160);
  const heroFade = Math.max(0.3, 1 - scrollY / 800);

  // Load from DESTINATIONS mock data or API
  useEffect(() => {
    if (!destinationId) return;
    setLoading(true);

    const matched = DESTINATIONS.find(
      (d) => d.id === destinationId || d.name.toLowerCase().includes(destinationId.toLowerCase())
    );

    if (matched) {
      const enrichedData = getEnrichedDestinationData(matched);
      setEnriched(enrichedData);
      setDestination({
        ...matched,
        bestTimeToVisit: matched.bestSeason,
        safetyScore: 4.9,
        crowdLevel: matched.budgetTier === 'luxury' ? 'Low' : 'Moderate',
        culturalInfo: {
          history: matched.culture,
          traditions: matched.highlights.join('. '),
          etiquette: 'Respect local customs, shrines, and sacred natural sanctuaries. Leave no trace.',
        },
        reviews: (matched.reviews && matched.reviews.length > 0)
          ? matched.reviews.map((r) => ({
              id: r.id,
              rating: r.rating,
              content: r.comment,
              createdAt: r.date,
              travelerType: r.travelerType,
              user: { name: r.author, avatar: r.avatar },
            }))
          : [
              {
                id: 'rev-1',
                rating: 5,
                content: 'Truly breathtaking atmosphere. Walking here felt like stepping onto another planet.',
                createdAt: new Date().toISOString(),
                travelerType: 'Explorer',
                user: { name: 'Elena Rostova', avatar: '/avatars/elena.jpg' },
              },
            ],
      });
      setLoading(false);
    } else {
      fetch(`/api/destinations/${destinationId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Destination not found');
          return res.json();
        })
        .then((data) => {
          setDestination(data.destination);
          setEnriched(getEnrichedDestinationData(data.destination));
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    try {
      const favs = JSON.parse(localStorage.getItem('atlasaura-favorite-destinations') || '[]');
      setIsSaved(favs.includes(destinationId));

      const prefs = JSON.parse(localStorage.getItem('atlasaura-preferences') || '{}');
      if (prefs.homeLocation) setUserOrigin(prefs.homeLocation);
    } catch (e) {
      console.error(e);
    }
  }, [destinationId]);

  const toggleWishlist = () => {
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const favs: string[] = JSON.parse(localStorage.getItem('atlasaura-favorite-destinations') || '[]');
        const updated = next ? [...favs, destinationId] : favs.filter((id) => id !== destinationId);
        localStorage.setItem('atlasaura-favorite-destinations', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    const user = getCurrentUser();
    if (!user) {
      router.push('/signin');
      return;
    }

    setSubmittingReview(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          rating,
          content: reviewContent,
        }),
      });

      const newReview = {
        id: 'rev-' + Date.now(),
        rating,
        content: reviewContent,
        createdAt: new Date().toISOString(),
        user: { name: user.name || 'Anonymous Traveler', avatar: user.avatar },
      };

      setDestination((prev: any) => ({
        ...prev,
        reviews: [newReview, ...(prev?.reviews || [])],
      }));
      setReviewContent('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-aurora/20" />
            <div className="absolute inset-0 rounded-full border-2 border-aurora border-t-transparent animate-spin" />
            <Compass className="absolute inset-0 m-auto w-5 h-5 text-aurora animate-pulse" />
          </div>
          <p className="text-xs font-mono text-muted-foreground animate-pulse">Loading destination dossier…</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Compass className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-3xl font-medium mb-2">Destination Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          The coordinates or catalog entry could not be retrieved.
        </p>
        <Link href="/destinations">
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full px-6 text-xs">
            <ChevronLeft className="w-4 h-4 mr-1" /> Return to Destinations
          </Button>
        </Link>
      </div>
    );
  }

  const data = enriched || getEnrichedDestinationData(destination);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top Header ──────────────────────────────────────────────────── */}
      <header className="glass-bar sticky top-0 z-40 border-b border-border/80">
        <div className="shell h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/destinations" className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4 text-aurora" />
              <span className="hidden sm:inline">Destinations</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-xs font-semibold text-foreground hidden sm:inline truncate max-w-[200px]">{destination.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <CurrencySelector />
            <ThemeToggle compact />
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full border transition-all active:scale-90 ${
                isSaved
                  ? 'bg-rose-500/15 border-rose-500 text-rose-500 shadow-sm'
                  : 'border-border bg-card/60 text-muted-foreground hover:text-foreground'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Parallax Hero Banner ────────────────────────────────────────── */}
      <section className="relative min-h-[560px] sm:min-h-[640px] w-full overflow-hidden bg-black flex flex-col justify-end">
        <div
          style={{ transform: `translateY(${heroParallax}px)` }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
        >
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover"
            decoding="async"
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-aurora/8 via-transparent to-violet/8 mix-blend-overlay" />

        <div style={{ opacity: heroFade }} className="relative shell z-10 pb-8 space-y-6 pt-24 transition-opacity duration-100">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <span>/</span>
            <span className="text-aurora">{destination.name}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-aurora text-ink-void shadow-lg">
              {destination.region}
            </span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-aurora text-aurora" />
              <span>{destination.rating} <span className="text-white/60">/ 5.0</span></span>
            </div>
            {destination.elevation && (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg">
                ⛰️ {destination.elevation}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight drop-shadow-lg leading-[1.05]">
            {destination.name}
          </h1>
          <p className="text-sm sm:text-base text-white/85 max-w-3xl leading-relaxed drop-shadow-sm font-normal">
            {destination.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href={`/globe?destination=${destination.id}`}>
              <Button
                className="rounded-full bg-aurora hover:bg-aurora-glow text-ink-void font-bold text-xs gap-2 px-6 py-5 shadow-lg transition-all active:scale-95"
              >
                <Globe className="w-4 h-4" />
                Explore on 3D Earth
              </Button>
            </Link>

            <Button
              onClick={() => setShowBudgetModal(true)}
              className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-semibold gap-2 px-6 py-5 shadow-lg transition-all active:scale-95"
            >
              <Calculator className="w-4 h-4 text-aurora" />
              AI Budget ({userOrigin.split(',')[0]})
            </Button>
          </div>

          {/* ── Floating Stat Cards ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {[
              { label: 'Base 7-Day Cost', value: formatPrice(destination.budgetUSD || 850), color: 'text-aurora' },
              { label: 'Best Season', value: (destination.bestTimeToVisit || destination.bestSeason)?.split('(')[0]?.trim(), color: 'text-white' },
              { label: 'Safety Score', value: `${destination.safetyScore || 4.9} / 5.0`, color: 'text-emerald-400' },
              { label: 'Coordinates', value: destination.coordinates?.lat ? `${destination.coordinates.lat.toFixed(1)}°N, ${destination.coordinates.lng.toFixed(1)}°E` : 'Global', color: 'text-white/80' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }}
                className="p-3 sm:p-4 rounded-2xl bg-white/8 backdrop-blur-md border border-white/15 shadow-lg"
              >
                <span className="text-[10px] text-white/50 block uppercase font-bold tracking-wider">{stat.label}</span>
                <span className={`text-sm sm:text-base font-bold font-mono ${stat.color}`}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content Layout ─────────────────────────────────────────── */}
      <main className="flex-1 shell py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Left 2 Cols: Tabs & Details ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* ── Premium Scrollable Tab Pills ──────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-aurora text-ink-void shadow-md'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-aurora/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {tab.id === 'reviews' && (
                      <span className={`text-[10px] font-bold ${isActive ? 'text-ink-void/70' : 'text-muted-foreground'}`}>
                        ({destination.reviews?.length || 1})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Tab: Overview ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                      Atmospheric Essence
                    </h3>
                    <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
                      {destination.description}
                    </p>
                  </div>

                  {/* ── Bento Grid Highlights ──────────────────────────────── */}
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-aurora" />
                        Must-Experience Waypoints
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {destination.highlights.map((h: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                            className="p-4 rounded-2xl bg-card border border-border/80 flex items-start gap-3 hover:border-aurora/40 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-aurora/15 flex items-center justify-center shrink-0 group-hover:bg-aurora/25 transition-colors">
                              <Sparkles className="w-4 h-4 text-aurora" />
                            </div>
                            <span className="text-sm text-foreground/90 leading-relaxed pt-1">{h}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Honest Pros & Cons */}
                  {data.prosAndCons && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-5">
                      <h4 className="font-serif text-xl text-foreground font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-aurora" />
                        Honest Traveler Assessment
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pros */}
                        <div className="space-y-3">
                          <span className="text-xs font-mono uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" /> What You Will Love
                          </span>
                          <ul className="space-y-2.5">
                            {data.prosAndCons.pros.map((pro: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/85">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Cons */}
                        <div className="space-y-3">
                          <span className="text-xs font-mono uppercase font-bold text-amber-500 tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> What to Prepare For
                          </span>
                          <ul className="space-y-2.5">
                            {data.prosAndCons.cons.map((con: string, i: number) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/85">
                                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {data.prosAndCons.verdict && (
                        <div className="p-4 rounded-2xl bg-aurora/5 border border-aurora/20 text-xs text-foreground/90">
                          <strong className="text-aurora">Expert Verdict:</strong> &ldquo;{data.prosAndCons.verdict}&rdquo;
                        </div>
                      )}
                    </div>
                  )}

                  {destination.localDelicacy && (
                    <div className="p-5 rounded-2xl bg-card border border-border/80 flex items-center gap-4 hover:border-aurora/40 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-rose/15 flex items-center justify-center shrink-0">
                        <Utensils className="w-5 h-5 text-rose" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-foreground block">Authentic Local Flavor</span>
                        <span className="text-muted-foreground">{destination.localDelicacy}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Tab: Roadmap ─────────────────────────────────────────── */}
              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      Curated Expedition Roadmap
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Day-by-day tactical itinerary designed for immersive discovery, optimal pacing, and unforgettable moments.
                    </p>
                  </div>

                  {/* Day selector pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {data.roadmap.map((r) => (
                      <button
                        key={r.day}
                        onClick={() => setActiveRoadmapDay(r.day)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          activeRoadmapDay === r.day
                            ? 'bg-aurora text-ink-void shadow-md'
                            : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-aurora/40'
                        }`}
                      >
                        Day {r.day}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Card — Vertical Timeline */}
                  {data.roadmap.find((r) => r.day === activeRoadmapDay) && (() => {
                    const day = data.roadmap.find((r) => r.day === activeRoadmapDay)!;
                    return (
                      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-6">
                        <div className="border-b border-border pb-4">
                          <span className="text-xs font-mono font-bold text-aurora uppercase tracking-wider">
                            Day {day.day} • {day.subtitle}
                          </span>
                          <h4 className="font-serif text-2xl font-medium text-foreground mt-1">
                            {day.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-foreground/85 mt-2 leading-relaxed">
                            {day.description}
                          </p>
                        </div>

                        {/* Vertical timeline */}
                        <div className="relative pl-8 space-y-6">
                          {/* Vertical line */}
                          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-500/40 via-aurora/40 to-violet/40 rounded-full" />

                          {/* Morning */}
                          <div className="relative">
                            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500 shadow-sm" />
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-2">
                                <Clock className="w-3 h-3" /> Morning
                              </span>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.morning}</p>
                            </div>
                          </div>

                          {/* Afternoon */}
                          <div className="relative">
                            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-aurora/20 border-2 border-aurora shadow-sm" />
                            <div className="p-4 rounded-2xl bg-aurora/5 border border-aurora/20">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-aurora flex items-center gap-1.5 mb-2">
                                <Clock className="w-3 h-3" /> Afternoon
                              </span>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.afternoon}</p>
                            </div>
                          </div>

                          {/* Evening */}
                          <div className="relative">
                            <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-violet/20 border-2 border-violet shadow-sm" />
                            <div className="p-4 rounded-2xl bg-violet/5 border border-violet/20">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet flex items-center gap-1.5 mb-2">
                                <Clock className="w-3 h-3" /> Evening
                              </span>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.evening}</p>
                            </div>
                          </div>
                        </div>

                        {/* Day metadata */}
                        <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { label: 'Transit Mode', value: day.transitMode, icon: Bus },
                            { label: 'Recommended Stay', value: day.stayRecommendation, icon: Hotel },
                            { label: 'Meal Highlight', value: day.mealHighlight, icon: Utensils },
                          ].map((meta) => (
                            <div key={meta.label} className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-2.5">
                              <meta.icon className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] text-muted-foreground block uppercase font-bold">{meta.label}</span>
                                <span className="font-semibold text-foreground text-xs">{meta.value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* ── Tab: Hotels ──────────────────────────────────────────── */}
              {activeTab === 'hotels' && (
                <motion.div
                  key="hotels"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      Handpicked Stays & Sanctuaries
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Curated accommodations vetted for character, view, location, and authentic hospitality.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.hotels.map((hotel, idx) => (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.06, ease: EASE }}
                        className="relative rounded-3xl bg-card border border-border/80 overflow-hidden group hover:border-aurora/40 transition-all duration-300"
                      >
                        {/* Gradient top accent */}
                        <div className="h-1 bg-gradient-to-r from-aurora via-violet to-aurora" />
                        
                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-aurora/15 text-aurora border border-aurora/30">
                                {hotel.tier}
                              </span>
                              <div className="flex items-center gap-1 text-xs font-mono font-bold text-foreground">
                                <Star className="w-3.5 h-3.5 fill-aurora text-aurora" />
                                <span>{hotel.rating}</span>
                              </div>
                            </div>

                            <h4 className="font-serif text-xl font-medium text-foreground">{hotel.name}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-aurora shrink-0" />
                              {hotel.location}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              {hotel.features.map((f, i) => (
                                <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-foreground/80 font-mono border border-border/60">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-border space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground font-mono">From / night</span>
                              <span className="text-lg font-bold text-aurora font-mono">{formatPrice(hotel.priceUSD)}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-aurora/5 border border-aurora/15 text-[11px] text-muted-foreground">
                              <strong className="text-aurora">Tip:</strong> {hotel.bookingTip}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Tab: Seasons ─────────────────────────────────────────── */}
              {activeTab === 'seasons' && (
                <motion.div
                  key="seasons"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      Seasonality & Weather Intelligence
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Comprehensive climate overview, crowd levels, and 12-month travel matrix.
                    </p>
                  </div>

                  {/* Season Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { ...data.seasonality.peakSeason, type: 'Peak', color: 'emerald' },
                      { ...data.seasonality.shoulderSeason, type: 'Shoulder', color: 'aurora' },
                      { ...data.seasonality.offSeason, type: 'Quiet', color: 'muted' },
                    ].map((season, i) => (
                      <motion.div
                        key={season.type}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08, ease: EASE }}
                        className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 hover:border-aurora/40 transition-colors"
                      >
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                          season.color === 'emerald' ? 'text-emerald-400' : season.color === 'aurora' ? 'text-aurora' : 'text-muted-foreground'
                        }`}>
                          {season.type} Season
                        </span>
                        <h5 className="font-serif text-lg text-foreground font-medium">{season.months}</h5>
                        <p className="text-xs text-foreground/80">{season.weather}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                          <Users className="w-3 h-3" />
                          <span><strong>Crowds:</strong> {season.crowds}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 12-Month Matrix */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <h4 className="font-serif text-lg font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-aurora" />
                      12-Month Traveler Calendar
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                      {data.seasonality.monthlyMatrix.map((m) => (
                        <div key={m.month} className="p-3 rounded-2xl bg-muted/40 border border-border/50 space-y-1.5 hover:border-aurora/30 transition-colors">
                          <div className="flex items-center justify-between font-mono font-bold">
                            <span className="text-foreground">{m.month}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              m.status === 'Peak' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-aurora/10 text-aurora'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> {m.tempC}</span>
                            <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> {m.rainfall}</span>
                          </div>
                          <p className="text-[11px] text-foreground/85 line-clamp-2 pt-0.5">{m.highlights}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Tab: Culinary ────────────────────────────────────────── */}
              {activeTab === 'culinary' && (
                <motion.div
                  key="culinary"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      Gastronomic Lore & Iconic Dishes
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Signature regional recipes, street food culture, and culinary customs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.culinary.signatureDishes.map((dish, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06, ease: EASE }}
                        className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 hover:border-aurora/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose/15 text-rose">
                            {dish.type}
                          </span>
                          <h4 className="font-serif text-lg font-medium text-foreground">{dish.name}</h4>
                          {dish.localName && (
                            <span className="text-xs font-mono text-muted-foreground">({dish.localName})</span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/85 leading-relaxed">{dish.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                      <span className="text-xs font-mono font-bold uppercase text-aurora">Street Food & Dining Tips</span>
                      <p className="text-xs text-foreground/85 leading-relaxed">{data.culinary.streetFoodAdvice}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                      <span className="text-xs font-mono font-bold uppercase text-aurora">Iconic Local Beverage</span>
                      <p className="text-xs text-foreground/85 leading-relaxed">{data.culinary.iconicDrink}</p>
                      <span className="text-[11px] font-mono text-muted-foreground block pt-1">
                        Avg. Daily Food Cost: <strong className="text-aurora">{formatPrice(data.culinary.avgDailyFoodUSD)}</strong>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Tab: FAQ ─────────────────────────────────────────────── */}
              {activeTab === 'faq' && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                      FAQ & Field Guide
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Everything you need to know about visas, health, gear, and cultural etiquette.
                    </p>
                  </div>

                  {/* Accordion FAQ */}
                  <div className="space-y-3">
                    {data.faq.map((faq, i) => (
                      <div key={i} className="rounded-2xl bg-card border border-border/80 overflow-hidden hover:border-aurora/30 transition-colors">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-aurora/15 text-aurora flex items-center justify-center text-xs font-bold shrink-0">Q</span>
                            {faq.question}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${openFaqIndex === i ? 'rotate-180 text-aurora' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openFaqIndex === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-1 text-xs text-foreground/85 leading-relaxed border-t border-border/40 ml-9">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  {/* Packing List */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <h4 className="font-serif text-lg font-medium text-foreground flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-aurora" /> Packing & Gear Essentials
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-mono font-bold text-muted-foreground uppercase text-[10px] block mb-2">Apparel & Footwear</span>
                        <ul className="space-y-1.5">
                          {data.packingList.clothing.map((c, i) => (
                            <li key={i} className="flex items-center gap-2 text-foreground/85">
                              <span className="w-1.5 h-1.5 rounded-full bg-aurora" /> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-muted-foreground uppercase text-[10px] block mb-2">Technical Gear & Optics</span>
                        <ul className="space-y-1.5">
                          {data.packingList.gear.map((g, i) => (
                            <li key={i} className="flex items-center gap-2 text-foreground/85">
                              <span className="w-1.5 h-1.5 rounded-full bg-aurora" /> {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {data.packingList.insiderPackingTip && (
                      <div className="p-3 rounded-xl bg-aurora/5 border border-aurora/15 text-xs text-muted-foreground">
                        <strong className="text-aurora">Insider Tip:</strong> {data.packingList.insiderPackingTip}
                      </div>
                    )}
                  </div>

                  {/* Cultural Etiquette */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <h4 className="font-serif text-lg font-medium text-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-aurora" /> Cultural Lore & Etiquette
                    </h4>
                    <ul className="space-y-2 text-xs text-foreground/85">
                      {data.culturalEtiquette.customs.map((custom, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-aurora/15 text-aurora flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">•</span>
                          <span>{custom}</span>
                        </li>
                      ))}
                    </ul>

                    {data.culturalEtiquette.keyPhrases?.length > 0 && (
                      <div className="pt-3 border-t border-border space-y-2">
                        <span className="font-mono font-bold text-[10px] uppercase text-muted-foreground">Useful Local Phrases</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {data.culturalEtiquette.keyPhrases.map((phrase, i) => (
                            <div key={i} className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs hover:border-aurora/30 transition-colors">
                              <div className="font-bold text-foreground">{phrase.phrase}</div>
                              <div className="text-[11px] text-muted-foreground">{phrase.translation}</div>
                              <div className="text-[10px] text-aurora font-mono italic">/{phrase.pronunciation}/</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Tab: Reviews ──────────────────────────────────────────── */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="space-y-6"
                >
                  {/* Submit review */}
                  <form onSubmit={handleReviewSubmit} className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <h4 className="font-serif text-lg font-medium text-foreground">Leave a Traveler Note</h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-muted-foreground hover:text-aurora transition-colors"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? 'text-aurora fill-aurora' : ''}`} />
                        </button>
                      ))}
                      <span className="text-xs text-muted-foreground ml-2 font-mono">{rating}.0</span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Share your experience, secret paths, or travel tips..."
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-background border border-border text-foreground outline-none resize-none focus:border-aurora focus:ring-1 focus:ring-aurora/30 transition-all"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-mono">
                        {reviewSuccess && <span className="text-emerald-500 font-semibold">✓ Note pinned to dossier!</span>}
                      </span>
                      <Button
                        type="submit"
                        disabled={submittingReview || !reviewContent.trim()}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full px-6 text-xs h-10"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        {submittingReview ? 'Submitting…' : 'Post Note'}
                      </Button>
                    </div>
                  </form>

                  {/* Reviews list — Quote style */}
                  <div className="space-y-4">
                    {(destination.reviews || []).map((r: any, idx: number) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05, ease: EASE }}
                        className="p-5 rounded-2xl bg-card border border-border/70 space-y-3 hover:border-aurora/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-aurora/15 flex items-center justify-center text-aurora font-bold text-xs">
                              {(r.user?.name || 'E')[0]}
                            </div>
                            <div>
                              <span className="font-semibold text-xs text-foreground block">{r.user?.name || 'Explorer'}</span>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                {r.travelerType && (
                                  <span className="px-2 py-0.5 rounded-full bg-aurora/10 text-aurora font-medium border border-aurora/20">
                                    {r.travelerType}
                                  </span>
                                )}
                                <span className="font-mono">
                                  {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-aurora text-xs">
                            {Array.from({ length: r.rating }, (_, i) => (
                              <Star key={i} className="w-3 h-3 fill-aurora" />
                            ))}
                          </div>
                        </div>
                        <div className="relative pl-4 border-l-2 border-aurora/30">
                          <p className="text-xs text-foreground/85 leading-relaxed italic">
                            &ldquo;{r.content}&rdquo;
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ Gallery Tab ═══════════════════════════ */}
              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-6"
                >
                  {/* Upload area */}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="relative border-2 border-dashed border-border/60 hover:border-aurora/40 rounded-2xl p-8 text-center cursor-pointer transition-all group bg-muted/30 hover:bg-muted/50"
                  >
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const newItem: GalleryItem = {
                              id: Date.now().toString() + Math.random(),
                              type: file.type.startsWith('video') ? 'video' : 'photo',
                              url: ev.target?.result as string,
                              caption: file.name.replace(/\.[^.]+$/, ''),
                              author: 'You',
                              date: 'Just now',
                            };
                            setGalleryItems(prev => [newItem, ...prev]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-aurora/10 border border-aurora/20 flex items-center justify-center group-hover:bg-aurora/20 transition-colors">
                        <Upload className="w-6 h-6 text-aurora" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Share your moments</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Upload photos or videos · Horizontal 16:9 recommended</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery counter */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{galleryItems.length}</span> traveller moments shared
                    </p>
                    <div className="flex gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground">
                        <ImageIcon className="w-3 h-3" /> {galleryItems.filter(i => i.type === 'photo').length}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground">
                        <Play className="w-3 h-3" /> {galleryItems.filter(i => i.type === 'video').length}
                      </span>
                    </div>
                  </div>

                  {/* Masonry grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className={`group/card relative rounded-xl overflow-hidden bg-muted border border-border/40 hover:border-aurora/30 transition-all cursor-pointer ${
                          idx === 0 ? 'col-span-2 row-span-2' : ''
                        }`}
                      >
                        <div className={`relative ${idx === 0 ? 'aspect-[16/9]' : 'aspect-[16/10]'} overflow-hidden`}>
                          <img
                            src={item.url}
                            alt={item.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

                          {/* Video play indicator */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                <Play className="w-4 h-4 text-ink-void ml-0.5" />
                              </div>
                            </div>
                          )}

                          {/* Hover caption */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                            <p className="text-white text-xs font-medium truncate">{item.caption}</p>
                            <p className="text-white/60 text-[10px] mt-0.5">{item.author} · {item.date}</p>
                          </div>

                          {/* Type badge */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px]">
                              {item.type === 'video' ? <Play className="w-2.5 h-2.5" /> : <Camera className="w-2.5 h-2.5" />}
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right Col: Sticky Sidebar ────────────────────────────────── */}
          <div className="space-y-6">
            <div className="relative p-6 rounded-3xl bg-card border border-border/80 shadow-cast space-y-5 sticky top-24 overflow-hidden">
              <BorderBeam
                size={180}
                duration={12}
                colorFrom="hsl(var(--aurora))"
                colorTo="hsl(var(--violet))"
                borderWidth={1.5}
              />

              <div className="relative z-10">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Plan Expedition
                </h3>

                {/* Quick facts */}
                <div className="space-y-3 text-xs font-mono mb-5">
                  {[
                    { label: 'Est. Land Cost', value: formatPrice(destination.budgetUSD || 850), highlight: true },
                    { label: 'Departure City', value: userOrigin.split(',')[0], highlight: false },
                    { label: 'Best Season', value: (destination.bestTimeToVisit || destination.bestSeason)?.split('(')[0]?.trim(), highlight: false },
                    { label: 'Elevation', value: destination.elevation || 'Sea level', highlight: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/60">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className={`font-semibold ${item.highlight ? 'text-aurora font-bold' : 'text-foreground'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <Button
                    onClick={() => setShowBudgetModal(true)}
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-full shadow-md text-xs py-5 transition-all active:scale-[0.98]"
                  >
                    <Calculator className="w-4 h-4 mr-1.5" />
                    Calculate AI Budget
                  </Button>

                  <Link href={`/globe?destination=${destination.id}`} className="block">
                    <Button
                      className="w-full border border-aurora/40 bg-aurora/10 hover:bg-aurora text-aurora hover:text-ink-void text-xs font-bold rounded-full py-5 transition-all active:scale-[0.98]"
                    >
                      <Globe className="w-4 h-4 mr-1.5" />
                      Explore on 3D Earth
                    </Button>
                  </Link>

                  <Link href={`/trip-planner?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`} className="block pt-1">
                    <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground gap-1.5">
                      Open in Trip Planner
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── 3D Earth Modal ─────────────────────────────────────────────────── */}
      {showGlobe && (
        <DestinationGlobeModal
          destination={destination}
          userLocationName={userOrigin}
          onClose={() => setShowGlobe(false)}
        />
      )}

      {/* ── AI Budget Estimator Modal ─────────────────────────────────────── */}
      {showBudgetModal && (
        <AIBudgetEstimatorModal
          destination={destination}
          initialOrigin={userOrigin}
          onClose={() => setShowBudgetModal(false)}
          onSaveOrigin={(newOrigin) => setUserOrigin(newOrigin)}
        />
      )}
    </div>
  );
}
