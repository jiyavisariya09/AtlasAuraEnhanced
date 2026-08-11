'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Menu, X, User, Search, MapPin, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth';
import { countries } from '@/data/mockData';
import { getAuthorAvatar } from '@/lib/utils';

interface NavigationProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export default function Navigation({ isLoggedIn, onLoginToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const PURPOSES = [
    { id: 'solo', label: 'Solo', emoji: '🎒' },
    { id: 'honeymoon', label: 'Honeymoon', emoji: '💕' },
    { id: 'adventure', label: 'Adventure', emoji: '⛰️' },
    { id: 'culture', label: 'Culture', emoji: '🏛️' },
    { id: 'calm', label: 'Peace', emoji: '🧘' },
  ];

  const searchResults = countries.filter(c => {
    const matchesName = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurpose = !selectedPurpose || c.purposes.includes(selectedPurpose);
    return (searchQuery.trim() || selectedPurpose) && matchesName && matchesPurpose;
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) setUser(getCurrentUser());
    else setUser(null);
  }, [isLoggedIn]);

  const handleSignOut = () => {
    signOut();
    onLoginToggle();
  };

  const navLinks = [
    { name: 'Explore', href: '#explore' },
    { name: 'World Map', href: '#world-map' },
    { name: 'Stories', href: '#stories' },
    { name: 'Curiosity', href: '#curiosity' },
  ];

  const scrolledLight = isScrolled && !isDark;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-smooth transform-gpu ${
        isScrolled
          ? isDark
            ? 'glass py-3 shadow-lg border-b border-white/10'
            : 'bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-md shadow-sky-900/5'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <motion.a href="/" className="flex items-center gap-2.5 group" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-200">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-500 ease-smooth ${scrolledLight ? 'text-slate-900' : 'text-white'}`}>
              Atlas<span className="text-sky-400">Aura</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-500 ease-smooth ${
                  scrolledLight
                    ? 'text-slate-700 hover:text-sky-600 hover:bg-sky-100/60'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>

          {/* Auth + Theme */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search button */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setShowSearch(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ease-smooth ${
                scrolledLight ? 'bg-sky-100/70 border border-sky-200/80 text-slate-700 hover:bg-sky-100' : 'bg-white/10 border border-white/10 text-white/80 hover:bg-white/15'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </motion.button>
            <ThemeToggle scrolledLight={scrolledLight} />
            {isLoggedIn ? (
              <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-500 ease-smooth ${
                    scrolledLight ? 'bg-sky-100/70 text-slate-700 hover:bg-sky-100' : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <img
                    src={user?.avatar || getAuthorAvatar(user?.name)}
                    alt={user?.name || 'User'}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  {user?.name?.split(' ')[0] || 'Traveler'}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`font-semibold transition-all duration-500 ease-smooth ${scrolledLight ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}
                >
                  Sign Out
                </Button>
              </motion.div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/signin')}
                  className={`font-bold transition-all duration-500 ease-smooth ${scrolledLight ? 'text-slate-800 hover:text-sky-600' : 'text-white/80 hover:text-white'}`}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/signup')}
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold hover:from-sky-400 hover:to-indigo-400 shadow-md shadow-sky-200/50 px-5 transition-all duration-500 ease-smooth transform-gpu hover:scale-105 active:scale-95"
                >
                  Join Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle scrolledLight={scrolledLight} />
            <button
              className={`p-2 rounded-lg transition-colors duration-500 ease-smooth ${scrolledLight ? 'text-slate-800' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowSearch(false); setSearchQuery(''); setSelectedPurpose(null); }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden ${
                isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-200'
              }`}
            >
              <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <Search className="w-5 h-5 flex-shrink-0 text-slate-400" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search countries, regions, vibes..."
                  className={`flex-1 text-sm outline-none bg-transparent ${
                    isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSelectedPurpose(null); }}
                  className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className={`flex gap-2 px-4 py-3 border-b overflow-x-auto ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                {PURPOSES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPurpose(prev => prev === p.id ? null : p.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedPurpose === p.id
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md'
                        : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    <span>{p.emoji}</span>{p.label}
                  </button>
                ))}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map(country => (
                    <button
                      key={country.id}
                      onClick={() => {
                        setShowSearch(false); setSearchQuery(''); setSelectedPurpose(null);
                        document.getElementById('world-map')?.scrollIntoView({ behavior: 'smooth' });
                        const coords: Record<string, [number, number]> = {
                          Japan: [36.2048, 138.2529], Morocco: [31.7917, -7.0926],
                          Norway: [60.472, 8.4689], Indonesia: [-0.7893, 113.9213], Greece: [39.0742, 21.8243],
                        };
                        const coord = coords[country.name];
                        if (coord) setTimeout(() => window.dispatchEvent(new CustomEvent('atlasaura-focus-map', { detail: { lat: coord[0], lng: coord[1] } })), 600);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-sky-50'
                      }`}
                    >
                      <img src={country.image} alt={country.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{country.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-600'
                          }`}>{country.region}</span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{country.vibe}</p>
                        <div className="flex gap-1 mt-1">
                          {country.purposes.slice(0, 3).map(p => (
                            <span key={p} className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                              isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                            }`}>{p}</span>
                          ))}
                        </div>
                      </div>
                      <Compass className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                    </button>
                  ))
                ) : (searchQuery || selectedPurpose) ? (
                  <div className={`px-4 py-8 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No countries found. Try a different search.
                  </div>
                ) : (
                  <div className={`px-4 py-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Type a country name or select a travel purpose above
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t mt-3 ${isDark ? 'glass border-white/10' : 'bg-white/98 backdrop-blur-xl border-sky-100'}`}
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isDark ? 'text-white/80 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-sky-600 hover:bg-sky-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-sky-100/50 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className={`block px-4 py-3 rounded-xl text-sm font-bold ${isDark ? 'text-white/80 hover:bg-white/5' : 'text-slate-700 hover:bg-sky-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                      My Dashboard
                    </Link>
                    <Button className="w-full font-bold" variant="outline" onClick={() => { onLoginToggle(); setIsMobileMenuOpen(false); }}>Sign Out</Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full font-bold" variant="outline" onClick={() => { router.push('/signin'); setIsMobileMenuOpen(false); }}>Sign In</Button>
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold" onClick={() => { router.push('/signup'); setIsMobileMenuOpen(false); }}>Join Free</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
