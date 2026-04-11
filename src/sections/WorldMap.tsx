'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Filter, Search, Globe, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { memoryPins } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import type { MemoryPin } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (emoji: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:40px;height:40px;border-radius:50%;background:rgba(14,165,233,0.9);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 15px rgba(14,165,233,0.4);border:3px solid white;cursor:pointer;">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true, duration: 1 }); }, [center, zoom, map]);
  return null;
}

export default function WorldMap({ isLoggedIn: _isLoggedIn }: { isLoggedIn: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  const filteredPins = memoryPins.filter(pin => {
    const matchesSearch = pin.country.toLowerCase().includes(searchQuery.toLowerCase()) || pin.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = !selectedMood || pin.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const moods = [
    { id: 'solo', label: 'Solo', color: 'from-violet-500 to-indigo-500' },
    { id: 'honeymoon', label: 'Romance', color: 'from-pink-500 to-rose-500' },
    { id: 'adventure', label: 'Adventure', color: 'from-sky-500 to-cyan-500' },
    { id: 'culture', label: 'Culture', color: 'from-emerald-500 to-teal-500' },
    { id: 'calm', label: 'Peace', color: 'from-blue-500 to-indigo-500' },
  ];

  const focusOnPin = useCallback((pin: MemoryPin) => {
    setMapCenter([pin.lat, pin.lng]);
    setMapZoom(6);
  }, []);

  return (
    <section id="world-map" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/5' : 'bg-sky-400/8'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? 'glass' : 'bg-white shadow-md border border-sky-100'}`}>
            <Globe className="w-4 h-4 text-sky-500" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Interactive World Map</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Explore the <span className="text-gradient">World</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Discover stories from travelers around the globe. Click on markers to read their memories.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input placeholder="Search countries, memories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-sky-100 shadow-sm'}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedMood(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedMood ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white' : isDark ? 'glass text-slate-300' : 'bg-white text-slate-600 shadow-sm border border-sky-100'}`}>
              <Filter className="w-4 h-4 inline mr-1" />All
            </button>
            {moods.map((mood) => (
              <button key={mood.id} onClick={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)} className={`px-4 py-2 rounded-full text-sm transition-all ${selectedMood === mood.id ? `bg-gradient-to-r ${mood.color} text-white font-bold` : isDark ? 'glass text-slate-300' : 'bg-white text-slate-600 shadow-sm border border-sky-100'}`}>
                {mood.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
          <div className={`rounded-3xl overflow-hidden shadow-2xl ${isDark ? '' : 'shadow-sky-200/50'}`} style={{ height: '600px' }}>
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className={isDark ? 'map-dark' : 'map-light'}>
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
              />
              {filteredPins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createCustomIcon(pin.emoji)} eventHandlers={{ click: () => focusOnPin(pin) }}>
                  <Popup>
                    <div className={`p-3 rounded-xl min-w-[200px] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{pin.emoji}</span>
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{pin.country}</p>
                          <p className="text-xs text-slate-500">{pin.date}</p>
                        </div>
                      </div>
                      <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{pin.note}"</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
                        <span className="text-xs text-slate-500">{pin.author}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
              {[{ icon: ZoomIn, action: () => setMapZoom(p => Math.min(p + 1, 18)) }, { icon: ZoomOut, action: () => setMapZoom(p => Math.max(p - 1, 2)) }, { icon: Navigation, action: () => { setMapCenter([20, 0]); setMapZoom(2); } }].map(({ icon: Icon, action }, i) => (
                <button key={i} onClick={action} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'glass hover:bg-white/10' : 'bg-white shadow-md hover:bg-sky-50'}`}>
                  <Icon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>

            <div className={`absolute bottom-4 left-4 z-[400] px-4 py-2 rounded-full ${isDark ? 'glass' : 'bg-white shadow-md'}`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-700'}`}>{filteredPins.length} memories visible</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8">
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Recent Memories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPins.slice(0, 6).map((pin, index) => (
              <motion.div key={pin.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => focusOnPin(pin)} className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'glass hover:bg-white/10' : 'bg-white shadow-sm hover:shadow-md border border-sky-50'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-lg flex-shrink-0">{pin.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      <span className="text-sm text-sky-500">{pin.country}</span>
                    </div>
                    <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{pin.note}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500" />
                      <span className="text-xs text-slate-500">{pin.author} • {pin.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .map-dark .leaflet-popup-content-wrapper { background: rgba(10,15,30,0.95); border-radius: 12px; border: 1px solid rgba(147,197,253,0.15); }
        .map-light .leaflet-popup-content-wrapper { background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(14,165,233,0.15); }
        .leaflet-popup-tip { display: none; }
        .custom-marker { background: transparent !important; border: none !important; }
      `}</style>
    </section>
  );
}
