'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Bot, MapPin, ShieldCheck, Utensils } from 'lucide-react'
import { useCurrency } from '@/context/CurrencyContext'
import { useModalLayer } from '@/hooks/use-modal-layer'
import { Button } from '@/components/ui/button'

interface AITravelAssistantModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ItineraryDay {
  day: number
  title: string
  activities: string[]
}

interface Recommendation {
  id: string
  name: string
  country: string
  budgetUSD: number
  description: string
  suggestedItinerary?: ItineraryDay[]
  foodRecommendations?: string[]
}

interface AssistantResult {
  recommendations?: Recommendation[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const MOOD_OPTIONS = [
  { id: 'solo', label: '🎒 Solo Explorer', mood: 'solo' },
  { id: 'adventure', label: '⛰️ High Adventure', mood: 'adventure' },
  { id: 'calm', label: '🧘 Serene Escape', mood: 'calm' },
  { id: 'culture', label: '🏛️ Cultural Immersion', mood: 'culture' },
  { id: 'honeymoon', label: '💕 Romantic Retreat', mood: 'honeymoon' },
]

export default function AITravelAssistantModal({ isOpen, onClose }: AITravelAssistantModalProps) {
  const { formatPrice } = useCurrency()

  const [prompt, setPrompt] = useState('')
  const [selectedMood, setSelectedMood] = useState('adventure')
  const [maxBudget, setMaxBudget] = useState('150')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AssistantResult | null>(null)

  /* Escape to close, hold the page still underneath, and hand focus in and back
     out again — the contract every dismissible layer here shares, so the whole
     site dismisses alike. It used to be spelt out in this file; four other
     overlays had none of it, which is why it now lives in one place. */
  const panelRef = useModalLayer(isOpen, onClose)

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

  /* The early `return null` used to sit outside AnimatePresence, which meant the
     whole tree — presence detector included — unmounted the moment isOpen went
     false, so none of the exit animations below ever ran. The condition belongs
     inside instead. */
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: 'hsl(var(--ink-void) / 0.72)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-assistant-title"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="ink-panel relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl"
          >
            <div className="hairline-b flex items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h3
                    id="ai-assistant-title"
                    className="t-sub flex flex-wrap items-center gap-2 text-foreground"
                  >
                    Travel assistant
                    <span className="t-label rounded-full border border-aurora/30 bg-aurora/10 px-2 py-0.5 text-aurora">
                      Beta
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Describe the trip you want. It answers with places, a day-by-day outline and
                    what people eat there.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close travel assistant"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <label
                  htmlFor="ai-prompt"
                  className="t-label mb-2 block text-muted-foreground"
                >
                  What kind of trip are you after?
                </label>
                <input
                  id="ai-prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A quiet week in the mountains, good food, few tourists…"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus-visible:border-aurora"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="t-label mb-2 text-muted-foreground">Mood</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Travel mood">
                    {MOOD_OPTIONS.map((m) => {
                      const on = selectedMood === m.mood
                      return (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSelectedMood(m.mood)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                            on
                              ? 'bg-primary text-primary-foreground shadow-aurora'
                              : 'border border-border bg-card text-muted-foreground hover:border-aurora hover:text-foreground'
                          }`}
                        >
                          {m.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ai-budget"
                    className="t-label mb-2 block text-muted-foreground"
                  >
                    Budget a day
                  </label>
                  <p className="t-data mb-3 text-foreground">
                    {formatPrice(parseFloat(maxBudget) || 100)}
                  </p>
                  <input
                    id="ai-budget"
                    type="range"
                    min="20"
                    max="400"
                    step="10"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full accent-aurora"
                  />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-6 text-base font-semibold hover:bg-primary-hover"
              >
                <Sparkles className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                {loading ? 'Drawing up an itinerary…' : 'Find me somewhere'}
              </Button>

              {results && results.recommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="hairline-t mt-8 space-y-6 pt-6"
                >
                  <h4 className="t-sub flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5 text-aurora" aria-hidden="true" />
                    Where to go
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {results.recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="rounded-2xl border border-border bg-muted/50 p-5"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h5 className="truncate text-base font-semibold text-foreground">
                              {rec.name}
                            </h5>
                            <p className="t-label mt-1 text-aurora">{rec.country}</p>
                          </div>
                          <span className="t-data shrink-0 rounded-full bg-aurora/15 px-2.5 py-1 text-xs text-aurora">
                            {formatPrice(rec.budgetUSD)}
                          </span>
                        </div>

                        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                          {rec.description}
                        </p>

                        {rec.suggestedItinerary && (
                          <div className="mb-4 space-y-2">
                            <p className="t-label text-muted-foreground">Day by day</p>
                            {rec.suggestedItinerary.map((day) => (
                              <div
                                key={day.day}
                                className="rounded-xl border border-border bg-background/60 p-2.5 text-xs"
                              >
                                <span className="t-data mr-2 text-aurora">Day {day.day}</span>
                                <span className="font-medium text-foreground">{day.title}</span>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {day.activities.join(' · ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 text-aurora">
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">Safety checked</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-orchid">
                            <Utensils className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">
                              {rec.foodRecommendations?.[0] || 'Local dishes'}
                            </span>
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
      )}
    </AnimatePresence>
  )
}
