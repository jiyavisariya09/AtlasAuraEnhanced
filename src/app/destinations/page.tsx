'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MapPin, Heart, Search, Star, 
  Compass, Calculator, ArrowRight, Plane, Sparkles, 
  Mountain, Trees, Sun, Landmark, Waves, Snowflake, Check, Settings,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { DESTINATIONS, type DestinationItem } from '@/data/destinationsData';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/components/ThemeToggle';
import CurrencySelector from '@/components/CurrencySelector';
import AIBudgetEstimatorModal from '@/components/AIBudgetEstimatorModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DestinationGlobeModal = dynamic(
  () => import('@/components/DestinationGlobeModal'),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

const REGIONS = ['All', 'Asia', 'Europe', 'Americas', 'Middle East', 'Oceania'];

const VIBES = [
  { id: 'all', label: 'All Vibes', icon: Compass },
  { id: 'mountain', label: 'Mountains & Peaks', icon: Mountain },
  { id: 'coastal', label: 'Coastal & Coral', icon: Waves },
  { id: 'spiritual', label: 'Spiritual & Zen', icon: Sun },
  { id: 'cultural', label: 'Ancient Heritage', icon: Landmark },
  { id: 'adventure', label: 'Wild Adventure', icon: Trees },
  { id: 'polar', label: 'Arctic & Aurora', icon: Snowflake },
];

const BUDGET_TIERS = [
  { id: 'all', label: 'All Budgets', desc: 'Any price range' },
  { id: 'backpacker', label: 'Backpacker (<$700)', desc: 'Hostels, local trains & street cuisine' },
  { id: 'explorer', label: 'Explorer ($700 - $1,300)', desc: 'Boutique stays, alpine huts & curated tours' },
  { id: 'luxury', label: 'Luxury ($1,300+)', desc: 'Overwater villas, private helicopters & fine dining' },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended', desc: 'Curated editorial balance' },
  { id: 'rating', label: 'Highest Rated ⭐', desc: '4.9+ explorer reviews' },
  { id: 'budget-asc', label: 'Lowest Land Cost 💰', desc: 'Most affordable 7-day budget' },
  { id: 'budget-desc', label: 'Premium & Luxury 💎', desc: 'Exclusive high-end expeditions' },
];

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

/* ── Budget tier gradient map ────────────────────────────────────────── */
const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  backpacker: { bg: 'from-emerald-500/80 to-teal-600/80', text: 'text-white', label: '🎒 Backpacker' },
  explorer:   { bg: 'from-violet-500/80 to-indigo-600/80', text: 'text-white', label: '🧭 Explorer' },
  luxury:     { bg: 'from-amber-400/80 to-orange-500/80', text: 'text-white', label: '💎 Luxury' },
};

