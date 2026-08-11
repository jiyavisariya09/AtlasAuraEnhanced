'use client';

import { motion } from 'framer-motion';
import { Trophy, MapPin, MessageCircle, Globe, TrendingUp, Award, Star, Zap } from 'lucide-react';
import { currentUser, badges } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import { getAuthorAvatar } from '@/lib/utils';

interface UserFeaturesProps {
  isLoggedIn: boolean;
}

export default function UserFeatures({ isLoggedIn }: UserFeaturesProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stats = [
    { icon: Globe, label: 'Countries', value: currentUser.countriesExplored, color: 'from-amber-500 to-orange-500' },
    { icon: MapPin, label: 'Memories', value: currentUser.memoryPins, color: 'from-cyan-500 to-blue-500' },
    { icon: MessageCircle, label: 'Answers', value: currentUser.questionsAnswered, color: 'from-emerald-500 to-teal-500' },
    { icon: Trophy, label: 'Score', value: currentUser.contributionScore, color: 'from-purple-500 to-indigo-500' },
  ];

  const nextMilestones = [
    { label: 'Hidden Gem Hunter', current: 1, target: 3, icon: Star },
    { label: 'Community Guide', current: 8, target: 10, icon: MessageCircle },
    { label: 'World Explorer', current: 12, target: 20, icon: Globe },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Track Your <span className="text-gradient">Adventure</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Every exploration earns you recognition. Collect badges, track progress, 
            and celebrate your travel milestones.
          </p>
        </motion.div>

        {isLoggedIn ? (
          <>
            {/* User Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              className="mb-16"
            >
              <div className="p-8 rounded-3xl glass">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-xl">
                      <img
                        src={currentUser.avatar || getAuthorAvatar(currentUser.name)}
                        alt={currentUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-slate-900" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white">{currentUser.name}</h3>
                    <p className="text-slate-400">Wanderer Level 5</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
                        {currentUser.badges.length} Badges Earned
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
                      className="p-4 rounded-xl bg-white/5 transition-all duration-500 ease-smooth hover:bg-white/8 transform-gpu"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                Your Badges
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`p-4 rounded-xl text-center transition-all duration-500 ease-smooth transform-gpu hover:-translate-y-0.5 ${
                      badge.earned
                        ? 'glass hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5'
                        : 'bg-white/5 opacity-50'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${badge.earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <p className={`text-sm font-medium ${badge.earned ? 'text-white' : 'text-slate-500'}`}>
                      {badge.name}
                    </p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-amber-400 mt-1">
                        Earned {badge.earnedDate}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Next Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-amber-400" />
                Next Milestones
              </h3>
              <div className="space-y-4">
                {nextMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 rounded-xl glass"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <milestone.icon className="w-5 h-5 text-amber-400" />
                        <span className="text-white font-medium">{milestone.label}</span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {milestone.current} / {milestone.target}
                      </span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Guest View - CTA to Join */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="p-12 rounded-3xl glass">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-slate-900" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Start Your Journey Today
              </h3>
              <p className={`max-w-md mx-auto mb-8 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                Join AtlasAura to track your travels, earn badges, share memories, 
                and connect with fellow wanderers around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="p-4 rounded-xl bg-white/5">
                  <Globe className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Track Countries</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Mark where you've been</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Share Memories</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Pin your experiences</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Earn Badges</p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Unlock achievements</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
