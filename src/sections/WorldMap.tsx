'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Filter, Search, Globe, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { memoryPins as initialPins } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import { getAuthorAvatar, getPinImage } from '@/lib/utils';
import type { MemoryPin } from '@/types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({ iconUrl: '/leaflet/marker-icon.png', shadowUrl: '/leaflet/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (imageUrl: string, isNew = false) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:44px;height:44px;border-radius:50%;overflow:hidden;box-shadow:0 4px 15px ${isNew ? 'rgba(245,158,11,0.6)' : 'rgba(14,165,233,0.5)'};border:3px solid white;cursor:pointer;background:#0f172a;"><img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" /></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom, { animate: true, duration: 1 }); }, [center, zoom, map]);
  return null;
}

export default function WorldMap() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [pins, setPins] = useState<MemoryPin[]>(initialPins);
  const [showAllMemories, setShowAllMemories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Load user-added pins from MongoDB (with localStorage fallback)
  useEffect(() => {
    fetch('/api/user/pins')
      .then(r => r.json())
      .then(data => {
        if (data.pins?.length) {
          setPins([...initialPins, ...data.pins]);
          localStorage.setItem('atlasaura-user-pins', JSON.stringify(data.pins));
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('atlasaura-user-pins');
        if (saved) setPins([...initialPins, ...JSON.parse(saved)]);
      });
  }, []);

  // Listen for focus-map event from CountryStories
  useEffect(() => {
    const handler = (e: Event) => {
      const { lat, lng } = (e as CustomEvent).detail;
      setMapCenter([lat, lng]);
      setMapZoom(5);
    };
    window.addEventListener('atlasaura-focus-map', handler);
    return () => window.removeEventListener('atlasaura-focus-map', handler);
  }, []);

  // Also check sessionStorage on mount (for page reload case)
  useEffect(() => {
    const stored = sessionStorage.getItem('atlasaura-map-focus');
    if (stored) {
      const { lat, lng } = JSON.parse(stored);
      setMapCenter([lat, lng]);
      setMapZoom(5);
      sessionStorage.removeItem('atlasaura-map-focus');
    }
  }, []);

  const filteredPins = pins.filter(pin => {
    const matchesSearch = pin.country.toLowerCase().includes(searchQuery.toLowerCase()) || pin.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = !selectedMood || pin.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const focusOnPin = useCallback((pin: MemoryPin) => {
    setMapCenter([pin.lat, pin.lng]);
    setMapZoom(6);
  }, []);

  const moods = [
    { id: 'solo', label: 'Solo', color: 'from-violet-500 to-indigo-500' },
    { id: 'honeymoon', label: 'Romance', color: 'from-pink-500 to-rose-500' },
    { id: 'adventure', label: 'Adventure', color: 'from-sky-500 to-cyan-500' },
    { id: 'culture', label: 'Culture', color: 'from-emerald-500 to-teal-500' },
    { id: 'calm', label: 'Peace', color: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <section id="world-map" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/5' : 'bg-sky-400/8'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} className="text-center mb-8">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Explore the <span className="text-gradient">World</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Discover stories from travelers around the globe. Click on markers to read their memories.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.5, 1] }} className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input placeholder="Search countries, memories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-sky-100 shadow-sm'}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedMood(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ease-smooth ${!selectedMood ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20' : isDark ? 'glass text-slate-300' : 'bg-white text-slate-600 shadow-sm border border-sky-100'}`}>
              <Filter className="w-4 h-4 inline mr-1" />All
            </button>
            {moods.map((mood) => (
              <button key={mood.id} onClick={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)} className={`px-4 py-2 rounded-full text-sm transition-all duration-500 ease-smooth ${selectedMood === mood.id ? `bg-gradient-to-r ${mood.color} text-white font-bold shadow-md` : isDark ? 'glass text-slate-300' : 'bg-white text-slate-600 shadow-sm border border-sky-100'}`}>
                {mood.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} className="relative">
          <div className={`rounded-3xl overflow-hidden shadow-2xl ${isDark ? '' : 'shadow-sky-200/50'}`} style={{ height: '600px' }}>
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className={isDark ? 'map-dark' : 'map-light'}>
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
              />
              {filteredPins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createCustomIcon(getPinImage(pin), pin.id.startsWith('user-'))} eventHandlers={{ click: () => focusOnPin(pin) }}>
                  <Popup>
                    <div className={`p-3 rounded-xl min-w-[220px] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={getPinImage(pin)} alt={pin.country} className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-sm border border-slate-200" />
                        <div>
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{pin.country}</p>
                          <p className="text-xs text-slate-500">{pin.date}</p>
                        </div>
                      </div>
                      <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{pin.note}"</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src={getAuthorAvatar(pin.author)} alt={pin.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
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

        {/* Recent Memories */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Recent Memories
              <span className={`ml-2 text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({filteredPins.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllMemories ? filteredPins : filteredPins.slice(0, 6)).map((pin, index) => (
              <motion.div
                key={pin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => focusOnPin(pin)}
                className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'glass hover:bg-white/10' : 'bg-white shadow-sm hover:shadow-md border border-sky-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md border border-sky-400/30">
                    <img src={getPinImage(pin)} alt={pin.country} className="w-full h-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      <span className="text-sm text-sky-500">{pin.country}</span>
                      {pin.id.startsWith('user-') && <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-medium">You</span>}
                    </div>
                    <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{pin.note}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={getAuthorAvatar(pin.author)} alt={pin.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="text-xs text-slate-500">{pin.author} • {pin.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPins.length > 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAllMemories(v => !v)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all border ${
                  isDark ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-sky-200 text-slate-600 hover:bg-sky-50'
                }`}
              >
                <span>{showAllMemories ? 'Show Less' : `More Memories (${filteredPins.length - 6} more)`}</span>
                <motion.span animate={{ rotate: showAllMemories ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-block">↓</motion.span>
              </button>
            </motion.div>
          )}
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
