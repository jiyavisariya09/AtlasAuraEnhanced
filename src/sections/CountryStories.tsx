'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, DollarSign, Users, X, Star, Compass } from 'lucide-react';
import { countries } from '@/data/mockData';
import type { Country } from '@/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export default function CountryStories() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const costMeta: Record<string, { label: string; bg: string; text: string }> = {
    budget:   { label: '$ Budget',   bg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100', text: isDark ? 'text-emerald-400' : 'text-emerald-700' },
    moderate: { label: '$$ Moderate', bg: isDark ? 'bg-sky-500/20'     : 'bg-sky-100',     text: isDark ? 'text-sky-400'     : 'text-sky-700'     },
    luxury:   { label: '$$$ Luxury',  bg: isDark ? 'bg-indigo-500/20'  : 'bg-indigo-100',  text: isDark ? 'text-indigo-400'  : 'text-indigo-700'  },
  };

  const c = costMeta;

  return (
    <section id="stories" className={`relative py-24 overflow-hidden ${isDark ? 'bg-transparent' : 'bg-sky-50/40'}`}>
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/8' : 'bg-sky-300/20'}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/8' : 'bg-indigo-200/20'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border ${isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-sky-200 text-slate-600'}`}>
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-medium">Country Story Cards</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Stories That <span className="text-gradient">Inspire</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Dive into visual narratives that capture the essence of each destination.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group cursor-pointer"
              onClick={() => setSelectedCountry(country)}
            >
              <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-slate-800/60 border-white/8 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100'
              }`}>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-white">{country.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${c[country.costLevel]?.bg ?? 'bg-slate-500/20'} ${c[country.costLevel]?.text ?? 'text-slate-300'}`}>
                      {c[country.costLevel]?.label ?? country.costLevel}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{country.region}</span>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 transition-colors group-hover:text-sky-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {country.name}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {country.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {country.purposes.slice(0, 3).map((p) => (
                      <span key={p} className={`px-2 py-0.5 text-xs rounded-full capitalize font-medium ${
                        isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-700'
                      }`}>{p}</span>
                    ))}
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{country.vibe}</span>
                    <span className="text-xs font-semibold text-sky-500 group-hover:translate-x-1 transition-transform inline-block">
                      Read Story →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative max-w-3xl w-full rounded-3xl overflow-hidden border shadow-2xl ${
                isDark
                  ? 'bg-slate-900 border-white/10'
                  : 'bg-white border-slate-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero image — fixed height, no scroll */}
              <div className="relative h-64 shrink-0">
                <img src={selectedCountry.image} alt={selectedCountry.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-5 left-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-300" />
                    <span className="text-sm text-slate-200">{selectedCountry.region}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedCountry.name}</h2>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: DollarSign, label: 'Cost', value: selectedCountry.costLevel, cap: true },
                    { icon: Star,       label: 'Rating', value: `${selectedCountry.rating}/5` },
                    { icon: Compass,    label: 'Vibe',   value: selectedCountry.vibe },
                  ].map(({ icon: Icon, label, value, cap }) => (
                    <div key={label} className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-sky-50 border border-sky-100'}`}>
                      <Icon className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                      <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                      <p className={`text-sm font-semibold ${cap ? 'capitalize' : ''} ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Story */}
                <div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>The Story</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedCountry.description}</p>
                </div>

                {/* Culture */}
                <div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Culture & Heritage</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedCountry.culture}</p>
                </div>

                {/* Hidden Gems */}
                <div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Hidden Gems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.hiddenGems.map((gem, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-100 text-sky-700 border border-sky-200'
                      }`}>✦ {gem}</span>
                    ))}
                  </div>
                </div>

                {/* Perfect For */}
                <div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.purposes.map((p) => (
                      <span key={p} className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${
                        isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        <Users className="w-3 h-3" />{p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 pt-1">
                  <Button className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold">
                    <MapPin className="w-4 h-4 mr-2" />View on Map
                  </Button>
                  <Button variant="outline" className={`flex-1 font-semibold ${
                    isDark ? 'border-white/15 text-slate-200 hover:bg-white/5' : 'border-sky-300 text-sky-700 hover:bg-sky-50'
                  }`}>
                    <BookOpen className="w-4 h-4 mr-2" />Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
