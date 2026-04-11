'use client';

import { motion } from 'framer-motion';
import { Gem, MapPin, ArrowRight, Mountain, TreePine, Landmark } from 'lucide-react';
import { hiddenGems } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';

export default function HiddenGems() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const getTypeIcon = (type: string) => {
    const icons: Record<string, typeof Mountain> = {
      nature: TreePine,
      culture: Landmark,
      adventure: Mountain,
    };
    return icons[type] || MapPin;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      nature: 'from-emerald-500 to-teal-500',
      culture: 'from-amber-500 to-orange-500',
      adventure: 'from-cyan-500 to-blue-500',
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Gem className="w-4 h-4 text-amber-400" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Hidden Gems</span>
            </div>
            <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Beyond the <span className="text-gradient">Tourist Trail</span>
            </h2>
            <p className={`text-lg max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              Discover lesser-known places that hold the true essence of a destination. 
              Curated by locals and experienced travelers.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            Explore all hidden gems
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Gems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {hiddenGems.map((gem, index) => {
            const Icon = getTypeIcon(gem.type);
            return (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`group relative ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              >
                <div className="relative h-full min-h-[300px] rounded-2xl overflow-hidden">
                  {/* Image */}
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getTypeColor(gem.type)}`}>
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white capitalize">{gem.type}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-300">{gem.country}</span>
                    </div>
                    <h3 className={`font-bold text-white mb-2 group-hover:text-amber-400 transition-colors ${index === 0 ? 'text-3xl' : 'text-xl'}`}>
                      {gem.name}
                    </h3>
                    <p className={`text-slate-400 line-clamp-2 ${index === 0 ? 'text-base max-w-lg' : 'text-sm'}`}>
                      {gem.description}
                    </p>
                    
                    {/* Hover Reveal */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-2 text-amber-400 text-sm">
                        Discover this gem
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${getTypeColor(gem.type)} opacity-20`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '500+', label: 'Hidden Gems', icon: Gem },
            { value: '120', label: 'Countries', icon: MapPin },
            { value: '50K', label: 'Community Tips', icon: TreePine },
            { value: '98%', label: 'Verified', icon: Landmark },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl glass text-center">
              <stat.icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
