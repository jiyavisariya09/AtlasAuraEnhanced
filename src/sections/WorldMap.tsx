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

/* Same entrance curve as `.lift`, the hero reveal, MoodSearch and
   CountryStories — one hand across the whole page. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DefaultIcon = L.icon({ iconUrl: '/leaflet/marker-icon.png', shadowUrl: '/leaflet/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

/* Leaflet takes an HTML string, so these cannot be Tailwind classes — but they
   can still be tokens. Reading the CSS variables keeps the markers on palette
   and lets them flip with the theme; the halo was hardcoded amber (245,158,11)
   for user pins and sky (14,165,233) for the rest, and the placeholder behind
   the photo was a fixed navy that stayed navy on cool paper. */
const createCustomIcon = (imageUrl: string, isNew = false) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:44px;height:44px;border-radius:50%;overflow:hidden;box-shadow:0 4px 15px ${isNew ? 'hsl(var(--violet) / 0.55)' : 'hsl(var(--aurora) / 0.45)'};border:3px solid hsl(var(--card));cursor:pointer;background:hsl(var(--muted));"><img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" /></div>`,
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
  /* `theme` is still needed here after the token pass — not for colours, but to
     pick the basemap tile set and scope the Leaflet CSS below. */
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

  /* `color` is the selected-chip surface, not a gradient ramp any more: a tint
     plus accent text, which is the one construction that holds contrast in both
     themes (the same move costMeta makes in CountryStories). Teal carries three
     of the five moods; violet and rose are spent on the two they actually mean. */
  const moods = [
    { id: 'solo', label: 'Solo', color: 'border-orchid/30 bg-orchid/15 text-orchid' },
    { id: 'honeymoon', label: 'Romance', color: 'border-blush/30 bg-blush/15 text-blush' },
    { id: 'adventure', label: 'Adventure', color: 'border-aurora/30 bg-aurora/15 text-aurora' },
    { id: 'culture', label: 'Culture', color: 'border-aurora/30 bg-aurora/15 text-aurora' },
    { id: 'calm', label: 'Peace', color: 'border-aurora/30 bg-aurora/15 text-aurora' },
  ];

  const chipOff = 'border-transparent bg-muted/60 text-muted-foreground hover:text-foreground';

  return (
    <section id="world-map" className="hairline-t section-y relative isolate overflow-hidden">
      {/* The old bloom only half worked: its day-theme tint asked for an /8
          alpha, which is not a step Tailwind emits, so outside the night theme
          it drew nothing at all. `.aurora-wash` plus one drifting teal bloom,
          both cool by construction. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0" />
        <div className="animate-aurora-drift absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-aurora/5 blur-3xl" />
      </div>

      <div className="shell relative">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: EASE }} className="text-center mb-8">
          <h2 className="t-title mb-4 text-foreground">
            Explore the <span className="text-aurora">World</span>
          </h2>
          <p className="t-lead mx-auto max-w-2xl">
            Discover stories from travelers around the globe. Click on markers to read their memories.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            {/* The Input primitive already resolves border/ring/placeholder from
                the token set — only the icon inset and a defined field surface
                need stating. */}
            <Input placeholder="Search countries, memories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-card" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMood(null)}
              aria-pressed={!selectedMood}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${!selectedMood ? 'border-aurora/30 bg-aurora/15 text-aurora' : chipOff}`}
            >
              <Filter className="w-4 h-4 inline mr-1" />All
            </button>
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)}
                aria-pressed={selectedMood === mood.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedMood === mood.id ? mood.color : chipOff}`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease: EASE }} className="relative">
          <div className="rounded-3xl overflow-hidden border border-border shadow-cast" style={{ height: '600px' }}>
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className={isDark ? 'map-dark' : 'map-light'}>
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
              />
              {filteredPins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createCustomIcon(getPinImage(pin), pin.id.startsWith('user-'))} eventHandlers={{ click: () => focusOnPin(pin) }}>
                  <Popup>
                    <div className="p-3 rounded-xl min-w-[220px] bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={getPinImage(pin)} alt={pin.country} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border" />
                        <div>
                          <p className="font-semibold text-foreground">{pin.country}</p>
                          <p className="t-data text-muted-foreground">{pin.date}</p>
                        </div>
                      </div>
                      <p className="text-sm italic text-muted-foreground">&ldquo;{pin.note}&rdquo;</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src={getAuthorAvatar(pin.author)} alt={pin.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                        <span className="text-xs text-muted-foreground">{pin.author}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Icon-only controls, so each one carries its own label. */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
              {[
                { icon: ZoomIn, label: 'Zoom in', action: () => setMapZoom(p => Math.min(p + 1, 18)) },
                { icon: ZoomOut, label: 'Zoom out', action: () => setMapZoom(p => Math.max(p - 1, 2)) },
                { icon: Navigation, label: 'Reset the view', action: () => { setMapCenter([20, 0]); setMapZoom(2); } },
              ].map(({ icon: Icon, label, action }, i) => (
                <button key={i} onClick={action} aria-label={label} className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-card/90 text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-aurora hover:text-aurora">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* `.glass` sets the `border` shorthand, so nothing here adds a
                `border-*` alongside it. */}
            <div className="glass absolute bottom-4 left-4 z-[400] px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-aurora" />
                <span className="t-data text-foreground">{filteredPins.length} memories visible</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Memories */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="t-sub text-foreground">
              Recent Memories
              <span className="t-data ml-2 text-muted-foreground">({filteredPins.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllMemories ? filteredPins : filteredPins.slice(0, 6)).map((pin, index) => (
              /* `.lift` owns the hover rise, the shadow and its own transition
                 shorthand — the old `transition-all hover:scale-[1.02]` would
                 cancel against it on stylesheet order. The surface is spelt out
                 instead of `.ink-panel` because the border animates on hover. */
              <motion.div
                key={pin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, ease: EASE }}
                onClick={() => focusOnPin(pin)}
                className="lift group cursor-pointer rounded-xl border border-border bg-card p-4 shadow-cast hover:border-aurora"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
                    <img src={getPinImage(pin)} alt={pin.country} className="w-full h-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-aurora" />
                      <span className="t-label text-aurora">{pin.country}</span>
                      {/* Violet marks your own pins here and in the map marker
                          halo, so the two readings agree. */}
                      {pin.id.startsWith('user-') && <span className="t-label rounded-full bg-orchid/15 px-1.5 py-0.5 text-orchid">You</span>}
                    </div>
                    <p className="text-sm mt-1 line-clamp-2 text-muted-foreground">&ldquo;{pin.note}&rdquo;</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={getAuthorAvatar(pin.author)} alt={pin.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <span className="t-data text-muted-foreground">{pin.author} • {pin.date}</span>
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
                className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-aurora hover:text-aurora"
              >
                <span>{showAllMemories ? 'Show Less' : `More Memories (${filteredPins.length - 6} more)`}</span>
                <motion.span aria-hidden="true" animate={{ rotate: showAllMemories ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE }} className="inline-block">↓</motion.span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Leaflet ships its own stylesheet, so its chrome has to be pulled onto
          the token set here rather than with classes. Selectors are specificity-
          matched to Leaflet's own so no `!important` is needed. */}
      <style>{`
        .leaflet-container { background: hsl(var(--muted)); }
        .map-dark .leaflet-popup-content-wrapper,
        .map-light .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border-radius: 12px;
          border: 1px solid hsl(var(--border));
          box-shadow: var(--shadow-cast);
        }
        .leaflet-popup-tip { display: none; }
        .custom-marker { background: transparent !important; border: none !important; }
        .leaflet-container a.leaflet-popup-close-button { color: hsl(var(--muted-foreground)); }
        .leaflet-container .leaflet-bar a {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border-bottom-color: hsl(var(--border));
        }
        .leaflet-container .leaflet-bar a:hover { background: hsl(var(--muted)); }
        .leaflet-container .leaflet-control-attribution {
          background: hsl(var(--card) / 0.85);
          color: hsl(var(--muted-foreground));
        }
        .leaflet-container .leaflet-control-attribution a { color: hsl(var(--aurora)); }
      `}</style>
    </section>
  );
}
