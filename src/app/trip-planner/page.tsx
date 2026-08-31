'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, IndianRupee, Plus, Trash2, CheckCircle2, 
  Circle, Luggage, ChevronLeft, Sparkles, Save, Compass, Clock, 
  Send, Share2, Check, Download, AlertCircle, ArrowRight, Tag,
  Utensils, Bed, Plane, Camera, ShieldCheck, Printer
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BorderBeam } from '@/components/ui/border-beam';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Activity {
  time?: string;
  title: string;
  category?: 'Stay' | 'Sightseeing' | 'Dining' | 'Transit' | 'Relaxation';
  costINR?: number;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: (string | Activity)[];
}

interface ChecklistItem {
  id: string;
  item: string;
  category?: string;
  done: boolean;
}

interface TripPlan {
  id?: string;
  _id?: string;
  title: string;
  destination: string;
  budgetUSD?: number;
  budgetINR?: number;
  startDate?: string;
  endDate?: string;
  itineraryDays?: ItineraryDay[];
  checklist?: ChecklistItem[];
}

export default function TripPlannerPage() {
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [activeTrip, setActiveTrip] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Trip Modal Form
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newBudgetINR, setNewBudgetINR] = useState('65000');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // Active Trip Editing
  const [newActivityText, setNewActivityText] = useState<{ [dayIndex: number]: string }>({});
  const [newActivityTime, setNewActivityTime] = useState<{ [dayIndex: number]: string }>({});
  const [newActivityCost, setNewActivityCost] = useState<{ [dayIndex: number]: string }>({});
  const [newActivityCat, setNewActivityCat] = useState<{ [dayIndex: number]: any }>({});
  const [newChecklistText, setNewChecklistText] = useState('');

  const loadTrips = async () => {
    try {
      const res = await fetch('/api/trip-plans');
      const data = await res.json();
      if (data.tripPlans && data.tripPlans.length > 0) {
        setTripPlans(data.tripPlans);
        setActiveTrip(data.tripPlans[0]);
      } else {
        // Default starter trip
        const starter: TripPlan = {
          title: 'Enchanting Ladakh Odyssey',
          destination: 'Leh & Pangong Lake, India',
          budgetINR: 85000,
          startDate: '2026-06-15',
          endDate: '2026-06-22',
          itineraryDays: [
            {
              day: 1,
              title: 'Acclimatization in Leh',
              activities: [
                { time: '10:00 AM', title: 'Arrival at Kushok Bakula Rimpochee Airport & check-in', category: 'Stay', costINR: 6000 },
                { time: '04:00 PM', title: 'Gentle walk around Leh Main Bazaar & Tibetan Kitchen', category: 'Dining', costINR: 1200 },
                { time: '06:30 PM', title: 'Sunset at Shanti Stupa', category: 'Sightseeing', costINR: 0 },
              ],
            },
            {
              day: 2,
              title: 'Monasteries & Indus Valley',
              activities: [
                { time: '08:30 AM', title: 'Visit Thiksey & Hemis Monasteries', category: 'Sightseeing', costINR: 1500 },
                { time: '01:30 PM', title: 'Traditional Ladakhi lunch at Chamba Restaurant', category: 'Dining', costINR: 800 },
                { time: '04:30 PM', title: 'Rafting confluence at Sangam (Indus & Zanskar)', category: 'Sightseeing', costINR: 3500 },
              ],
            },
            {
              day: 3,
              title: 'Journey to Pangong Tso via Chang La',
              activities: [
                { time: '07:00 AM', title: 'Scenic drive through Chang La Pass (17,688 ft)', category: 'Transit', costINR: 8000 },
                { time: '02:00 PM', title: 'Check-in to Eco-Huts by Pangong Lake', category: 'Stay', costINR: 7500 },
                { time: '08:00 PM', title: 'Stargazing under the Milky Way', category: 'Relaxation', costINR: 0 },
              ],
            },
          ],
          checklist: [
            { id: '1', item: 'Inner Line Permits & Passport Photos', category: 'Documents', done: true },
            { id: '2', item: 'Altitude sickness medication (Diamox) & ORS', category: 'Health', done: true },
            { id: '3', item: 'Thermal fleece, windproof jacket, & sunglasses', category: 'Wardrobe', done: false },
            { id: '4', item: 'Power bank & DSLR extra batteries', category: 'Electronics', done: false },
            { id: '5', item: 'Cash in INR (Limited ATMs in Nubra/Pangong)', category: 'Money', done: false },
          ],
        };
        setTripPlans([starter]);
        setActiveTrip(starter);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Calculate total estimated expenses
  const calculateTotalExpenses = () => {
    if (!activeTrip?.itineraryDays) return 0;
    let total = 0;
    activeTrip.itineraryDays.forEach((d) => {
      d.activities.forEach((act) => {
        if (typeof act === 'object' && act.costINR) {
          total += act.costINR;
        }
      });
    });
    return total;
  };

  const totalSpentINR = calculateTotalExpenses();
  const tripBudgetINR = activeTrip?.budgetINR || (activeTrip?.budgetUSD ? activeTrip.budgetUSD * 83 : 75000);
  const remainingBudgetINR = tripBudgetINR - totalSpentINR;
  const budgetPercentage = Math.min(100, Math.round((totalSpentINR / tripBudgetINR) * 100));

  // Checklist counts
  const totalChecklist = activeTrip?.checklist?.length || 0;
  const doneChecklist = activeTrip?.checklist?.filter((c) => c.done).length || 0;
  const checklistPercent = totalChecklist > 0 ? Math.round((doneChecklist / totalChecklist) * 100) : 0;

  // Add Day
  const handleAddDay = () => {
    if (!activeTrip) return;
    const currentDays = activeTrip.itineraryDays || [];
    const nextDayNum = currentDays.length + 1;
    const updatedDays: ItineraryDay[] = [
      ...currentDays,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum} Exploration`,
        activities: [{ time: '09:00 AM', title: 'Morning exploration', category: 'Sightseeing', costINR: 1000 }],
      },
    ];
    setActiveTrip({ ...activeTrip, itineraryDays: updatedDays });
  };

  // Add Activity to Day
  const handleAddActivity = (dayIndex: number) => {
    const text = newActivityText[dayIndex]?.trim();
    if (!text || !activeTrip) return;
    const time = newActivityTime[dayIndex]?.trim() || '10:00 AM';
    const cost = parseFloat(newActivityCost[dayIndex]) || 0;
    const cat = newActivityCat[dayIndex] || 'Sightseeing';

    const currentDays = [...(activeTrip.itineraryDays || [])];
    currentDays[dayIndex].activities.push({
      time,
      title: text,
      category: cat,
      costINR: cost,
    });

    setActiveTrip({ ...activeTrip, itineraryDays: currentDays });
    setNewActivityText((prev) => ({ ...prev, [dayIndex]: '' }));
    setNewActivityTime((prev) => ({ ...prev, [dayIndex]: '' }));
    setNewActivityCost((prev) => ({ ...prev, [dayIndex]: '' }));
  };

  // Remove Activity
  const handleRemoveActivity = (dayIndex: number, actIndex: number) => {
    if (!activeTrip?.itineraryDays) return;
    const currentDays = [...activeTrip.itineraryDays];
    currentDays[dayIndex].activities.splice(actIndex, 1);
    setActiveTrip({ ...activeTrip, itineraryDays: currentDays });
  };

  // Toggle Checklist
  const handleToggleChecklist = (id: string) => {
    if (!activeTrip?.checklist) return;
    const updated = activeTrip.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c));
    setActiveTrip({ ...activeTrip, checklist: updated });
  };

  // Add Checklist Item
  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim() || !activeTrip) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      item: newChecklistText.trim(),
      category: 'General',
      done: false,
    };
    setActiveTrip({
      ...activeTrip,
      checklist: [...(activeTrip.checklist || []), newItem],
    });
    setNewChecklistText('');
  };

  // Save Trip to API
  const handleSaveTrip = async () => {
    if (!activeTrip) return;
    setSaving(true);
    try {
      if (activeTrip.id || (activeTrip as any)._id) {
        // Update
        await fetch('/api/trip-plans', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: activeTrip.id || (activeTrip as any)._id,
            title: activeTrip.title,
            destination: activeTrip.destination,
            startDate: activeTrip.startDate,
            endDate: activeTrip.endDate,
            budgetUSD: Math.round(tripBudgetINR / 83),
            itineraryDays: activeTrip.itineraryDays,
            checklist: activeTrip.checklist,
          }),
        });
      } else {
        // Create
        const res = await fetch('/api/trip-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: activeTrip.title,
            destination: activeTrip.destination,
            startDate: activeTrip.startDate,
            endDate: activeTrip.endDate,
            budgetUSD: Math.round(tripBudgetINR / 83),
            itineraryDays: activeTrip.itineraryDays,
            checklist: activeTrip.checklist,
          }),
        });
        const data = await res.json();
        if (data.tripPlan) {
          setActiveTrip(data.tripPlan);
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    } catch (err) {
      console.error('Failed to save trip plan:', err);
    } finally {
      setSaving(false);
    }
  };

  // Create new trip modal handler
  const handleCreateNewTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDestination.trim()) return;

    const budgetINR = parseFloat(newBudgetINR) || 50000;
    const initialDays: ItineraryDay[] = [
      {
        day: 1,
        title: 'Arrival & Neighborhood Discovery',
        activities: [
          { time: '11:00 AM', title: 'Hotel Check-in & Freshen up', category: 'Stay', costINR: 4000 },
          { time: '03:00 PM', title: 'City Walk & Coffee Tasting', category: 'Dining', costINR: 600 },
        ],
      },
      {
        day: 2,
        title: 'Historic Sights & Culture',
        activities: [
          { time: '09:00 AM', title: 'Monument & Heritage Tour', category: 'Sightseeing', costINR: 1500 },
          { time: '01:00 PM', title: 'Authentic Local Feast', category: 'Dining', costINR: 1000 },
        ],
      },
    ];

    const initialChecklist: ChecklistItem[] = [
      { id: '1', item: 'Flight Tickets & Hotel Vouchers', category: 'Documents', done: false },
      { id: '2', item: 'Cash in Rupees (₹) & UPI App active', category: 'Money', done: false },
      { id: '3', item: 'Phone charger & Power bank', category: 'Electronics', done: false },
    ];

    const newTrip: TripPlan = {
      title: newTitle.trim(),
      destination: newDestination.trim(),
      budgetINR,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
      itineraryDays: initialDays,
      checklist: initialChecklist,
    };

    setSaving(true);
    try {
      const res = await fetch('/api/trip-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTrip.title,
          destination: newTrip.destination,
          startDate: newTrip.startDate,
          endDate: newTrip.endDate,
          budgetUSD: Math.round(budgetINR / 83),
          itineraryDays: initialDays,
          checklist: initialChecklist,
        }),
      });
      const data = await res.json();
      const savedTrip = data.tripPlan || newTrip;
      setTripPlans([savedTrip, ...tripPlans]);
      setActiveTrip(savedTrip);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDestination('');
    } catch (err) {
      console.error('Failed to create trip:', err);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'Stay':
        return <Bed className="w-3.5 h-3.5 text-violet" />;
      case 'Dining':
        return <Utensils className="w-3.5 h-3.5 text-rose" />;
      case 'Transit':
        return <Plane className="w-3.5 h-3.5 text-aurora" />;
      case 'Relaxation':
        return <Sparkles className="w-3.5 h-3.5 text-yellow-500" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-aurora" />;
    }
  };

  return (
    <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
      {/* ── Ambient Background Glows ───────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="aurora-wash absolute inset-0 opacity-25" />
        <div className="graticule absolute inset-0 opacity-15" />
      </div>

      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/80 glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-aurora" />
              <span>Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <Luggage className="w-5 h-5 text-aurora" />
              <h1 className="font-sans font-bold text-base sm:text-lg text-foreground tracking-tight">
                Trip Planner <span className="text-aurora font-mono text-xs">(₹ INR)</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 text-xs rounded-full border-border"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
            <Button
              onClick={handleSaveTrip}
              disabled={saving || saveSuccess}
              className="h-9 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs px-4 flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Itinerary
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace ────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Active Trip Hero & Budget Overview ──────────────────────────── */}
        {activeTrip ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative rounded-3xl p-6 sm:p-8 glass border border-border shadow-cast space-y-6"
          >
            <BorderBeam
              size={180}
              duration={12}
              colorFrom="hsl(var(--aurora))"
              colorTo="hsl(var(--violet))"
              borderWidth={1.5}
            />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              {/* Trip Title & Destination */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="t-label text-aurora text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeTrip.destination}
                  </span>
                  {activeTrip.startDate && (
                    <span className="text-xs font-mono text-muted-foreground bg-card px-2 py-0.5 rounded-full border border-border">
                      {activeTrip.startDate} {activeTrip.endDate ? `→ ${activeTrip.endDate}` : ''}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">
                  {activeTrip.title}
                </h2>
              </div>

              {/* Trip Switcher / Create Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="rounded-full bg-aurora/15 border border-aurora/30 text-aurora hover:bg-aurora/25 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  New Trip Plan
                </Button>
              </div>
            </div>

            {/* ── Rupee Budget Health Meter ─────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/70">
              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-aurora" />
                  Total Trip Budget
                </span>
                <div className="font-mono text-2xl font-bold text-foreground">
                  ₹{tripBudgetINR.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet" />
                  Planned Expenses
                </span>
                <div className="font-mono text-2xl font-bold text-foreground">
                  ₹{totalSpentINR.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card/60 border border-border space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className={`w-3.5 h-3.5 ${remainingBudgetINR >= 0 ? 'text-aurora' : 'text-destructive'}`} />
                  {remainingBudgetINR >= 0 ? 'Remaining Buffer' : 'Over Budget!'}
                </span>
                <div className={`font-mono text-2xl font-bold ${remainingBudgetINR >= 0 ? 'text-aurora' : 'text-destructive'}`}>
                  ₹{Math.abs(remainingBudgetINR).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1.5">
                <span>Budget Utilization ({budgetPercentage}%)</span>
                <span>₹{totalSpentINR.toLocaleString('en-IN')} / ₹{tripBudgetINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPercentage}%` }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`h-full rounded-full ${
                    budgetPercentage > 100 ? 'bg-destructive' : 'bg-aurora'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* ── Two Column Workspace: Itinerary + Packing Checklist ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left 2 Cols: Day-by-Day Timeline Itinerary ───────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-normal text-foreground">Day-by-Day Itinerary</h3>
                <p className="text-xs text-muted-foreground">Detailed schedule with timeline slots and Rupee expense estimates</p>
              </div>
              <Button
                onClick={handleAddDay}
                size="sm"
                className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Day
              </Button>
            </div>

            <div className="space-y-6">
              {activeTrip?.itineraryDays?.map((dayPlan, dayIdx) => (
                <div
                  key={dayPlan.day}
                  className="rounded-3xl p-6 glass border border-border shadow-cast space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-aurora/15 border border-aurora/30 text-aurora font-mono text-xs font-bold flex items-center justify-center">
                        D{dayPlan.day}
                      </span>
                      <h4 className="text-base font-semibold text-foreground">{dayPlan.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {dayPlan.activities.length} activities
                    </span>
                  </div>

                  {/* Activities list */}
                  <div className="space-y-2.5">
                    {dayPlan.activities.map((activity, actIdx) => {
                      const isObj = typeof activity === 'object';
                      const title = isObj ? activity.title : activity;
                      const time = isObj ? activity.time : '10:00 AM';
                      const cost = isObj && activity.costINR ? activity.costINR : 0;
                      const cat = isObj ? activity.category : 'Sightseeing';

                      return (
                        <div
                          key={actIdx}
                          className="flex items-center justify-between p-3 rounded-2xl bg-card/60 border border-border hover:border-aurora/40 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-card flex items-center justify-center shrink-0">
                              {getCategoryIcon(cat)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-aurora font-semibold">{time}</span>
                                <span className="text-xs font-medium text-foreground">{title}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{cat}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {cost > 0 && (
                              <span className="font-mono text-xs font-semibold text-foreground bg-card px-2 py-0.5 rounded-full border border-border">
                                ₹{cost.toLocaleString('en-IN')}
                              </span>
                            )}
                            <button
                              onClick={() => handleRemoveActivity(dayIdx, actIdx)}
                              className="p-1 rounded-md text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete activity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Activity Input Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="e.g. 02:00 PM · Temple visit"
                      value={newActivityText[dayIdx] || ''}
                      onChange={(e) =>
                        setNewActivityText((prev) => ({ ...prev, [dayIdx]: e.target.value }))
                      }
                      className="text-xs h-9 bg-card/40 border-border text-foreground flex-1"
                    />
                    <Input
                      placeholder="Cost (₹)"
                      type="number"
                      value={newActivityCost[dayIdx] || ''}
                      onChange={(e) =>
                        setNewActivityCost((prev) => ({ ...prev, [dayIdx]: e.target.value }))
                      }
                      className="text-xs h-9 bg-card/40 border-border text-foreground w-24 font-mono"
                    />
                    <Button
                      onClick={() => handleAddActivity(dayIdx)}
                      size="sm"
                      className="h-9 px-4 rounded-full bg-card hover:bg-card/80 border border-border text-foreground text-xs font-semibold shrink-0"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Col: Packing & Travel Checklist ───────────────────────── */}
          <div className="space-y-6">
            <div className="rounded-3xl p-6 glass border border-border shadow-cast space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-xl font-normal text-foreground">Packing &amp; Checklist</h3>
                  <span className="font-mono text-xs text-aurora font-bold">{checklistPercent}% Ready</span>
                </div>
                <p className="text-xs text-muted-foreground">Track essential documents, tech, and gear</p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-3">
                  <motion.div
                    animate={{ width: `${checklistPercent}%` }}
                    className="h-full bg-aurora rounded-full"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {activeTrip?.checklist?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      item.done
                        ? 'bg-card/30 border-border/50 text-muted-foreground line-through opacity-70'
                        : 'bg-card/70 border-border text-foreground hover:border-aurora/50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-aurora" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-tight">{item.item}</p>
                      {item.category && (
                        <span className="text-[10px] uppercase font-mono text-muted-foreground">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add checklist item */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Input
                  placeholder="Add item (e.g. Travel adapter)..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  className="text-xs h-9 bg-card/40 border-border text-foreground"
                />
                <Button
                  onClick={handleAddChecklistItem}
                  size="sm"
                  className="h-9 px-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Travel Advisory Card */}
            <div className="rounded-3xl p-5 bg-aurora/10 border border-aurora/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-aurora">
                <ShieldCheck className="w-4 h-4" />
                <span>Smart Rupee Travel Tip</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most Himalayan &amp; rural regions accept UPI payments, but keep at least ₹5,000–₹10,000 cash in reserve for remote mountain passes and driver tips.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Create New Trip Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl glass border border-border p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="font-serif text-xl text-foreground">Create New Trip Itinerary</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-full hover:bg-card text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewTrip} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Trip Title
                  </label>
                  <Input
                    placeholder="e.g. Kerala Backwaters & Spices"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-10 bg-card/60 border-border text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Destination
                  </label>
                  <Input
                    placeholder="e.g. Kochi & Alleppey, India"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="h-10 bg-card/60 border-border text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Total Estimated Budget (₹ INR)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="65000"
                      value={newBudgetINR}
                      onChange={(e) => setNewBudgetINR(e.target.value)}
                      className="pl-9 h-10 bg-card/60 border-border text-foreground font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="h-10 bg-card/60 border-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="h-10 bg-card/60 border-border text-foreground"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full shadow-cast text-xs mt-2"
                >
                  {saving ? 'Creating Itinerary...' : 'Build Itinerary'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
