'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Globe, User, Phone, Check, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BorderBeam } from '@/components/ui/border-beam'
import { useTheme } from '@/context/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import { signUp } from '@/lib/auth'

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]
  const score = checks.filter(c => c.met).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-emerald-500']
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${score >= 4 ? 'text-emerald-500' : score >= 3 ? 'text-yellow-500' : 'text-red-400'}`}>
          {password ? labels[score - 1] || 'Too weak' : ''}
        </span>
      </div>
      {/* Requirements */}
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {check.met
              ? <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              : <X className="w-3 h-3 text-slate-300 flex-shrink-0" />}
            <span className={`text-[11px] ${check.met ? 'text-emerald-600' : 'text-slate-400'}`}>{check.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [step, setStep] = useState(1) // 1 = account info, 2 = password
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ''
  const passwordScore = [
    formData.password.length >= 8,
    /[A-Z]/.test(formData.password),
    /[a-z]/.test(formData.password),
    /\d/.test(formData.password),
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  ].filter(Boolean).length

  const canProceedStep1 = formData.name.trim().length >= 2 && formData.email.includes('@') && formData.phone.length >= 7
  const canSubmit = passwordScore >= 3 && passwordsMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 700))

    const result = signUp({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    })

    if (!result.success) {
      setError(result.error || 'Sign up failed.')
      setIsLoading(false)
      return
    }

    router.push('/welcome')
  }

  const inputClass = (isDark: boolean) =>
    `h-11 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-sky-500' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-400'}`

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center py-8 ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'}`}>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl ${isDark ? 'bg-sky-500/8' : 'bg-sky-300/35'}`}
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl ${isDark ? 'bg-indigo-500/8' : 'bg-indigo-300/30'}`}
        />
        <svg className={`absolute inset-0 w-full h-full ${isDark ? 'opacity-[0.04]' : 'opacity-[0.06]'}`}>
          <defs>
            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#38bdf8' : '#0ea5e9'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
      </div>

      {/* Top bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link href="/">
          <motion.div whileHover={{ x: -3 }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-sky-600 hover:bg-white/80'}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
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
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-200">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Atlas<span className="text-sky-500">Aura</span>
            </span>
          </motion.div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Join 50,000+ travelers worldwide 🌍
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 px-1">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-200' : isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              <span className={`text-xs font-semibold ${step >= s ? (isDark ? 'text-sky-400' : 'text-sky-600') : (isDark ? 'text-slate-600' : 'text-slate-400')}`}>
                {s === 1 ? 'Your Info' : 'Password'}
              </span>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-sky-400' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className={`relative rounded-2xl p-8 ${isDark ? 'bg-slate-900/80 border border-white/10' : 'bg-white/90 border border-sky-100 shadow-xl shadow-sky-100/50'} backdrop-blur-xl`}>
          <BorderBeam size={140} duration={10} colorFrom={isDark ? '#38bdf8' : '#0ea5e9'} colorTo={isDark ? '#818cf8' : '#6366f1'} borderWidth={1.5} />

          <div className="mb-6">
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {step === 1 ? 'Create your account' : 'Secure your account'}
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {step === 1 ? 'Tell us a bit about yourself' : 'Choose a strong password'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); if (canProceedStep1) setStep(2) } : handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Full Name</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Input type="text" placeholder="Alex Wanderer" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={`pl-10 ${inputClass(isDark)}`} required />
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Email Address</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Input type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`pl-10 ${inputClass(isDark)}`} required />
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={`pl-10 ${inputClass(isDark)}`} required />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className={`pl-10 pr-10 ${inputClass(isDark)}`} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {formData.password && <PasswordStrengthBar password={formData.password} />}
                    </AnimatePresence>
                  </div>
                  {/* Confirm */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Confirm Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className={`pl-10 pr-10 ${inputClass(isDark)} ${formData.confirmPassword && !passwordsMatch ? 'border-red-400 focus:border-red-400' : ''}`} required />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                    )}
                    {passwordsMatch && (
                      <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
                    )}
                  </div>
                  {/* Terms */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-sky-500" required />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      I agree to the{' '}
                      <a href="#" className="text-sky-500 hover:underline font-semibold">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-sky-500 hover:underline font-semibold">Privacy Policy</a>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-1">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)} className={`flex-1 h-11 font-bold ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600'}`}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && (!canSubmit || isLoading))}
                className="flex-1 h-11 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold shadow-lg shadow-sky-200/50 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Creating account...
                  </span>
                ) : step === 1 ? (
                  <span className="flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4" /></span>
                )}
              </Button>
            </div>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>already a member?</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>

          <p className="text-center text-sm">
            <Link href="/signin" className="text-sky-500 hover:text-sky-400 font-bold">
              Sign in to your account →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
