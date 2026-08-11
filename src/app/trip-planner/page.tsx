'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, MapPin, DollarSign, Plus, Trash2, CheckCircle2, 
  Circle, Luggage, ChevronLeft, Sparkles, Save, Compass, Clock, Send
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useCurrency } from '@/context/CurrencyContext'
import ThemeToggle from '@/components/ThemeToggle'
import CurrencySelector from '@/components/CurrencySelector'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'

export default function TripPlannerPage() {
  const { theme } = useTheme()
  const { formatPrice, currency } = useCurrency()
  const isDark = theme === 'dark'

  const [tripPlans, setTripPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // New Trip Plan Form
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [budgetUSD, setBudgetUSD] = useState('800')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [days, setDays] = useState([
    { day: 1, title: 'Arrival & Neighborhood Walk', activities: ['Hotel Check-in', 'Explore local coffee shops'] },
    { day: 2, title: 'Historic Highlights', activities: ['Visit main temple/museum', 'Traditional culinary tour'] },
  ])
  const [checklist, setChecklist] = useState([
    { id: '1', item: 'Passport & Visa Documentation', done: false },
    { id: '2', item: 'Universal Power Adapter', done: false },
    { id: '3', item: 'Local Currency Cash', done: false },
    { id: '4', item: 'Comfortable Hiking / Walking Shoes', done: false },
  ])
  const [newItemText, setNewItemText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/trip-plans')
      .then((res) => res.json())
      .then((data) => {
        if (data.tripPlans) setTripPlans(data.tripPlans)
      })
      .catch((err) => console.error('Failed to load trip plans:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleAddDay = () => {
    setDays((prev) => [
      ...prev,
      { day: prev.length + 1, title: `Day ${prev.length + 1} Adventure`, activities: ['Explore local sights'] },
    ])
  }

  const handleAddActivity = (dayIndex: number, text: string) => {
    if (!text.trim()) return
    setDays((prev) => {
      const updated = [...prev]
      updated[dayIndex].activities.push(text)
      return updated
    })
  }

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const handleAddChecklistItem = () => {
    if (!newItemText.trim()) return
    setChecklist((prev) => [
      ...prev,
      { id: Date.now().toString(), item: newItemText.trim(), done: false },
    ])
    setNewItemText('')
  }

  const handleSaveTripPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !destination.trim()) return

    setSaving(true)
    try {
      const res = await fetch('/api/trip-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          destination,
          budgetUSD: parseFloat(budgetUSD) || 500,
          startDate,
          endDate,
          itineraryDays: days,
          checklist,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setTripPlans((prev) => [data.tripPlan, ...prev])
        setShowCreateModal(false)
        setTitle('')
        setDestination('')
      }
    } catch (err) {
      console.error('Failed to save trip plan:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold hover:text-amber-500 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <CurrencySelector />
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full px-5 shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Plan New Trip
            </Button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
              <Luggage className="w-8 h-8 text-amber-500" /> Interactive Trip Planner
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Design day-wise itineraries, track budgets in real-time, and manage customized packing checklists.
            </p>
          </div>
        </div>

        {/* Existing Plans */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading your travel itineraries...</p>
          </div>
        ) : tripPlans.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200'}`}>
            <Compass className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold mb-2">No Trip Plans Created Yet</h3>
            <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Start crafting your dream journey with custom day-wise plans and intelligent packing checklists.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Create First Itinerary
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tripPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
                  isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-xl font-bold">{plan.title}</h4>
                    <p className="text-xs text-amber-500 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {plan.destination}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">
                    {formatPrice(plan.budgetUSD)}
                  </span>
                </div>

                {/* Itinerary Preview */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Itinerary Highlights</p>
                  {Array.isArray(plan.itineraryDays) &&
                    plan.itineraryDays.slice(0, 3).map((day: any) => (
                      <div
                        key={day.day}
                        className={`p-2.5 rounded-xl text-xs ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-200'}`}
                      >
                        <span className="font-bold text-amber-500 mr-2">Day {day.day}:</span>
                        <span>{day.title}</span>
                      </div>
                    ))}
                </div>

                {/* Checklist count */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Checklist: {Array.isArray(plan.checklist) ? plan.checklist.length : 0} items</span>
                  <span className="text-emerald-400 font-semibold">Ready to Travel</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Trip Plan */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
                onClick={() => setShowCreateModal(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border ${
                  isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Luggage className="w-6 h-6 text-amber-500" /> Plan Your Next Journey
                </h3>

                <form onSubmit={handleSaveTripPlan} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Trip Name</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Kyoto Autumn Explorer"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${
                          isDark ? 'bg-white/5 border-white/10 focus:border-amber-400' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Destination</label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Japan"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${
                          isDark ? 'bg-white/5 border-white/10 focus:border-amber-400' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Estimated Budget: <span className="text-amber-500 font-bold">{formatPrice(parseFloat(budgetUSD) || 0)}</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="50"
                      value={budgetUSD}
                      onChange={(e) => setBudgetUSD(e.target.value)}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Day-by-Day Itinerary Builder */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Day-Wise Itinerary</label>
                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Day
                      </button>
                    </div>

                    <div className="space-y-3">
                      {days.map((day, idx) => (
                        <div
                          key={day.day}
                          className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <span className="text-xs font-bold text-amber-500">Day {day.day}</span>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => {
                              const updated = [...days]
                              updated[idx].title = e.target.value
                              setDays(updated)
                            }}
                            className={`w-full text-sm font-semibold mt-1 mb-2 bg-transparent border-b pb-1 outline-none ${
                              isDark ? 'border-white/10 focus:border-amber-400' : 'border-slate-300 focus:border-amber-500'
                            }`}
                          />
                          <p className="text-[11px] text-slate-400">Activities: {day.activities.join(' • ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Packing Checklist */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Packing Checklist
                    </label>
                    <div className="space-y-2 mb-3">
                      {checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                          }`}
                        >
                          {item.done ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={`text-xs ${item.done ? 'line-through text-slate-500' : ''}`}>{item.item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add custom packing item..."
                        className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                        }`}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddChecklistItem}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-xs"
                      >
                        Add Item
                      </Button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl px-6"
                    >
                      {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Itinerary</>}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
