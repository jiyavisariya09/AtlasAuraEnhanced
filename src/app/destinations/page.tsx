'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MapPin, Heart, Search, Filter, Star, 
  Compass, Calculator, ArrowRight, Plane, Sparkles, 
  Mountain, Trees, Sun, Landmark, Waves, Snowflake, Check, Settings,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, RotateCcw,
  DollarSign, ArrowUpDown, Tag
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

  // Pagination state — Minimum 12 cards default
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Full description popup state (Click to view full description)
  const [activeDescriptionId, setActiveDescriptionId] = useState<string | null>(null);

  // Close description popup on outside click or Escape
  useEffect(() => {
    if (!activeDescriptionId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-desc-popover]') && !target.closest('[data-desc-trigger]')) {
        setActiveDescriptionId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDescriptionId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDescriptionId]);



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
      <main className="flex-1 pb-24 pt-10">
        <div className="shell space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/60">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-aurora/15 border border-aurora/30 text-aurora text-xs font-mono uppercase tracking-wider mb-3">
                <Globe className="w-3.5 h-3.5" />
                <span>Curated World Sanctuaries</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                Find Your Next World Expedition
              </h1>
              <p className="text-muted-foreground max-w-2xl text-sm sm:text-base mt-2 leading-relaxed font-normal">
                Explore hidden sanctuaries, high-altitude lakes, and untouched archipelagos with real-time 3D Earth positioning and location-aware AI trip budget models.
              </p>
            </div>

            {/* User Origin Quick Indicator */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card border border-border/80 shadow-sm">
              <Plane className="w-4 h-4 text-orchid shrink-0" />
              <div className="text-xs">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono font-bold">Departure City</span>
                <span className="font-semibold text-foreground">{userOrigin}</span>
              </div>
            </div>
          </div>

          {/* ── Consolidated Search & Filter Rails (Single Button + 5XL Modal) ── */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search input (Wide & Clean) */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search destination, country, or keyword (e.g. Fjord, Mirror, Temple, Volcano)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 h-12 rounded-2xl bg-card border-border text-xs sm:text-sm text-foreground shadow-sm focus:border-aurora"
                />
              </div>

              {/* Action Buttons: 5XL Filters Modal, Favorites, and Clear All */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                {/* 5XL Filter Modal Trigger Button */}
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

                {/* Favorites Toggle Button */}
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

                {/* Clear All Filters Button */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearAllFilters}
                    className="h-12 px-4 rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                    title="Clear all active filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Chips Strip */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-mono uppercase font-bold text-muted-foreground">Active Filters:</span>

                {selectedRegion !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora border border-aurora/30 font-medium text-xs">
                    <span>Region: {selectedRegion}</span>
                    <button onClick={() => setSelectedRegion('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {selectedVibe !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora border border-aurora/30 font-medium text-xs">
                    <span>Vibe: {VIBES.find(v => v.id === selectedVibe)?.label}</span>
                    <button onClick={() => setSelectedVibe('all')} className="hover:text-white"><X className="w-3 h-3" /></button>
                  </span>
                )}

                {selectedBudgetTier !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orchid/15 text-orchid border border-orchid/30 font-medium text-xs">
                    <span>Budget: {BUDGET_TIERS.find(b => b.id === selectedBudgetTier)?.label}</span>
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
                    <span>Search: &ldquo;{searchQuery}&rdquo;</span>
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
            <div ref={gridTopRef} className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs font-mono">
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
          </div>

          {/* ── Destinations Cards Grid (Spacious, Uncluttered, Premium) ───── */}
          {paginatedDestinations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-3">
              <Compass className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="font-serif text-xl font-medium text-foreground">No destinations match your filters</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {paginatedDestinations.map((dest, index) => {
                const isFav = favorites.includes(dest.id);
                return (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03, ease: EASE }}
                    className="group flex flex-col"
                  >
                    <div className="lift relative rounded-3xl overflow-hidden bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-aurora/40 flex flex-col justify-between h-full transition-all duration-300">
                      
                      {/* Image Top Half — 100% Bright, Crisp, Natural */}
                      <div className="relative h-64 w-full overflow-hidden bg-muted">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-smooth will-change-transform group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                        {/* Top Rating & Location Floating Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-white text-[11px] font-mono backdrop-blur-md shadow-md">
                            <MapPin className="w-3 h-3 text-aurora" />
                            {dest.country} · {dest.region}
                          </span>

                          <div className="flex items-center gap-1.5 pointer-events-auto">
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-white text-xs font-semibold backdrop-blur-md shadow-md">
                              <Star className="w-3.5 h-3.5 text-aurora fill-aurora" />
                              <span>{dest.rating}</span>
                            </div>

                            {/* Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(dest.id, e)}
                              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                              className={`p-2 rounded-full border backdrop-blur-md transition-all active:scale-90 shadow-md ${
                                isFav
                                  ? 'bg-rose-500 text-white border-rose-500'
                                  : 'bg-black/70 border-white/20 text-white hover:text-rose-400'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Content Body (Spacious & Cleanly Hierarchical) */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          {/* Elevation & Season Badges Strip */}
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                            <span className="bg-muted border border-border/80 px-2.5 py-0.5 rounded-lg text-foreground/80 font-medium">
                              ⛰️ {dest.elevation}
                            </span>
                            <span className="bg-muted border border-border/80 px-2.5 py-0.5 rounded-lg text-foreground/80 font-medium">
                              🗓️ {dest.bestSeason.split('(')[0]}
                            </span>
                          </div>

                          {/* Title & Description with Full Popover on Click */}
                          <div>
                            <h3 className="font-serif text-2xl font-semibold text-foreground group-hover:text-aurora transition-colors">
                              {dest.name}
                            </h3>
                            
                            {/* Description (Click to view full description) */}
                            <div className="relative mt-1.5">
                              <button
                                type="button"
                                data-desc-trigger={dest.id}
                                onClick={() => setActiveDescriptionId(prev => prev === dest.id ? null : dest.id)}
                                className="text-left group/desc cursor-pointer focus:outline-none block w-full rounded-md -m-1 p-1 hover:bg-muted/40 transition-colors"
                                title="Click to view full description"
                              >
                                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground group-hover/desc:text-foreground transition-colors line-clamp-2">
                                  {dest.description}
                                </p>
                              </button>

                              {/* Floating Popover on Click (Day & Night Mode Supported) */}
                              <AnimatePresence>
                                {activeDescriptionId === dest.id && (
                                  <motion.div
                                    data-desc-popover={dest.id}
                                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 bottom-full mb-2.5 z-50 w-72 sm:w-80 p-3.5 rounded-2xl bg-card border border-border dark:border-aurora/40 text-card-foreground text-xs shadow-2xl backdrop-blur-xl"
                                  >
                                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border dark:border-white/10">
                                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-aurora uppercase tracking-wider">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Full Description</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveDescriptionId(null);
                                        }}
                                        className="text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-muted transition-colors"
                                        title="Close"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                                      {dest.description}
                                    </p>
                                    {/* Tooltip Downward Arrow Pointer */}
                                    <div className="absolute top-full left-6 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-card" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Curated Highlights Chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {dest.highlights.slice(0, 2).map((h, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono font-medium rounded-full bg-muted px-2.5 py-1 text-muted-foreground border border-border/80"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions & Price Strip (Clean, Spacious, Elegant) */}
                        <div className="pt-4 border-t border-border/60 space-y-3.5">
                          {/* Price & Micro Actions Row */}
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-mono text-muted-foreground block font-bold tracking-wider">Est. 7-Day Land</span>
                              <span className="text-aurora font-bold text-base font-mono">
                                {formatPrice(dest.budgetUSD)}
                              </span>
                            </div>

                            {/* Micro Action Pills */}
                            <div className="flex items-center gap-1.5">
                              <Link href={`/globe?destination=${dest.id}`}>
                                <button
                                  type="button"
                                  className="py-1.5 px-3 rounded-full bg-aurora/15 hover:bg-aurora text-aurora hover:text-ink-void border border-aurora/30 text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-95 shadow-sm"
                                  title="Explore on 3D Earth Globe"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  <span>3D Globe</span>
                                </button>
                              </Link>

                              <button
                                type="button"
                                onClick={() => setBudgetDestination(dest)}
                                className="py-1.5 px-3 rounded-full bg-orchid/15 hover:bg-orchid text-orchid hover:text-white border border-orchid/30 text-xs font-semibold flex items-center gap-1 transition-all duration-200 active:scale-95 shadow-sm"
                                title="Calculate AI Budget"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                                <span>AI Budget</span>
                              </button>
                            </div>
                          </div>

                          {/* Primary Solid Action Button */}
                          <Link href={`/destinations/${dest.id}`} className="block group/btn">
                            <Button
                              className="w-full py-2.5 px-5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs flex items-center justify-between shadow-md transition-all duration-300 active:scale-98"
                            >
                              <span className="group-hover/btn:translate-x-0.5 transition-transform">Explore Destination Dossier</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Variable Pagination Controls Bar ──────────────────────────── */}
          {totalPages > 1 && (
            <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60">
              <div className="text-xs font-mono text-muted-foreground">
                Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
              </div>

              {/* Numbered Page Buttons */}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-full text-xs font-mono font-bold transition-all ${
                      currentPage === page
                        ? 'bg-aurora text-ink-void shadow-md scale-105'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}

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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/15 text-aurora text-[10px] font-mono uppercase font-bold mb-1">
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

              {/* Modal Body (Scrollable 5XL multi-section grid) */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
                {/* Section 1: Continents & Regions */}
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-3">1. Continent / Region</span>
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
                  <span className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-3">2. Landscape & Vibe</span>
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
                  <span className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-3">3. 7-Day Land Budget Tier</span>
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
                              ? 'bg-orchid/15 border-orchid text-foreground font-bold shadow-sm'
                              : 'bg-muted/40 border-border/80 text-muted-foreground hover:text-foreground hover:border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold">{tier.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orchid" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{tier.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4: Sort Preference */}
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-muted-foreground block mb-3">4. Sorting Order</span>
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
