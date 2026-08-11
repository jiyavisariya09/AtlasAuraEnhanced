'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navigation from '@/sections/Navigation';
import { getCurrentUser, type AuthUser } from '@/lib/auth';
import Hero from '@/sections/Hero';
import MoodSearch from '@/sections/MoodSearch';
import CountryStories from '@/sections/CountryStories';
import HiddenGems from '@/sections/HiddenGems';
import CuriosityFeed from '@/sections/CuriosityFeed';
import UserFeatures from '@/sections/UserFeatures';
import Footer from '@/sections/Footer';

const WorldMap = dynamic(() => import('@/sections/WorldMap'), { ssr: false });

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Globe Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 blur-xl -z-10"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold">
            <span className="text-white">Atlas</span>
            <span className="text-gradient">Aura</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-slate-500 mt-2 tracking-wider"
          >
            Purpose-driven travel
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
    setMapKey(1);
  }, []);

  const handleLoginToggle = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    if (!newState) {
      localStorage.removeItem('atlasaura-user');
      setCurrentUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden theme-transition">
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <Navigation isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} />
          <main>
            <Hero />
            <MoodSearch />
            <WorldMap key={mapKey} />
            <CountryStories />
            <HiddenGems />
            <CuriosityFeed isLoggedIn={isLoggedIn} />
            <UserFeatures isLoggedIn={isLoggedIn} />
          </main>
          <Footer />
          
          <AnimatePresence>
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                className="fixed bottom-24 right-8 z-40 px-4 py-2 rounded-full glass border-sky-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-breathe" />
                  <span className="text-sm text-slate-500">Signed in as <span className="text-sky-400 font-medium">{currentUser?.name || 'Traveler'}</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
