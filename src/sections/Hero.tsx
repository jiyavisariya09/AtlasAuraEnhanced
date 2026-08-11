"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

const STARS = [
  { top: "6%", left: "8%", size: "w-[2px] h-[2px]", delay: "0.2s", opacity: "opacity-80" },
  { top: "12%", left: "18%", size: "w-[3px] h-[3px]", delay: "1.1s", opacity: "opacity-90" },
  { top: "5%", left: "28%", size: "w-[1.5px] h-[1.5px]", delay: "2.4s", opacity: "opacity-70" },
  { top: "18%", left: "36%", size: "w-[2px] h-[2px]", delay: "0.8s", opacity: "opacity-85" },
  { top: "9%", left: "48%", size: "w-[4px] h-[4px]", delay: "1.5s", opacity: "opacity-100", flare: true },
  { top: "15%", left: "58%", size: "w-[2px] h-[2px]", delay: "0.4s", opacity: "opacity-80" },
  { top: "7%", left: "69%", size: "w-[3px] h-[3px]", delay: "1.9s", opacity: "opacity-95" },
  { top: "14%", left: "78%", size: "w-[4px] h-[4px]", delay: "0.7s", opacity: "opacity-100", flare: true },
  { top: "8%", left: "89%", size: "w-[2px] h-[2px]", delay: "2.2s", opacity: "opacity-85" },
  { top: "22%", left: "12%", size: "w-[2.5px] h-[2.5px]", delay: "1.6s", opacity: "opacity-75" },
  { top: "25%", left: "24%", size: "w-[1.5px] h-[1.5px]", delay: "0.3s", opacity: "opacity-65" },
  { top: "20%", left: "42%", size: "w-[3px] h-[3px]", delay: "2.8s", opacity: "opacity-90" },
  { top: "24%", left: "64%", size: "w-[2px] h-[2px]", delay: "1.2s", opacity: "opacity-80" },
  { top: "21%", left: "84%", size: "w-[3.5px] h-[3.5px]", delay: "2.0s", opacity: "opacity-95", flare: true },
  { top: "29%", left: "7%", size: "w-[1.5px] h-[1.5px]", delay: "0.9s", opacity: "opacity-70" },
  { top: "31%", left: "31%", size: "w-[2px] h-[2px]", delay: "1.8s", opacity: "opacity-85" },
  { top: "27%", left: "53%", size: "w-[4px] h-[4px]", delay: "2.5s", opacity: "opacity-100", flare: true },
  { top: "33%", left: "76%", size: "w-[2px] h-[2px]", delay: "0.6s", opacity: "opacity-75" },
  { top: "30%", left: "93%", size: "w-[2.5px] h-[2.5px]", delay: "1.4s", opacity: "opacity-85" },
  { top: "38%", left: "19%", size: "w-[1.5px] h-[1.5px]", delay: "2.1s", opacity: "opacity-60" },
  { top: "36%", left: "46%", size: "w-[2px] h-[2px]", delay: "0.5s", opacity: "opacity-80" },
  { top: "37%", left: "82%", size: "w-[2px] h-[2px]", delay: "1.7s", opacity: "opacity-70" },
];

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Scroll parallax
  const { scrollY } = useScroll();
  const bgScrollY = useTransform(scrollY, [0, 600], [0, 120]);
  const textY = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);

  const stats = [
    { value: "50K+", label: "Memory Pins" },
    { value: "195", label: "Countries" },
    { value: "12K+", label: "Stories" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Static Background Image ── */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ y: bgScrollY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
          }}
        />

        {/* Day mode overlay — smooth 600ms theme transition */}
        <div
          className={`absolute inset-0 transition-opacity duration-600 ease-out ${
            !isDark ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/50 via-blue-900/35 to-indigo-950/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-transparent to-sky-900/30" />
        </div>

        {/* Dark mode overlay with Twinkling Starry Night Sky */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            isDark ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-indigo-950/50 to-slate-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/40" />

          {/* Twinkling Stars Over Mountain Sky */}
          <div className="absolute inset-x-0 top-0 h-[60%] pointer-events-none overflow-hidden">
            {STARS.map((star, i) => (
              <div
                key={i}
                className={`absolute rounded-full bg-white animate-pulse ${star.size} ${star.opacity}`}
                style={{
                  top: star.top,
                  left: star.left,
                  animationDelay: star.delay,
                  animationDuration: '3s',
                  boxShadow: star.flare
                    ? '0 0 10px 2px rgba(255, 255, 255, 0.9), 0 0 16px 4px rgba(186, 230, 253, 0.5)'
                    : '0 0 4px 1px rgba(255, 255, 255, 0.6)',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16"
        style={{ y: textY, opacity }}
      >
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] text-white drop-shadow-lg"
        >
          Where Every Journey
          <br />
          <span className="text-gradient drop-shadow-none">Leaves a Mark</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-white/85 leading-relaxed font-normal"
        >
          AtlasAura is your companion for purpose-driven travel. Explore countries through emotional memories, cultural insights, and hidden gems shared by fellow wanderers.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-sky-500 via-sky-400 to-indigo-500 text-white font-bold px-8 py-6 text-lg transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-sky-500/35 hover:scale-[1.02] active:scale-[0.98] transform-gpu shadow-xl shadow-sky-500/25 border border-sky-300/30"
            >
              <Compass className="w-5 h-5 mr-2 transition-transform duration-500 ease-out group-hover:rotate-45" />
              Start Exploring
            </Button>
          </Link>
          <Link href="#world-map">
            <Button
              size="lg"
              variant="outline"
              className="group border-white/30 text-white hover:bg-white/20 hover:border-white/60 bg-white/10 backdrop-blur-md px-8 py-6 text-lg font-bold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] transform-gpu"
            >
              <MapPin className="w-5 h-5 mr-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
              View World Map
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center group cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-sky-300 transition-colors duration-300">{stat.value}</div>
              <div className="text-sm text-white/65 mt-1 tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            const el = document.getElementById('explore');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>

      {/* Soft, natural bottom fade transition */}
      <div className={`absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t z-10 pointer-events-none transition-colors duration-700 ease-out ${
        isDark
          ? 'from-[#090d1a] via-[#090d1a]/40 to-transparent'
          : 'from-[#f0f6ff] via-[#f0f6ff]/40 to-transparent'
      }`} />
    </section>
  );
}
