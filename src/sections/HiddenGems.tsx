'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, MapPin, ArrowRight, Mountain, TreePine, Landmark, X, Star, Clock, Users, Navigation, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { hiddenGems } from '@/data/mockData';
import { useModalLayer } from '@/hooks/use-modal-layer';
import type { HiddenGem } from '@/types';

/* Same entrance curve as `.lift`, the hero reveal, MoodSearch and
   CountryStories — one hand across the whole page instead of four beziers. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Small overlay control shared by the close button and the gallery arrows.
   Spelt out rather than `.glass`, because `.glass` sets the `border`
   shorthand and these need an animated single border colour on hover. */
const OVERLAY_BUTTON =
  'flex items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-aurora hover:text-aurora';

function GemModal({ gem, onClose }: { gem: HiddenGem; onClose: () => void }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = gem.images?.length ? gem.images : [gem.image];

  /* `true` rather than a prop: this component only exists while the modal is
     open, because the parent mounts it inside AnimatePresence. */
  const panelRef = useModalLayer(true, onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop — the same scrim as CountryStories' modal and the command
          palette. --ink-void is only declared on :root, so it stays deep navy
          in the day theme too, which is what a dialog over cool paper needs. */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'hsl(var(--ink-void) / 0.72)' }}
      />

      {/* `.ink-panel` supplies surface, hairline and cast shadow in one, so
          there is no `border-*` or `shadow-*` here to fight its shorthand. */}
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gem-modal-title"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={e => e.stopPropagation()}
        className="ink-panel relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 z-10 w-9 h-9 ${OVERLAY_BUTTON}`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Photo Gallery */}
        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]}
              alt={gem.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Fades into --card, so the strip below sits on the panel's own
              surface at night and on cool paper by day. */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

          {/* Gallery nav */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                aria-label="Previous photo"
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 ${OVERLAY_BUTTON}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % images.length)}
                aria-label="Next photo"
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 ${OVERLAY_BUTTON}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Show photo ${i + 1} of ${images.length}`}
                    aria-current={i === activeImg ? 'true' : undefined}
                    className={`h-2 rounded-full transition-all duration-300 ease-smooth ${i === activeImg ? 'w-5 bg-aurora' : 'w-2 bg-foreground/40'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-4 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === activeImg ? 'true' : undefined}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-out ${i === activeImg ? 'border-aurora scale-105' : 'border-border'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-aurora" />
                <span className="text-sm text-muted-foreground">{gem.country}</span>
                {gem.coordinates && (
                  <>
                    <span aria-hidden="true" className="text-xs text-muted-foreground opacity-50">•</span>
                    <Navigation className="w-3 h-3 text-muted-foreground" />
                    {/* Real coordinates — exactly what the mono face is for. */}
                    <span className="t-data text-muted-foreground">{gem.coordinates}</span>
                  </>
                )}
              </div>
              <h2 id="gem-modal-title" className="t-sub text-foreground">{gem.name}</h2>
            </div>
            {gem.rating && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 border border-aurora/20 bg-aurora/10">
                <Star className="w-4 h-4 text-aurora fill-aurora" />
                <span className="t-data text-aurora">{gem.rating}</span>
              </div>
            )}
          </div>

          {/* Quick stats — a readout of real field values. */}
          <div className="grid grid-cols-2 gap-3">
            {gem.bestTime && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <Clock className="w-4 h-4 text-aurora flex-shrink-0" />
                <div>
                  <p className="t-label text-muted-foreground">Best Time</p>
                  <p className="t-data text-foreground">{gem.bestTime}</p>
                </div>
              </div>
            )}
            {gem.visitors && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <Users className="w-4 h-4 text-aurora flex-shrink-0" />
                <div>
                  <p className="t-label text-muted-foreground">Visitors</p>
                  <p className="t-data text-foreground">{gem.visitors}</p>
                </div>
              </div>
            )}
          </div>

          {/* Full description */}
          <div>
            <h3 className="t-label mb-2 text-aurora">About this place</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {gem.fullDescription || gem.description}
            </p>
          </div>

          {/* Tips — the length has to be coerced to a boolean. `{gem.tips?.length
              && …}` short-circuits to the number 0 when the array is empty, and
              React renders 0 as visible text rather than nothing. */}
          {!!gem.tips?.length && (
            <div>
              <h3 className="t-label mb-3 flex items-center gap-2 text-aurora">
                <Lightbulb className="w-4 h-4 text-aurora" />
                Traveler Tips
              </h3>
              <ul className="space-y-2">
                {gem.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span aria-hidden="true" className="w-5 h-5 rounded-full bg-aurora/10 text-aurora flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HiddenGems() {
  const [selectedGem, setSelectedGem] = useState<HiddenGem | null>(null);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Mountain> = { nature: TreePine, culture: Landmark, adventure: Mountain };
    return icons[type] || MapPin;
  };

  /* Three place types, three Aurora Ink accents — the same move costMeta makes
     in CountryStories. Tints and accent text rather than gradient ramps, so
     each badge stays legible over a photograph in both themes. The culture
     ramp's amber/orange stops were the last warm hold-out in this section; the
     old class names are deliberately not quoted anywhere in this file, because
     Tailwind's content scan is a plain text sweep and would re-emit them. */
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      nature: 'border-aurora/30 text-aurora',
      culture: 'border-orchid/30 text-orchid',
      adventure: 'border-blush/30 text-blush',
    };
    return colors[type] || 'border-border text-muted-foreground';
  };

  return (
    <section id="gems" className="hairline-t section-y relative isolate overflow-hidden">
      {/* The old radial-gradient class was never real — Tailwind v3 ships no
          such utility and the config declares no backgroundImage key,
          so the old amber bloom emitted nothing at all. `.aurora-wash` is the
          system's one gradient, and it is cool by construction. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0" />
        <div className="animate-aurora-drift absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-aurora/5 blur-3xl" />
      </div>

      <div className="shell relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9, ease: EASE }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <h2 className="t-title mb-4 text-foreground">
              Beyond the <span className="text-aurora">Tourist Trail</span>
            </h2>
            <p className="t-lead max-w-xl">
              Discover lesser-known places that hold the true essence of a destination. Curated by locals and experienced travelers.
            </p>
          </div>
          <a href="#" className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-aurora hover:text-aurora">
            Explore all hidden gems <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hiddenGems.map((gem, index) => {
            const Icon = getTypeIcon(gem.type);
            return (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                className={`group relative cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                onClick={() => setSelectedGem(gem)}
              >
                {/* `.lift` owns the hover rise, the shadow and its own
                    transition shorthand, so no `transition-*`/`-translate-y`
                    here — the two would cancel on stylesheet order. */}
                <div className="lift relative h-full min-h-[300px] rounded-2xl overflow-hidden border border-border/60 shadow-cast">
                  <img src={gem.image} alt={gem.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.06] will-change-transform" />
                  {/* Cinematic bottom gradient for 100% photo clarity */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                  {/* Type badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white shadow-sm">
                      <Icon className="w-4 h-4 text-aurora" />
                      <span className="t-label text-white">{gem.type}</span>
                    </div>
                  </div>

                  {/* Rating badge */}
                  {gem.rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white shadow-sm">
                      <Star className="w-3 h-3 text-aurora fill-aurora" />
                      <span className="t-data text-white">{gem.rating}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-aurora" />
                      <span className="t-label text-aurora font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{gem.country}</span>
                    </div>
                    <h3 className={`font-serif font-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-2 ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                      {gem.name}
                    </h3>
                    <p className={`line-clamp-2 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] leading-relaxed ${index === 0 ? 'text-base max-w-lg' : 'text-sm'}`}>
                      {gem.description}
                    </p>

                    {/* CTA */}
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-aurora/30 bg-aurora/10 text-aurora text-sm font-medium transition-colors duration-500 ease-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                        Discover this gem
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-smooth" />
                      </span>
                    </motion.div>
                  </div>

                  {/* Glow — one teal lift from the bottom edge, same as the
                      country cards in MoodSearch. */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-smooth pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-aurora/15 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats — real counts, so the mono face is allowed here. `.glass`
            sets the `border` shorthand; no `border-*` is paired with it. */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '500+', label: 'Hidden Gems', icon: Gem },
            { value: '120', label: 'Countries', icon: MapPin },
            { value: '50K', label: 'Community Tips', icon: TreePine },
            { value: '98%', label: 'Verified', icon: Landmark },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl glass text-center">
              <stat.icon className="w-5 h-5 text-aurora mx-auto mb-2" />
              <div className="t-data text-2xl text-foreground">{stat.value}</div>
              <div className="t-label mt-1 text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedGem && <GemModal gem={selectedGem} onClose={() => setSelectedGem(null)} />}
      </AnimatePresence>
    </section>
  );
}
