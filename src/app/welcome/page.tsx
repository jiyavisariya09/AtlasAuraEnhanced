'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, MapPin, Heart, Compass, ArrowRight, ChevronDown, User, Globe, Camera, BookOpen, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function WelcomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    name: '',
    travelStyle: [] as string[],
    dreamDestinations: '',
    travelFrequency: '',
    bio: '',
    avatar: ''
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreferences(prev => ({ ...prev, avatar: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const isDark = theme === 'dark';

  const storySlides = [
    {
      imageDark: '/welcome-bg.jpg',
      imageLight: '/welcome-bg-day.jpg',
      title: 'Welcome, Traveler',
      subtitle: 'Your journey begins here',
      description: 'Every great adventure starts with a single step. You\'ve just unlocked a world of stories, memories, and hidden gems waiting to be discovered.',
      icon: Compass
    },
    {
      imageDark: '/welcome-journey.jpg',
      imageLight: '/welcome-journey-day.jpg',
      title: 'The Path Ahead',
      subtitle: 'Where will you go?',
      description: 'AtlasAura is more than a travel platform. It\'s a community of wanderers who share not just places, but feelings, moments, and the magic of discovery.',
      icon: MapPin
    },
    {
      imageDark: '/welcome-story.jpg',
      imageLight: '/welcome-story-day.jpg',
      title: 'Share Your Story',
      subtitle: 'Leave your mark',
      description: 'Pin your memories on our world map. Every emotion, every sunset, every unexpected encounter becomes part of a global tapestry of human experience.',
      icon: BookOpen
    },
    {
      imageDark: '/welcome-choose.jpg',
      imageLight: '/welcome-choose-day.jpg',
      title: 'Your Adventure Awaits',
      subtitle: 'Let\'s begin',
      description: 'Would you like to tell us a bit about yourself? It helps us personalize your experience, but it\'s completely optional.',
      icon: Heart
    }
  ];

  const travelStyles = [
    { id: 'solo', label: 'Solo Explorer', icon: User },
    { id: 'couple', label: 'Romantic', icon: Heart },
    { id: 'adventure', label: 'Adventurer', icon: Compass },
    { id: 'culture', label: 'Culture Seeker', icon: BookOpen },
    { id: 'photography', label: 'Photographer', icon: Camera },
    { id: 'relaxed', label: 'Easy Going', icon: Globe },
  ];

  const handleNext = () => {
    if (currentStep < storySlides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save to localStorage for immediate use
      localStorage.setItem('atlasaura-preferences', JSON.stringify(preferences));
      // Save to MongoDB
      fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar: preferences.avatar,
          bio: preferences.bio,
          travelStyle: preferences.travelStyle,
          dreamDestinations: preferences.dreamDestinations,
        }),
      }).catch(() => {});
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const toggleTravelStyle = (style: string) => {
    setPreferences(prev => ({
      ...prev,
      travelStyle: prev.travelStyle.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...prev.travelStyle, style]
    }));
  };

  const currentSlide = storySlides[currentStep];
  const Icon = currentSlide.icon;
  const currentImage = isDark ? currentSlide.imageDark : currentSlide.imageLight;

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-amber-50'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${theme}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
          <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'bg-slate-950/60' : 'bg-amber-50/50'}`} />
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${isDark ? 'from-slate-950 via-transparent to-slate-950/30' : 'from-amber-50 via-transparent to-amber-50/30'}`} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-amber-400/30' : 'bg-amber-500/40'}`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {storySlides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'w-10 bg-gradient-to-r from-amber-400 to-orange-500' 
                  : i < currentStep 
                    ? 'w-5 bg-amber-400' 
                    : `w-5 ${isDark ? 'bg-white/20' : 'bg-slate-300'}`
              }`}
              initial={false}
              animate={{ scale: i === currentStep ? 1 : 0.9 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${isDark ? 'glass' : 'bg-white shadow-lg'}`}>
                <Icon className="w-10 h-10 text-amber-500" />
              </div>
            </motion.div>

            <div className="text-center mb-8">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-amber-500 text-sm uppercase tracking-widest mb-2 font-medium"
              >
                {currentSlide.subtitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                {currentSlide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                {currentSlide.description}
              </motion.p>
            </div>

            {currentStep === storySlides.length - 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    isDark ? 'glass hover:bg-white/10' : 'bg-white/90 hover:bg-white shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className={isDark ? 'text-white' : 'text-slate-800'}>
                      Personalize my experience (optional)
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showPreferences ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showPreferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => avatarInputRef.current?.click()}
                          className={`relative w-20 h-20 rounded-full flex-shrink-0 cursor-pointer overflow-hidden border-2 border-dashed transition-all ${
                            isDark ? 'border-amber-500/50 hover:border-amber-400' : 'border-amber-600/40 hover:border-amber-600'
                          }`}
                        >
                          {preferences.avatar ? (
                            <img src={preferences.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Upload className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Photo</span>
                            </div>
                          )}
                        </div>
                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <div className="flex-1">
                          <label className={`block text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            What should we call you?
                          </label>
                          <Input
                            placeholder="Your name"
                            value={preferences.name}
                            onChange={(e) => setPreferences(prev => ({ ...prev, name: e.target.value }))}
                            className={`${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-slate-200'} text-inherit`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          How do you like to travel? (Select all that apply)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {travelStyles.map((style) => {
                            const isSelected = preferences.travelStyle.includes(style.id);
                            const StyleIcon = style.icon;
                            return (
                              <button
                                key={style.id}
                                onClick={() => toggleTravelStyle(style.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : isDark
                                      ? 'glass text-slate-300 hover:text-white'
                                      : 'bg-white/80 text-slate-600 hover:bg-white shadow-sm'
                                }`}
                              >
                                <StyleIcon className="w-4 h-4" />
                                {style.label}
                                {isSelected && <Check className="w-3 h-3" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Dream destinations?
                        </label>
                        <Input
                          placeholder="Japan, Iceland, Morocco..."
                          value={preferences.dreamDestinations}
                          onChange={(e) => setPreferences(prev => ({ ...prev, dreamDestinations: e.target.value }))}
                          className={`${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-slate-200'} text-inherit`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Tell us about yourself
                        </label>
                        <textarea
                          rows={3}
                          placeholder="I'm a passionate traveler who loves sunsets, street food, and getting lost in old cities..."
                          value={preferences.bio}
                          onChange={(e) => setPreferences(prev => ({ ...prev, bio: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-md text-sm resize-none border outline-none transition-colors ${
                            isDark
                              ? 'bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50'
                              : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-amber-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-8 py-6 text-lg hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25"
                >
                  {currentStep === storySlides.length - 1 ? 'Start Exploring' : 'Continue'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              {currentStep === storySlides.length - 1 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}
                >
                  Skip for now
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {currentStep < storySlides.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleSkip}
            className={`absolute bottom-8 text-sm transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Skip intro →
          </motion.button>
        )}
      </div>
    </div>
  );
}
