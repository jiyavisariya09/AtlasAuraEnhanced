'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Bot, MapPin, Calendar, DollarSign, ArrowRight, ShieldCheck, Utensils, CheckCircle } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useCurrency } from '@/context/CurrencyContext'
import { Button } from '@/components/ui/button'

interface AITravelAssistantModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AITravelAssistantModal({ isOpen, onClose }: AITravelAssistantModalProps) {
  const { theme } = useTheme()
  const { formatPrice, currency } = useCurrency()
  const isDark = theme === 'dark'

  const [prompt, setPrompt] = useState('')
  const [selectedMood, setSelectedMood] = useState('adventure')
  const [maxBudget, setMaxBudget] = useState('150')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any | null>(null)

  const MOOD_OPTIONS = [
    { id: 'solo', label: '🎒 Solo Explorer', mood: 'solo' },
    { id: 'adventure', label: '⛰️ High Adventure', mood: 'adventure' },
    { id: 'calm', label: '🧘 Serene Escape', mood: 'calm' },
    { id: 'culture', label: '🏛️ Cultural Immersion', mood: 'culture' },
    { id: 'honeymoon', label: '💕 Romantic Retreat', mood: 'honeymoon' },
  ]

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mood: selectedMood,
          maxBudget,
        }),
      })
      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error('AI assistant query failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  AI Travel Assistant
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    BETA
                  </span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Smart recommendations, custom itineraries & local wisdom powered by MongoDB & AI
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form & Controls */}
          <div className="p-6 space-y-6">
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                What kind of experience are you seeking?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A peaceful week in the mountains with good food and local traditions..."
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
            </div>

            {/* Mood selector & budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Travel Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.mood)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedMood === m.mood
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : isDark
                          ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Max Daily Budget: <span className="text-amber-500 font-bold">{formatPrice(parseFloat(maxBudget) || 100)} / day</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-orange-500/20 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Generating Personalized Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Travel Recommendations
                </>
              )}
            </Button>

            {/* Results Display */}
            {results && results.recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6 pt-6 border-t border-white/10"
              >
                <h4 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  Top Recommended Destinations
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.recommendations.map((rec: any) => (
                    <div
                      key={rec.id}
                      className={`p-5 rounded-2xl border ${
                        isDark ? 'bg-slate-800/80 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h5 className="font-bold text-lg">{rec.name}</h5>
                          <p className="text-xs text-amber-500 font-semibold">{rec.country}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">
                          {formatPrice(rec.budgetUSD)} / day
                        </span>
                      </div>

                      <p className={`text-xs mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{rec.description}</p>

                      {/* Itinerary Preview */}
                      {rec.suggestedItinerary && (
                        <div className="space-y-2 mb-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Suggested Itinerary</p>
                          {rec.suggestedItinerary.map((day: any) => (
                            <div
                              key={day.day}
                              className={`p-2.5 rounded-xl text-xs ${isDark ? 'bg-white/5' : 'bg-white border border-slate-200/60'}`}
                            >
                              <span className="font-bold text-amber-500 mr-2">Day {day.day}:</span>
                              <span className="font-medium">{day.title}</span>
                              <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {day.activities.join(' • ')}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Safety & Food */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Safety Verified</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-400">
                          <Utensils className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{rec.foodRecommendations?.[0] || 'Local Dishes'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
