'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Compass, MapPin, BookOpen, Heart, ArrowRight, User, 
  Camera, Globe, Upload, Check, Sparkles, ChevronDown, IndianRupee, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ThemeToggle';
import { BorderBeam } from '@/components/ui/border-beam';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WelcomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [preferences, setPreferences] = useState({
    name: '',
    travelStyle: [] as string[],
    dreamDestinations: '',
    budgetTier: 'explorer',
    bio: '',
    avatar: '',
  });

  const storySlides = [
    {
      imageNight: '/welcome-bg.jpg',
      imageDay: '/welcome-bg-day.jpg',
      title: 'Welcome, Traveler',
      subtitle: 'Your journey begins here',
      description: 'Every great adventure starts with a single step. You\'ve just unlocked a world of stories, memories, and hidden gems waiting to be discovered.',
      icon: Compass,
      tag: 'YOUR JOURNEY BEGINS HERE'
    },
    {
      imageNight: '/welcome-journey.jpg',
      imageDay: '/welcome-journey-day.jpg',
      title: 'The Path Less Traveled',
      subtitle: 'Where curiosity leads',
      description: 'AtlasAura isn\'t just another itinerary app. It\'s a community of explorers mapping sensations, sunrises, and unexpected turns off the beaten track.',
      icon: MapPin,
      tag: 'WHERE CURIOSITY LEADS'
    },
    {
      imageNight: '/welcome-story.jpg',
      imageDay: '/welcome-story-day.jpg',
      title: 'Pin Your World Memories',
      subtitle: 'Leave your indelible mark',
      description: 'Pin your stories to our interactive globe. Every serendipitous tea in Istanbul or sunset over Santorini weaves into a global tapestry.',
      icon: BookOpen,
      tag: 'LEAVE YOUR INDELIBLE MARK'
    },
    {
      imageNight: '/welcome-choose.jpg',
      imageDay: '/welcome-choose-day.jpg',
      title: 'Tailor Your Passport',
      subtitle: 'Personalize your travel aura',
      description: 'Tell us a bit about your travel rhythm. We\'ll calibrate custom destination recommendations and budget tools to your exact taste.',
      icon: Heart,
      tag: 'CALIBRATE YOUR EXPEDITION'
    },
  ];

  const travelStyles = [
    { id: 'solo', label: 'Solo Explorer', icon: User },
    { id: 'couple', label: 'Romantic / Duo', icon: Heart },
    { id: 'adventure', label: 'Wild Adventurer', icon: Compass },
    { id: 'culture', label: 'Culture & Heritage', icon: BookOpen },
    { id: 'photography', label: 'Landscape & Photo', icon: Camera },
    { id: 'relaxed', label: 'Slow & Mindful', icon: Globe },
  ];

  const budgetTiers = [
    { id: 'backpacker', label: 'Backpacker', range: '₹15k – ₹40k / trip' },
    { id: 'explorer', label: 'Explorer', range: '₹40k – ₹1,20k / trip' },
    { id: 'luxury', label: 'Luxury Haven', range: '₹1,20k+ / trip' },
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreferences((prev) => ({ ...prev, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const toggleTravelStyle = (style: string) => {
    setPreferences((prev) => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter((s) => s !== style)
        : [...prev.travelStyle, style],
    }));
  };

  const handleNext = async () => {
    if (currentStep < storySlides.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setSaving(true);
      try {
        localStorage.setItem('atlasaura-preferences', JSON.stringify(preferences));
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: preferences.name,
            avatar: preferences.avatar,
            bio: preferences.bio,
            travelStyle: preferences.travelStyle,
            dreamDestinations: preferences.dreamDestinations,
            budgetTier: preferences.budgetTier,
          }),
        });
      } catch (err) {
        console.error('Failed to sync profile:', err);
      } finally {
        router.push('/dashboard');
      }
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const currentSlide = storySlides[currentStep];
  const Icon = currentSlide.icon;

  return (
    <div className="min-h-screen relative overflow-hidden text-foreground flex flex-col justify-between select-none">
      {/* ── Cinematic Photographic Backdrops (Stacked Direct Crossfade) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {storySlides.map((slide, idx) => {
          const isActive = idx === currentStep;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out [transform:translateZ(0)] ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Night layer */}
              <div className="hero-layer theme-night-only">
                <img
                  src={slide.imageNight}
                  alt=""
                  className="hero-media"
                />
                {/* Night Atmospheric Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B14]/95 via-[#080B14]/65 to-[#080B14]/75 backdrop-blur-[0.5px]" />
              </div>

              {/* Day layer */}
              <div className="hero-layer theme-day-only">
                <img
                  src={slide.imageDay}
                  alt=""
                  className="hero-media"
                />
                {/* Day Warm Sunlit Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8FC]/95 via-[#F6F8FC]/60 to-[#F6F8FC]/70 backdrop-blur-[0.5px]" />
              </div>
            </div>
          );
        })}

        {/* Ambient Floating Dust / Light Motifs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-amber-400/40 dark:bg-aurora/40 blur-[1px] animate-pulse" />
          <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-orange-400/30 dark:bg-orchid/40 blur-[1px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-amber-400/35 dark:bg-aurora/30 blur-[1px] animate-pulse" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-orange-300/40 dark:bg-violet/40 blur-[1px] animate-pulse" style={{ animationDelay: '3.5s' }} />
        </div>
      </div>

      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="h-7 w-7 text-aurora" aria-hidden="true">
            <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
            <ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <circle cx="21.2" cy="10.4" r="2.5" fill="currentColor" />
          </svg>
          <span className="font-sans font-bold text-lg text-foreground tracking-tight">
            Atlas<span className="text-aurora">Aura</span>
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-2">
          {storySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-amber-500 dark:bg-aurora shadow-sm'
                  : i < currentStep
                  ? 'w-3 bg-amber-500/50 dark:bg-aurora/50'
                  : 'w-3 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground rounded-full px-3"
          >
            Skip Intro
          </Button>
          <ThemeToggle compact />
        </div>
      </header>

      {/* ── Main Content Body ─────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="w-full"
          >
            {/* Slide Tag & Icon */}
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="w-16 h-16 rounded-full bg-white/90 dark:bg-card/90 border border-amber-500/30 dark:border-aurora/40 flex items-center justify-center shadow-lg mb-4 text-amber-500 dark:text-aurora backdrop-blur-md"
              >
                <Icon className="w-8 h-8" />
              </motion.div>

              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-aurora drop-shadow-sm">
                {currentSlide.tag}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground mt-2 drop-shadow-sm">
                {currentSlide.title}
              </h1>

              <p className="max-w-xl mx-auto mt-3 text-sm sm:text-base text-foreground/80 dark:text-muted-foreground leading-relaxed">
                {currentSlide.description}
              </p>
            </div>

            {/* Step 4: Interactive Personalization Form */}
            {currentStep === storySlides.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8"
              >
                <div className="relative rounded-3xl bg-card/85 backdrop-blur-xl border border-border p-6 sm:p-8 shadow-cast">
                  <BorderBeam
                    size={140}
                    duration={10}
                    colorFrom="hsl(var(--aurora))"
                    colorTo="hsl(var(--violet))"
                    borderWidth={1.5}
                  />

                  {/* Header Bar */}
                  <button
                    type="button"
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-aurora" />
                      <div>
                        <h2 className="text-base font-semibold text-foreground">
                          Customise Your Traveler Profile
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Optional details to personalise your dashboard and recommendations
                        </p>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: showPreferences ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Collapsible Content */}
                  <AnimatePresence>
                    {showPreferences && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="mt-6 space-y-6 pt-6 border-t border-border"
                      >
                        {/* Avatar & Name */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div
                            onClick={() => avatarInputRef.current?.click()}
                            className="relative w-16 h-16 rounded-full shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-border hover:border-aurora transition-colors group flex items-center justify-center bg-card/60"
                          >
                            {preferences.avatar ? (
                              <img src={preferences.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-aurora">
                                <Upload className="w-4 h-4" />
                                <span className="text-[9px] uppercase font-bold mt-0.5">Photo</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                          <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                              Display Name
                            </label>
                            <Input
                              placeholder="e.g. Captain Nemo"
                              value={preferences.name}
                              onChange={(e) => setPreferences((prev) => ({ ...prev, name: e.target.value }))}
                              className="h-10 bg-card/60 border-border text-foreground"
                            />
                          </div>
                        </div>

                        {/* Travel Style Chips */}
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Preferred Travel Styles
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {travelStyles.map((style) => {
                              const isSelected = preferences.travelStyle.includes(style.id);
                              const StyleIcon = style.icon;
                              return (
                                <button
                                  type="button"
                                  key={style.id}
                                  onClick={() => toggleTravelStyle(style.id)}
                                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                    isSelected
                                      ? 'border-aurora bg-aurora/15 text-aurora shadow-sm'
                                      : 'border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/80'
                                  }`}
                                >
                                  <StyleIcon className="w-3.5 h-3.5" />
                                  <span>{style.label}</span>
                                  {isSelected && <Check className="w-3 h-3 ml-auto text-aurora" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Budget Preference */}
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                            Default Trip Budget Tier
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {budgetTiers.map((tier) => {
                              const isSelected = preferences.budgetTier === tier.id;
                              return (
                                <button
                                  type="button"
                                  key={tier.id}
                                  onClick={() => setPreferences((prev) => ({ ...prev, budgetTier: tier.id }))}
                                  className={`p-3 rounded-xl border text-left transition-all ${
                                    isSelected
                                      ? 'border-aurora bg-aurora/15 text-foreground'
                                      : 'border-border bg-card/40 text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold">{tier.label}</span>
                                    <IndianRupee className={`w-3.5 h-3.5 ${isSelected ? 'text-aurora' : 'text-muted-foreground'}`} />
                                  </div>
                                  <span className="text-[11px] text-muted-foreground">{tier.range}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Dream Destinations */}
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                            Dream Destinations
                          </label>
                          <Input
                            placeholder="Kyoto, Amalfi Coast, Ladakh, Patagonia..."
                            value={preferences.dreamDestinations}
                            onChange={(e) => setPreferences((prev) => ({ ...prev, dreamDestinations: e.target.value }))}
                            className="h-10 bg-card/60 border-border text-foreground"
                          />
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                            Traveler Motto / Bio
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Chasing sunsets, mountain ridges, and authentic street flavors..."
                            value={preferences.bio}
                            onChange={(e) => setPreferences((prev) => ({ ...prev, bio: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-card/60 border border-border text-foreground placeholder:text-muted-foreground focus:border-aurora outline-none resize-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Navigation CTA */}
            <div className="flex flex-col items-center justify-center gap-3">
              <Button
                onClick={handleNext}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600 dark:bg-aurora dark:hover:bg-aurora-bright text-white dark:text-ink-void font-semibold px-9 py-6 rounded-full shadow-lg text-base transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Setting up your passport...
                  </span>
                ) : currentStep === storySlides.length - 1 ? (
                  <span className="flex items-center gap-2">
                    Enter Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 font-medium"
              >
                Skip Intro →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-aurora" />
          <span>Your travel data is private and encrypted</span>
        </div>
        <span>AtlasAura © 2026</span>
      </footer>
    </div>
  );
}
