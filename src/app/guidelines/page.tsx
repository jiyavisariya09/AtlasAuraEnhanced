'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Heart, Sparkles, AlertCircle, Camera, Users, ArrowRight } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

const GUIDELINES = [
  {
    title: '1. Truth Over Glamour',
    desc: 'Do not hide the rain, the canceled ferry, or the three-hour wrong turn. AtlasAura is built on real friction. Honest memories help fellow wanderers prepare with humility.',
    icon: ShieldCheck,
  },
  {
    title: '2. Sacred Heritage & Local Respect',
    desc: 'Never geotag sacred indigenous sites or fragile ecological micro-habitats that cannot sustain foot traffic. Always ask permission before photographing local artisans or spiritual rituals.',
    icon: Heart,
  },
  {
    title: '3. Zero Commercial Astroturfing',
    desc: 'Sponsored content, affiliate links, and promotional reviews are strictly barred from the atlas. Any account found accepting payment for reviews is permanently removed.',
    icon: AlertCircle,
  },
  {
    title: '4. Authentic Photography Standards',
    desc: 'No over-saturated sky replacements or unrealistic filters. Photographs should reflect the actual light, weather, and mood of the coordinate.',
    icon: Camera,
  },
  {
    title: '5. Cultural Gratitude & Etiquette',
    desc: 'Document the local greetings, tipping norms, and dietary customs. Always leave places cleaner than you found them and support family-owned neighborhood establishments.',
    icon: Users,
  },
];

export default function GuidelinesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Hero Header */}
      <section className="relative isolate pt-36 pb-16 overflow-hidden hairline-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-aurora/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 border border-aurora/25 text-aurora text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Storytelling Code of Conduct</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6"
          >
            Community guidelines & <br className="hidden sm:block" />
            <span className="font-serif-italic text-aurora">wanderer ethics.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-xl mx-auto"
          >
            The principles that keep our sensory atlas authentic, respectful, and protected from commercial hype.
          </motion.p>
        </div>
      </section>

      {/* Guidelines Grid */}
      <section className="section-y relative">
        <div className="shell max-w-4xl mx-auto space-y-6">
          {GUIDELINES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: EASE }}
                className="p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-start gap-6 group hover:border-aurora/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-aurora/10 border border-aurora/20 flex items-center justify-center text-aurora shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-aurora transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-muted/20 hairline-t relative text-center">
        <div className="shell max-w-3xl mx-auto">
          <div className="p-10 sm:p-14 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready to chronicle your journey?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Join thousands of thoughtful wanderers documenting real, unvarnished memories across the globe.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-aurora hover:bg-aurora-bright text-ink-void font-semibold text-sm transition-all shadow-lg active:scale-95"
              >
                <span>Create Your Traveler Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
