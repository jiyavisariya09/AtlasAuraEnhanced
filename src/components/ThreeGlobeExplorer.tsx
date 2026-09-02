'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { 
  Globe, MapPin, Compass, RotateCcw, ZoomIn, ZoomOut, 
  Plane, Sparkles, Mountain, Calendar, ArrowRight, 
  Search, Heart, ChevronLeft, ChevronRight, Calculator,
  ExternalLink, Maximize2, Minimize2, Eye, Shield, Crosshair,
  Satellite, Navigation, Layers, Check, X, AlertCircle,
  Bot, Award, CheckCircle2, Bookmark, Play, Pause
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DESTINATIONS, type DestinationItem } from '@/data/destinationsData';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import AIBudgetEstimatorModal from '@/components/AIBudgetEstimatorModal';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;
const DEFAULT_SATELLITE_ZOOM = 6; // Natural continent/regional orbital view

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * D2R;
  const dLon = (lon2 - lon1) * D2R;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// 3D Globe Vector Math
const toVec = (lat: number, lng: number): [number, number, number] => {
  const p = lat * D2R;
  const l = lng * D2R;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};

function rotate(
  v: readonly [number, number, number],
  yaw: number,
  pitch: number,
): [number, number, number] {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = v[0] * cy + v[2] * sy;
  const z1 = -v[0] * sy + v[2] * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
}

// Real continent coastlines (vectorized for 3D Globe)
const CONTINENT_OUTLINES: [number, number][][] = [
  // Africa
  [
    [37.3, 9.8], [36.8, 11.0], [32.0, 20.0], [31.2, 27.5], [31.5, 32.5],
    [27.8, 34.5], [22.0, 37.0], [12.0, 43.5], [11.5, 51.2], [1.0, 45.0],
    [-4.0, 39.5], [-11.0, 40.5], [-17.0, 38.5], [-26.0, 33.0], [-34.8, 20.0],
    [-34.0, 18.4], [-28.5, 16.5], [-18.0, 11.8], [-6.0, 12.0], [4.5, 9.0],
    [5.0, -1.0], [4.3, -7.5], [9.5, -13.5], [14.7, -17.5], [21.0, -17.0],
    [28.0, -12.5], [35.8, -5.5], [37.3, 9.8]
  ],
  // Eurasia
  [
    [36.0, -5.5], [43.5, -9.0], [48.0, -4.5], [51.0, 2.0], [54.0, 8.5],
    [58.0, 11.5], [71.0, 28.0], [69.0, 60.0], [73.0, 80.0], [76.0, 110.0],
    [70.0, 160.0], [65.0, 175.0], [60.0, 162.0], [53.0, 142.0], [43.0, 132.0],
    [35.0, 129.0], [22.0, 114.0], [10.0, 107.0], [1.3, 103.8], [13.0, 100.0],
    [21.5, 87.0], [8.0, 77.5], [25.0, 67.0], [25.0, 57.0], [12.5, 43.5],
    [30.0, 32.5], [36.5, 36.0], [41.0, 29.0], [38.0, 24.0], [36.5, 14.5],
    [44.0, 8.0], [41.0, 1.0], [36.0, -5.5]
  ],
  // North America
  [
    [8.0, -77.5], [9.0, -83.0], [16.0, -88.0], [19.0, -96.0], [26.0, -97.0],
    [30.0, -85.0], [25.0, -80.5], [35.0, -75.5], [44.0, -64.0], [47.0, -53.0],
    [58.0, -62.0], [62.0, -78.0], [70.0, -95.0], [72.0, -125.0], [71.0, -156.0],
    [65.0, -168.0], [58.0, -158.0], [55.0, -131.0], [48.0, -124.0], [37.0, -122.0],
    [32.0, -117.0], [23.0, -110.0], [15.0, -93.0], [8.0, -77.5]
  ],
  // South America
  [
    [12.0, -72.0], [10.5, -61.5], [5.0, -52.0], [-5.0, -35.0], [-13.0, -38.5],
    [-23.0, -43.0], [-34.5, -53.5], [-42.0, -63.0], [-54.0, -67.0], [-52.0, -75.0],
    [-42.0, -74.0], [-18.0, -70.5], [-5.0, -81.0], [1.0, -79.5], [9.0, -77.0],
    [12.0, -72.0]
  ],
  // Australia
  [
    [-11.5, 142.5], [-17.0, 146.0], [-28.0, 153.5], [-37.5, 150.0], [-38.5, 145.0],
    [-35.0, 136.0], [-32.0, 125.0], [-34.5, 115.0], [-22.0, 114.0], [-15.0, 124.0],
    [-12.0, 131.0], [-12.0, 136.0], [-11.5, 142.5]
  ],
  // Japan Archipelago
  [
    [31.0, 130.5], [34.0, 135.0], [36.0, 140.5], [41.0, 141.0], [45.5, 142.0],
    [43.0, 145.5], [40.0, 140.0], [35.5, 133.5], [33.0, 129.5], [31.0, 130.5]
  ],
  // Scandinavia
  [
    [58.0, 6.0], [62.0, 5.0], [68.0, 14.0], [71.0, 26.0], [65.0, 24.0],
    [56.0, 13.0], [58.0, 6.0]
  ],
  // Indonesia
  [
    [5.5, 95.5], [-3.0, 102.0], [-6.0, 106.0], [-8.5, 115.0], [-8.5, 126.0],
    [-3.0, 138.0], [-0.5, 131.0], [1.5, 125.0], [3.0, 117.0], [5.5, 95.5]
  ]
];

