'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Globe, Heart, Github, Twitter, Instagram, Mail, ArrowUp, Sparkles } from 'lucide-react';
import { smoothScrollTo, smoothScrollToPosition } from '@/lib/utils';

/* Same entrance curve as `.lift` and the hero reveal. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    smoothScrollToPosition(0);
  };

  const handleFooterLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      smoothScrollTo(href, e as unknown as React.MouseEvent);
    }
  };

  const [socialToast, setSocialToast] = useState<string | null>(null);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const triggerSocialNotice = (name: string) => {
    setSocialToast(`${name} launching soon with AtlasAura v2.0`);
    setTimeout(() => setSocialToast(null), 3000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 4000);
  };

  const footerLinks = {
    explore: [
      { name: 'Memory Map', href: '/#world-map' },
      { name: 'Country Stories', href: '/#stories' },
      { name: 'Hidden Gems', href: '/#gems' },
      { name: 'Mood Search', href: '/#explore' },
    ],
    community: [
      { name: 'Curiosity Feed', href: '/#curiosity' },
      { name: 'Traveler Q&A', href: '/#curiosity' },
      { name: 'Share Memory', href: '/signup' },
      { name: 'Guidelines', href: '/guidelines' },
    ],
    about: [
      { name: 'Our Story', href: '/story' },
      { name: 'Team', href: '/team' },
      { name: 'Settings', href: '/settings' },
      { name: 'Contact', href: '/contact' },
      { name: 'Press', href: '/press' },
    ],
  };

  return (
    <footer className="hairline-t relative isolate pt-24 pb-8 overflow-hidden">
      {/* Background aurora gradient (Zero GPU blur passes) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0 opacity-80" />
      </div>

      {/* Social Toast Alert */}
      <AnimatePresence>
        {socialToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-card/95 border border-aurora/40 text-aurora text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{socialToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 shell">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-aurora/10 border border-aurora/20 flex items-center justify-center text-aurora group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl tracking-tight text-foreground">
                Atlas<span className="text-aurora font-serif-italic">Aura</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              A sensory atlas for deliberate wanderers. Mapping atmospheric moments, 
              local secrets, and cultural memories across 195 nations.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Github, label: 'GitHub' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="relative group/social">
                  <motion.button
                    type="button"
                    onClick={() => triggerSocialNotice(label)}
                    aria-label={`${label} (Coming Soon)`}
                    className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-aurora hover:border-aurora/40 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.button>
                  {/* Floating tooltip */}
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-card border border-border/80 text-[10px] font-mono text-muted-foreground whitespace-nowrap opacity-0 group-hover/social:opacity-100 transition-opacity shadow-sm">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="p-8 rounded-3xl bg-card border border-border mb-12 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-1">
                The Sunday Dispatch
              </h3>
              <p className="text-sm text-muted-foreground">
                One secret coordinate, three local stories, zero spam. Delivered weekly.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex items-center gap-3">
              <input
                type="email"
                required
                id="newsletter-email"
                name="email"
                autoComplete="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={newsletterSubscribed ? 'Subscribed!' : 'Enter your email'}
                className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground transition-colors focus:border-aurora"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-300 ease-smooth transform-gpu hover:bg-primary-hover hover:shadow-aurora active:scale-[0.97]"
              >
                {newsletterSubscribed ? 'Done!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="hairline-t flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm flex items-center gap-1 text-muted-foreground">
            Made with <Heart className="w-4 h-4 text-blush fill-blush" aria-hidden="true" />
            <span className="sr-only">love</span> for travelers everywhere
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-300 ease-smooth">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors duration-300 ease-smooth">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors duration-300 ease-smooth">Cookies</Link>
          </div>
        </div>

        {/* ── Interactive Expand-on-Hover Back to Top Button (Tailwind Converted) ── */}
        <AnimatePresence>
          {isVisible && (
            <motion.button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              initial={{ opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group fixed bottom-8 right-8 z-40 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-[#141414] font-semibold text-white shadow-[0_0_0_4px_rgba(180,160,255,0.25)] transition-all duration-300 ease-out hover:w-[140px] hover:rounded-[50px] hover:bg-[#b5a0ff] hover:text-[#141414] hover:shadow-[0_0_0_4px_rgba(180,160,255,0.4)] active:scale-95 cursor-pointer"
            >
              {/* Arrow SVG Icon — smoothly translates up out of view on hover */}
              <ArrowUp className="w-3.5 h-3.5 text-white group-hover:text-[#141414] transition-all duration-300 ease-out group-hover:-translate-y-10 group-hover:opacity-0 shrink-0" />

              {/* 'Back to Top' Text — slides in smoothly from bottom to center */}
              <span className="absolute translate-y-8 text-[13px] font-sans font-semibold tracking-wide text-white group-hover:text-[#141414] opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap">
                Back to Top
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
