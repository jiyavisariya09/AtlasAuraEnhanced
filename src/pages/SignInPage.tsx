import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function SignInPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('atlasaura-user', 'true');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-[#1a1410]' : 'bg-[#f5f1e8]'}`}>
      <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
      }} />

      <div className={`absolute top-0 left-0 w-48 h-48 opacity-20 ${isDark ? 'text-amber-600' : 'text-amber-800'}`}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 Q25,0 25,25 Q25,0 50,0 L50,2 Q27,2 27,25 Q27,2 2,2 L2,50 Q2,27 25,27 Q2,27 2,2 Z" />
        </svg>
      </div>
      <div className={`absolute top-0 right-0 w-48 h-48 opacity-20 ${isDark ? 'text-amber-600' : 'text-amber-800'} transform rotate-90`}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 Q25,0 25,25 Q25,0 50,0 L50,2 Q27,2 27,25 Q27,2 2,2 L2,50 Q2,27 25,27 Q2,27 2,2 Z" />
        </svg>
      </div>

      <motion.div whileHover={{ x: -5 }} className="absolute top-8 left-8 z-50">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded border-2 ${isDark ? 'border-amber-700/50 bg-[#2a2420]/80 text-amber-200' : 'border-amber-800/30 bg-[#faf8f3]/80 text-amber-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-serif text-sm">Return Home</span>
        </Link>
      </motion.div>

      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className={`font-serif text-4xl mb-2 ${isDark ? 'text-amber-100' : 'text-amber-950'}`}>
              Atlas<span className={isDark ? 'text-amber-500' : 'text-amber-700'}>Aura</span>
            </h1>
            <div className={`w-32 h-px mx-auto ${isDark ? 'bg-amber-700/50' : 'bg-amber-800/30'}`} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`relative p-8 rounded-sm border-4 shadow-2xl ${isDark ? 'bg-[#2a2420] border-amber-700/30' : 'bg-[#faf8f3] border-amber-800/20'}`}
            style={{ boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(120,53,15,0.15)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className={`px-4 py-1 ${isDark ? 'bg-[#2a2420]' : 'bg-[#faf8f3]'}`}>
                <span className={`font-serif text-sm ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>Welcome Back</span>
              </div>
            </div>

            <div className="text-center mb-6 mt-4">
              <h2 className={`font-serif text-xl mb-1 ${isDark ? 'text-amber-100' : 'text-amber-950'}`}>
                Sign In to Your Account
              </h2>
              <p className={`font-serif text-xs italic ${isDark ? 'text-amber-300/70' : 'text-amber-800/70'}`}>
                Continue your journey of discovery
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block font-serif text-xs mb-1.5 ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-amber-600' : 'text-amber-700'}`} />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-9 py-2 text-sm font-serif border-2 rounded-sm ${isDark ? 'bg-[#1a1410] border-amber-700/30 text-amber-100 placeholder:text-amber-700/40' : 'bg-white border-amber-800/20 text-amber-950 placeholder:text-amber-700/40'}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block font-serif text-xs mb-1.5 ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-amber-600' : 'text-amber-700'}`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-9 pr-9 py-2 text-sm font-serif border-2 rounded-sm ${isDark ? 'bg-[#1a1410] border-amber-700/30 text-amber-100 placeholder:text-amber-700/40' : 'bg-white border-amber-800/20 text-amber-950 placeholder:text-amber-700/40'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-amber-600 hover:text-amber-500' : 'text-amber-700 hover:text-amber-800'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-serif">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded-sm" />
                  <span className={isDark ? 'text-amber-300/70' : 'text-amber-800/70'}>Remember me</span>
                </label>
                <a href="#" className={`${isDark ? 'text-amber-500 hover:text-amber-400' : 'text-amber-700 hover:text-amber-800'}`}>
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className={`w-full py-3 font-serif text-sm rounded-sm border-2 ${isDark ? 'bg-amber-700 hover:bg-amber-600 border-amber-600 text-amber-50' : 'bg-amber-800 hover:bg-amber-900 border-amber-900 text-amber-50'}`}
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className={`font-serif text-xs ${isDark ? 'text-amber-300/70' : 'text-amber-800/70'}`}>
                New to AtlasAura?{' '}
                <Link to="/signup" className={`font-semibold ${isDark ? 'text-amber-500 hover:text-amber-400' : 'text-amber-700 hover:text-amber-800'}`}>
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>

          <p className={`text-center mt-4 text-[10px] font-serif italic ${isDark ? 'text-amber-600/60' : 'text-amber-800/50'}`}>
            By signing in, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
