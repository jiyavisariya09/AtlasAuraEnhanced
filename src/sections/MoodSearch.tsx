'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { moodOptions, countries } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import type { TravelMood } from '@/types';

export default function MoodSearch() {
  const [selectedMood, setSelectedMood] = useState<TravelMood>('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const filteredCountries = selectedMood === 'all'
    ? countries
    : countries.filter(c => c.purposes.includes(selectedMood));

  return (
    <section id="explore" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-drift" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How do you want to <span className="text-gradient">feel</span>?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select your travel mood and discover countries that match your soul's calling.
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <motion.button
            onClick={() => setSelectedMood('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-500 ease-smooth transform-gpu ${
              selectedMood === 'all'
                ? isDark ? 'bg-white text-slate-900 shadow-lg shadow-white/10' : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : isDark ? 'glass text-slate-300 hover:text-white' : 'glass text-slate-700 hover:text-slate-900'
            }`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          >
            All Destinations
          </motion.button>
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id as TravelMood)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all duration-500 ease-smooth transform-gpu ${
                selectedMood === mood.id
                  ? `bg-gradient-to-r ${mood.color} text-white font-bold shadow-lg`
                  : isDark ? 'glass text-slate-300 hover:text-white' : 'glass text-slate-700 hover:text-slate-900'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            >
              <span className="font-bold">{mood.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Country Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md transition-all duration-500 ease-smooth group-hover:shadow-2xl group-hover:shadow-sky-500/15 group-hover:-translate-y-2 transform-gpu">
                  {/* Image */}
                  <img
                    src={country.image}
                    alt={country.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.06] will-change-transform"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-500 ease-smooth" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="transform transition-transform duration-500 ease-smooth group-hover:-translate-y-1">
                      <span className="text-xs text-sky-400 uppercase tracking-wider font-medium">
                        {country.region}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{country.name}</h3>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-smooth translate-y-2 group-hover:translate-y-0">
                        {country.description}
                      </p>
                    </div>
                    
                    {/* Purpose Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {country.purposes.slice(0, 2).map((purpose) => (
                        <span
                          key={purpose}
                          className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-slate-300 backdrop-blur-sm"
                        >
                          {purpose}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Glow — subtle color shift on bottom */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-smooth pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-500/15 to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#stories"
            className="group inline-flex items-center gap-2 text-sky-500 hover:text-sky-400 transition-colors duration-300 ease-smooth font-medium"
          >
            View all country stories
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
