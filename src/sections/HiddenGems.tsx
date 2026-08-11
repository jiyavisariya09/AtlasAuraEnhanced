'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, MapPin, ArrowRight, Mountain, TreePine, Landmark, X, Star, Clock, Users, Navigation, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { hiddenGems } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import type { HiddenGem } from '@/types';

function GemModal({ gem, onClose }: { gem: HiddenGem; onClose: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeImg, setActiveImg] = useState(0);
  const images = gem.images?.length ? gem.images : [gem.image];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border border-slate-100'}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-600'} shadow-lg`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Photo Gallery */}
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]}
              alt={gem.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Gallery nav */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-5' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-4 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-out ${i === activeImg ? 'border-amber-400 scale-105' : 'border-white/30'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{gem.country}</span>
                {gem.coordinates && (
                  <>
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>•</span>
                    <Navigation className="w-3 h-3 text-slate-400" />
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{gem.coordinates}</span>
                  </>
                )}
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{gem.name}</h2>
            </div>
            {gem.rating && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-500 font-bold text-sm">{gem.rating}</span>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {gem.bestTime && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Best Time</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{gem.bestTime}</p>
                </div>
              </div>
            )}
            {gem.visitors && (
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <Users className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Visitors</p>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{gem.visitors}</p>
                </div>
              </div>
            )}
          </div>

          {/* Full description */}
          <div>
            <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>About this place</h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {gem.fullDescription || gem.description}
            </p>
          </div>

          {/* Tips */}
          {gem.tips?.length && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Traveler Tips
              </h3>
              <ul className="space-y-2">
                {gem.tips.map((tip, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HiddenGems() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedGem, setSelectedGem] = useState<HiddenGem | null>(null);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Mountain> = { nature: TreePine, culture: Landmark, adventure: Mountain };
    return icons[type] || MapPin;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      nature: 'from-emerald-500 to-teal-500',
      culture: 'from-amber-500 to-orange-500',
      adventure: 'from-cyan-500 to-blue-500',
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Beyond the <span className="text-gradient">Tourist Trail</span>
            </h2>
            <p className={`text-lg max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Discover lesser-known places that hold the true essence of a destination. Curated by locals and experienced travelers.
            </p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap">
            Explore all hidden gems <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hiddenGems.map((gem, index) => {
            const Icon = getTypeIcon(gem.type);
            return (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                onClick={() => setSelectedGem(gem)}
              >
                <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-smooth group-hover:shadow-2xl group-hover:shadow-sky-500/10 group-hover:-translate-y-2 transform-gpu">
                  <img src={gem.image} alt={gem.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.06] will-change-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  {/* Type badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getTypeColor(gem.type)}`}>
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white capitalize">{gem.type}</span>
                    </div>
                  </div>

                  {/* Rating badge */}
                  {gem.rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-bold">{gem.rating}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-300">{gem.country}</span>
                    </div>
                    <h3 className={`font-bold text-white mb-2 transition-colors duration-500 ease-smooth group-hover:text-sky-400 ${index === 0 ? 'text-3xl' : 'text-xl'}`}>
                      {gem.name}
                    </h3>
                    <p className={`text-slate-400 line-clamp-2 ${index === 0 ? 'text-base max-w-lg' : 'text-sm'}`}>
                      {gem.description}
                    </p>

                    {/* CTA */}
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-sm font-medium group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md transition-all duration-500 ease-smooth transform-gpu">
                        Discover this gem
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-smooth" />
                      </span>
                    </motion.div>
                  </div>

                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-smooth pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${getTypeColor(gem.type)} opacity-20`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '500+', label: 'Hidden Gems', icon: Gem },
            { value: '120', label: 'Countries', icon: MapPin },
            { value: '50K', label: 'Community Tips', icon: TreePine },
            { value: '98%', label: 'Verified', icon: Landmark },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl glass text-center">
              <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedGem && <GemModal gem={selectedGem} onClose={() => setSelectedGem(null)} />}
      </AnimatePresence>
    </section>
  );
}
