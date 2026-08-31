'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Lock, Eye, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-aurora selection:text-ink-void">
      <Navigation isLoggedIn={false} onLoginToggle={() => {}} />

      {/* Header */}
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 border border-aurora/25 text-aurora text-xs font-mono font-semibold tracking-wider uppercase mb-6"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data Privacy & Telemetry Ethics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl leading-[1.08] tracking-tight mb-6"
          >
            Privacy Policy & <br className="hidden sm:block" />
            <span className="font-serif-italic text-aurora">Data Protection.</span>
          </motion.h1>

          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: January 1, 2026 · Version 2.4
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-y relative">
        <div className="shell max-w-3xl mx-auto space-y-12 text-muted-foreground leading-relaxed text-sm">
          {/* Summary Box */}
          <div className="p-6 rounded-3xl bg-card border border-aurora/30 shadow-sm space-y-3">
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-aurora" />
              <span>Our Core Privacy Pledge</span>
            </h3>
            <ul className="space-y-2 text-xs font-mono text-foreground/90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0" />
                <span>Zero third-party advertising tracking or data broking.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0" />
                <span>GPS coordinates entered into the 3D globe are never sold.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0" />
                <span>Full data export and permanent deletion rights at any time.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              1. Information We Collect
            </h2>
            <p>
              When you use AtlasAura, we collect account credentials (name and email), your curated trip plans, saved sanctuary pins, and your voluntary traveler memory submissions.
            </p>
            <p>
              We do not track continuous background location telemetry on your device. Any coordinate lookup performed in our 3D Globe Explorer or Satellite Map is processed transiently to render satellite tiles and AI place dossiers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              2. How Your Data Is Protected
            </h2>
            <p>
              All personal communications, session tokens, and passwords are encrypted in transit via TLS 1.3 and at rest using AES-256 standards. Our database is isolated and protected by strict row-level security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              3. Cookies and Local Storage
            </h2>
            <p>
              We utilize essential local storage to remember your chosen theme preference (Day or Night mode), chosen currency (USD, INR, EUR, etc.), and active authentication session. We do not use cross-site behavioral tracking cookies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              4. Your Rights (GDPR & CCPA)
            </h2>
            <p>
              You maintain total ownership of your travel chronicles and photographs. You may export your entire memory archive or request complete account erasure via your Settings dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              5. Contact Our Data Protection Officer
            </h2>
            <p>
              If you have any questions regarding your data privacy or wish to request records, contact our privacy desk directly via our <Link href="/contact" className="text-aurora hover:underline font-semibold">Contact Page</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
