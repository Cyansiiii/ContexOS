import { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Box, Key, Terminal } from 'lucide-react'

// Common styles to attach to the page or use as a style block
const customStyles = `
  .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  }
  .obsidian-grid {
      background-image: 
          linear-gradient(rgba(110, 231, 195, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(110, 231, 195, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
  }
  .diagonal-sweep {
      background: linear-gradient(45deg, rgba(97, 219, 184, 0.05) 0%, transparent 70%);
  }
  .bg-grid-pattern {
      background-image: linear-gradient(to right, #ffffff05 1px, transparent 1px),
                        linear-gradient(to bottom, #ffffff05 1px, transparent 1px);
      background-size: 40px 40px;
  }
  .diagonal-lines {
      background: repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(97, 219, 184, 0.05) 40px, rgba(97, 219, 184, 0.05) 41px);
  }
  .glass-cube-depth {
      transform: rotateX(15deg) rotateY(-20deg);
      box-shadow: 
          -20px 20px 60px rgba(0,0,0,0.5),
          inset 1px 1px 0px rgba(255,255,255,0.1);
  }
`

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
}

export default function AuthPage({ onAuthenticate }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'signup' && !form.name.trim()) {
      setError('Name is required.')
      return
    }

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login'
      const payload = mode === 'signup'
        ? {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          }

      const response = await axios.post(`${apiBaseUrl}${endpoint}`, payload)
      onAuthenticate(response.data.user)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-sans selection:bg-[#61dbb8]/30 selection:text-[#61dbb8] h-screen w-screen overflow-hidden dark">
      <style>{customStyles}</style>

      <main className="flex h-full w-full">
        {/* LEFT PANEL */}
        {mode === 'login' ? (
          <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#0D0D0D] items-center justify-center border-r border-[#5e3f3c]/10">
            <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
            <div className="absolute inset-0 diagonal-lines"></div>
            
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-purple-900/30 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#61dbb8]/10 blur-[100px] rounded-full"></div>
            
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-32 border border-white/5 bg-white/5 -rotate-12"></div>
              <div className="absolute bottom-1/4 right-1/3 w-48 h-64 border border-white/5 bg-white/5 rotate-6"></div>
              <div class="absolute top-1/2 right-1/4 w-80 h-40 border border-white/5 bg-white/5 rotate-45"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="absolute bottom-12 w-48 h-12 bg-[#61dbb8]/40 blur-[40px] opacity-60 rounded-full"></div>
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: 15, rotateX: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-80 h-80 glass-cube-depth backdrop-blur-3xl bg-[#353534]/40 rounded-xl flex items-center justify-center border border-white/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl font-sans">ContextOS</h1>
              </motion.div>
              <div className="mt-16 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#61dbb8] font-semibold">Private AI Memory Engine</p>
                <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#61dbb8] to-transparent mx-auto opacity-50"></div>
              </div>
            </div>
          </section>
        ) : (
          <section className="hidden lg:flex lg:w-3/5 relative bg-[#0e0e0e] overflow-hidden items-center justify-center">
            <div className="absolute inset-0 obsidian-grid"></div>
            <div className="absolute inset-0 diagonal-sweep"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              className="relative z-10 w-[500px] h-[500px]"
            >
              <div className="absolute inset-0 border border-[#5e3f3c]/10 rounded-xl backdrop-blur-3xl bg-[#201f1f]/20 shadow-[0_0_100px_rgba(0,0,0,0.5)]"></div>
              
              <div className="absolute inset-12 flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ff544b] rounded-lg flex items-center justify-center">
                    <Box className="w-7 h-7 text-[#410002]" />
                  </div>
                  <span className="font-black text-2xl tracking-tighter text-[#ffb4ab]">ContextOS</span>
                </div>
                <div className="space-y-6">
                  <div className="h-[1px] w-full bg-gradient-to-r from-[#61dbb8]/40 to-transparent"></div>
                  <h2 className="text-5xl font-extrabold leading-tight tracking-tighter">
                    The Future of <br/>
                    <span className="text-[#61dbb8]">Corporate Intelligence.</span>
                  </h2>
                  <p className="text-[#888888] max-w-sm font-light leading-relaxed">
                    A neural architecture designed for high-performance teams. Deploy ContextOS and bridge the gap between raw data and actionable memory.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-[#2a2a2a]/40 rounded-lg border border-[#5e3f3c]/5"></div>
                  <div className="h-20 bg-[#2a2a2a]/60 rounded-lg border border-[#5e3f3c]/5"></div>
                  <div className="h-20 bg-[#2a2a2a]/40 rounded-lg border border-[#5e3f3c]/5"></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#61dbb8]/10 blur-[80px]"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#ffb4ab]/10 blur-[100px]"></div>
            </motion.div>
            
            <div className="absolute top-12 left-12 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#61dbb8]">System Status</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#888888]/50">Core.V2_Stable</span>
            </div>
          </section>
        )}

        {/* RIGHT PANEL */}
        <section data-lenis-prevent className="w-full lg:w-2/5 h-full bg-[#111111] flex flex-col px-8 lg:px-16 relative overflow-y-auto">
          {mode === 'signup' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1c1b1b] to-[#131313] opacity-50 z-0 pointer-events-none"></div>
          )}
          
          <motion.div 
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10 m-auto py-16"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-12">
              <span className="font-black text-2xl tracking-tighter text-[#ffb4ab]">ContextOS</span>
            </div>

            <header className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                {mode === 'login' ? 'Sign in' : 'Create Account'}
              </h1>
              <p className="text-[#888888] leading-relaxed">
                {mode === 'login' 
                  ? "Welcome to ContextOS. Access your company's AI memory workspace."
                  : "Join ContextOS to power your company's AI memory."}
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888]" htmlFor="fullname">Full Name</label>
                  <input 
                    className="w-full bg-[#1c1b1b] border border-[#5e3f3c]/20 rounded-lg px-4 py-3.5 text-[#e5e2e1] placeholder:text-[#888888]/40 focus:ring-2 focus:ring-[#61dbb8]/20 focus:border-[#61dbb8] transition-all outline-none" 
                    id="fullname" 
                    placeholder="John Doe" 
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888]" htmlFor="email">Email Address</label>
                <input 
                  className="w-full bg-[#1E1E1E] border-[#333333] border rounded-lg px-4 py-4 text-white placeholder:text-[#555555] focus:border-[#61dbb8] focus:ring-4 focus:ring-[#61dbb8]/10 transition-all outline-none" 
                  id="email" 
                  placeholder={mode === 'login' ? "name@company.ai" : "name@company.com"}
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888]" htmlFor="password">Password</label>
                  {mode === 'login' && <span className="text-xs text-[#61dbb8] hover:underline transition-all cursor-pointer">Forgot?</span>}
                </div>
                <input 
                  className="w-full bg-[#1E1E1E] border-[#333333] border rounded-lg px-4 py-4 text-white placeholder:text-[#555555] focus:border-[#61dbb8] focus:ring-4 focus:ring-[#61dbb8]/10 transition-all outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </div>

              {error && (
                 <div className="rounded-lg border border-red-500/20 bg-[#93000a]/20 px-4 py-3 text-sm font-medium text-[#ffb4ab]">
                   {error}
                 </div>
              )}

              <div className="flex items-center gap-3 py-2">
                <input 
                  className={`w-4 h-4 rounded ${mode === 'login' ? 'border-[#333333] bg-[#1E1E1E] text-[#ff544b] focus:ring-[#ff544b]' : 'border-[#5e3f3c]/30 bg-[#1c1b1b] text-[#61dbb8] focus:ring-[#61dbb8]/40'} focus:ring-offset-0`}
                  id="tos" 
                  type="checkbox"
                />
                <label className="text-sm text-[#888888]" htmlFor="tos">
                  I agree to the <span className="text-[#e5e2e1] hover:underline cursor-pointer">Terms of Service</span> {mode === 'signup' && <span className="text-[#e5e2e1] hover:underline cursor-pointer">and Privacy Policy</span>}
                </label>
              </div>

              <button 
                disabled={submitting}
                className="w-full bg-[#ff544b] hover:bg-[#c00014] text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-xl shadow-[#ff544b]/10 active:scale-[0.98] uppercase tracking-widest text-sm" 
                type="submit"
              >
                {submitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#5e3f3c]/10"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-[#111111] px-4 text-[#888888]/50">
                  {mode === 'login' ? 'Enterprise Auth' : 'Or Continue With'}
                </span>
              </div>
            </div>

            {mode === 'login' ? (
              <button className="w-full flex items-center justify-center gap-3 bg-[#1c1b1b] border border-[#5e3f3c]/20 hover:bg-[#201f1f] py-3 rounded-lg transition-all group">
                <Key className="text-[#61dbb8] w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Continue with SSO</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-[#201f1f] rounded-lg border border-[#5e3f3c]/10 hover:bg-[#2a2a2a] transition-colors">
                  <img alt="" className="w-4 h-4 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHKtyX4PorMx2h9yHO8fbht8ALSvgvHarABsVkGuR8sXddxae_MN40scbA1QvxJkREfGOIoJj-gz0b6-eek4PCZ9vUIc3x2frvjoUBLKIoNIkpKe3ok7gnziFzkkqVGJ7CzJARrIsPQrennd36engsZ_NWtRCBl7L7Sy9F2zsb9mo9FhDV8MP4pWvSqg247y0VyTY5D3RHB8at0cDYHg36Yu1FfDdSFq81S4JiigV6ovtaRFaKY3RxgTfqbQ1CmJHmzsQniv1_Wr4"/>
                  <span className="text-xs font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-[#201f1f] rounded-lg border border-[#5e3f3c]/10 hover:bg-[#2a2a2a] transition-colors">
                  <Terminal className="w-4 h-4 opacity-70" />
                  <span className="text-xs font-medium">SSO</span>
                </button>
              </div>
            )}

            <footer className="mt-12 text-center">
              <p className="text-[#888888] text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} 
                  className="text-[#61dbb8] font-bold hover:underline transition-all ml-1 cursor-pointer"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </footer>

            {/* Bottom Credits (visible on login style layout) */}
            {mode === 'login' && (
              <div className="absolute -bottom-4 left-0 w-full flex justify-between items-center opacity-30 pointer-events-none pb-4">
                <span className="text-[10px] uppercase tracking-widest text-[#888888]">v4.0.2 Stable</span>
                <span className="text-[10px] uppercase tracking-widest text-[#888888]">© 2024 ContextOS</span>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      
      {/* Background Decals for Signup mode */}
      {mode === 'signup' && (
        <div className="fixed bottom-12 left-12 z-0 opacity-20 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#61dbb8]"></div>
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#888888]">Secure Transmission Active</span>
          </div>
        </div>
      )}
    </div>
  )
}
