"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    { value: "50K+", label: "Memory Pins" },
    { value: "195", label: "Countries" },
    { value: "12K+", label: "Stories" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        {/* Real travel photo — Santorini aerial, works great in both modes */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop')`,
          }}
        />
        {/* Day mode: soft bright overlay that keeps image visible but adds warmth */}
        {!isDark && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900/40 via-blue-800/20 to-indigo-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-sky-900/20" />
          </>
        )}
        {/* Dark mode: deeper overlay */}
        {isDark && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-blue-950/50 to-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
          </>
        )}
      </div>

      {/* ── Floating ambient orbs ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-indigo-400/15 blur-3xl"
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/15 backdrop-blur-md border border-white/25"
        >
          <div className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
          <span className="text-sm font-semibold text-white/90 tracking-wide">50,000+ travelers worldwide</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white drop-shadow-lg"
        >
          Where Every Journey
          <br />
          <span className="text-gradient drop-shadow-none">Leaves a Mark</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-white/80 leading-relaxed"
        >
          AtlasAura is your companion for purpose-driven travel. Explore countries through emotional memories, cultural insights, and hidden gems shared by fellow wanderers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold px-8 py-6 text-lg hover:from-sky-400 hover:to-indigo-400 transition-all hover:scale-105 shadow-xl shadow-sky-500/30"
          >
            <Compass className="w-5 h-5 mr-2" />
            Start Exploring
          </Button>
          <Link href="#world-map">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/15 bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-bold"
            >
              <MapPin className="w-5 h-5 mr-2" />
              View World Map
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-white/50">Scroll to explore</span>
          <ArrowDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t z-10 ${isDark ? 'from-slate-950' : 'from-sky-50'} to-transparent`} />
    </section>
  );
}
