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
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Globe Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 blur-xl -z-10"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold">
            <span className="text-slate-800">Atlas</span>
            <span className="text-gradient">Aura</span>
          </h1>
        </motion.div>

        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500"
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
          transition={{ duration: 0.5 }}
        >
          <Navigation isLoggedIn={isLoggedIn} onLoginToggle={handleLoginToggle} />
          <main>
            <Hero />
            <MoodSearch />
            <WorldMap key={mapKey} isLoggedIn={isLoggedIn} />
            <CountryStories />
            <HiddenGems />
            <CuriosityFeed isLoggedIn={isLoggedIn} />
            <UserFeatures isLoggedIn={isLoggedIn} />
          </main>
          <Footer />
          
          <AnimatePresence>
            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-24 right-8 z-40 px-4 py-2 rounded-full glass border-amber-500/30`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-slate-600">Signed in as <span className="text-sky-500">{currentUser?.name || 'Traveler'}</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
