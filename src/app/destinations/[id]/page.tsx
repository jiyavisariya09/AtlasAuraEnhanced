'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Star, Calendar, DollarSign, ShieldCheck, Utensils, 
  Compass, ChevronLeft, Heart, Share2, Sparkles, MessageSquare, 
  ThumbsUp, Check, AlertCircle, Globe, Award, Bus, Send, Plus
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useCurrency } from '@/context/CurrencyContext'
import ThemeToggle from '@/components/ThemeToggle'
import CurrencySelector from '@/components/CurrencySelector'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const destinationId = params?.id as string

  const { theme } = useTheme()
  const { formatPrice } = useCurrency()
  const isDark = theme === 'dark'

  const [destination, setDestination] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'culture' | 'food' | 'reviews'>('overview')

  // Review Form State
  const [rating, setRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!destinationId) return
    setLoading(true)
    fetch(`/api/destinations/${destinationId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Destination not found')
        return res.json()
      })
      .then((data) => {
        setDestination(data.destination)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [destinationId])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewContent.trim()) return

    const user = getCurrentUser()
    if (!user) {
      router.push('/signin')
      return
    }

    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          rating,
          content: reviewContent,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setDestination((prev: any) => ({
          ...prev,
          reviews: [data.review, ...(prev?.reviews || [])],
        }))
        setReviewContent('')
        setReviewSuccess(true)
        setTimeout(() => setReviewSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium animate-pulse">Loading destination details...</p>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'}`}>
        <h2 className="text-3xl font-bold mb-2">Destination Not Found</h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          The destination you are looking for does not exist in our catalog.
        </p>
        <Link href="/#explore">
          <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full">
            <ChevronLeft className="w-4 h-4 mr-1" /> Return to Discover
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Sticky Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/#explore" className="flex items-center gap-2 text-sm font-bold hover:text-amber-500 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <CurrencySelector />
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-full border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-500'
                  : isDark
                  ? 'border-white/10 hover:bg-white/5 text-slate-400'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-[480px] w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
              {destination.region}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{destination.rating} / 5.0</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-white">
              Crowd: <span className="capitalize">{destination.crowdLevel}</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-3 tracking-tight">
            {destination.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
            {destination.description}
          </p>
        </div>
      </section>

      {/* Fast Facts Bar */}
      <div className={`border-b ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated Budget</span>
            <span className="text-lg font-bold text-amber-500">{formatPrice(destination.budgetUSD)} <span className="text-xs font-normal">/ day</span></span>
          </div>
          <div>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Best Time to Visit</span>
            <span className="text-sm font-semibold">{destination.bestTimeToVisit}</span>
          </div>
          <div>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Safety Index</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-4 h-4" /> {destination.safetyScore} / 5.0
            </span>
          </div>
          <div>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Travel Purposes</span>
            <div className="flex flex-wrap gap-1 justify-center sm:justify-start mt-0.5">
              {destination.purposes?.map((p: string) => (
                <span key={p} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 capitalize">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 gap-6 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview & Highlights' },
            { id: 'culture', label: 'Cultural Insights' },
            { id: 'food', label: 'Culinary Guide' },
            { id: 'reviews', label: `Reviews (${destination.reviews?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-bold whitespace-nowrap relative transition-colors ${
                activeTab === tab.id
                  ? 'text-amber-500'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Must-Visit Attractions */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-amber-500" /> Must-Visit Attractions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {destination.mustVisit?.map((attraction: string, i: number) => (
                  <div
                    key={attraction}
                    className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${
                      isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-3">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-base mb-1">{attraction}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Iconic landmark highly recommended by travelers in {destination.name}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Etiquette & Safety */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" /> Local Etiquette & Rules
              </h3>
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.etiquette?.map((rule: string) => (
                    <div key={rule} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Culture */}
        {activeTab === 'culture' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {destination.culturalInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traditions & Festivals */}
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-5 h-5" /> Local Traditions
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {destination.culturalInfo.traditions?.map((trad: string) => (
                      <li key={trad} className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {trad}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-sky-400">
                    <Calendar className="w-5 h-5" /> Festivals & Celebrations
                  </h4>
                  <ul className="space-y-2">
                    {destination.culturalInfo.festivals?.map((fest: string) => (
                      <li key={fest} className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {fest}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Do's & Don'ts */}
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-lg font-bold mb-4 text-emerald-400">Cultural Do's</h4>
                  <ul className="space-y-2 mb-6">
                    {destination.culturalInfo.dos?.map((doItem: string) => (
                      <li key={doItem} className="text-sm flex items-start gap-2 text-emerald-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{doItem}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-bold mb-3 text-rose-400">Cultural Don'ts</h4>
                  <ul className="space-y-2">
                    {destination.culturalInfo.donts?.map((dontItem: string) => (
                      <li key={dontItem} className="text-sm flex items-start gap-2 text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{dontItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Cultural insights are being curated for this region.</p>
            )}
          </motion.div>
        )}

        {/* Tab 3: Food Guide */}
        {activeTab === 'food' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-400" /> Culinary Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {destination.foodTips?.map((food: string, index: number) => (
                <div
                  key={food}
                  className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base mb-1">{food}</h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Must-try authentic dish to experience the local gastronomic culture.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Reviews & Rating Form */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Write Review Form */}
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h4 className="text-lg font-bold mb-2">Share Your Experience</h4>
              <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Have you traveled to {destination.name}? Leave your review and help fellow wanderers!
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Your Review</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={3}
                    placeholder="Describe your trip, local gems, crowd levels, and recommendations..."
                    className={`w-full p-3.5 rounded-xl text-sm outline-none border transition-all ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-400'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                    }`}
                  />
                </div>

                {reviewSuccess && (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Review submitted and contribution points awarded!
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submittingReview || !reviewContent.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl px-6"
                >
                  {submittingReview ? 'Submitting...' : <><Send className="w-4 h-4 mr-2" /> Post Review</>}
                </Button>
              </form>
            </div>

            {/* Existing Community Reviews List */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold">Community Traveler Reviews ({destination.reviews?.length || 0})</h4>
              {destination.reviews?.length > 0 ? (
                destination.reviews.map((rev: any) => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || '/avatars/avatar-default.jpg'}
                          alt={rev.user?.name || 'Traveler'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-sm">{rev.user?.name || 'Atlas Explorer'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{rev.content}</p>
                  </div>
                ))
              ) : (
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No reviews yet. Be the first to review {destination.name}!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
