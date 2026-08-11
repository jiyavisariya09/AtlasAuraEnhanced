'use client';

import { motion } from 'framer-motion';
import { Globe, Heart, Github, Twitter, Instagram, Mail, ArrowUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    explore: [
      { name: 'Memory Map', href: '#memory-map' },
      { name: 'Country Stories', href: '#stories' },
      { name: 'Hidden Gems', href: '#' },
      { name: 'Mood Search', href: '#explore' },
    ],
    community: [
      { name: 'Curiosity Feed', href: '#curiosity' },
      { name: 'Traveler Q&A', href: '#curiosity' },
      { name: 'Share Memory', href: '#memory-map' },
      { name: 'Guidelines', href: '#' },
    ],
    about: [
      { name: 'Our Story', href: '#' },
      { name: 'Team', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Press', href: '#' },
    ],
  };

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-900" />
              </div>
              <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Atlas<span className="text-amber-400">Aura</span>
              </span>
            </motion.a>
            <p className={`mb-6 max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Discover the world through stories, not reviews. 
              A purpose-driven platform for meaningful travel experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all duration-500 ease-smooth transform-gpu ${isDark ? 'text-slate-400 hover:text-sky-400 hover:border-sky-400/30' : 'text-slate-500 hover:text-sky-500 hover:border-sky-300'}`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 ease-smooth ${isDark ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 ease-smooth ${isDark ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`transition-colors duration-300 ease-smooth ${isDark ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500'}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl glass mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Get Travel Stories in Your Inbox
              </h4>
              <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>
                Weekly inspiration from travelers around the world.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 md:w-64 px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-amber-500/50 ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium hover:from-sky-400 hover:to-indigo-400 transition-all duration-500 ease-smooth transform-gpu hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.97]">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for travelers everywhere
          </p>
          <div className={`flex items-center gap-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            <a href="#" className="hover:text-sky-400 transition-colors duration-300 ease-smooth">Privacy Policy</a>
            <a href="#" className="hover:text-sky-400 transition-colors duration-300 ease-smooth">Terms of Service</a>
            <a href="#" className="hover:text-sky-400 transition-colors duration-300 ease-smooth">Cookies</a>
          </div>
        </div>

        {/* Scroll to Top */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg hover:shadow-sky-500/30 transition-all duration-500 ease-smooth z-40"
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.93 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ArrowUp className="w-5 h-5 text-slate-900" />
        </motion.button>
      </div>
    </footer>
  );
}