// AI Geographic & Cultural Synthesizer for unlisted coordinates
function synthesizeAIPlaceInfo(lat: number, lng: number) {
  let region = 'Global Frontier';
  let country = 'Earth Surface';
  let terrainType = 'Continental Terrain & Plains';
  let elevation = '850 m';
  let culture = 'Cross-cultural trade routes, ancient nomadic settlements, and regional indigenous traditions.';
  let localFlavor = 'Locally harvested grains, regional mountain teas, and traditional hearth cuisine.';
  let bestSeason = 'May – Oct';
  let estimatedCostUSD = 1150;
  let safetyScore = 92;

  // South America / Andes / Altiplano
  if (lat < 12 && lat > -56 && lng < -30 && lng > -85) {
    region = 'Americas';
    if (lat < -15 && lat > -25 && lng < -65 && lng > -70) {
      country = 'Andean Altiplano (Bolivia / Chile border)';
      terrainType = 'High-Altitude Mineral Salt Basin & Volcanic Plateau';
      elevation = '3,650 m';
      culture = 'Ancient Quechua and Aymara indigenous traditions rooted in Andean cosmology and artisanal salt harvesting.';
      localFlavor = 'Llama tenderloin steak & Quinoa soup';
      bestSeason = 'Dec – Apr';
      estimatedCostUSD = 980;
      safetyScore = 95;
    } else if (lat < -5 && lat > -15 && lng < -70 && lng > -80) {
      country = 'Peruvian Andes / Sacred Valley Zone';
      terrainType = 'Steep Granite Ridges & Cloud Forest Valleys';
      elevation = '2,430 m';
      culture = 'Incan astronomical engineering, agricultural terracing, and mystical temple complexes.';
      localFlavor = 'Lomo Saltado, Ceviche, and Purple Corn Chicha.';
      bestSeason = 'May – Sep';
      estimatedCostUSD = 1100;
      safetyScore = 93;
    } else if (lat < -40) {
      country = 'Patagonia Sub-Polar Region';
      terrainType = 'Glacial Fjords & Jagged Granite Horns';
      elevation = '1,200 m';
      culture = 'Gaucho sheep-farming heritage and pioneering Antarctic exploration lore.';
      localFlavor = 'Patagonian spit-roasted lamb and Calafate berry tarts.';
      bestSeason = 'Nov – Mar';
      estimatedCostUSD = 1650;
      safetyScore = 97;
    } else {
      country = 'South American Basin';
      terrainType = 'Tropical Forest & River Terraces';
      elevation = '250 m';
      bestSeason = 'Jun – Nov';
      estimatedCostUSD = 850;
      safetyScore = 88;
    }
  }
  // Europe / Scandinavia / Alps / Mediterranean
  else if (lat > 35 && lat < 72 && lng > -10 && lng < 40) {
    region = 'Europe';
    if (lat > 58) {
      country = 'Nordic & Scandinavian Fjords';
      terrainType = 'Glaciated Fjords & Arctic Coastal Archipelago';
      elevation = '580 m';
      culture = 'Viking maritime ancestry, coastal stockfish drying, and the Scandinavian philosophy of Friluftsliv.';
      localFlavor = 'Arctic Skrei Cod, Cloudberries, and Brown Goat Cheese.';
      bestSeason = 'Sep – Apr';
      estimatedCostUSD = 1890;
      safetyScore = 99;
    } else if (lat > 44 && lat < 48 && lng > 5 && lng < 15) {
      country = 'Central Alpine Valley (Swiss/Italian Alps)';
      terrainType = 'High Alpine Glaciers & U-Shaped Valleys';
      elevation = '2,100 m';
      culture = 'Centuries-old alpine mountaineering heritage and high-pasture dairy traditions.';
      localFlavor = 'Alpine Raclette, Fondue, and Bündnerfleisch.';
      bestSeason = 'Jun – Sep / Dec – Mar';
      estimatedCostUSD = 2200;
      safetyScore = 98;
    } else {
      country = 'Mediterranean Coast & Olive Groves';
      terrainType = 'Limestone Cliffs & Coastal Lagoons';
      elevation = '180 m';
      bestSeason = 'Apr – Oct';
      estimatedCostUSD = 1450;
      safetyScore = 96;
    }
  }
  // Asia / Himalayas / East Asia / SE Asia
  else if (lat > 5 && lat < 60 && lng > 60 && lng < 145) {
    region = 'Asia';
    if (lat > 25 && lat < 38 && lng > 75 && lng > 95) {
      country = 'Himalayan Ridge & Tibetan Plateau';
      terrainType = 'Ultra-High Peak Massifs & Sacred Glacial River Sources';
      elevation = '4,800 m';
      culture = 'Tibetan Buddhist monasteries, sacred kora pilgrimages, and mountain Sherpa traditions.';
      localFlavor = 'Yak Butter Tea, Steamed Momos, and Tsampa barley.';
      bestSeason = 'Apr – Jun / Sep – Nov';
      estimatedCostUSD = 850;
      safetyScore = 91;
    } else if (lat > 30 && lat < 42 && lng > 128 && lng < 142) {
      country = 'Japanese Archipelago & Ancient Forests';
      terrainType = 'Volcanic Mountains & Cedar Shrine Valleys';
      elevation = '450 m';
      culture = 'Shinto nature reverence, Zen aesthetics, and centuries-old artisan craftsmanship.';
      localFlavor = 'Matcha Kaiseki, Soba noodles, and Yuzu confectionery.';
      bestSeason = 'Mar – May / Oct – Nov';
      estimatedCostUSD = 1750;
      safetyScore = 99;
    } else {
      country = 'Southeast Asian Archipelago & Karsts';
      terrainType = 'Limestone Karst Islands & Emerald Lagoons';
      elevation = '120 m';
      bestSeason = 'Nov – Apr';
      estimatedCostUSD = 680;
      safetyScore = 90;
    }
  }
  // Middle East / Arabia
  else if (lat > 12 && lat < 35 && lng > 35 && lng < 60) {
    region = 'Middle East';
    country = 'Arabian Sand Dunes & Red Sandstone Canyons';
    terrainType = 'Desert Escarpment & Ancient Oases';
    elevation = '820 m';
    culture = 'Bedouin hospitality, frankincense trading routes, and Nabataean rock architecture.';
    localFlavor = 'Cardamom Arabic Coffee, Medjool Dates, and Mansaf.';
    bestSeason = 'Oct – Apr';
    estimatedCostUSD = 1350;
    safetyScore = 94;
  }
  // Africa
  else if (lat > -35 && lat < 37 && lng > -20 && lng < 52) {
    region = 'Africa';
    country = 'Rift Valley & Savannah Wilderness';
    terrainType = 'Volcanic Calderas & Great Plains';
    elevation = '1,600 m';
    culture = 'Maasai and Swahili tribal heritage with ancient wildlife coexistence rituals.';
    localFlavor = 'Ugali, Nyama Choma, and Spiced Chai.';
    bestSeason = 'Jul – Oct';
    estimatedCostUSD = 1550;
    safetyScore = 89;
  }
  // Oceania
  else if (lat < -10 && lat > -50 && lng > 110 && lng < 180) {
    region = 'Oceania';
    country = 'Pacific Island & Coral Ridge';
    terrainType = 'Volcanic Atolls & Coastal Rainforests';
    elevation = '320 m';
    culture = 'Polynesian celestial navigation, Haka warrior traditions, and Maori lore.';
    localFlavor = 'Hangi earth-oven feast, Fresh Mahi-Mahi, and Tropical Taro.';
    bestSeason = 'Dec – Apr';
    estimatedCostUSD = 1680;
    safetyScore = 98;
  }

  const name = `${country.split('(')[0].trim()} · Point (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
  const description = `Satellite telemetry locked at ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E. Characterized by ${terrainType.toLowerCase()} with an average elevation of ${elevation}. Cultural heritage encompasses ${culture.toLowerCase()}`;

  return {
    name,
    country,
    region,
    elevation,
    terrainType,
    description,
    culture,
    localFlavor,
    bestSeason,
    estimatedCostUSD,
    safetyScore,
  };
}

// Custom Glowing Pulse Radar Icon for Leaflet
const createTargetIcon = (name: string, isCustom = false) => {
  return L.divIcon({
    className: 'custom-satellite-pin',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform:translate(-50%, -100%); pointer-events:auto;">
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:36px; height:36px; border-radius:9999px; background:${isCustom ? 'rgba(244,63,94,0.35)' : 'rgba(45,212,191,0.35)'}; animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:26px; height:26px; border-radius:9999px; background:${isCustom ? '#f43f5e' : '#14b8a6'}; border:2px solid #ffffff; box-shadow:0 0 16px ${isCustom ? '#f43f5e' : '#14b8a6'}; display:flex; align-items:center; justify-content:center; color:#0f172a; font-size:13px;">
            ${isCustom ? '🎯' : '📍'}
          </div>
        </div>
        <div style="margin-top:6px; padding:5px 12px; border-radius:9999px; background:rgba(9,13,26,0.96); border:1.5px solid ${isCustom ? '#f43f5e' : '#14b8a6'}; color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Inter, sans-serif; font-size:13px; font-weight:600; letter-spacing:-0.01em; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,0.7), 0 0 12px ${isCustom ? 'rgba(244,63,94,0.35)' : 'rgba(20,184,166,0.35)'}; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;">
          ${name}
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

// AAA Game-Style Preload Layer: Automatically pre-buffers surrounding chunks/tiles in 360° outside viewport
function AAAPreloadedSatelliteLayer() {
  const map = useMap();

  useEffect(() => {
    // Custom Leaflet TileLayer that pre-buffers extra tiles beyond the camera viewport
    const CustomPreloadTileLayer = (L.TileLayer as any).extend({
      _getTiledPixelBounds: function (center: any) {
        const map = this._map;
        const mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom();
        const scale = map.getZoomScale(mapZoom, this._tileZoom);
        const pixelCenter = map.project(center, this._tileZoom).floor();
        const halfSize = map.getSize().divideBy(scale * 2);

        // Preload buffer: 2.0x screen dimensions in all 4 directions (360° chunk streaming)
        const bufferPadding = map.getSize().multiplyBy(2.0);
        const min = pixelCenter.subtract(halfSize).subtract(bufferPadding);
        const max = pixelCenter.add(halfSize).add(bufferPadding);

        return new L.Bounds(min, max);
      },
    });

    const tileLayerInstance = new CustomPreloadTileLayer(
      'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        maxZoom: 20,
        minZoom: 4,
        keepBuffer: 32, // Keeps surrounding 32 rings of tiles in memory
        updateWhenZooming: false,
        updateWhenIdle: false,
        attribution: '&copy; Google Satellite & Earth Imagery',
      }
    );

    tileLayerInstance.addTo(map);

    return () => {
      map.removeLayer(tileLayerInstance);
    };
  }, [map]);

  return null;
}

// Leaflet Map controller component
function SatelliteMapController({
  flyTarget,
  onMapClick,
  onZoomChange,
}: {
  flyTarget: { lat: number; lng: number; zoom: number; triggerId: number } | null;
  onMapClick: (latlng: { lat: number; lng: number }) => void;
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMap();
  const lastTriggerRef = useRef<number>(0);

  useEffect(() => {
    if (flyTarget && flyTarget.triggerId !== lastTriggerRef.current) {
      lastTriggerRef.current = flyTarget.triggerId;
      map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [flyTarget, map]);

  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });

  return null;
}

interface ThreeGlobeExplorerProps {
  initialDestinationId?: string;
  initialUserOrigin?: string;
}

export default function ThreeGlobeExplorer({
  initialDestinationId,
  initialUserOrigin = 'Mumbai, India',
}: ThreeGlobeExplorerProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { formatPrice } = useCurrency();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // View Mode: 'globe' (True 3D Spherical Earth) vs 'satellite' (Leaflet High-Res Surface)
  const [viewMode, setViewMode] = useState<'globe' | 'satellite'>('satellite');

  // Selected Destination
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(() => {
    if (!initialDestinationId) return null;
    return DESTINATIONS.find((d) => d.id === initialDestinationId) || null;
  });

  // Target Coordinates
  const [targetCoords, setTargetCoords] = useState<{ lat: number; lng: number }>(() => {
    if (selectedDestination) {
      return selectedDestination.coordinates;
    }
    const def = DESTINATIONS[0];
    return def ? def.coordinates : { lat: -20.1338, lng: -67.4891 };
  });

  // Explicit Fly Target
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom: number; triggerId: number } | null>(() => ({
    lat: selectedDestination ? selectedDestination.coordinates.lat : (DESTINATIONS[0]?.coordinates.lat ?? -20.1338),
    lng: selectedDestination ? selectedDestination.coordinates.lng : (DESTINATIONS[0]?.coordinates.lng ?? -67.4891),
    zoom: DEFAULT_SATELLITE_ZOOM,
    triggerId: 1,
  }));

  const [customLocationName, setCustomLocationName] = useState<string | null>(null);
  const [satelliteZoom, setSatelliteZoom] = useState<number>(DEFAULT_SATELLITE_ZOOM);
  const [searchOrCoordInput, setSearchOrCoordInput] = useState<string>('');
  const [userOrigin, setUserOrigin] = useState(initialUserOrigin);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 }); // Mumbai
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showAIDossierModal, setShowAIDossierModal] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3D Canvas Angular & Interaction State
  const [globeZoom, setGlobeZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // Synchronize 3D camera to target coordinates
  useEffect(() => {
    targetYawRef.current = -targetCoords.lng * D2R;
    targetPitchRef.current = targetCoords.lat * D2R * 0.75;
  }, [targetCoords]);

  // Compute real-time AI synthesized intelligence
  const aiPlaceInfo = useMemo(() => {
    return synthesizeAIPlaceInfo(targetCoords.lat, targetCoords.lng);
  }, [targetCoords.lat, targetCoords.lng]);

  // Load user origin from storage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('atlasaura-preferences');
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.homeLocation) {
          setUserOrigin(parsed.homeLocation);
          if (parsed.homeLocation.toLowerCase().includes('delhi')) setUserCoords({ lat: 28.6139, lng: 77.2090 });
          else if (parsed.homeLocation.toLowerCase().includes('london')) setUserCoords({ lat: 51.5074, lng: -0.1278 });
          else if (parsed.homeLocation.toLowerCase().includes('new york')) setUserCoords({ lat: 40.7128, lng: -74.0060 });
          else if (parsed.homeLocation.toLowerCase().includes('dubai')) setUserCoords({ lat: 25.2048, lng: 55.2708 });
          else if (parsed.homeLocation.toLowerCase().includes('tokyo')) setUserCoords({ lat: 35.6762, lng: 139.6503 });
        }
      }
    } catch {}
  }, []);

  // Update target when initialDestinationId prop changes
  useEffect(() => {
    if (initialDestinationId) {
      const found = DESTINATIONS.find((d) => d.id === initialDestinationId);
      if (found) {
        setSelectedDestination(found);
        setTargetCoords(found.coordinates);
        setCustomLocationName(null);
        setFlyTarget({
          lat: found.coordinates.lat,
          lng: found.coordinates.lng,
          zoom: DEFAULT_SATELLITE_ZOOM,
          triggerId: Date.now(),
        });
      }
    }
  }, [initialDestinationId]);

  // Distance from user origin
  const flightDistanceKm = useMemo(() => {
    return calculateDistanceKm(userCoords.lat, userCoords.lng, targetCoords.lat, targetCoords.lng);
  }, [userCoords, targetCoords]);

  // 3D Canvas Sphere Rendering
  useEffect(() => {
    if (viewMode !== 'globe') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const destVec = toVec(targetCoords.lat, targetCoords.lng);
    const userVec = toVec(userCoords.lat, userCoords.lng);

    const vectorizedContinents = CONTINENT_OUTLINES.map((poly) =>
      poly.map(([lat, lng]) => toVec(lat, lng))
    );

    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(cx, cy) * 0.65 * globeZoom;

      if (!isDragging && !autoRotate) {
        currentYawRef.current += (targetYawRef.current - currentYawRef.current) * 0.06;
        currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * 0.06;
      } else if (autoRotate) {
        currentYawRef.current += 0.003;
      }

      const yaw = currentYawRef.current;
      const pitch = currentPitchRef.current;

      ctx.clearRect(0, 0, width, height);

      // Deep Space Starfield & Outer Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      glowGrad.addColorStop(0, 'rgba(20, 184, 166, 0.22)');
      glowGrad.addColorStop(0.5, 'rgba(139, 127, 245, 0.1)');
      glowGrad.addColorStop(1, 'rgba(5, 8, 20, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, TAU);
      ctx.fill();

      // Earth Body Sphere
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      sphereGrad.addColorStop(0, '#131e3a');
      sphereGrad.addColorStop(0.6, '#091024');
      sphereGrad.addColorStop(1, '#050814');
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.clip();

      // Graticule Lat / Lng Coordinate Rings
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
      ctx.lineWidth = 1;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 8) {
          const v = rotate(toVec(lat, lng), yaw, pitch);
          const px = cx + v[0] * radius;
          const py = cy - v[1] * radius;
          if (v[2] > 0) {
            if (lng === -180) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 6) {
          const v = rotate(toVec(lat, lng), yaw, pitch);
          const px = cx + v[0] * radius;
          const py = cy - v[1] * radius;
          if (v[2] > 0) {
            if (lat === -90) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      // Draw Real Continents on 3D Sphere
      for (const poly of vectorizedContinents) {
        ctx.beginPath();
        let first = true;
        for (const pt of poly) {
          const v = rotate(pt, yaw, pitch);
          if (v[2] > 0) {
            const px = cx + v[0] * radius;
            const py = cy - v[1] * radius;
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.fillStyle = 'rgba(20, 184, 166, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(20, 184, 166, 0.55)';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      // Great Circle Flight Path Arc
      const uRot = rotate(userVec, yaw, pitch);
      const dRot = rotate(destVec, yaw, pitch);

      ctx.beginPath();
      let hasVisibleArc = false;
      for (let t = 0; t <= 1; t += 0.02) {
        const alt = 1 + Math.sin(t * Math.PI) * 0.15;
        const midLat = userCoords.lat + (targetCoords.lat - userCoords.lat) * t;
        const midLng = userCoords.lng + (targetCoords.lng - userCoords.lng) * t;
        const v = rotate(toVec(midLat, midLng), yaw, pitch);
        
        const px = cx + v[0] * radius * alt;
        const py = cy - v[1] * radius * alt;

        if (v[2] > -0.2) {
          if (!hasVisibleArc) {
            ctx.moveTo(px, py);
            hasVisibleArc = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.strokeStyle = 'rgba(139, 127, 245, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // User Origin Pin
      if (uRot[2] > -0.1) {
        const px = cx + uRot[0] * radius;
        const py = cy - uRot[1] * radius;

        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, TAU);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('📍 ' + userOrigin.split(',')[0], px + 8, py - 6);
      }

      // Destination Target Pin with Pulsing Beacon
      if (dRot[2] > -0.1) {
        const px = cx + dRot[0] * radius;
        const py = cy - dRot[1] * radius;
        const pulse = (Math.sin(Date.now() * 0.006) + 1) * 0.5;

        // Glowing Beacon
        ctx.beginPath();
        ctx.arc(px, py, 10 + pulse * 12, 0, TAU);
        ctx.fillStyle = `rgba(20, 184, 166, ${0.45 - pulse * 0.35})`;
        ctx.fill();

        // Pin Core
        ctx.beginPath();
        ctx.arc(px, py, 6.5, 0, TAU);
        ctx.fillStyle = '#14b8a6';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Target Badge Label
        const labelText = selectedDestination ? selectedDestination.name : (customLocationName || aiPlaceInfo.country);
        ctx.fillStyle = '#14b8a6';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('🎯 ' + labelText, px + 12, py + 4);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, targetCoords, userCoords, userOrigin, selectedDestination, customLocationName, aiPlaceInfo, globeZoom, isDragging, autoRotate]);

  // 3D Canvas Mouse Event Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !lastMouseRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    targetYawRef.current += dx * 0.005;
    targetPitchRef.current = Math.max(-1.3, Math.min(1.3, targetPitchRef.current + dy * 0.005));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    lastMouseRef.current = null;
  };

  // Handle Coordinate Teleport or Destination Search
  const handleTeleportOrSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    const query = searchOrCoordInput.trim();
    if (!query) return;

    // Check if input is Lat, Lng format
    const coordMatch = query.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setSelectedDestination(null);
        const synth = synthesizeAIPlaceInfo(lat, lng);
        setCustomLocationName(synth.name);
        setTargetCoords({ lat, lng });
        setFlyTarget({
          lat,
          lng,
          zoom: DEFAULT_SATELLITE_ZOOM,
          triggerId: Date.now(),
        });
        setSearchOrCoordInput('');
        return;
      }
    }

    // Check if input matches any Destination in dataset
    const matchedDest = DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.region.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedDest) {
      setSelectedDestination(matchedDest);
      setCustomLocationName(null);
      setTargetCoords(matchedDest.coordinates);
      setFlyTarget({
        lat: matchedDest.coordinates.lat,
        lng: matchedDest.coordinates.lng,
        zoom: DEFAULT_SATELLITE_ZOOM,
        triggerId: Date.now(),
      });
      setSearchOrCoordInput('');
      router.replace(`/globe?destination=${matchedDest.id}`);
      return;
    }

    setErrorMessage(`Location not found. Enter format: "Lat, Lng" (e.g. 27.1751, 78.0421) or sanctuary name.`);
  };

  // Handle map click: synthesize AI info instantly
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    setSelectedDestination(null);
    const synth = synthesizeAIPlaceInfo(latlng.lat, latlng.lng);
    setCustomLocationName(synth.name);
    setTargetCoords({ lat: latlng.lat, lng: latlng.lng });
  };

  // Set zoom preset (or switch to 3D globe on Orbit)
  const setZoomPreset = (zoomLevel: number) => {
    if (zoomLevel <= 3) {
      setViewMode('globe');
      return;
    }
    setViewMode('satellite');
    setSatelliteZoom(zoomLevel);
    setFlyTarget({
      lat: targetCoords.lat,
      lng: targetCoords.lng,
      zoom: zoomLevel,
      triggerId: Date.now(),
    });
  };

  return (
    <div className="relative w-screen h-screen bg-[#050814] overflow-hidden select-none font-sans text-white">
      {/* ── Top Floating Telemetry & Coordinate Teleport Header ─────────────── */}
      <header className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Left: Brand Badge & Mode Switcher */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#090d1a]/95 border border-white/20 backdrop-blur-xl shadow-2xl pointer-events-auto">
          <Link href="/destinations" className="flex items-center gap-1.5 text-xs font-mono text-white/80 hover:text-aurora transition-colors px-2 py-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Sanctuaries</span>
          </Link>
          <span className="text-white/20">|</span>

          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('globe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'globe'
                  ? 'bg-aurora text-ink-void shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>

            <button
              onClick={() => setViewMode('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                viewMode === 'satellite'
                  ? 'bg-aurora text-ink-void shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite Surface</span>
            </button>
          </div>
        </div>

        {/* Center: Global Coordinate Teleport & Sanctuary Search Bar */}
        <form
          onSubmit={handleTeleportOrSearch}
          className="flex items-center gap-2 w-full md:max-w-md pointer-events-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Enter Lat, Lng (e.g. 27.1751, 78.0421) or sanctuary name..."
              value={searchOrCoordInput}
              onChange={(e) => {
                setSearchOrCoordInput(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[#090d1a]/95 border border-white/20 text-white placeholder-white/40 text-xs font-mono backdrop-blur-xl focus:outline-none focus:border-aurora shadow-2xl"
            />
          </div>

          <button
            type="submit"
            className="h-11 px-4 rounded-2xl bg-aurora hover:bg-aurora-hover text-ink-void font-bold text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 shadow-lg"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Teleport</span>
          </button>
        </form>

        {/* Right Status Badges */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto">
          {/* Coordinates readout */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#090d1a]/95 border border-white/20 backdrop-blur-xl text-xs font-mono shadow-2xl flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-aurora" />
            <span className="text-white/90">
              {targetCoords.lat.toFixed(4)}° N, {targetCoords.lng.toFixed(4)}° E
            </span>
          </div>

          {/* Departure distance */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#090d1a]/95 border border-white/20 backdrop-blur-xl text-xs font-mono shadow-2xl flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-orchid" />
            <span className="text-white/70">From {userOrigin.split(',')[0]}:</span>
            <strong className="text-white font-bold">{flightDistanceKm.toLocaleString()} km</strong>
          </div>
        </div>
      </header>

      {/* Error alert toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[410] px-4 py-2 rounded-xl bg-rose-500/90 border border-rose-400 text-white text-xs font-mono flex items-center gap-2 shadow-2xl pointer-events-auto"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="ml-2 hover:text-black">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mode 1: True 3D Spherical Earth Globe (Tactical Canvas 3D) ──────── */}
      {viewMode === 'globe' && (
        <div className="w-full h-full relative z-10 flex items-center justify-center bg-[#050814]">
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1200}
            height={typeof window !== 'undefined' ? window.innerHeight : 800}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {/* 3D Globe Controls */}
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className="p-3 rounded-2xl bg-[#090d1a]/90 border border-white/20 backdrop-blur-xl text-white hover:border-aurora hover:text-aurora transition-colors shadow-2xl flex items-center gap-2 text-xs font-mono"
            >
              {autoRotate ? <Pause className="w-4 h-4 text-aurora" /> : <Play className="w-4 h-4" />}
              <span>{autoRotate ? 'Pause Orbit' : 'Auto Orbit'}</span>
            </button>

            <button
              onClick={() => {
                targetYawRef.current = -targetCoords.lng * D2R;
                targetPitchRef.current = targetCoords.lat * D2R * 0.75;
                setGlobeZoom(1);
              }}
              className="p-3 rounded-2xl bg-[#090d1a]/90 border border-white/20 backdrop-blur-xl text-white hover:border-aurora hover:text-aurora transition-colors shadow-2xl flex items-center gap-2 text-xs font-mono"
              title="Reset View to Target"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Center Target</span>
            </button>

            <button
              onClick={() => {
                setViewMode('satellite');
                setSatelliteZoom(6);
                setFlyTarget({
                  lat: targetCoords.lat,
                  lng: targetCoords.lng,
                  zoom: 6,
                  triggerId: Date.now(),
                });
              }}
              className="px-4 py-3 rounded-2xl bg-aurora hover:bg-aurora-hover text-ink-void font-bold transition-all shadow-2xl flex items-center gap-2 text-xs font-mono active:scale-95"
            >
              <Satellite className="w-4 h-4" />
              <span>Dive to Satellite Surface</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Mode 2: High-Resolution Satellite Map Engine (ESRI World Imagery) ─ */}
      {viewMode === 'satellite' && (
        <div className="w-full h-full relative z-10">
          <MapContainer
            center={[targetCoords.lat, targetCoords.lng]}
            zoom={DEFAULT_SATELLITE_ZOOM}
            minZoom={4} // Ensures it NEVER zooms out into a miniature flat strip
            maxZoom={19}
            maxBounds={[[-85, -180], [85, 180]]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            className="w-full h-full bg-[#050814]"
          >
            <SatelliteMapController
              flyTarget={flyTarget}
              onMapClick={handleMapClick}
              onZoomChange={(z) => setSatelliteZoom(z)}
            />

            {/* AAA Game-Style Seamless Preloaded Global Satellite Layer */}
            <AAAPreloadedSatelliteLayer />

            {/* Single Destination Marker (When on specific destination) */}
            {selectedDestination && (
              <Marker
                position={[selectedDestination.coordinates.lat, selectedDestination.coordinates.lng]}
                icon={createTargetIcon(selectedDestination.name, false)}
              >
                <Popup>
                  <div className="p-2 text-slate-900 text-xs font-mono">
                    <strong className="block text-sm font-serif">{selectedDestination.name}</strong>
                    <p>{selectedDestination.country} · {selectedDestination.elevation}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Satellite Lock Active</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Custom Coordinate Target Marker (When custom teleported/clicked) */}
            {!selectedDestination && (
              <Marker
                position={[targetCoords.lat, targetCoords.lng]}
                icon={createTargetIcon(customLocationName || `${aiPlaceInfo.country.split('(')[0].trim()}`, true)}
              >
                <Popup>
                  <div className="p-2 text-slate-900 text-xs font-mono">
                    <strong className="block text-sm font-serif">{aiPlaceInfo.country}</strong>
                    <p>{targetCoords.lat.toFixed(4)}°, {targetCoords.lng.toFixed(4)}°</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{aiPlaceInfo.terrainType}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}

      {/* ── Optical Zoom Telemetry Controls (Right Floating) ───────────────── */}
      <div className="absolute top-24 right-4 sm:right-6 z-30 p-3.5 rounded-2xl bg-[#090d1a]/95 border border-white/20 backdrop-blur-xl text-xs font-mono shadow-2xl flex flex-col gap-2.5 pointer-events-auto">
        <div className="flex items-center justify-between gap-3 text-[10px] text-white/60 uppercase font-bold">
          <span>Explore Level</span>
          <span className="text-aurora font-bold">{viewMode === 'globe' ? '3D Globe' : `${satelliteZoom}x`}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomPreset(Math.max(4, satelliteZoom - 2))}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          {/* Preset Buttons */}
          <button
            onClick={() => setZoomPreset(3)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${viewMode === 'globe' ? 'bg-aurora text-ink-void font-bold' : 'bg-white/10 text-white/80'}`}
          >
            🌐 3D Globe
          </button>
          <button
            onClick={() => setZoomPreset(6)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${viewMode === 'satellite' && satelliteZoom >= 5 && satelliteZoom <= 7 ? 'bg-aurora text-ink-void font-bold' : 'bg-white/10 text-white/80'}`}
          >
            Region
          </button>
          <button
            onClick={() => setZoomPreset(11)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${viewMode === 'satellite' && satelliteZoom >= 8 && satelliteZoom <= 13 ? 'bg-aurora text-ink-void font-bold' : 'bg-white/10 text-white/80'}`}
          >
            Terrain
          </button>
          <button
            onClick={() => setZoomPreset(16)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${viewMode === 'satellite' && satelliteZoom >= 14 ? 'bg-aurora text-ink-void font-bold' : 'bg-white/10 text-white/80'}`}
          >
            Surface
          </button>

          <button
            onClick={() => setZoomPreset(Math.min(19, satelliteZoom + 2))}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-white/40 text-center">
          {viewMode === 'globe' ? 'Drag globe to rotate in 3D' : 'Scroll mouse wheel to zoom smoothly'}
        </p>
      </div>

      {/* ── Left Floating Comprehensive Dossier Card ───────────────────────── */}
      <div
        className={`absolute bottom-6 sm:bottom-auto sm:top-24 left-4 sm:left-6 z-30 w-[calc(100%-2rem)] sm:w-[410px] transition-all duration-300 pointer-events-auto ${
          dossierOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="rounded-3xl bg-[#090d1a]/95 border border-white/20 backdrop-blur-2xl p-6 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Header Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/20 border border-aurora/40 text-aurora text-[10px] font-mono uppercase font-bold mb-2">
                <Sparkles className="w-3 h-3" />
                <span>{selectedDestination ? selectedDestination.region : 'AI Orbital Dossier'}</span>
              </div>
              <h2 className="font-serif text-2xl font-medium text-white tracking-tight">
                {selectedDestination ? selectedDestination.name : aiPlaceInfo.country}
              </h2>
              <p className="text-xs text-white/70 font-mono mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-aurora" /> 
                {selectedDestination ? `${selectedDestination.country} · ${selectedDestination.elevation}` : `${aiPlaceInfo.elevation} · ${targetCoords.lat.toFixed(4)}°, ${targetCoords.lng.toFixed(4)}°`}
              </p>
            </div>

            <button
              onClick={() => setDossierOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Photography Preview (if Destination) */}
          {selectedDestination && (
            <div className="relative h-40 rounded-2xl overflow-hidden border border-white/15">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 text-[11px] font-mono text-white/90">
                ⭐ {selectedDestination.rating} Explorer Score
              </div>
            </div>
          )}

          {/* Place Description & Geography */}
          <div>
            <span className="text-[10px] uppercase font-mono text-white/50 block font-bold mb-1">
              {selectedDestination ? 'Overview' : 'AI Geographic & Terrain Telemetry'}
            </span>
            <p className="text-xs text-white/80 leading-relaxed font-normal">
              {selectedDestination ? selectedDestination.description : aiPlaceInfo.description}
            </p>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase text-white/50 block font-bold">Flight Distance</span>
              <span className="text-white font-bold text-sm mt-0.5 block">{flightDistanceKm.toLocaleString()} km</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase text-white/50 block font-bold">Est. 7-Day Land</span>
              <span className="text-aurora font-bold text-sm mt-0.5 block">
                {selectedDestination ? formatPrice(selectedDestination.budgetUSD) : formatPrice(aiPlaceInfo.estimatedCostUSD)}
              </span>
            </div>
          </div>

          {/* Cultural Lore & Flavor */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
            <div>
              <span className="text-[10px] uppercase text-aurora font-bold block font-mono">Cultural Lore & History</span>
              <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
                {selectedDestination ? selectedDestination.culture : aiPlaceInfo.culture}
              </p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase text-orchid font-bold block font-mono">Authentic Local Flavor</span>
              <p className="text-[11px] text-white/80 mt-0.5 leading-snug">
                {selectedDestination ? selectedDestination.localDelicacy : aiPlaceInfo.localFlavor}
              </p>
            </div>
          </div>

          {/* Actions Strip */}
          <div className="pt-2 space-y-2">
            {/* Primary Action Button: More Info / Open Complete Dossier */}
            {selectedDestination ? (
              <Link href={`/destinations/${selectedDestination.id}`} className="block">
                <button className="w-full py-3 px-4 rounded-xl bg-aurora hover:bg-aurora-hover text-ink-void font-bold text-xs flex items-center justify-between shadow-lg transition-all active:scale-98">
                  <span>Explore Full Place Dossier & Guides</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <button
                onClick={() => setShowAIDossierModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-aurora hover:bg-aurora-hover text-ink-void font-bold text-xs flex items-center justify-between shadow-lg transition-all active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>View Full AI Dossier & Travel Guide</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Secondary Action: AI Budget Estimator */}
            <button
              onClick={() => setShowBudgetModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-orchid" />
              <span>Calculate AI Budget from {userOrigin.split(',')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimized Dossier Reopen Button */}
      {!dossierOpen && (
        <button
          onClick={() => setDossierOpen(true)}
          className="absolute top-24 left-4 z-30 p-3 rounded-2xl bg-[#090d1a]/90 border border-white/20 text-white backdrop-blur-xl shadow-2xl flex items-center gap-2 text-xs font-mono font-bold hover:border-aurora hover:text-aurora pointer-events-auto"
        >
          <Maximize2 className="w-4 h-4 text-aurora" />
          <span>Open Dossier</span>
        </button>
      )}

      {/* ── AI Full Place Dossier & Guide Modal (For Unlisted Coordinates) ──── */}
      <AnimatePresence>
        {showAIDossierModal && (
          <div
            className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShowAIDossierModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#090d1a] border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-white/15 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/20 text-aurora text-[10px] font-mono uppercase font-bold mb-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Gemini AI Spatial Intelligence (Ready for Live Key)</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    {aiPlaceInfo.country}
                  </h2>
                  <p className="text-xs font-mono text-white/60 mt-0.5">
                    Coordinates: {targetCoords.lat.toFixed(4)}° N, {targetCoords.lng.toFixed(4)}° E · Elevation: {aiPlaceInfo.elevation}
                  </p>
                </div>
                <button
                  onClick={() => setShowAIDossierModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* AI Terrain & Geography Dossier */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-mono uppercase font-bold text-aurora block">
                    1. Geographic Anatomy & Terrain Classification
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {aiPlaceInfo.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-white/70">
                    <span className="px-2.5 py-1 rounded-lg bg-white/10">Terrain: {aiPlaceInfo.terrainType}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10">Peak Elevation: {aiPlaceInfo.elevation}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10">Optimal Season: {aiPlaceInfo.bestSeason}</span>
                  </div>
                </div>

                {/* Cultural Context & Indigenous Lore */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-mono uppercase font-bold text-orchid block">
                    2. Human Settlement & Cultural Lineage
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {aiPlaceInfo.culture}
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10 text-white/80">
                    <strong>Authentic Delicacy:</strong> {aiPlaceInfo.localFlavor}
                  </div>
                </div>

                {/* Travel Feasibility & Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">Safety Index</span>
                    <span className="text-xl font-bold text-aurora mt-1 block">{aiPlaceInfo.safetyScore} / 100</span>
                    <span className="text-[10px] text-white/60">Low Hazard Territory</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">Distance from {userOrigin.split(',')[0]}</span>
                    <span className="text-xl font-bold text-white mt-1 block">{flightDistanceKm.toLocaleString()} km</span>
                    <span className="text-[10px] text-white/60">Estimated 8-12 hrs flight</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-mono uppercase text-white/50 block font-bold">Est. 7-Day Land Cost</span>
                    <span className="text-xl font-bold text-emerald-400 mt-1 block">{formatPrice(aiPlaceInfo.estimatedCostUSD)}</span>
                    <span className="text-[10px] text-white/60">Explorer tier baseline</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/15 bg-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowAIDossierModal(false);
                    setShowBudgetModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5 text-orchid" />
                  <span>Calculate AI Trip Budget</span>
                </button>

                <button
                  onClick={() => setShowAIDossierModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-aurora hover:bg-aurora-hover text-ink-void font-bold text-xs shadow-lg transition-all"
                >
                  Back to Explorer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── AI Budget Estimator Modal ───────────────────────────────────────── */}
      {showBudgetModal && (
        <AIBudgetEstimatorModal
          destination={selectedDestination || {
            id: 'custom-location',
            name: customLocationName || aiPlaceInfo.name,
            country: aiPlaceInfo.country,
            region: aiPlaceInfo.region,
            image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
            description: aiPlaceInfo.description,
            culture: aiPlaceInfo.culture,
            vibe: 'Global Orbit',
            rating: 5.0,
            reviewCount: 120,
            bestSeason: aiPlaceInfo.bestSeason,
            elevation: aiPlaceInfo.elevation,
            coordinates: targetCoords,
            budgetUSD: aiPlaceInfo.estimatedCostUSD,
            budgetTier: 'explorer',
            category: 'adventure',
            purposes: ['Exploration', 'Satellite'],
            localDelicacy: aiPlaceInfo.localFlavor,
            highlights: ['Satellite View', 'GPS Coordinate Lock', 'AI Synthesized Dossier'],
            flightBenchmarkUSD: {
              mumbai: 450,
              delhi: 450,
              newyork: 650,
              london: 550,
              dubai: 400,
              tokyo: 700,
              sydney: 850,
              paris: 550,
              singapore: 450,
              toronto: 700,
              default: 500,
            },
          }}
          initialOrigin={userOrigin}
          onClose={() => setShowBudgetModal(false)}
          onSaveOrigin={(newOrigin) => setUserOrigin(newOrigin)}
        />
      )}
    </div>
  );
}
