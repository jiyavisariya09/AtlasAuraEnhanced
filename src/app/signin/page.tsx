'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Globe, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BorderBeam } from '@/components/ui/border-beam'
import { useTheme } from '@/context/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import { signIn } from '@/lib/auth'

export default function SignInPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await signIn({ email: formData.email, password: formData.password })

    if (!result.success) {
      setError(result.error || 'Sign in failed.')
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'}`}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/10' : 'bg-sky-300/40'}`}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className={`absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/35'}`}
        />
        {/* Animated grid */}
        <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.04]' : 'opacity-[0.06]'}`}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#38bdf8' : '#0ea5e9'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link href="/">
          <motion.div
            whileHover={{ x: -3 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-sky-600 hover:bg-white/80'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2.5 mb-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Atlas<span className="text-sky-500">Aura</span>
            </span>
          </motion.div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Welcome back, traveler ✈️
          </p>
        </div>

        {/* Form card */}
        <div className={`relative rounded-2xl p-8 ${isDark ? 'bg-slate-900/80 border border-white/10' : 'bg-white/90 border border-sky-100 shadow-xl shadow-sky-100/50'} backdrop-blur-xl`}>
          <BorderBeam
            size={120}
            duration={8}
            colorFrom={isDark ? '#38bdf8' : '#0ea5e9'}
            colorTo={isDark ? '#818cf8' : '#6366f1'}
            borderWidth={1.5}
          />

          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Sign in
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Continue your journey of discovery
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 h-11 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-sky-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'}`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-sky-500 hover:text-sky-400 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 pr-10 h-11 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-sky-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-sky-500" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold shadow-lg shadow-sky-200/50 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>or</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>

          {/* Sign up link */}
          <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Don't have an account?{' '}
            <Link href="/signup" className="text-sky-500 hover:text-sky-400 font-bold">
              Create one free
            </Link>
          </p>
        </div>

        <p className={`text-center mt-4 text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-sky-500">Terms</a> &{' '}
          <a href="#" className="underline hover:text-sky-500">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  )
}
