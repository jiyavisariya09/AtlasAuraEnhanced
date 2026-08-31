'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Compass, Shield, Clock, PhoneCall, Sparkles } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const EASE = [0.22, 1, 0.36, 1] as const;

const TOPICS = [
  { id: 'expedition', label: 'Expedition & Route Inquiries', icon: Compass },
  { id: 'cartography', label: 'Local Cartographer Guild Submission', icon: MapPin },
  { id: 'press', label: 'Press & Editorial Media Kit', icon: MessageSquare },
  { id: 'technical', label: 'Technical Telemetry & Bug Report', icon: Shield },
];

const BUREAUS = [
  {
    city: 'Kyoto Guildhouse',
    country: 'Japan',
    coord: '35.0094° N, 135.6667° E',
    focus: 'Asian Cultural Sanctuaries & Micro-Climate Mapping',
  },
  {
    city: 'Tromsø Polar Station',
    country: 'Norway',
    coord: '69.6492° N, 18.9553° E',
    focus: 'Geomagnetic Substorms & Arctic Aurora Indexing',
  },
  {
    city: 'Zurich Cartography Lab',
    country: 'Switzerland',
    coord: '47.3769° N, 8.5417° E',
    focus: 'Alpine Glacial Elevation & Topographical Vector Systems',
  },
];

export default function ContactPage() {
  const [topic, setTopic] = useState('expedition');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

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
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aurora/10 border border-aurora/25 text-aurora text-xs font-mono font-semibold tracking-wider uppercase mb-6"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>The Dispatch Desk</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6"
          >
            Send a dispatch to <br className="hidden sm:block" />
            <span className="font-serif-italic text-aurora">our cartographers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-xl mx-auto"
          >
            Whether you have discovered an unlisted cultural sanctuary, wish to partner with our guild, or have feedback on our 3D globe telemetry.
          </motion.p>
        </div>
      </section>

      {/* Main Form & Bureaus Section */}
      <section className="section-y relative">
        <div className="shell max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Dispatch Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-xl">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-aurora/15 border border-aurora/30 text-aurora flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-3xl font-bold">
                        Dispatch Received.
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you, {name}. Your message has been encrypted and routed to our expedition team. We will respond to <strong>{email}</strong> within 24 hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setMessage('');
                        }}
                        className="mt-6 px-6 py-2.5 rounded-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs font-mono transition-colors"
                      >
                        Send Another Dispatch
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Topic Selection */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider mb-3">
                          Select Dispatch Category
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {TOPICS.map((item) => {
                            const Icon = item.icon;
                            const isSelected = topic === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setTopic(item.id)}
                                className={`p-3.5 rounded-2xl border text-left text-xs font-sans font-medium transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? 'bg-aurora/10 border-aurora text-foreground shadow-sm'
                                    : 'bg-muted/30 border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                                }`}
                              >
                                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-aurora' : 'text-muted-foreground'}`} />
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Aria Montgomery"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-aurora transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider mb-2">
                            Your Email
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="aria@wanderer.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-aurora transition-colors"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-muted-foreground tracking-wider mb-2">
                          Your Message / Coordinates
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Share the details of your inquiry, cultural notes, or route telemetry..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-aurora transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-aurora hover:bg-aurora-bright text-ink-void font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-ink-void border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Transmit Dispatch</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Global Guild Bureaus & Direct Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                <span className="text-xs font-mono font-bold text-aurora tracking-widest uppercase">
                  Global Guild Bureaus
                </span>

                <div className="space-y-6">
                  {BUREAUS.map((bureau) => (
                    <div key={bureau.city} className="space-y-1.5 pb-5 border-b border-border/60 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-lg font-bold text-foreground">
                          {bureau.city}
                        </h4>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {bureau.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-aurora">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{bureau.coord}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        {bureau.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Time Pledge */}
              <div className="p-6 rounded-3xl bg-muted/20 border border-border/60 flex items-start gap-4">
                <Clock className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                    Human Response Guarantee
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All inquiries are answered directly by our cartography team. We do not use automated email chatbots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