/* ── Stagger animation variants ──────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: EASE,
    },
  }),
};

export default function DestinationsPage() {
  const { theme } = useTheme();
  const { formatPrice } = useCurrency();
  const gridTopRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userOrigin, setUserOrigin] = useState('Mumbai, India');

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals state
  const [globeDestination, setGlobeDestination] = useState<DestinationItem | null>(null);
  const [budgetDestination, setBudgetDestination] = useState<DestinationItem | null>(null);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedRegion !== 'All') count++;
    if (selectedVibe !== 'all') count++;
    if (selectedBudgetTier !== 'all') count++;
    if (showFavoritesOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedRegion, selectedVibe, selectedBudgetTier, showFavoritesOnly, searchQuery]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedVibe('all');
    setSelectedBudgetTier('all');
    setShowFavoritesOnly(false);
    setSortBy('recommended');
  };

  // Load favorites & origin from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('atlasaura-favorite-destinations');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedPrefs = localStorage.getItem('atlasaura-preferences');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.homeLocation) setUserOrigin(parsed.homeLocation);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, selectedVibe, selectedBudgetTier, sortBy, showFavoritesOnly, itemsPerPage]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('atlasaura-favorite-destinations', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const handleSaveOrigin = (newOrigin: string) => {
    setUserOrigin(newOrigin);
    try {
      const current = JSON.parse(localStorage.getItem('atlasaura-preferences') || '{}');
      localStorage.setItem('atlasaura-preferences', JSON.stringify({ ...current, homeLocation: newOrigin }));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered & Sorted List
  const filteredDestinations = useMemo(() => {
    const list = DESTINATIONS.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = selectedRegion === 'All' || item.region === selectedRegion;
      const matchesVibe = selectedVibe === 'all' || item.category === selectedVibe;
      const matchesBudget = selectedBudgetTier === 'all' || item.budgetTier === selectedBudgetTier;
      const matchesFav = !showFavoritesOnly || favorites.includes(item.id);

      return matchesSearch && matchesRegion && matchesVibe && matchesBudget && matchesFav;
    });

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'budget-asc') {
      list.sort((a, b) => a.budgetUSD - b.budgetUSD);
    } else if (sortBy === 'budget-desc') {
      list.sort((a, b) => b.budgetUSD - a.budgetUSD);
    }

    return list;
  }, [searchQuery, selectedRegion, selectedVibe, selectedBudgetTier, sortBy, showFavoritesOnly, favorites]);

  // Paginated Slices
  const totalItems = filteredDestinations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedDestinations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDestinations.slice(start, start + itemsPerPage);
  }, [filteredDestinations, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <header className="glass-bar sticky top-0 z-40 border-b border-border/80">
        <div className="shell flex h-16 items-center justify-between gap-4">
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
              <Link href="/dashboard" className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                Dashboard
              </Link>
              <Link href="/trip-planner" className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                Trip Planner
              </Link>
              <Link href="/destinations" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-aurora/15 text-aurora border border-aurora/30">
                Explore Destinations
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <CurrencySelector />
            <ThemeToggle compact />
            <Link href="/settings" className="p-2 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Body Content ─────────────────────────────────────────────── */}
      <main className="flex-1 pb-24">
        {/* ── Cinematic Page Hero ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
          {/* Aurora wash background */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-aurora/8 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] rounded-full bg-violet/6 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] rounded-full bg-aurora/4 blur-[150px]" />
          </div>

          <div className="shell">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora/10 border border-aurora/20 text-aurora text-xs uppercase tracking-widest font-bold mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </motion.div>
                  <span>Curated World Sanctuaries</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-foreground tracking-tight leading-[1.1]">
                  Find Your Next
                  <br />
                  <span className="bg-gradient-to-r from-aurora to-violet bg-clip-text text-transparent">
                    World Expedition
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-2xl text-sm sm:text-base mt-4 leading-relaxed font-normal">
                  Explore hidden sanctuaries, high-altitude lakes, and untouched archipelagos with real-time 3D Earth positioning and AI-powered trip budget models.
                </p>
              </motion.div>

              {/* User Origin Quick Indicator */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl glass border border-border/60 shadow-cast"
              >
                <div className="w-9 h-9 rounded-full bg-aurora/15 flex items-center justify-center">
                  <Plane className="w-4 h-4 text-aurora" />
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Departure City</span>
                  <span className="font-semibold text-foreground">{userOrigin}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Search, Filters & Controls ───────────────────────────────────── */}
        <div className="shell space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
            className="flex flex-col md:flex-row gap-3 items-center justify-between"
          >
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search destination, country, or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-12 rounded-2xl bg-card border-border text-xs sm:text-sm text-foreground shadow-sm focus:border-aurora focus:ring-1 focus:ring-aurora/30 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <Button
                onClick={() => setShowFilterModal(true)}
                className={`h-12 px-5 rounded-2xl border font-semibold text-xs gap-2 transition-all shadow-sm active:scale-95 ${
                  activeFilterCount > 0
                    ? 'bg-aurora/15 border-aurora text-aurora hover:bg-aurora hover:text-ink-void font-bold shadow-md'
                    : 'bg-card border-border hover:bg-muted text-foreground'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-aurora text-ink-void text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`h-12 px-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  showFavoritesOnly
                    ? 'bg-rose-500/15 border-rose-500 text-rose-500 font-bold shadow-sm'
                    : 'bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">Favorites ({favorites.length})</span>
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAllFilters}
                  className="h-12 px-4 rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  title="Clear all active filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* ── Inline Region Pills ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedRegion === region
                    ? 'bg-aurora text-ink-void shadow-md scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-aurora/40'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Active Filter Chips Strip */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] uppercase font-bold text-muted-foreground">Active:</span>

              {selectedRegion !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora border border-aurora/30 font-medium text-xs">
                  <span>{selectedRegion}</span>
                  <button onClick={() => setSelectedRegion('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedVibe !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora border border-aurora/30 font-medium text-xs">
                  <span>{VIBES.find(v => v.id === selectedVibe)?.label}</span>
                  <button onClick={() => setSelectedVibe('all')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedBudgetTier !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/15 text-violet border border-violet/30 font-medium text-xs">
                  <span>{BUDGET_TIERS.find(b => b.id === selectedBudgetTier)?.label}</span>
                  <button onClick={() => setSelectedBudgetTier('all')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {showFavoritesOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/30 font-medium text-xs">
                  <span>Favorites Only</span>
                  <button onClick={() => setShowFavoritesOnly(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-foreground border border-border font-medium text-xs">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-500"><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-500 hover:underline font-semibold ml-2"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Results Counter & Items-Per-Page Selector */}
          <div ref={gridTopRef} className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{paginatedDestinations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} – {Math.min(currentPage * itemsPerPage, totalItems)}</strong> of <strong className="text-foreground">{totalItems}</strong> destinations
            </span>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Per page:</span>
              <div className="flex items-center gap-1">
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <button
                    key={num}
                    onClick={() => setItemsPerPage(num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      itemsPerPage === num
                        ? 'bg-aurora text-ink-void font-bold shadow-sm'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Magazine Editorial Cards Grid ─────────────────────────────────── */}
          {paginatedDestinations.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-card/50 border border-border space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Compass className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground">No destinations match</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Try clearing your search terms, switching regions, or toggling off favorites.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                  setSelectedVibe('all');
                  setShowFavoritesOnly(false);
                }}
                className="text-xs rounded-full border-border mt-2"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDestinations.map((dest, index) => {
                const isFav = favorites.includes(dest.id);
                const tierStyle = TIER_STYLES[dest.budgetTier] || TIER_STYLES.explorer;

                return (
                  <motion.div
                    key={dest.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="group"
                  >
                    <Link href={`/destinations/${dest.id}`} className="block">
                      <div className="relative rounded-[1.25rem] overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-aurora/40 transition-all duration-500 cursor-pointer">
                        
                        {/* ── Image Section ─────────────────────────────────── */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05]"
                            loading="lazy"
                            decoding="async"
                          />

                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

                          {/* Top badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gradient-to-r ${tierStyle.bg} ${tierStyle.text} backdrop-blur-sm shadow-lg`}>
                              {tierStyle.label}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(dest.id, e)}
                              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                              className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-lg ${
                                isFav
                                  ? 'bg-rose-500 text-white border border-rose-400'
                                  : 'bg-black/40 border border-white/25 text-white/90 hover:text-rose-400 hover:bg-black/60'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                            </button>
                          </div>

                          {/* Rating badge */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-lg z-10">
                            <Star className="w-3.5 h-3.5 text-aurora fill-aurora" />
                            <span className="text-white text-sm font-medium">{dest.rating}</span>
                            <span className="text-white/50 text-[11px]">({dest.reviewCount || 128})</span>
                          </div>
                        </div>

                        {/* ── Card Body ─────────────────────────────────────── */}
                        <div className="p-4 space-y-2.5">
                          {/* Destination name */}
                          <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground tracking-tight leading-snug group-hover:text-aurora transition-colors duration-300">
                            {dest.name}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-aurora shrink-0" />
                            <span>{dest.country} · {dest.region}</span>
                          </div>

                          {/* Highlights */}
                          <div className="flex flex-wrap gap-1.5">
                            {dest.highlights.slice(0, 2).map((h, i) => (
                              <span
                                key={i}
                                className="text-[11px] rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground border border-border/50"
                              >
                                {h}
                              </span>
                            ))}
                          </div>

                          {/* Price strip */}
                          <div className="flex items-end justify-between pt-2.5 border-t border-border/50">
                            <div>
                              <span className="text-[10px] uppercase text-muted-foreground block tracking-wider">Est. 7-Day</span>
                              <span className="text-aurora font-semibold text-lg font-mono">
                                {formatPrice(dest.budgetUSD)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setBudgetDestination(dest);
                              }}
                              className="p-2 rounded-lg bg-muted/60 border border-border/60 text-muted-foreground hover:text-aurora hover:border-aurora/30 transition-all"
                              title="AI Budget Calculator"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Pagination Controls ──────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="pt-10 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full h-9 px-3 text-xs border-border disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first, last, current, and neighbors
                    if (totalPages <= 7) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <span key={page} className="flex items-center gap-1">
                        {showEllipsis && <span className="text-muted-foreground text-xs px-1">…</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                            currentPage === page
                              ? 'bg-aurora text-ink-void shadow-md scale-105'
                              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-aurora/40'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-9 px-3 text-xs border-border disabled:opacity-40"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── 5XL Expedition Filters Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showFilterModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-card border border-border/80 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-border/80 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora text-[10px] uppercase font-bold mb-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Expedition Discovery Filters</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-foreground tracking-tight">Filter Sanctuaries</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Filter by continent, landscape vibe, budget tier, and sorting order.</p>
                </div>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
                {/* Section 1: Continents & Regions */}
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-3">1. Continent / Region</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {REGIONS.map((region) => {
                      const isSelected = selectedRegion === region;
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setSelectedRegion(region)}
                          className={`p-3.5 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-aurora text-ink-void border-aurora font-bold shadow-md scale-105'
                              : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                          }`}
                        >
                          <span className="text-xs block font-medium">{region}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Landscapes & Terrains */}
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-3">2. Landscape & Vibe</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {VIBES.map((vibe) => {
                      const Icon = vibe.icon;
                      const isSelected = selectedVibe === vibe.id;
                      return (
                        <button
                          key={vibe.id}
                          type="button"
                          onClick={() => setSelectedVibe(vibe.id)}
                          className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-aurora/15 border-aurora text-foreground font-bold shadow-sm'
                              : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                          }`}
                        >
                          <span className="text-xs flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-aurora' : 'text-muted-foreground'}`} />
                            <span>{vibe.label}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-aurora shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Budget Tiers */}
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-3">3. 7-Day Land Budget Tier</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {BUDGET_TIERS.map((tier) => {
                      const isSelected = selectedBudgetTier === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedBudgetTier(tier.id)}
                          className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                            isSelected
                              ? 'bg-violet/15 border-violet text-foreground font-bold shadow-sm'
                              : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">{tier.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-violet" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{tier.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Sort Preference */}
                <div>
                  <span className="text-xs uppercase font-bold text-muted-foreground block mb-3">4. Sorting Order</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {SORT_OPTIONS.map((opt) => {
                      const isSelected = sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSortBy(opt.id)}
                          className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                            isSelected
                              ? 'bg-primary/15 border-primary text-foreground font-bold shadow-sm'
                              : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">{opt.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:p-8 border-t border-border/80 bg-muted/30 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>

                <Button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-8 py-5 shadow-lg active:scale-95"
                >
                  Show {filteredDestinations.length} Destinations
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Interactive 3D Earth Globe Modal ───────────────────────────────── */}
      {globeDestination && (
        <DestinationGlobeModal
          destination={globeDestination}
          userLocationName={userOrigin}
          onClose={() => setGlobeDestination(null)}
        />
      )}

      {/* ── AI Origin-Aware Budget Estimator Modal ─────────────────────────── */}
      {budgetDestination && (
        <AIBudgetEstimatorModal
          destination={budgetDestination}
          initialOrigin={userOrigin}
          onClose={() => setBudgetDestination(null)}
          onSaveOrigin={handleSaveOrigin}
        />
      )}
    </div>
  );
}
