'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Header */}
      <section className="relative isolate pt-36 pb-16 overflow-hidden hairline-b">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full bg-violet/10 blur-[120px]" />
          <div className="graticule absolute inset-0 opacity-40" />
        </div>

        <div className="shell max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet/10 border border-violet/25 text-violet text-xs font-mono font-semibold tracking-wider uppercase mb-6"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Wanderer Agreement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl leading-[1.08] tracking-tight mb-6"
          >
            Terms of Service & <br className="hidden sm:block" />
            <span className="font-serif-italic text-violet">Usage Agreement.</span>
          </motion.h1>

          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: January 1, 2026 · Version 2.4
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-y relative">
        <div className="shell max-w-3xl mx-auto space-y-12 text-muted-foreground leading-relaxed text-sm">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing AtlasAura, using our 3D Globe Explorer, or contributing travel chronicles, you agree to comply with these terms and our Community Guidelines.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              2. User-Generated Content and Intellectual Property
            </h2>
            <p>
              You retain all copyright and intellectual property rights to the travel accounts, photographs, and memories you publish on AtlasAura. By submitting content, you grant AtlasAura a non-exclusive license to display your memory within the sensory atlas.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              3. Travel Safety and Autonomous Navigation Disclaimer
            </h2>
            <p>
              AtlasAura provides atmospheric, geographical, and cultural intelligence for deliberate wanderers. High-altitude passes, polar expeditions, and remote sea coordinates involve inherent physical risks. Users are solely responsible for verifying local weather warnings, permits, and hiring certified local guides when entering remote wilderness terrain.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              4. Code of Conduct
            </h2>
            <p>
              Any attempt to harass local communities, post fraudulent reviews for monetary gain, or inject malicious code into the atlas will result in immediate and permanent account termination.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              5. Modifications and Governing Law
            </h2>
            <p>
              We reserve the right to update these terms as our spatial cartography tools evolve. Continued usage constitutes acceptance of revised terms.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
