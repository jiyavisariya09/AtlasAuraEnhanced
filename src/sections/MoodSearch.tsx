'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Purpose-Based Discovery</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How do you want to <span className="text-gradient">feel</span>?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            Select your travel mood and discover countries that match your soul's calling.
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={() => setSelectedMood('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              selectedMood === 'all'
                ? isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                : isDark ? 'glass text-slate-300 hover:text-white' : 'glass text-slate-700 hover:text-slate-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Destinations
          </motion.button>
          {moodOptions.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id as TravelMood)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all ${
                selectedMood === mood.id
                  ? `bg-gradient-to-r ${mood.color} text-white font-bold`
                  : isDark ? 'glass text-slate-300 hover:text-white' : 'glass text-slate-700 hover:text-slate-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-bold">{mood.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Country Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  {/* Image */}
                  <img
                    src={country.image}
                    alt={country.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                      <span className="text-xs text-amber-400 uppercase tracking-wider">
                        {country.region}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{country.name}</h3>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {country.description}
                      </p>
                    </div>
                    
                    {/* Purpose Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {country.purposes.slice(0, 2).map((purpose) => (
                        <span
                          key={purpose}
                          className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-slate-300"
                        >
                          {purpose}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                  </div>
                </div>

                {/* Card Border Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/30 group-hover:via-orange-500/30 group-hover:to-amber-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#stories"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            View all country stories
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
