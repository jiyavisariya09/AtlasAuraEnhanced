'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cookie, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CookiesPage() {
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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 border border-aurora/25 text-aurora text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Local Storage & Sensory Cache</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl leading-[1.08] tracking-tight mb-6"
          >
            Cookie & Cache <br className="hidden sm:block" />
            <span className="font-serif-italic text-aurora">Policy.</span>
          </motion.h1>

          <p className="text-xs text-muted-foreground">
            Effective Date: January 1, 2026 · Version 2.4
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-y relative">
        <div className="shell max-w-3xl mx-auto space-y-12 text-muted-foreground leading-relaxed text-sm">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              1. What We Store Locally
            </h2>
            <p>
              AtlasAura uses browser local storage and essential session tokens solely to enhance your exploration experience. We do not use intrusive cross-site tracking cookies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Storage Categories
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-xs block">atlasaura-theme</strong>
                  <span className="text-xs text-muted-foreground">Stores your preference for Day (Light) or Night (Dark) mode.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-xs block">atlasaura-currency</strong>
                  <span className="text-xs text-muted-foreground">Remembers your preferred currency conversion benchmark (USD, INR, EUR, etc.).</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-xs block">atlasaura_auth_user</strong>
                  <span className="text-xs text-muted-foreground">Maintains your authenticated session securely on your device.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              2. Managing Your Storage
            </h2>
            <p>
              You can clear your stored preferences and caches at any time directly through your browser settings or via the Data Controls section on your <Link href="/settings" className="text-aurora hover:underline font-semibold">Settings Page</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
