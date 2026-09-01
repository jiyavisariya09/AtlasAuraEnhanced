'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Star, Calendar, DollarSign, ShieldCheck, Utensils, 
  Compass, ChevronLeft, Heart, Share2, Sparkles, MessageSquare, 
  ThumbsUp, Check, AlertCircle, Globe, Award, Bus, Send, Plus, 
  Calculator, Plane, Mountain
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import AIBudgetEstimatorModal from '@/components/AIBudgetEstimatorModal';
import { DESTINATIONS, type DestinationItem } from '@/data/destinationsData';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

const DestinationGlobeModal = dynamic(
  () => import('@/components/DestinationGlobeModal'),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const destinationId = params?.id as string;

  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const isDark = theme === 'dark';

  const [destination, setDestination] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'food' | 'reviews'>('overview');

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

    // 1. Check local rich dataset first
    const matched = DESTINATIONS.find(
      (d) => d.id === destinationId || d.name.toLowerCase().includes(destinationId.toLowerCase())
    );

    if (matched) {
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
      // 2. Fetch from backend API
      fetch(`/api/destinations/${destinationId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Destination not found');
          return res.json();
        })
        .then((data) => {
          setDestination(data.destination);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Check wishlist state
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
      const res = await fetch('/api/reviews', {
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

      {/* Hero Banner Section — Seamless Cinematic Hero & Integrated Telemetry (No Harsh Background Dividing Bar) */}
      <section className="relative min-h-[560px] w-full overflow-hidden bg-black flex flex-col justify-end pb-8">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

        <div className="relative shell z-10 flex flex-col justify-end space-y-6 pt-28">
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

            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight drop-shadow-md">
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

          {/* Integrated Seamless Telemetry Strip (NO harsh solid background bar!) */}
          <div className="pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Base 7-Day Land Cost</span>
              <span className="text-lg font-bold text-aurora">{formatPrice(destination.budgetUSD || 850)}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Best Visiting Season</span>
              <span className="text-white font-semibold">{destination.bestTimeToVisit || destination.bestSeason}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Safety Score</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {destination.safetyScore || 4.9} / 5.0
              </span>
            </div>
            <div>
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Coordinates</span>
              <span className="text-white/90 font-mono">
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
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-border text-xs font-mono uppercase tracking-wider pb-3">
              <button
                onClick={() => setActiveTab('overview')}
                className={`transition-colors font-bold ${
                  activeTab === 'overview'
                    ? 'text-aurora border-b-2 border-aurora pb-3 -mb-3'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview & Highlights
              </button>
              <button
                onClick={() => setActiveTab('culture')}
                className={`transition-colors font-bold ${
                  activeTab === 'culture'
                    ? 'text-aurora border-b-2 border-aurora pb-3 -mb-3'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Culture & Heritage
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`transition-colors font-bold ${
                  activeTab === 'reviews'
                    ? 'text-aurora border-b-2 border-aurora pb-3 -mb-3'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Traveler Stories ({destination.reviews?.length || 2})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                    Atmospheric Essence
                  </h3>
                  <p className="text-sm text-foreground/85 leading-relaxed">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {destination.highlights.map((h: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-foreground/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-aurora shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
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

            {/* Tab: Culture */}
            {activeTab === 'culture' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                  <h3 className="font-serif text-2xl font-medium text-foreground">
                    Cultural Lore & Heritage
                  </h3>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {destination.culturalInfo?.history || destination.culture}
                  </p>

                  <div className="pt-4 border-t border-border space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                      Traveler Etiquette
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {destination.culturalInfo?.etiquette || 'Respect local customs, environmental balance, and sanctuary spaces.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
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
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-cast space-y-5">
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
