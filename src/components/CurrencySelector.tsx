'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Coins } from 'lucide-react'
import { useCurrency, SUPPORTED_CURRENCIES, type CurrencyCode } from '@/context/CurrencyContext'
import { useTheme } from '@/context/ThemeContext'

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isDark
            ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-sm'
        }`}
        title="Select currency"
      >
        <Coins className="w-3.5 h-3.5 text-aurora" />
        <span>{activeCurrency.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-36 py-1.5 rounded-xl shadow-xl z-50 overflow-hidden border ${
              isDark
                ? 'bg-slate-900/95 backdrop-blur-md border-white/10 text-white'
                : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800'
            }`}
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code as CurrencyCode)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                  currency === c.code
                    ? 'bg-aurora/20 text-aurora font-bold'
                    : isDark
                    ? 'hover:bg-white/10 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[11px] opacity-60">{c.symbol}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
