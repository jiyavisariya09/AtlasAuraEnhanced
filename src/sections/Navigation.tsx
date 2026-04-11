'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import { getCurrentUser, signOut, type AuthUser } from '@/lib/auth';

interface NavigationProps {
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export default function Navigation({ isLoggedIn, onLoginToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? isDark
            ? 'glass py-3'
            : 'bg-white/95 backdrop-blur-xl border-b border-sky-100 py-3 shadow-sm'
          : 'bg-transparent py-5'
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
            <span className={`text-xl font-bold tracking-tight ${scrolledLight ? 'text-slate-800' : 'text-white'}`}>
              Atlas<span className="text-sky-400">Aura</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className={`px-5 py-2 text-sm font-bold rounded-full transition-all duration-200 ${
                  scrolledLight
                    ? 'text-slate-700 hover:text-sky-600 hover:bg-sky-50'
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
            <ThemeToggle />
            {isLoggedIn ? (
              <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    scrolledLight ? 'bg-sky-50 text-slate-700 hover:bg-sky-100' : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  {user?.name?.split(' ')[0] || 'Traveler'}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className={`font-semibold ${scrolledLight ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}
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
                  className={`font-bold ${scrolledLight ? 'text-slate-700 hover:text-sky-600' : 'text-white/80 hover:text-white'}`}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/signup')}
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold hover:from-sky-400 hover:to-indigo-400 shadow-md shadow-sky-200/50 px-5"
                >
                  Join Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className={`p-2 rounded-lg ${scrolledLight ? 'text-slate-700' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

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
