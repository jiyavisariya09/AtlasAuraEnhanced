'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MapPin, DollarSign, Users, X, Star, Compass } from 'lucide-react';
import { countries } from '@/data/mockData';
import { useModalLayer } from '@/hooks/use-modal-layer';
import type { Country } from '@/types';
import { Button } from '@/components/ui/button';

/* Same entrance curve as `.lift`, the hero reveal and MoodSearch — one hand
   across the whole page instead of three near-identical beziers. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function CountryModal({
  country,
  onClose,
  router,
}: {
  country: Country;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useModalLayer(true, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] overflow-y-auto flex min-h-full items-center justify-center p-3 sm:p-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="fixed inset-0 bg-black/85 dark:bg-[#03060f]/92 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-modal-title"
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative z-10 my-auto w-[96vw] sm:w-[94vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl bg-card border border-border/80 shadow-2xl text-left"
        style={{ overscrollBehavior: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image — fixed height, no scroll */}
        <div className="relative h-64 sm:h-72 lg:h-80 shrink-0">
          <img src={country.image} alt={country.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          <div className="absolute bottom-5 left-6">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-aurora" />
              <span className="t-label text-aurora">{country.region}</span>
            </div>
            <h2 id="country-modal-title" className="t-sub text-foreground">{country.name}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: DollarSign, label: 'Cost', value: country.costLevel, cap: true },
              { icon: Star,       label: 'Rating', value: `${country.rating}/5` },
              { icon: Compass,    label: 'Vibe',   value: country.vibe },
            ].map(({ icon: Icon, label, value, cap }) => (
              <div key={label} className="p-3 rounded-xl text-center bg-muted">
                <Icon className="w-4 h-4 text-aurora mx-auto mb-1" />
                <p className="t-label mb-1 text-muted-foreground">{label}</p>
                <p className={`t-data text-foreground ${cap ? 'capitalize' : ''}`}>{value}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="t-label mb-2 text-aurora">The Story</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{country.description}</p>
          </div>

          <div>
            <h3 className="t-label mb-2 text-aurora">Culture & Heritage</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{country.culture}</p>
          </div>

          <div>
            <h3 className="t-label mb-2 text-aurora">Hidden Gems</h3>
            <div className="flex flex-wrap gap-2">
              {country.hiddenGems.map((gem, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium border border-aurora/20 bg-aurora/10 text-aurora">✦ {gem}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="t-label mb-2 text-aurora">Perfect For</h3>
            <div className="flex flex-wrap gap-2">
              {country.purposes.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 border border-orchid/20 bg-orchid/10 text-orchid">
                  <Users className="w-3 h-3" />{p}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              className="flex-1 font-semibold hover:bg-primary-hover"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const el = document.getElementById('world-map');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  const coords: Record<string, [number, number]> = {
                    Japan: [36.2048, 138.2529],
                    Morocco: [31.7917, -7.0926],
                    Norway: [60.472, 8.4689],
                    Indonesia: [-0.7893, 113.9213],
                    Greece: [39.0742, 21.8243],
                  };
                  const coord = coords[country.name];
                  if (coord) {
                    sessionStorage.setItem('atlasaura-map-focus', JSON.stringify({ lat: coord[0], lng: coord[1], name: country.name }));
                    window.dispatchEvent(new CustomEvent('atlasaura-focus-map', { detail: { lat: coord[0], lng: coord[1] } }));
                  }
                }, 300);
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />View on Map
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-semibold"
              onClick={() => {
                onClose();
                router.push(`/destinations/${country.id}`);
              }}
            >
              <Compass className="w-4 h-4 mr-2" />Full Guide
            </Button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default function CountryStories() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const costMeta: Record<string, { label: string; bg: string; text: string }> = {
    budget:   { label: '$ Budget',    bg: 'bg-aurora/15', text: 'text-aurora' },
    moderate: { label: '$$ Moderate', bg: 'bg-orchid/15', text: 'text-orchid' },
    luxury:   { label: '$$$ Luxury',  bg: 'bg-blush/15',  text: 'text-blush'  },
  };

  const c = costMeta;

  return (
    <section id="stories" className="hairline-t section-y relative isolate overflow-hidden cv-auto">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="graticule absolute inset-0 opacity-20" />
        <div className="aurora-wash absolute inset-0" />
      </div>

      <div className="shell relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-16"
        >
          <h2 className="t-title mb-4 text-foreground">
            Stories That <span className="text-aurora">Inspire</span>
          </h2>
          <p className="t-lead mx-auto max-w-2xl">
            Real experiences from travelers who sought something different.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: index * 0.04, ease: EASE }}
              whileHover={{ y: -3 }}
              className="lift relative rounded-3xl overflow-hidden cursor-pointer group border border-border/80 bg-card shadow-cast"
              onClick={() => setSelectedCountry(country)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={country.image}
                  alt={country.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-aurora fill-aurora" />
                  <span className="t-data text-white">{country.rating}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`t-data px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 ${c[country.costLevel]?.bg ?? 'bg-black/60'} ${c[country.costLevel]?.text ?? 'text-white'}`}>
                    {c[country.costLevel]?.label ?? country.costLevel}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-aurora mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="t-label text-aurora font-bold">{country.region}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white font-normal">{country.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                  {country.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="t-label text-xs text-muted-foreground">{country.vibe}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-aurora group-hover:translate-x-0.5 transition-transform duration-200">
                    Read Story →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCountry && (
          <CountryModal
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
            router={router}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
