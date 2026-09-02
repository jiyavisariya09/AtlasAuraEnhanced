'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Compass, MapPin, Navigation, Mountain, 
  Calendar, RotateCcw, ZoomIn, ZoomOut, Sparkles, Plane,
  Layers, Map as MapIcon, Eye, ExternalLink
} from 'lucide-react';
import type { DestinationItem } from '@/data/destinationsData';
import { useTheme } from '@/context/ThemeContext';
import { useModalLayer } from '@/hooks/use-modal-layer';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DestinationGlobeModalProps {
  destination: DestinationItem | null;
  userLocationName?: string;
  userCoords?: { lat: number; lng: number };
  onClose: () => void;
}

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;

// Real continent coastlines (simplified polylines in lat/lng)
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
  // Great Britain & Ireland
  [
    [50.0, -5.5], [51.5, 1.4], [58.5, -3.0], [57.5, -5.8], [55.0, -5.0],
    [51.0, -4.5], [50.0, -5.5]
  ],
  // Scandinavia
  [
    [58.0, 6.0], [62.0, 5.0], [68.0, 14.0], [71.0, 26.0], [65.0, 24.0],
    [56.0, 13.0], [58.0, 6.0]
  ],
  // Indonesia (Sumatra/Java/Papua spine)
  [
    [5.5, 95.5], [-3.0, 102.0], [-6.0, 106.0], [-8.5, 115.0], [-8.5, 126.0],
    [-3.0, 138.0], [-0.5, 131.0], [1.5, 125.0], [3.0, 117.0], [5.5, 95.5]
  ]
];

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

