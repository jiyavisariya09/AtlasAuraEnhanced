'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Newspaper, Download, Mail, Sparkles, Globe, Quote, ExternalLink, ArrowRight } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

const PRESS_RELEASES = [
  {
    date: 'January 14, 2026',
    outlet: 'Monocle Global Travel',
    title: 'The Anti-Instagram Atlas: How AtlasAura is Reclaiming Slow, Sensory Exploration',
    summary: 'An in-depth profile on how AtlasAura eliminated star ratings and built a tactile 3D globe dedicated to micro-climates, local dialects, and slow exploration.',
    readTime: '6 min read',
  },
  {
    date: 'November 28, 2025',
    outlet: 'Wired Magazine',
    title: 'Mapping Atmosphere: Combining Satellite Telemetry with Indigenous Oral History',
    summary: 'A technical exploration into AtlasAura’s browser-native spherical globe engine, rendering accurate solar angles and planetary terrain at 60 FPS.',
    readTime: '8 min read',
  },
  {
    date: 'August 19, 2025',
    outlet: 'National Geographic Traveler',
    title: 'Why Rating a 1,000-Year-Old Mountain 4.2 Stars Breaks Our Relationship with the World',
    summary: 'A guest essay by AtlasAura cartographers on the philosophy of deliberate wandering and responsible tourism in vulnerable ecosystems.',
    readTime: '5 min read',
  },
];

const BRAND_PALETTE = [
  { name: 'Aurora Teal', hex: '#3EE8C8', role: 'Primary Celestial Accent' },
  { name: 'Night Void', hex: '#080B14', role: 'Tactical Base' },
  { name: 'Paper White', hex: '#E8EDF7', role: 'Primary Typography' },
  { name: 'Cosmic Violet', hex: '#8B7FF5', role: 'Secondary Accent' },
  { name: 'Dawn Rose', hex: '#F2789F', role: 'Tertiary Accent' },
];

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Hero Header */}
      <section className="relative isolate pt-36 pb-16 overflow-hidden hairline-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-rose/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose/10 border border-rose/25 text-rose text-xs font-mono font-semibold tracking-wider uppercase mb-6"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Newsroom & Media Kit</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6"
          >
            Press releases & <br className="hidden sm:block" />
            <span className="font-serif-italic text-rose">brand assets.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-xl mx-auto"
          >
            Official news, editorial coverage, high-resolution media photography, and typography assets for journalists and creators.
          </motion.p>
        </div>
      </section>

      {/* Featured Press Stories */}
      <section className="section-y relative">
        <div className="shell max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-aurora tracking-widest uppercase">
              Editorial Coverage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mt-2">
              Featured In The Press
            </h2>
          </div>

          <div className="space-y-6">
            {PRESS_RELEASES.map((article, idx) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                className="p-8 rounded-3xl bg-card border border-border/80 hover:border-aurora/40 transition-all shadow-sm group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-aurora uppercase tracking-wider">
                    {article.outlet}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-aurora transition-colors mb-3">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Identity & Palette */}
      <section className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-aurora tracking-widest uppercase">
              Brand Identity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mt-2">
              The "Aurora Ink" Palette
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Our curated color palette designed for high contrast and sensory atmospheric depth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BRAND_PALETTE.map((color) => (
              <div
                key={color.hex}
                className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3"
              >
                <div
                  className="w-full h-20 rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="text-xs font-serif font-bold text-foreground truncate">
                    {color.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {color.hex}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mt-1 leading-tight">
                    {color.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact Card */}
      <section className="section-y relative text-center">
        <div className="shell max-w-3xl mx-auto">
          <div className="p-10 sm:p-14 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Media Inquiries & Embargo Access
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              For interview requests with our founders or high-res vector assets, contact our editorial press desk.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora hover:bg-aurora-bright text-ink-void font-semibold text-sm transition-all shadow-lg active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Press Office</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
