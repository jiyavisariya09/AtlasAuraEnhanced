import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import MoodSearch from './sections/MoodSearch';
import WorldMap from './sections/WorldMap';
import CountryStories from './sections/CountryStories';
import HiddenGems from './sections/HiddenGems';
import CuriosityFeed from './sections/CuriosityFeed';
import UserFeatures from './sections/UserFeatures';
import Footer from './sections/Footer';
import WelcomePage from './pages/WelcomePage';
import UserDashboard from './pages/UserDashboard';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

// Main Landing Page Component
function LandingPage({ isLoggedIn, onLoginToggle }: { isLoggedIn: boolean; onLoginToggle: () => void }) {
  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />
      <main>
        <Hero />
        <MoodSearch />
        <WorldMap isLoggedIn={isLoggedIn} />
        <CountryStories />
        <HiddenGems />
        <CuriosityFeed isLoggedIn={isLoggedIn} />
        <UserFeatures isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
      
      {/* Floating Theme Toggle */}
      <div className="fixed bottom-8 right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Login Status Indicator */}
      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 z-40 px-4 py-2 rounded-full glass border-amber-500/30"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Signed in as <span className="text-amber-500">Alex Wanderer</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Loading Screen Component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="w-10 h-10 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl"
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-800"
        >
          Atlas<span className="text-amber-400">Aura</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-500 mt-2"
        >
          Loading your world...
        </motion.p>
      </div>
    </motion.div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved login state
  useEffect(() => {
    const savedUser = localStorage.getItem('atlasaura-user');
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  // Also listen for storage changes (when signin page sets it)
  useEffect(() => {
    const handleStorage = () => {
      const savedUser = localStorage.getItem('atlasaura-user');
      setIsLoggedIn(!!savedUser);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLoginToggle = () => {
    const newState = !isLoggedIn;
    setIsLoggedIn(newState);
    if (newState) {
      localStorage.setItem('atlasaura-user', 'true');
    } else {
      localStorage.removeItem('atlasaura-user');
    }
  };

  return (
    <ThemeProvider>
      <Router>
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
              <Routes>
                {/* Landing Page Route */}
                <Route 
                  path="/" 
                  element={
                    <LandingPage 
                      isLoggedIn={isLoggedIn} 
                      onLoginToggle={handleLoginToggle} 
                    />
                  } 
                />
                
                {/* Welcome Page Route (after signup) */}
                <Route 
                  path="/welcome" 
                  element={<WelcomePage />} 
                />
                
                {/* Sign In Route */}
                <Route 
                  path="/signin" 
                  element={<SignInPage />} 
                />

                {/* Sign Up Route */}
                <Route 
                  path="/signup" 
                  element={<SignUpPage />} 
                />
                
                {/* User Dashboard Route */}
                <Route 
                  path="/dashboard" 
                  element={
                    localStorage.getItem('atlasaura-user') ? (
                      <UserDashboard />
                    ) : (
                      <Navigate to="/signin" replace />
                    )
                  } 
                />
                
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          )}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
