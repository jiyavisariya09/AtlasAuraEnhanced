import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Heart, Lock, Globe, Plus } from 'lucide-react';
import { memoryPins } from '@/data/mockData';
import type { MemoryPin } from '@/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

interface MemoryMapProps {
  isLoggedIn: boolean;
}

export default function MemoryMap({ isLoggedIn }: MemoryMapProps) {
  const [selectedPin, setSelectedPin] = useState<MemoryPin | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const worldRegions = [
    { id: 'na', name: 'North America', x: 18, y: 28, pins: 2 },
    { id: 'sa', name: 'South America', x: 28, y: 65, pins: 1 },
    { id: 'eu', name: 'Europe', x: 50, y: 25, pins: 3 },
    { id: 'af', name: 'Africa', x: 52, y: 50, pins: 2 },
    { id: 'as', name: 'Asia', x: 72, y: 32, pins: 4 },
    { id: 'oc', name: 'Oceania', x: 82, y: 70, pins: 1 },
  ];

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      solo: 'from-purple-500 to-indigo-500',
      honeymoon: 'from-pink-500 to-rose-500',
      adventure: 'from-orange-500 to-amber-500',
      culture: 'from-emerald-500 to-teal-500',
      calm: 'from-cyan-500 to-blue-500',
    };
    return colors[mood] || 'from-slate-500 to-slate-600';
  };

  return (
    <section id="memory-map" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${isDark ? 'bg-amber-500/5' : 'bg-amber-400/10'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? 'glass' : 'bg-white shadow-md'}`}>
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Social Memory Map</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Memories Around the <span className="text-gradient">World</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore emotional travel experiences shared by our community.
            Each pin holds a story, a feeling, a moment in time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className={`relative aspect-[2/1] rounded-3xl overflow-hidden ${isDark ? 'glass' : 'bg-white shadow-xl border border-slate-200'}`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(100,100,100,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100,100,100,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            <svg
              viewBox="0 0 100 60"
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.1))' }}
            >
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.3)" />
                  <stop offset="100%" stopColor="rgba(34, 211, 238, 0.3)" />
                </linearGradient>
              </defs>
              {[
                { d: "M5,15 Q15,10 25,15 Q30,20 28,30 Q25,35 20,32 Q15,30 10,28 Q5,25 5,15", id: 'na' },
                { d: "M22,38 Q28,36 30,42 Q32,50 28,58 Q24,55 22,50 Q20,45 22,38", id: 'sa' },
                { d: "M45,18 Q52,15 58,18 Q60,22 58,26 Q54,28 50,26 Q46,24 45,18", id: 'eu' },
                { d: "M46,30 Q55,28 58,35 Q60,45 55,52 Q50,55 46,50 Q44,42 46,30", id: 'af' },
                { d: "M60,15 Q75,12 85,18 Q90,25 88,35 Q82,38 75,36 Q68,32 62,28 Q58,22 60,15", id: 'as' },
                { d: "M78,48 Q85,46 88,50 Q90,55 86,58 Q80,58 78,54 Q76,50 78,48", id: 'oc' },
              ].map((region, i) => (
                <motion.path
                  key={region.id}
                  d={region.d}
                  fill="url(#mapGradient)"
                  stroke="rgba(245, 158, 11, 0.3)"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 + i * 0.2 }}
                  className="hover:fill-amber-500/40 transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              ))}
            </svg>

            {memoryPins.map((pin, index) => (
              <motion.button
                key={pin.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${((pin.lng + 180) / 360) * 100}%`,
                  top: `${((90 - pin.lat) / 180) * 100}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                onClick={() => setSelectedPin(pin)}
                whileHover={{ scale: 1.2 }}
              >
                <div className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${getMoodColor(pin.mood)} flex items-center justify-center shadow-lg`}>
                  <span className="text-sm">{pin.emoji}</span>
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                </div>
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-slate-900/90' : 'bg-slate-800/90'}`}>
                  {pin.country}
                </div>
              </motion.button>
            ))}

            {hoveredRegion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-4 left-4 px-4 py-2 rounded-lg ${isDark ? 'glass' : 'bg-white shadow-md'}`}
              >
                <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {worldRegions.find(r => r.id === hoveredRegion)?.name}
                </span>
                <span className="text-xs text-amber-500 ml-2">
                  {worldRegions.find(r => r.id === hoveredRegion)?.pins} memories
                </span>
              </motion.div>
            )}

            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-4 right-4"
              >
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Memory
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: Globe, label: 'Public Memories', value: '12.5K' },
            { icon: Heart, label: 'Total Likes', value: '48.2K' },
            { icon: Lock, label: 'Private Memories', value: '3.2K' },
          ].map((stat, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-full ${isDark ? 'glass' : 'bg-white shadow-md'}`}>
              <stat.icon className="w-4 h-4 text-amber-500" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPin(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative max-w-md w-full rounded-2xl p-6 ${isDark ? 'glass' : 'bg-white shadow-2xl'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPin(null)}
                className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
              >
                <X className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getMoodColor(selectedPin.mood)} flex items-center justify-center text-2xl`}>
                  {selectedPin.emoji}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedPin.country}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedPin.date}</p>
                </div>
              </div>

              <p className={`mb-4 italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{selectedPin.note}"</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedPin.author}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${getMoodColor(selectedPin.mood)} text-white`}>
                  {selectedPin.mood}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
