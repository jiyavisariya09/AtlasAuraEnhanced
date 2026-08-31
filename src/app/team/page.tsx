'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, MapPin, Compass, Sparkles, Feather, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

const TEAM_MEMBERS = [
  {
    name: 'Aria Chen',
    role: 'Lead Cartographer & Co-Founder',
    bio: 'Former geospatial engineer at Tokyo GIS Labs. Spends three months every winter mapping micro-elevation contours across Hokkaido and the Japanese Alps.',
    favoriteCoord: '36.2562° N, 136.9066° E (Shirakawa-gō, Japan)',
    expeditions: '38 Expeditions',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mateo Morales',
    role: 'Cultural Ethnographer & Founder',
    bio: 'Anthropologist documenting indigenous Quechua agricultural rhythms and Himalayan high-pass monastic traditions for over 12 years.',
    favoriteCoord: '-20.1338° S, -67.4891° W (Salar de Uyuni, Bolivia)',
    expeditions: '52 Expeditions',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Astrid Lindholm',
    role: 'Polar Climate & Dark Sky Specialist',
    bio: 'Tromsø-based aurora physicist tracking geomagnetic substorms and night sky darkness indexes across the Arctic Circle.',
    favoriteCoord: '67.9317° N, 13.0877° E (Lofoten, Norway)',
    expeditions: '29 Expeditions',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Devin Kothari',
    role: 'Spatial AI & Telemetry Architect',
    bio: 'Built real-time satellite rendering engines and 3D globe mathematics for AtlasAura. Passionate about high-altitude Himalayan motorcycle traverses.',
    favoriteCoord: '33.7595° N, 78.6674° E (Pangong Tso, Ladakh)',
    expeditions: '21 Expeditions',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Elena Rossi',
    role: 'Mediterranean Heritage & Culinary Curator',
    bio: 'Food historian uncovering century-old coastal recipes, ancient olive groves, and forgotten fishing lineages across Southern Europe.',
    favoriteCoord: '40.6281° N, 14.4850° E (Amalfi, Italy)',
    expeditions: '34 Expeditions',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Tariq Al-Mansoor',
    role: 'Desert Geography & Bedouin Lore Historian',
    bio: 'Specialist in ancient Nabataean trade routes, desert survival navigation, and stargazing storytelling across Wadi Rum and the Empty Quarter.',
    favoriteCoord: '30.3222° N, 35.4517° E (Petra, Jordan)',
    expeditions: '41 Expeditions',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  },
];

const STATS = [
  { value: '195', label: 'Nations Mapped' },
  { value: '48', label: 'Field Guides on the Ground' },
  { value: '45k+', label: 'Deliberate Wanderers' },
  { value: '0', label: 'Star Ratings or Hype Algorithms' },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Hero Header */}
      <section className="relative isolate pt-36 pb-20 overflow-hidden hairline-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[680px] h-[320px] rounded-full bg-violet/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet/10 border border-violet/25 text-violet text-xs font-mono font-semibold tracking-wider uppercase mb-6"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>The Cartography Guild</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-8"
          >
            The people who map <br className="hidden sm:block" />
            <span className="font-serif-italic text-violet">the atmosphere.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans max-w-2xl mx-auto"
          >
            A collective of cartographers, ethnographers, physicists, and software engineers dedicated to deliberate, sensory exploration.
          </motion.p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-12 border-b border-border/80 bg-muted/10">
        <div className="shell max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                className="p-4"
              >
                <div className="font-serif text-3xl sm:text-4xl font-bold text-aurora mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-y relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-aurora tracking-widest uppercase">
              Core Cartographers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mt-3">
              Meet our expedition leads.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE }}
                className="rounded-3xl bg-card border border-border/80 overflow-hidden shadow-sm hover:border-aurora/40 transition-all duration-300 group flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border/60 text-[11px] font-mono text-aurora font-semibold">
                      {member.expeditions}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-aurora transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-violet font-semibold mt-1">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Favorite Coordinate */}
                  <div className="pt-3 border-t border-border/60">
                    <span className="block text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
                      Favorite Coordinate
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground/90 truncate">
                      <MapPin className="w-3.5 h-3.5 text-aurora shrink-0" />
                      <span className="truncate">{member.favoriteCoord}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Guild Teaser */}
      <section className="section-y bg-muted/20 hairline-t relative overflow-hidden text-center">
        <div className="shell max-w-3xl mx-auto">
          <div className="p-10 sm:p-14 rounded-3xl bg-card border border-border/80 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-violet/15 blur-3xl" />
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Are you a local cartographer?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              We collaborate with field guides, botanists, and cultural historians in 195 countries. If you have deep local roots, connect with our team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora hover:bg-aurora-bright text-ink-void font-semibold text-sm transition-all shadow-lg active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Contact the Guild Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
