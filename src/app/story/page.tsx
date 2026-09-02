'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, Globe, Sparkles, MapPin, Feather, Eye, Shield, ArrowRight, BookOpen } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    icon: Feather,
    title: 'Sensory Over Statistical',
    desc: 'No star ratings, algorithmic popularity contests, or tourist trap rankings. We document how a place feels at dawn, the sound of temple bells in the rain, and the scent of night jasmine.',
  },
  {
    icon: Compass,
    title: 'The Deliberate Wanderer',
    desc: 'We build tools for travelers who choose slow immersion over checklist tourism. For those who want to know the local language subtleties and cultural etiquette before booking.',
  },
  {
    icon: Eye,
    title: 'Zero Algorithmic Hype',
    desc: 'Traditional travel apps funnel millions of people into the exact same 10 photo spots, ruining local communities. We balance human discovery with sacred conservation.',
  },
  {
    icon: Shield,
    title: 'Unvarnished Truth',
    desc: 'Every memory, flight cost benchmark, and route guide contains honest friction — what it truly cost, what went wrong, and what to avoid — written by authentic wanderers.',
  },
];

const TIMELINE = [
  {
    year: '2023',
    title: 'The Manifesto in Kyoto',
    location: 'Arashiyama, Japan',
    desc: 'Born during a solitary rainy autumn in Kyoto. A notebook realization that modern travel had been reduced to 5-star ratings and shallow selfie lists.',
  },
  {
    year: '2024',
    title: 'The First 50 Sanctuaries',
    location: 'Patagonia & Tromsø',
    desc: 'A collective of 30 ethnographers, cartographers, and local guides mapped the first 50 sensory sanctuaries with micro-climates, indigenous histories, and exact GPS coordinates.',
  },
  {
    year: '2025',
    title: 'The Tactical 3D Globe',
    location: 'Global Launch',
    desc: 'Engineered a seamless spherical globe and satellite telemetry explorer allowing users to preview atmospheric lighting and real-time terrain from anywhere on Earth.',
  },
  {
    year: '2026',
    title: 'AtlasAura 2.0 & AI Dossiers',
    location: '120+ Countries Mapped',
    desc: 'Over 45,000 independent travelers now document cultural memories, regional culinary traditions, and sensory journeys across every continent.',
  },
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Hero Banner */}
      <section className="relative isolate pt-36 pb-20 overflow-hidden hairline-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-aurora/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 border border-aurora/25 text-aurora text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Our Origin & Manifesto</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-8"
          >
            A travel atlas with <br className="hidden sm:block" />
            <span className="font-serif-italic text-aurora">no star ratings.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans max-w-2xl mx-auto"
          >
            We believe places should not be scored out of five stars like vacuum cleaners. 
            AtlasAura is a sensory sanctuary mapping atmosphere, memory, and culture across 195 nations.
          </motion.p>
        </div>
      </section>

      {/* The Core Manifesto Section */}
      <section className="section-y relative">
        <div className="shell max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-aurora tracking-widest uppercase">
                The Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl leading-tight">
                Why we stopped rating mountains on the internet.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When an algorithm rates a 1,000-year-old Norwegian fjord 4.2 stars because the parking lot was crowded on a Sunday, something fundamental in our relationship with travel has broken.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AtlasAura maps the sensory atmosphere: the crispness of high mountain air, the quiet cadence of monastic tea ceremonies, the exact season when the salt flats turn into celestial mirrors, and the cultural gratitude needed when arriving.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALUES.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                    className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm hover:border-aurora/40 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-aurora/10 border border-aurora/20 flex items-center justify-center text-aurora mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2 text-foreground group-hover:text-aurora transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {val.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Journey */}
      <section className="section-y bg-muted/20 hairline-t hairline-b relative">
        <div className="shell max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold text-aurora tracking-widest uppercase">
              The Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mt-3">
              How the atlas came to life.
            </h2>
          </div>

          <div className="relative border-l border-border/80 ml-4 sm:ml-32 space-y-12 pl-6 sm:pl-10">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE }}
                className="relative group"
              >
                {/* Dot */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-aurora group-hover:bg-aurora transition-colors shadow-sm" />
                
                <span className="inline-block sm:absolute sm:-left-32 sm:top-1 text-xs font-bold text-aurora mb-1 sm:mb-0">
                  {item.year}
                </span>

                <div className="p-6 rounded-3xl bg-card border border-border/80 group-hover:border-aurora/30 transition-all shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {item.location}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="section-y relative overflow-hidden text-center">
        <div className="shell max-w-3xl mx-auto">
          <div className="p-10 sm:p-14 rounded-3xl bg-card border border-border/80 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-aurora/15 blur-3xl" />
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Wander with purpose.
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              Explore our curated sanctuaries, inspect real-time satellite telemetry, or plan a bespoke 7-day itinerary.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/destinations"
                className="px-6 py-3 rounded-full bg-aurora hover:bg-aurora-bright text-ink-void font-semibold text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95"
              >
                <span>Browse Sanctuaries</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/globe"
                className="px-6 py-3 rounded-full bg-muted/60 hover:bg-muted text-foreground font-semibold text-sm transition-all border border-border flex items-center gap-2"
              >
                <span>Explore 3D Globe</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
