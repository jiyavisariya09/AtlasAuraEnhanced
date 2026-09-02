'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Star, Calendar, DollarSign, ShieldCheck, Utensils, 
  Compass, ChevronLeft, Heart, Share2, Sparkles, MessageSquare, 
  ThumbsUp, Check, AlertCircle, Globe, Award, Bus, Send, Plus, 
  Calculator, Plane, Mountain, Hotel, CloudSun, HelpCircle,
  ThumbsDown, ChevronDown, CheckCircle2, Luggage, Coffee, BookOpen, Clock
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

const DestinationGlobeModal = dynamic(
  () => import('@/components/DestinationGlobeModal'),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

type ActiveTab = 'overview' | 'roadmap' | 'hotels' | 'seasons' | 'culinary' | 'faq' | 'reviews';

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-aurora border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-muted-foreground animate-pulse">Loading destination dossier...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <Compass className="w-12 h-12 text-muted-foreground mb-3" />
        <h2 className="font-serif text-3xl font-medium mb-2">Destination Dossier Not Found</h2>
        <p className="text-xs text-muted-foreground mb-6">
          The coordinates or catalog entry could not be retrieved.
        </p>
        <Link href="/destinations">
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full px-6 text-xs">
            <ChevronLeft className="w-4 h-4 mr-1" /> Return to Destinations Explorer
          </Button>
        </Link>
      </div>
    );
  }

  const data = enriched || getEnrichedDestinationData(destination);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="glass-bar sticky top-0 z-40 border-b border-border/80">
        <div className="shell h-16 flex items-center justify-between gap-4">
          <Link href="/destinations" className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Destinations
          </Link>

          <div className="flex items-center gap-3">
            <CurrencySelector />
            <ThemeToggle compact />
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full border transition-all ${
                isSaved
                  ? 'bg-rose/15 border-rose text-rose shadow-sm'
                  : 'border-border bg-card/60 text-muted-foreground hover:text-foreground'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose text-rose' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative min-h-[520px] sm:min-h-[580px] w-full overflow-hidden bg-black flex flex-col justify-end pb-8">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25" />

        <div className="relative shell z-10 flex flex-col justify-end space-y-6 pt-24">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-aurora text-ink-void shadow-md">
                {destination.region}
              </span>
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/65 backdrop-blur-md text-aurora border border-white/20 shadow-md">
                <Star className="w-3.5 h-3.5 fill-aurora text-aurora" />
                <span className="text-white">{destination.rating} <span className="text-white/60">/ 5.0</span></span>
              </div>
              {destination.elevation && (
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-black/65 backdrop-blur-md text-white border border-white/20 shadow-md">
                  ⛰️ {destination.elevation}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight drop-shadow-md">
              {destination.name}
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-3xl leading-relaxed drop-shadow-sm font-normal">
              {destination.description}
            </p>

            {/* Quick Feature Trigger Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={`/globe?destination=${destination.id}`}>
                <Button
                  className="rounded-full bg-aurora hover:bg-aurora-glow text-ink-void font-bold text-xs gap-2 px-6 py-4 shadow-lg transition-all active:scale-95"
                >
                  <Globe className="w-4 h-4" />
                  Explore on 3D Earth
                </Button>
              </Link>

              <Button
                onClick={() => setShowBudgetModal(true)}
                className="rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/30 text-white text-xs font-semibold gap-2 px-6 py-4 shadow-lg transition-all active:scale-95"
              >
                <Calculator className="w-4 h-4 text-aurora" />
                AI Location Budget ({userOrigin.split(',')[0]})
              </Button>
            </div>
          </div>

          {/* Integrated Telemetry Strip */}
          <div className="pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Base 7-Day Land Cost</span>
              <span className="text-base sm:text-lg font-bold text-aurora">{formatPrice(destination.budgetUSD || 850)}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Best Visiting Season</span>
              <span className="text-white font-semibold text-xs sm:text-sm">{destination.bestTimeToVisit || destination.bestSeason}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Safety Score</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs sm:text-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> {destination.safetyScore || 4.9} / 5.0
              </span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Coordinates</span>
              <span className="text-white/90 font-mono text-xs">
                {destination.coordinates?.lat ? `${destination.coordinates.lat.toFixed(2)}°N, ${destination.coordinates.lng.toFixed(2)}°E` : 'Global'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-1 shell py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Tabs & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Responsive Tab Bar */}
            <div className="flex items-center gap-3 sm:gap-6 border-b border-border text-[11px] sm:text-xs font-mono uppercase tracking-wider pb-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 ${
                  activeTab === 'overview'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'roadmap'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Roadmap & Itinerary
              </button>
              <button
                onClick={() => setActiveTab('hotels')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'hotels'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Hotel className="w-3.5 h-3.5" /> Hotels & Stays
              </button>
              <button
                onClick={() => setActiveTab('seasons')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'seasons'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CloudSun className="w-3.5 h-3.5" /> Best Time
              </button>
              <button
                onClick={() => setActiveTab('culinary')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'culinary'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" /> Food & Dining
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'faq'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> FAQ & Guide
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`whitespace-nowrap transition-colors font-bold pb-3 -mb-3 flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'text-aurora border-b-2 border-aurora'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Stories ({destination.reviews?.length || 2})
              </button>
            </div>

            {/* Tab 1: Overview & Highlights */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                    Atmospheric Essence
                  </h3>
                  <p className="text-sm sm:text-base text-foreground/85 leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                {/* Highlights List */}
                {destination.highlights && destination.highlights.length > 0 && (
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-aurora" />
                      Must-Experience Waypoints
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {destination.highlights.map((h: string, i: number) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                          <span className="w-2 h-2 rounded-full bg-aurora shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Honest Pros & Cons Assessment Matrix */}
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
                              <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
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
                              <span className="w-4 h-4 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">!</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {data.prosAndCons.verdict && (
                      <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 text-xs text-foreground/90 italic">
                        <strong>Expert Verdict:</strong> &ldquo;{data.prosAndCons.verdict}&rdquo;
                      </div>
                    )}
                  </div>
                )}

                {destination.localDelicacy && (
                  <div className="p-5 rounded-2xl bg-card border border-border/80 flex items-center gap-3">
                    <Utensils className="w-5 h-5 text-rose shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-foreground block">Authentic Local Flavor</span>
                      <span className="text-muted-foreground">{destination.localDelicacy}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Expedition Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                    Curated Expedition Roadmap
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Day-by-day tactical itinerary designed for immersive discovery, optimal pacing, and unforgettable moments.
                  </p>
                </div>

                {/* Day selector tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {data.roadmap.map((r) => (
                    <button
                      key={r.day}
                      onClick={() => setActiveRoadmapDay(r.day)}
                      className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                        activeRoadmapDay === r.day
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Day {r.day}
                    </button>
                  ))}
                </div>

                {/* Active Day Card */}
                {data.roadmap.find((r) => r.day === activeRoadmapDay) && (() => {
                  const day = data.roadmap.find((r) => r.day === activeRoadmapDay)!;
                  return (
                    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-cast space-y-6">
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

                      {/* Day Breakdown: Morning, Afternoon, Evening */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                            MORNING
                          </span>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.morning}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-aurora/15 text-aurora font-mono text-[10px] font-bold shrink-0 mt-0.5">
                            AFTERNOON
                          </span>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.afternoon}</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-md bg-violet/15 text-violet font-mono text-[10px] font-bold shrink-0 mt-0.5">
                            EVENING
                          </span>
                          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{day.evening}</p>
                        </div>
                      </div>

                      {/* Day Metadata footer */}
                      <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-muted/60">
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">Transit Mode</span>
                          <span className="font-semibold text-foreground">{day.transitMode}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/60">
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">Recommended Stay</span>
                          <span className="font-semibold text-foreground">{day.stayRecommendation}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/60">
                          <span className="text-[10px] text-muted-foreground block uppercase font-bold">Meal Highlight</span>
                          <span className="font-semibold text-foreground">{day.mealHighlight}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tab 3: Hotels & Stays */}
            {activeTab === 'hotels' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                    Handpicked Stays & Sanctuaries
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Curated accommodations vetted for character, view, location, and authentic hospitality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.hotels.map((hotel) => (
                    <div key={hotel.id} className="p-6 rounded-3xl bg-card border border-border/80 shadow-cast flex flex-col justify-between space-y-4">
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

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {hotel.features.map((f, i) => (
                            <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-foreground/80 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-mono">From / night</span>
                          <span className="text-base font-bold text-aurora font-mono">{formatPrice(hotel.priceUSD)}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-muted/50 text-[11px] text-muted-foreground italic">
                          <strong>Tip:</strong> {hotel.bookingTip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Best Time & Seasons */}
            {activeTab === 'seasons' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                    Seasonality & Weather Intelligence
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Comprehensive climate overview, crowd levels, and 12-month travel matrix.
                  </p>
                </div>

                {/* 3 Season Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Peak Season</span>
                    <h5 className="font-serif text-lg text-foreground font-medium">{data.seasonality.peakSeason.months}</h5>
                    <p className="text-xs text-foreground/80">{data.seasonality.peakSeason.weather}</p>
                    <p className="text-[11px] text-muted-foreground"><strong>Crowds:</strong> {data.seasonality.peakSeason.crowds}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-aurora">Shoulder Season</span>
                    <h5 className="font-serif text-lg text-foreground font-medium">{data.seasonality.shoulderSeason.months}</h5>
                    <p className="text-xs text-foreground/80">{data.seasonality.shoulderSeason.weather}</p>
                    <p className="text-[11px] text-muted-foreground"><strong>Crowds:</strong> {data.seasonality.shoulderSeason.crowds}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Quiet Season</span>
                    <h5 className="font-serif text-lg text-foreground font-medium">{data.seasonality.offSeason.months}</h5>
                    <p className="text-xs text-foreground/80">{data.seasonality.offSeason.weather}</p>
                    <p className="text-[11px] text-muted-foreground"><strong>Crowds:</strong> {data.seasonality.offSeason.crowds}</p>
                  </div>
                </div>

                {/* 12-Month Matrix */}
                <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-foreground">12-Month Traveler Calendar</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                    {data.seasonality.monthlyMatrix.map((m) => (
                      <div key={m.month} className="p-3 rounded-2xl bg-muted/60 border border-border/50 space-y-1">
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span className="text-foreground">{m.month}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            m.status === 'Peak' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-aurora/10 text-aurora'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">🌡️ {m.tempC}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">🌧️ {m.rainfall}</div>
                        <p className="text-[11px] text-foreground/85 line-clamp-2 pt-1">{m.highlights}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Food & Culinary */}
            {activeTab === 'culinary' && (
              <div className="space-y-6">
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
                    <div key={i} className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose/15 text-rose">
                            {dish.type}
                          </span>
                          <h4 className="font-serif text-lg font-medium text-foreground">{dish.name}</h4>
                          {dish.localName && (
                            <span className="text-xs font-mono text-muted-foreground">({dish.localName})</span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/85 leading-relaxed">{dish.description}</p>
                      </div>
                    </div>
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
                      Avg. Daily Food Cost: <strong>{formatPrice(data.culinary.avgDailyFoodUSD)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: FAQ & Essential Guide */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                    Frequently Asked Questions & Field Guide
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Everything you need to know about visas, health, gear, and cultural etiquette.
                  </p>
                </div>

                {/* Accordion FAQ */}
                <div className="space-y-3">
                  {data.faq.map((faq, i) => (
                    <div key={i} className="rounded-2xl bg-card border border-border/80 overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-aurora/15 text-aurora flex items-center justify-center text-xs font-bold shrink-0">Q</span>
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openFaqIndex === i ? 'rotate-180 text-aurora' : ''}`} />
                      </button>
                      {openFaqIndex === i && (
                        <div className="px-5 pb-5 pt-1 text-xs text-foreground/85 leading-relaxed border-t border-border/40">
                          {faq.answer}
                        </div>
                      )}
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
                    <div className="p-3 rounded-xl bg-muted/60 text-xs text-muted-foreground italic">
                      <strong>Insider Tip:</strong> {data.packingList.insiderPackingTip}
                    </div>
                  )}
                </div>

                {/* Cultural Etiquette & Key Phrases */}
                <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                  <h4 className="font-serif text-lg font-medium text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-aurora" /> Cultural Lore & Etiquette
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/85">
                    {data.culturalEtiquette.customs.map((custom, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-aurora/15 text-aurora flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">•</span>
                        <span>{custom}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Useful Phrases */}
                  {data.culturalEtiquette.keyPhrases?.length > 0 && (
                    <div className="pt-3 border-t border-border space-y-2">
                      <span className="font-mono font-bold text-[10px] uppercase text-muted-foreground">Useful Local Phrases</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {data.culturalEtiquette.keyPhrases.map((phrase, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-muted/50 text-xs">
                            <div className="font-bold text-foreground">{phrase.phrase}</div>
                            <div className="text-[11px] text-muted-foreground">{phrase.translation}</div>
                            <div className="text-[10px] text-aurora font-mono italic">/{phrase.pronunciation}/</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 7: Traveler Stories & Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit review */}
                <form onSubmit={handleReviewSubmit} className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Leave a Traveler Note</h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-muted-foreground hover:text-aurora"
                      >
                        <Star className={`w-4 h-4 ${star <= rating ? 'text-aurora fill-aurora' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your experience, secret paths, or travel tips..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-background border border-border text-foreground outline-none resize-none focus:border-aurora"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">
                      {reviewSuccess && <span className="text-emerald-500 font-semibold">✓ Note pinned to dossier!</span>}
                    </span>
                    <Button
                      type="submit"
                      disabled={submittingReview || !reviewContent.trim()}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full px-5 text-xs h-9"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Traveler Note'}
                    </Button>
                  </div>
                </form>

                {/* Reviews list */}
                <div className="space-y-3">
                  {(destination.reviews || []).map((r: any) => (
                    <div key={r.id} className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">{r.user?.name || 'Explorer'}</span>
                          {r.travelerType && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-aurora/10 text-aurora font-medium border border-aurora/20">
                              {r.travelerType}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-aurora text-xs">
                          <Star className="w-3 h-3 fill-aurora" />
                          <span className="font-mono">{r.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">&ldquo;{r.content}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Quick Actions & Trip Planner Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-cast space-y-5 sticky top-24">
              <h3 className="font-serif text-xl font-medium text-foreground">
                Plan Expedition
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Est. Land Cost</span>
                  <span className="font-bold text-aurora">{formatPrice(destination.budgetUSD || 850)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Departure City</span>
                  <span className="font-semibold text-foreground">{userOrigin.split(',')[0]}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-full shadow-md text-xs py-5 transition-all active:scale-98"
                >
                  <Calculator className="w-4 h-4 mr-1.5 text-aurora" />
                  Calculate AI Budget
                </Button>

                <Link href={`/globe?destination=${destination.id}`} className="block">
                  <Button
                    className="w-full border border-aurora/40 bg-aurora/10 hover:bg-aurora text-aurora hover:text-ink-void text-xs font-bold rounded-full py-5 transition-all active:scale-98"
                  >
                    <Globe className="w-4 h-4 mr-1.5" />
                    Explore on 3D Earth
                  </Button>
                </Link>

                <Link href={`/trip-planner?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}`} className="block pt-2">
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground">
                    Open in Trip Planner →
                  </Button>
                </Link>
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

