'use client';

import { useState } from 'react';
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

export default function CountryStories() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  /* Escape, a still page underneath, and focus handed into the dialog and back
     to the card afterwards — the contract every overlay here shares. */
  const closeCountry = () => setSelectedCountry(null);
  const panelRef = useModalLayer(selectedCountry !== null, closeCountry);

  /* Cost is a three-step scale, so it gets the three Aurora Ink accents rather
     than emerald/sky/indigo. The theme ternaries are gone: the tints resolve
     against --aurora/--violet/--rose, which already flip per theme. */
  const costMeta: Record<string, { label: string; bg: string; text: string }> = {
    budget:   { label: '$ Budget',    bg: 'bg-aurora/15', text: 'text-aurora' },
    moderate: { label: '$$ Moderate', bg: 'bg-orchid/15', text: 'text-orchid' },
    luxury:   { label: '$$$ Luxury',  bg: 'bg-blush/15',  text: 'text-blush'  },
  };

  const c = costMeta;

  return (
    <section id="stories" className="hairline-t section-y relative isolate overflow-hidden">
      {/* Background — the atlas's own grid plus two cool blooms. No warm stops,
          and no `/8` tints: that is not an alpha step Tailwind emits. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="graticule absolute inset-0 opacity-25" />
        <div className="animate-aurora-drift absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-aurora/5 blur-3xl" />
        <div
          className="animate-aurora-drift absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-orchid/5 blur-3xl"
          style={{ animationDelay: '5s' }}
        />
      </div>

      <div className="shell relative">
        {/* Header */}
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
            Dive into visual narratives that capture the essence of each destination.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: EASE }}
              className="group cursor-pointer"
              onClick={() => setSelectedCountry(country)}
            >
              {/* `.lift` owns the hover rise, shadow and its own transition
                  shorthand, so no `transition-*`/`-translate-y` here — the two
                  would cancel depending on stylesheet order. The surface is spelt
                  out rather than using `.ink-panel`, because this card animates
                  its border and `.ink-panel` sets the `border` shorthand.
                  `.lift` already transitions border-color for us. */}
              <div className="lift relative h-full overflow-hidden rounded-2xl bg-card border border-border/70 shadow-cast hover:shadow-2xl">
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-black">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-smooth will-change-transform group-hover:scale-[1.04]"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 text-aurora fill-aurora" />
                    <span className="t-data text-white font-semibold">{country.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`t-data px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 ${c[country.costLevel]?.bg ?? 'bg-black/60'} ${c[country.costLevel]?.text ?? 'text-white'}`}>
                      {c[country.costLevel]?.label ?? country.costLevel}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-aurora" />
                    <span className="t-label text-aurora">{country.region}</span>
                  </div>

                  <h3 className="t-sub mb-2 text-foreground transition-colors duration-500 ease-smooth group-hover:text-aurora">
                    {country.name}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-2 leading-relaxed text-muted-foreground">
                    {country.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {country.purposes.slice(0, 3).map((p) => (
                      <span key={p} className="t-label rounded-full bg-muted/70 px-2 py-1 text-muted-foreground">{p}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/20">
                    <span className="text-xs text-muted-foreground">{country.vibe}</span>
                    <span className="text-xs font-semibold text-aurora group-hover:translate-x-1 transition-transform duration-500 ease-smooth inline-block">
                      Read Story →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCountry && (
          /* Same scrim as the command palette in Navigation: --ink-void is only
             declared on :root, so it stays deep navy in the day theme too, which
             is what a dialog over cool paper needs. */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ background: 'hsl(var(--ink-void) / 0.72)' }}
            onClick={closeCountry}
          >
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="country-modal-title"
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="ink-panel relative max-w-3xl w-full rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero image — fixed height, no scroll */}
              <div className="relative h-64 shrink-0">
                <img src={selectedCountry.image} alt={selectedCountry.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-transparent" />
                <button
                  type="button"
                  onClick={closeCountry}
                  aria-label="Close"
                  className="absolute top-4 right-4 p-2 rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
                <div className="absolute bottom-5 left-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-aurora" />
                    <span className="t-label text-aurora">{selectedCountry.region}</span>
                  </div>
                  <h2 id="country-modal-title" className="t-sub text-foreground">{selectedCountry.name}</h2>
                </div>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6">
                {/* Stats row — a readout of real field values, which is exactly
                    where the mono face is allowed to appear. */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: DollarSign, label: 'Cost', value: selectedCountry.costLevel, cap: true },
                    { icon: Star,       label: 'Rating', value: `${selectedCountry.rating}/5` },
                    { icon: Compass,    label: 'Vibe',   value: selectedCountry.vibe },
                  ].map(({ icon: Icon, label, value, cap }) => (
                    <div key={label} className="p-3 rounded-xl text-center bg-muted">
                      <Icon className="w-4 h-4 text-aurora mx-auto mb-1" />
                      <p className="t-label mb-1 text-muted-foreground">{label}</p>
                      <p className={`t-data text-foreground ${cap ? 'capitalize' : ''}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Story */}
                <div>
                  <h3 className="t-label mb-2 text-aurora">The Story</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedCountry.description}</p>
                </div>

                {/* Culture */}
                <div>
                  <h3 className="t-label mb-2 text-aurora">Culture & Heritage</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{selectedCountry.culture}</p>
                </div>

                {/* Hidden Gems */}
                <div>
                  <h3 className="t-label mb-2 text-aurora">Hidden Gems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.hiddenGems.map((gem, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium border border-aurora/20 bg-aurora/10 text-aurora">✦ {gem}</span>
                    ))}
                  </div>
                </div>

                {/* Perfect For — the one sparing use of violet in this section */}
                <div>
                  <h3 className="t-label mb-2 text-aurora">Perfect For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCountry.purposes.map((p) => (
                      <span key={p} className="px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 border border-orchid/20 bg-orchid/10 text-orchid">
                        <Users className="w-3 h-3" />{p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAs — the Button variants already resolve to primary/border/
                    accent tokens, so only the teal hover needs stating. */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    className="flex-1 font-semibold hover:bg-primary-hover"
                    onClick={() => {
                      setSelectedCountry(null);
                      setTimeout(() => {
                        const el = document.getElementById('world-map');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        // Store target country so WorldMap can zoom to it
                        const coords: Record<string, [number, number]> = {
                          Japan: [36.2048, 138.2529],
                          Morocco: [31.7917, -7.0926],
                          Norway: [60.472, 8.4689],
                          Indonesia: [-0.7893, 113.9213],
                          Greece: [39.0742, 21.8243],
                        };
                        const coord = coords[selectedCountry!.name];
                        if (coord) {
                          sessionStorage.setItem('atlasaura-map-focus', JSON.stringify({ lat: coord[0], lng: coord[1], name: selectedCountry!.name }));
                          window.dispatchEvent(new CustomEvent('atlasaura-focus-map', { detail: { lat: coord[0], lng: coord[1] } }));
                        }
                      }, 300);
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />View on Map
                  </Button>
                  {/* The `outline` variant already resolves to border/background/
                      accent tokens — the old amber overrides were the only warm
                      thing left in this section. */}
                  <Button
                    variant="outline"
                    className="flex-1 font-semibold"
                    onClick={() => {
                      router.push(`/destinations/${selectedCountry.id}`);
                    }}
                  >
                    <Compass className="w-4 h-4 mr-2" />Full Guide
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
