'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { moodOptions, countries } from '@/data/mockData';
import type { TravelMood } from '@/types';

/* One entrance curve for the whole section — the same cubic-bezier `.lift` and
   the hero reveal use, so scroll-ins, hovers and the headline all share a hand. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MoodSearch() {
  const [selectedMood, setSelectedMood] = useState<TravelMood>('all');

  const filteredCountries = selectedMood === 'all'
    ? countries
    : countries.filter(c => c.purposes.includes(selectedMood));

  return (
    <section id="explore" className="hairline-t section-y relative isolate overflow-hidden">
      {/* Background Elements — cool blooms only. Both originals were dead
          weight: an alpha step of eight is not one Tailwind emits, and the drift
          animation they named has no keyframe. These use tokens that exist. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-aurora-drift absolute left-1/4 top-0 h-80 w-80 rounded-full bg-aurora/5 blur-3xl" />
        <div
          className="animate-aurora-drift absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-orchid/5 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="shell relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-16 text-center"
        >
          <h2 className="t-title mb-4 text-foreground">
            How do you want to <span className="text-aurora">feel</span>?
          </h2>
          <p className="t-lead mx-auto max-w-2xl">
            Select your travel mood and discover countries that match your soul&apos;s calling.
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mb-16 flex flex-wrap justify-center gap-3"
        >
          {/* `transition-colors`, not `transition-all`: framer already drives
              the hover scale and a CSS transform transition fights it. */}
          <motion.button
            onClick={() => setSelectedMood('all')}
            className={`rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ease-smooth ${
              selectedMood === 'all'
                ? 'bg-primary text-primary-foreground shadow-aurora'
                : 'glass text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            All Destinations
          </motion.button>
          {moodOptions.map((mood) => (
            /* Selection is one accent, not five gradients: the per-mood ramps
               in mockData still carry warm stops, so they are not read here. */
            <motion.button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id as TravelMood)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-colors duration-300 ease-smooth ${
                selectedMood === mood.id
                  ? 'bg-primary text-primary-foreground shadow-aurora'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <span className="font-bold">{mood.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Country Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
                className="group relative"
              >
                {/* `.lift` owns the hover rise and shadow, so no `transition-*`
                    class here — `.lift` sets the `transition` shorthand and the
                    two would cancel depending on stylesheet order. */}
                <div className="lift relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 shadow-cast">
                  {/* Image */}
                  <img
                    src={country.image}
                    alt={country.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth will-change-transform group-hover:scale-[1.06]"
                  />

                  {/* Gradient Overlay — cinematic bottom vignette for 100% photo clarity */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="transition-transform duration-500 ease-smooth group-hover:-translate-y-1">
                      <span className="t-label text-aurora font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {country.region}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {country.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 translate-y-2 text-xs sm:text-sm text-white/90 opacity-0 transition-all duration-500 ease-smooth group-hover:translate-y-0 group-hover:opacity-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] leading-relaxed">
                        {country.description}
                      </p>
                    </div>

                    {/* Purpose Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {country.purposes.slice(0, 2).map((purpose) => (
                        <span
                          key={purpose}
                          className="text-[11px] font-medium tracking-wider uppercase rounded-full bg-black/50 border border-white/20 px-2.5 py-1 text-white backdrop-blur-md shadow-sm"
                        >
                          {purpose}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-12 text-center"
        >
          <a
            href="#stories"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-aurora hover:text-aurora"
          >
            View all country stories
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
