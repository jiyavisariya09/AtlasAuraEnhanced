'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plane, Hotel, Utensils, Compass, ShieldCheck, 
  Sparkles, ArrowRight, MapPin, Calculator, IndianRupee, 
  Check, RefreshCw, Luggage
} from 'lucide-react';
import type { DestinationItem } from '@/data/destinationsData';
import { useCurrency } from '@/context/CurrencyContext';
import { useModalLayer } from '@/hooks/use-modal-layer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface AIBudgetEstimatorModalProps {
  destination: DestinationItem | null;
  initialOrigin?: string;
  onClose: () => void;
  onSaveOrigin?: (origin: string) => void;
}

const GLOBAL_HUBS = [
  { id: 'mumbai', name: 'Mumbai, India' },
  { id: 'delhi', name: 'Delhi, India' },
  { id: 'newyork', name: 'New York, USA' },
  { id: 'london', name: 'London, UK' },
  { id: 'dubai', name: 'Dubai, UAE' },
  { id: 'tokyo', name: 'Tokyo, Japan' },
  { id: 'paris', name: 'Paris, France' },
  { id: 'sydney', name: 'Sydney, Australia' },
  { id: 'singapore', name: 'Singapore' },
  { id: 'toronto', name: 'Toronto, Canada' },
];