function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * D2R;
  const dLon = (lon2 - lon1) * D2R;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * D2R) * Math.cos(lat2 * D2R) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function LeafletMapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function DestinationGlobeModal({
  destination,
  userLocationName = 'Mumbai, India',
  userCoords = { lat: 19.0760, lng: 72.8777 },
  onClose,
}: DestinationGlobeModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const panelRef = useModalLayer(Boolean(destination), onClose);

  // Dual-view state: 3D Orbital Globe vs Topographic Place Anatomy Map
  const [viewMode, setViewMode] = useState<'globe' | 'anatomy'>('globe');
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [mapZoomLevel, setMapZoomLevel] = useState(8);

  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Angular state for 3D Earth
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!destination) return;
    const { lat, lng } = destination.coordinates;
    targetYawRef.current = -lng * D2R;
    targetPitchRef.current = lat * D2R * 0.7;
    currentYawRef.current = targetYawRef.current - 0.5;
    currentPitchRef.current = targetPitchRef.current - 0.2;
  }, [destination]);

  const resetCamera = useCallback(() => {
    if (!destination) return;
    const { lat, lng } = destination.coordinates;
    targetYawRef.current = -lng * D2R;
    targetPitchRef.current = lat * D2R * 0.7;
    setZoom(1);
  }, [destination]);

  // 3D Canvas Rendering with Real Continents
  useEffect(() => {
    if (!destination || viewMode !== 'globe') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const destVec = toVec(destination.coordinates.lat, destination.coordinates.lng);
    const userVec = toVec(userCoords.lat, userCoords.lng);

    // Pre-vectorize continent points
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
      const radius = Math.min(cx, cy) * 0.68 * zoom;

      if (!isDragging && !autoRotate) {
        currentYawRef.current += (targetYawRef.current - currentYawRef.current) * 0.05;
        currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * 0.05;
      } else if (autoRotate) {
        currentYawRef.current += 0.003;
      }

      const yaw = currentYawRef.current;
      const pitch = currentPitchRef.current;

      ctx.clearRect(0, 0, width, height);

      // 1. Outer Glow Atmosphere
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.35);
      if (isDark) {
        glowGrad.addColorStop(0, 'rgba(62, 232, 200, 0.2)');
        glowGrad.addColorStop(0.5, 'rgba(139, 127, 245, 0.09)');
        glowGrad.addColorStop(1, 'rgba(8, 11, 20, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(14, 156, 134, 0.15)');
        glowGrad.addColorStop(0.6, 'rgba(90, 76, 209, 0.06)');
        glowGrad.addColorStop(1, 'rgba(245, 248, 252, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, TAU);
      ctx.fill();

      // 2. Earth Ocean Body
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      const sphereGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
      if (isDark) {
        sphereGrad.addColorStop(0, '#101B38');
        sphereGrad.addColorStop(0.6, '#080E21');
        sphereGrad.addColorStop(1, '#040712');
      } else {
        sphereGrad.addColorStop(0, '#FFFFFF');
        sphereGrad.addColorStop(0.7, '#E4ECF7');
        sphereGrad.addColorStop(1, '#D0DFEE');
      }
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(62, 232, 200, 0.35)' : 'rgba(14, 156, 134, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.clip();

      // 3. Graticule Lat / Lng Rings
      ctx.strokeStyle = isDark ? 'rgba(62, 232, 200, 0.12)' : 'rgba(14, 156, 134, 0.16)';
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

      // 4. Draw Real Continents & Landmasses on 3D Sphere
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
        ctx.fillStyle = isDark ? 'rgba(62, 232, 200, 0.14)' : 'rgba(14, 156, 134, 0.18)';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(62, 232, 200, 0.45)' : 'rgba(14, 156, 134, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 5. Great Circle Flight Path Arc
      const uRot = rotate(userVec, yaw, pitch);
      const dRot = rotate(destVec, yaw, pitch);

      ctx.beginPath();
      let hasVisibleArc = false;
      for (let t = 0; t <= 1; t += 0.02) {
        const alt = 1 + Math.sin(t * Math.PI) * 0.15;
        const midLat = userCoords.lat + (destination.coordinates.lat - userCoords.lat) * t;
        const midLng = userCoords.lng + (destination.coordinates.lng - userCoords.lng) * t;
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
      ctx.strokeStyle = isDark ? 'rgba(139, 127, 245, 0.85)' : 'rgba(90, 76, 209, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. User Origin Pin
      if (uRot[2] > -0.1) {
        const px = cx + uRot[0] * radius;
        const py = cy - uRot[1] * radius;

        ctx.fillStyle = '#8B7FF5';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, TAU);
        ctx.fill();

        ctx.fillStyle = isDark ? '#E8EDF7' : '#0B1020';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('📍 ' + userLocationName.split(',')[0], px + 8, py - 6);
      }

      // 7. Destination Target Marker with Pulsing Beacon
      if (dRot[2] > -0.1) {
        const px = cx + dRot[0] * radius;
        const py = cy - dRot[1] * radius;
        const pulse = (Math.sin(Date.now() * 0.006) + 1) * 0.5;

        // Glowing Beacon
        ctx.beginPath();
        ctx.arc(px, py, 9 + pulse * 10, 0, TAU);
        ctx.fillStyle = isDark ? `rgba(62, 232, 200, ${0.45 - pulse * 0.35})` : `rgba(14, 156, 134, ${0.45 - pulse * 0.35})`;
        ctx.fill();

        // Pin Core
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, TAU);
        ctx.fillStyle = isDark ? '#3EE8C8' : '#0E9C86';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Target Badge Label
        ctx.fillStyle = isDark ? '#3EE8C8' : '#0E9C86';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`🎯 ${destination.name}`, px + 12, py - 8);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [destination, isDark, zoom, isDragging, autoRotate, userCoords, userLocationName, viewMode]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !lastMouseRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    currentYawRef.current += dx * 0.008;
    currentPitchRef.current = Math.max(-1.2, Math.min(1.2, currentPitchRef.current + dy * 0.008));
    targetYawRef.current = currentYawRef.current;
    targetPitchRef.current = currentPitchRef.current;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastMouseRef.current = null;
  };

  if (!destination) return null;

  const distanceKm = calculateDistanceKm(
    userCoords.lat,
    userCoords.lng,
    destination.coordinates.lat,
    destination.coordinates.lng,
  );

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-3xl bg-card border border-border overflow-hidden shadow-2xl flex flex-col lg:flex-row h-[92vh] max-h-[860px]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-card/90 border border-border text-foreground hover:bg-aurora hover:text-ink-void transition-all shadow-md active:scale-95"
            title="Close Explorer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Interactive Canvas / Topographic Map */}
          <div className="relative flex-1 flex items-center justify-center bg-[#060810] dark:bg-[#060810] overflow-hidden select-none">
            {/* Mode Switcher Tabs (3D Globe vs Place Anatomy Map) */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 p-1 rounded-2xl bg-card/85 border border-border backdrop-blur-md shadow-md">
              <button
                type="button"
                onClick={() => setViewMode('globe')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'globe'
                    ? 'bg-aurora text-ink-void shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3D Orbital Earth</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('anatomy')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'anatomy'
                    ? 'bg-aurora text-ink-void shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Topographic Anatomy</span>
              </button>
            </div>

            {/* ── View Mode 1: 3D Orbital Globe ─────────────────────────── */}
            {viewMode === 'globe' ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={700}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-full max-w-[650px] max-h-[650px] cursor-grab active:cursor-grabbing"
                />

                {/* Floating Orbit Controls */}
                <div className="absolute bottom-5 left-5 flex items-center gap-2 z-20">
                  <button
                    onClick={() => setZoom((prev) => Math.min(1.7, prev + 0.2))}
                    className="p-2.5 rounded-xl bg-card/85 border border-border backdrop-blur-md text-foreground hover:border-aurora hover:text-aurora transition-colors shadow-sm"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoom((prev) => Math.max(0.65, prev - 0.2))}
                    className="p-2.5 rounded-xl bg-card/85 border border-border backdrop-blur-md text-foreground hover:border-aurora hover:text-aurora transition-colors shadow-sm"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetCamera}
                    className="px-3 py-2 rounded-xl bg-card/85 border border-border backdrop-blur-md text-foreground hover:border-aurora hover:text-aurora transition-colors shadow-sm flex items-center gap-1.5 text-xs font-medium"
                    title="Center on Destination"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-aurora" />
                    <span>Target Destination</span>
                  </button>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-3 py-2 rounded-xl border backdrop-blur-md text-xs transition-colors ${
                      autoRotate
                        ? 'border-aurora bg-aurora/20 text-aurora font-bold'
                        : 'border-border bg-card/85 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {autoRotate ? 'Orbiting...' : 'Auto Orbit'}
                  </button>
                </div>
              </>
            ) : (
              /* ── View Mode 2: Place Anatomy Topographic & Satellite Map ─── */
              <div className="w-full h-full relative">
                {/* Map Layer Switcher */}
                <div className="absolute top-16 left-4 z-[400] flex items-center gap-1 p-1 rounded-xl bg-card/90 border border-border backdrop-blur-md text-[11px] shadow-md">
                  <button
                    type="button"
                    onClick={() => setMapLayer('streets')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      mapLayer === 'streets'
                        ? 'bg-aurora text-ink-void font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Terrain & Borders
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapLayer('satellite')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      mapLayer === 'satellite'
                        ? 'bg-aurora text-ink-void font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Satellite Imagery
                  </button>
                </div>

                <MapContainer
                  center={[destination.coordinates.lat, destination.coordinates.lng]}
                  zoom={mapZoomLevel}
                  scrollWheelZoom={true}
                  className="w-full h-full z-10"
                >
                  <LeafletMapUpdater
                    center={[destination.coordinates.lat, destination.coordinates.lng]}
                    zoom={mapZoomLevel}
                  />

                  {mapLayer === 'streets' ? (
                    <TileLayer
                      attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
                      url={
                        isDark
                          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                      }
                    />
                  ) : (
                    <TileLayer
                      attribution='&copy; Google Satellite & Earth Imagery'
                      url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                      subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                      maxZoom={20}
                      minZoom={4}
                      keepBuffer={12}
                      updateWhenZooming={false}
                      updateWhenIdle={false}
                    />
                  )}

                  <Marker position={[destination.coordinates.lat, destination.coordinates.lng]}>
                    <Popup>
                      <div className="p-2 space-y-1 text-slate-900 font-sans text-xs">
                        <strong className="block text-sm font-serif">{destination.name}</strong>
                        <p>{destination.country} · {destination.elevation}</p>
                        <p className="text-[10px] text-slate-600">
                          {destination.coordinates.lat.toFixed(4)}°N, {destination.coordinates.lng.toFixed(4)}°E
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* Anatomy Controls */}
                <div className="absolute bottom-5 right-5 z-[400] flex flex-col gap-1.5">
                  <button
                    onClick={() => setMapZoomLevel((z) => Math.min(16, z + 1))}
                    className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:border-aurora shadow-lg"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMapZoomLevel((z) => Math.max(3, z - 1))}
                    className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:border-aurora shadow-lg"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Top Flight Distance Tag */}
            <div className="absolute top-4 right-16 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-border backdrop-blur-md shadow-md text-xs">
              <Plane className="w-3.5 h-3.5 text-orchid" />
              <span className="text-muted-foreground">{userLocationName.split(',')[0]} ➔ {destination.country}:</span>
              <span className="text-foreground font-bold">{distanceKm.toLocaleString('en-US')} km</span>
            </div>
          </div>

          {/* Right: Place Anatomy Dossier */}
          <div className="w-full lg:w-[380px] p-6 sm:p-7 bg-card border-t lg:border-t-0 lg:border-l border-border flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora/15 border border-aurora/30 text-aurora text-xs uppercase tracking-wider mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Geographic Anatomy</span>
                </div>
                <h2 className="font-serif text-3xl font-medium text-foreground tracking-tight">
                  {destination.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-aurora" />
                  {destination.country} · {destination.region}
                </p>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-muted/40 border border-border/80 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Latitude</span>
                  <span className="font-bold text-foreground">{destination.coordinates.lat.toFixed(4)}° N</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Longitude</span>
                  <span className="font-bold text-foreground">{destination.coordinates.lng.toFixed(4)}° E</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Elevation</span>
                  <span className="font-bold text-foreground">{destination.elevation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Best Season</span>
                  <span className="font-bold text-foreground">{destination.bestSeason.split('(')[0]}</span>
                </div>
              </div>

              {/* Atmosphere & Anatomy details */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Topographic Profile
                  </h4>
                  <p className="text-xs text-foreground/85 leading-relaxed">
                    {destination.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Cultural Lore
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {destination.culture}
                  </p>
                </div>
              </div>

              {/* Surrounding Waypoints */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-aurora" />
                  Must-Explore Waypoints
                </h4>
                <div className="space-y-1.5">
                  {destination.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-aurora shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-border mt-5 space-y-2">
              <Button
                onClick={() => setViewMode(viewMode === 'globe' ? 'anatomy' : 'globe')}
                variant="outline"
                className="w-full rounded-full border-aurora/40 text-aurora hover:bg-aurora hover:text-ink-void font-semibold text-xs py-4 transition-all"
              >
                {viewMode === 'globe' ? '🗺️ Switch to Anatomy Map' : '🌐 Switch to 3D Orbit Globe'}
              </Button>

              <Button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-full text-xs py-4"
              >
                Close Explorer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
