'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, ArrowLeft, Globe, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BorderBeam } from '@/components/ui/border-beam'
import { useTheme } from '@/context/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import { forgotPassword } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const result = await forgotPassword(email)
    setIsLoading(false)
    if (!result.success) {
      setError(result.message)
      return
    }
    setSent(true)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'}`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/10' : 'bg-sky-300/40'}`}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className={`absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/35'}`}
        />
      </div>

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link href="/signin">
          <motion.div whileHover={{ x: -3 }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-sky-600 hover:bg-white/80'}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </motion.div>
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Atlas<span className="text-sky-500">Aura</span>
            </span>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Reset your password
          </p>
        </div>

        <div className={`relative rounded-2xl p-8 ${isDark ? 'bg-slate-900/80 border border-white/10' : 'bg-white/90 border border-sky-100 shadow-xl shadow-sky-100/50'} backdrop-blur-xl`}>
          <BorderBeam size={120} duration={8} colorFrom={isDark ? '#38bdf8' : '#0ea5e9'} colorTo={isDark ? '#818cf8' : '#6366f1'} borderWidth={1.5} />

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Check your inbox</h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                If <span className="font-semibold text-sky-500">{email}</span> is registered, you'll receive a reset link shortly.
              </p>
              <Link href="/signin">
                <Button className="w-full h-11 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold">
                  Back to Sign In
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Forgot password?</h1>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`pl-10 h-11 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-sky-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'}`}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold shadow-lg shadow-sky-200/50 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Sending...
                    </span>
                  ) : 'Send Reset Link'}
                </Button>
              </form>

              <p className={`text-center text-sm mt-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Remember your password?{' '}
                <Link href="/signin" className="text-sky-500 hover:text-sky-400 font-bold">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