export default function AIBudgetEstimatorModal({
  destination,
  initialOrigin = 'Mumbai, India',
  onClose,
  onSaveOrigin,
}: AIBudgetEstimatorModalProps) {
  const { formatPrice, currency } = useCurrency();
  const [origin, setOrigin] = useState(initialOrigin);
  const [customOrigin, setCustomOrigin] = useState('');
  const [tripTier, setTripTier] = useState<'backpacker' | 'explorer' | 'luxury'>('explorer');
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(1);
  const [calculating, setCalculating] = useState(false);

  const panelRef = useModalLayer(Boolean(destination), onClose);

  if (!destination) return null;

  // Determine Flight Cost based on selected hub
  const hubKey = origin.toLowerCase().split(',')[0].trim().replace(/\s+/g, '') as keyof typeof destination.flightBenchmarkUSD;
  const baseFlightUSD = destination.flightBenchmarkUSD[hubKey] ?? destination.flightBenchmarkUSD.default ?? 800;

  // Tier multipliers
  const tierMultiplier = tripTier === 'backpacker' ? 0.65 : tripTier === 'luxury' ? 1.85 : 1.0;

  // Cost breakdowns in USD
  const flightTotalUSD = Math.round(baseFlightUSD * (tripTier === 'luxury' ? 1.4 : 1.0) * travelers);
  const dailyStayUSD = Math.round((destination.budgetUSD / 7) * 0.45 * tierMultiplier);
  const dailyFoodUSD = Math.round((destination.budgetUSD / 7) * 0.30 * tierMultiplier);
  const dailyActivitiesUSD = Math.round((destination.budgetUSD / 7) * 0.25 * tierMultiplier);

  const stayTotalUSD = dailyStayUSD * days * (travelers > 1 ? Math.ceil(travelers / 2) : 1);
  const foodTotalUSD = dailyFoodUSD * days * travelers;
  const activitiesTotalUSD = dailyActivitiesUSD * days * travelers;
  const bufferTotalUSD = Math.round((stayTotalUSD + foodTotalUSD + activitiesTotalUSD) * 0.1);

  const grandTotalUSD = flightTotalUSD + stayTotalUSD + foodTotalUSD + activitiesTotalUSD + bufferTotalUSD;

  const handleSelectOrigin = (hubName: string) => {
    setOrigin(hubName);
    onSaveOrigin?.(hubName);
    setCalculating(true);
    setTimeout(() => setCalculating(false), 300);
  };

  const handleCustomOriginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customOrigin.trim()) return;
    setOrigin(customOrigin.trim());
    onSaveOrigin?.(customOrigin.trim());
    setCustomOrigin('');
    setCalculating(true);
    setTimeout(() => setCalculating(false), 300);
  };

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 overflow-y-auto flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-background/80 dark:bg-[#080B14]/80 backdrop-blur-md"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 my-auto w-[95vw] sm:w-[90vw] max-w-3xl max-h-[88vh] sm:max-h-[90vh] rounded-3xl bg-card/95 backdrop-blur-xl border border-border/80 overflow-y-auto shadow-2xl text-left"
          style={{ overscrollBehavior: 'contain' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-border bg-card/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-aurora/15 border border-aurora/30 text-aurora flex items-center justify-center shadow-sm shrink-0">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-2xl font-medium text-foreground">
                  AI Travel Budget Estimator
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Custom flight & land calculation for {destination.name}, {destination.country}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. Departure Origin Selection */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                📍 Where are you traveling from? (Departure Hub)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {GLOBAL_HUBS.map((hub) => {
                  const isSelected = origin === hub.name;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => handleSelectOrigin(hub.name)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-aurora bg-aurora/15 text-aurora shadow-sm'
                          : 'border-border bg-card/60 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {hub.name}
                    </button>
                  );
                })}
              </div>

              {/* Custom Location Search */}
              <form onSubmit={handleCustomOriginSubmit} className="flex gap-2">
                <Input
                  placeholder="Or enter city / country (e.g. Bangalore, Frankfurt, Chicago)..."
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  className="h-10 text-xs bg-muted/30 border-border"
                />
                <Button type="submit" size="sm" variant="outline" className="h-10 text-xs px-4 border-border rounded-xl">
                  Set Origin
                </Button>
              </form>
            </div>

            {/* 2. Controls: Trip Tier, Days, Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Trip Style Tier */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Travel Comfort Tier
                </label>
                <div className="grid grid-cols-3 gap-1 bg-muted/40 p-1 rounded-xl border border-border">
                  {(['backpacker', 'explorer', 'luxury'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTripTier(tier)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                        tripTier === tier
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Days */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={3}
                    max={21}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="flex-1 accent-aurora h-2 bg-muted rounded-lg"
                  />
                  <span className="text-xs font-bold w-12 text-right">{days} Days</span>
                </div>
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Travelers
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTravelers(num)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        travelers === num
                          ? 'border-aurora bg-aurora/15 text-aurora font-bold shadow-sm'
                          : 'border-border bg-card/60 text-muted-foreground'
                      }`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. AI Generated Cost Breakdown Card */}
            <div className="rounded-2xl bg-muted/40 border border-border/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-aurora" />
                  Estimated AI Breakdown ({currency})
                </span>
                <span className="text-xs text-aurora">
                  Route: {origin.split(',')[0]} ➔ {destination.country}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/70">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Plane className="w-3.5 h-3.5 text-orchid" />
                    <span>Flights (R/T)</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-foreground">
                    {formatPrice(flightTotalUSD)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Hotel className="w-3.5 h-3.5 text-aurora" />
                    <span>Stay ({days}n)</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-foreground">
                    {formatPrice(stayTotalUSD)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Utensils className="w-3.5 h-3.5 text-rose" />
                    <span>Food & Dining</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-foreground">
                    {formatPrice(foodTotalUSD)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-card border border-border/70">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tours & Transit</span>
                  </div>
                  <div className="font-mono font-bold text-sm text-foreground">
                    {formatPrice(activitiesTotalUSD)}
                  </div>
                </div>
              </div>

              {/* Total Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-card border border-aurora/30 shadow-sm gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Total Estimated Expedition Budget
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Includes flights, stays, meals, local activities + 10% emergency buffer
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-aurora">
                  {formatPrice(grandTotalUSD)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border bg-card/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close Estimator
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link href={`/trip-planner?destination=${encodeURIComponent(destination.name + ', ' + destination.country)}&budget=${grandTotalUSD}`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs px-6 py-4 flex items-center gap-1.5">
                  <Luggage className="w-4 h-4" />
                  Plan Trip with this Budget
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
