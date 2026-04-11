'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full glass flex items-center justify-center overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Background glow */}
      <motion.div
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
          isDark ? 'bg-amber-500/20' : 'bg-cyan-500/20'
        }`}
        initial={false}
        animate={{ opacity: isDark ? 0 : 0 }}
      />
      
      {/* Icon container */}
      <div className="relative w-6 h-6">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sparkle effects */}
      <AnimatePresence>
        {!isDark && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-amber-500 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (i - 1) * 15],
                  y: [0, -10 - i * 5]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                style={{ 
                  left: '50%', 
                  top: '50%',
                  marginLeft: '-2px',
                  marginTop: '-2px'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Orbit ring for dark mode */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full"
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ 
                left: '50%',
                top: '50%',
                marginLeft: '-3px',
                marginTop: '-3px',
                transformOrigin: '3px 14px'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
