'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gem, MapPin, ArrowRight, Mountain, TreePine, Landmark, X, Star, Clock, Users, Navigation, ChevronLeft, ChevronRight, Lightbulb, Compass } from 'lucide-react';
import { hiddenGems } from '@/data/mockData';
import { useModalLayer } from '@/hooks/use-modal-layer';
import type { HiddenGem } from '@/types';

/* Same entrance curve as `.lift`, the hero reveal, MoodSearch and
   CountryStories — one hand across the whole page instead of four beziers. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Small overlay control shared by the close button and the gallery arrows. */
const OVERLAY_BUTTON =
  'flex items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-aurora hover:text-aurora';

function GemModal({ gem, onClose }: { gem: HiddenGem; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const router = useRouter();
  const images = gem.images?.length ? gem.images : [gem.image];

  useEffect(() => {
    setMounted(true);
  }, []);

  /* `true` rather than a prop: this component only exists while the modal is
     open, because the parent mounts it inside AnimatePresence. */
  const panelRef = useModalLayer(true, onClose);

  if (!mounted) return null;

  return createPortal(
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[99999] overflow-y-auto flex min-h-full items-center justify-center p-2.5 sm:p-4 md:p-6 text-center"
    >
      {/* Backdrop — High contrast to completely obscure any background header */}
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
        aria-labelledby="gem-modal-title"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 my-auto w-[96vw] sm:w-[94vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl bg-card border border-border/80 shadow-2xl text-left"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 z-20 w-9 h-9 ${OVERLAY_BUTTON}`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Photo Gallery */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[26rem] overflow-hidden rounded-t-3xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={images[activeImg]}
              alt={gem.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Show photo ${i + 1} of ${images.length}`}
                    aria-current={i === activeImg ? 'true' : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ease-smooth ${i === activeImg ? 'w-5 bg-aurora' : 'w-1.5 bg-foreground/40'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-4 hidden sm:flex gap-2 z-10">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === activeImg ? 'true' : undefined}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ease-out ${i === activeImg ? 'border-aurora scale-105 shadow-md' : 'border-border/80 opacity-75'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 md:p-8 space-y-6">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-aurora shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">{gem.country}</span>
                {gem.coordinates && (
                  <>
                    <span aria-hidden="true" className="text-xs text-muted-foreground opacity-50">•</span>
                    <Navigation className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span className="t-data text-xs text-muted-foreground">{gem.coordinates}</span>
                  </>
                )}
              </div>
              <h2 id="gem-modal-title" className="font-serif text-2xl sm:text-3xl text-foreground font-medium">{gem.name}</h2>
            </div>
            {gem.rating && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0 border border-aurora/30 bg-aurora/10 shadow-sm">
                <Star className="w-4 h-4 text-aurora fill-aurora" />
                <span className="t-data font-bold text-aurora">{gem.rating}</span>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gem.bestTime && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border/60">
                <Clock className="w-4 h-4 text-aurora shrink-0" />
                <div>
                  <p className="t-label text-[10px] uppercase font-bold text-muted-foreground">Best Time</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{gem.bestTime}</p>
                </div>
              </div>
            )}
            {gem.visitors && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/60 border border-border/60">
                <Users className="w-4 h-4 text-aurora shrink-0" />
                <div>
                  <p className="t-label text-[10px] uppercase font-bold text-muted-foreground">Visitors</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{gem.visitors}</p>
                </div>
              </div>
            )}
          </div>

          {/* Full description */}
          <div>
            <h3 className="t-label text-xs uppercase font-bold mb-2 text-aurora">About this sanctuary</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/85">
              {gem.fullDescription || gem.description}
            </p>
          </div>

          {/* Tips */}
          {!!gem.tips?.length && (
            <div>
              <h3 className="t-label text-xs uppercase font-bold mb-3 flex items-center gap-2 text-aurora">
                <Lightbulb className="w-4 h-4 text-aurora" />
                Insider Traveler Tips
              </h3>
              <ul className="space-y-2.5">
                {gem.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/85">
                    <span aria-hidden="true" className="w-5 h-5 rounded-full bg-aurora/15 text-aurora flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                router.push(`/destinations/${gem.id}`);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              View Full Destination Guide & Roadmap
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default function HiddenGems() {
  const [selectedGem, setSelectedGem] = useState<HiddenGem | null>(null);
  const router = useRouter();

  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Mountain> = { nature: TreePine, culture: Landmark, adventure: Mountain };
    return icons[type] || MapPin;
  };

  return (
    <section id="gems" className="hairline-t section-y relative isolate overflow-hidden cv-auto">
      {/* Optimized Background Gradient (GPU friendly) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0" />
      </div>

      <div className="shell relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, ease: EASE }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="t-title mb-4 text-foreground">
              Beyond the <span className="text-aurora">Tourist Trail</span>
            </h2>
            <p className="t-lead max-w-xl">
              Discover lesser-known places that hold the true essence of a destination. Curated by locals and experienced travelers.
            </p>
          </div>
          <Link href="/destinations" className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-aurora hover:text-aurora">
            Explore all hidden gems <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
          </Link>
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
                transition={{ duration: 0.7, delay: index * 0.05, ease: EASE }}
                className={`group relative cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                onClick={() => setSelectedGem(gem)}
              >
                <div className="lift relative h-full min-h-[320px] sm:min-h-[360px] rounded-3xl overflow-hidden border border-border/60 shadow-cast">
                  <img 
                    src={gem.image} 
                    alt={gem.name} 
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05] will-change-transform" 
                  />
                  {/* Cinematic bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

                  {/* Type badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white shadow-sm">
                      <Icon className="w-4 h-4 text-aurora" />
                      <span className="t-label text-white capitalize">{gem.type}</span>
                    </div>
                  </div>

                  {/* Rating badge */}
                  {gem.rating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white shadow-sm">
                      <Star className="w-3.5 h-3.5 text-aurora fill-aurora" />
                      <span className="t-data text-white font-bold">{gem.rating}</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-aurora" />
                      <span className="t-label text-aurora font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{gem.country}</span>
                    </div>
                    <h3 className={`font-serif font-normal text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-2 ${index === 0 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
                      {gem.name}
                    </h3>
                    <p className={`line-clamp-2 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] leading-relaxed ${index === 0 ? 'text-sm sm:text-base max-w-lg' : 'text-xs sm:text-sm'}`}>
                      {gem.description}
                    </p>

                    {/* CTA Button: Specifically routes to detail page */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/destinations/${gem.id}`);
                        }}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-aurora/40 bg-aurora/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-md"
                      >
                        Discover this gem
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-smooth pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-aurora/15 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '500+', label: 'Hidden Gems', icon: Gem },
            { value: '120', label: 'Countries', icon: MapPin },
            { value: '50K', label: 'Community Tips', icon: TreePine },
            { value: '98%', label: 'Verified', icon: Landmark },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl glass text-center">
              <stat.icon className="w-5 h-5 text-aurora mx-auto mb-2" />
              <div className="t-data text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="t-label text-xs mt-1 text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedGem && (
          <GemModal gem={selectedGem} onClose={() => setSelectedGem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
