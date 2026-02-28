import { useState, useEffect } from 'react'
import axios from 'axios'
import Integrations from './Integrations'
import Pricing from './Pricing'
import CurvedLoop from './components/core/CurvedLoop'
import { LineShadowText } from './components/core/line-shadow-text'
import { AnimatedListDemo } from './components/core/AnimatedListDemo'
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { BorderBeam } from "@/components/ui/border-beam"
import {
  Search, Database, MessageSquare, BrainCircuit,
  Activity, UploadCloud, Zap,
  CheckCircle2, ShieldCheck, Sparkles, Files, Briefcase,
  Bell, Clock, ArrowUpRight, Plus, MoreHorizontal, Video, FileText, CheckCircle
} from 'lucide-react'

// MOCK DATA for floating bubbles to simulate Guru homepage
const FLOATING_CHATS = [
  { text: "What's our current security review process?", type: "q", user: "dev", delay: "delay-0", pos: "top-20 -left-12 lg:-left-32" },
  { text: "Standard timeframe is 3-5 business days requiring Approval.", type: "a", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, delay: "delay-[2000ms]", pos: "top-36 left-0 lg:-left-12" },
  { text: "Did we update the Stripe payment API?", type: "q", user: "pm", delay: "delay-1000", pos: "bottom-40 -left-8 lg:-left-24" },
  { text: "Yes—Stripe integration was just updated to support passkey.", type: "a", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, delay: "delay-[3000ms]", pos: "bottom-20 left-4 lg:-left-8" },
  { text: "Who leads the Acme Corp renewal?", type: "q", user: "sales", delay: "delay-500", pos: "top-16 -right-12 lg:-right-32" },
  { text: "Priya is the lead for Acme Corp.", type: "a", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, delay: "delay-[2500ms]", pos: "top-32 right-0 lg:-right-12" },
]

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('search')
  const [activityPeriod, setActivityPeriod] = useState('Week')
  const [statKey, setStatKey] = useState(0)
  // Trigger re-animation when tab changes
  useEffect(() => { setStatKey(k => k + 1) }, [activityPeriod, activeTab])
  // To force replace  = useState('search') // 'search', 'upload', 'dashboard'

  const [uploadContent, setUploadContent] = useState('')
  const [uploadSource, setUploadSource] = useState('document')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')



  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true)
    setAnswer('')
    try {
      const response = await axios.post(
        'http://localhost:8000/ask',
        { question: question }
      )
      setAnswer(response.data.answer)
      setSources(response.data.sources || [])
    } catch (error) {
      console.error(error)
      setAnswer('Error reaching ContextOS API. Check if backend is running.')
    }
    setLoading(false)
  }

  const handleUpload = async () => {
    if (!uploadContent.trim()) return;
    setUploading(true);
    setUploadMessage('');
    try {
      await axios.post('http://localhost:8000/upload', {
        content: uploadContent,
        source: uploadSource,
        date: new Date().toISOString()
      });
      setUploadMessage('Memory stored successfully!');
      setUploadContent('');
    } catch (error) {
      console.error(error);
      setUploadMessage('Failed to upload memory.');
    }
    setUploading(false);
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 selection:bg-purple-200 overflow-x-hidden relative hero-gradient">

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* --- NEW HEADER (Dribbble matching) --- */}
          <div className="flex-1 flex justify-start items-center">
            <div className="flex items-center gap-2 cursor-pointer mr-12" onClick={() => setActiveTab('search')}>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Outfit']">ContextOS</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-[#212121] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >Dashboard</button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'search' ? 'bg-[#212121] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >Tasks & Search</button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'upload' ? 'bg-[#212121] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
              >Analytics</button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 flex-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
            </button>
            <AnimatedThemeToggler className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 focus:outline-none" />
            <div className="h-10 pl-3 flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 ml-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-blue-600 overflow-hidden text-white flex items-center justify-center font-bold">
                C
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Ethan Walker</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ethan.walker@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="pt-32 pb-24 relative z-10 min-h-screen">

        {/* --- SEARCH / HOME VIEW --- */}
        {activeTab === 'search' && (
          <div className="animate-slide-up w-full flex flex-col items-center">
            {/* HERO CONTAINER */}
            <div className="w-full max-w-7xl mx-auto relative min-h-[75vh] pb-32 px-6 lg:px-12">

              {/* HERO TYPOGRAPHY */}
              <div className="absolute top-1/4 left-0 w-full z-0 flex items-center justify-center pointer-events-none overflow-visible pt-10">
                <CurvedLoop
                  marqueeText="CONTEXT OS ✦ INTELLIGENT ✦ FAST ✦ PRIVATE ✦"
                  speed={2}
                  curveAmount={250}
                  interactive={false}
                />
              </div>

              <div className="text-center max-w-4xl mx-auto mb-16 relative z-10 pt-10 mt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm mb-6">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Powered by AMD Ryzen AI</span>
                </div>
                <h1 className="text-[3.5rem] md:text-[5rem] font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6">
                  Ready to try AI built on <br className="hidden md:block" />
                  <LineShadowText className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400" shadowColor="rgba(124, 58, 237, 0.4)">
                    your knowledge?
                  </LineShadowText>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 font-normal mb-8 max-w-2xl mx-auto">
                  <span className="font-semibold text-slate-800 dark:text-white">Ask, chat, and research</span> using verified company knowledge. Always cited. Always secure.
                </p>

                {/* SECURITY BADGES (Mocking Guru) */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-12">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> SOC 2</span> |
                  <span>GDPR</span> |
                  <span>SSO</span> |
                  <span>Encryption</span> |
                  <span>Zero data retention</span>
                </div>
              </div>

              {/* HUGE SEARCH BAR */}
              <div className="max-w-3xl mx-auto relative z-20 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white dark:bg-[#1a1c22] border border-slate-200 dark:border-slate-800 flex items-center p-3 rounded-full shadow-2xl hover:shadow-xl transition-all h-20 pl-8">
                    <Search className="w-7 h-7 text-[#8250f2]" />
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                      placeholder="Ask anything about your company's knowledge..."
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-xl px-4 py-2 font-medium placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={loading}
                      className="bg-[#8250f2] hover:bg-[#7245d6] text-white px-8 h-full rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : 'Search'}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI ANSWER REGION */}
              {answer && (
                <div className="max-w-3xl mx-auto mb-20 animate-slide-up">
                  <div className="glass-card rounded-[2rem] p-8 text-left relative overflow-hidden group">
                    <BorderBeam duration={8} size={300} reverse className="from-transparent via-purple-500 to-transparent" />
                    {/* Glowing corner effect */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full"></div>

                    <div className="flex items-start gap-4 mb-6 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 shadow-lg">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Verified Answer</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sourced from internal docs</p>
                      </div>
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-14 relative z-10">
                      {answer}
                    </p>
                    <div className="pl-14 mt-6 flex gap-3 relative z-10">
                      {sources.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors shadow-sm dark:shadow-none">
                          <FileText className="w-4 h-4 text-[#8250f2] dark:text-purple-400" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FLOATING BUBBLES BACKGROUND (Visible on Desktop) */}
              {!answer && (
                <div className="hidden lg:block absolute top-[10%] left-0 right-0 bottom-0 pointer-events-none z-0">
                  <div className="relative w-full h-full max-w-7xl mx-auto">
                    {FLOATING_CHATS.map((chat, idx) => (
                      <div
                        key={idx}
                        className={`absolute ${chat.pos} animate-float ${chat.delay} bg-white dark:bg-[#1a1c22] px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800 max-w-xs flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 float-bubble`}
                      >
                        {chat.type === "q" ? (
                          <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shrink-0 text-xs">
                            {chat.user[0].toUpperCase()}
                          </div>
                        ) : (
                          <div className="mt-0.5 shrink-0">{chat.icon}</div>
                        )}
                        <span>{chat.text}</span>
                      </div>
                    ))}

                    {/* Verified absolute badge mock */}
                    <div className="absolute right-0 bottom-32 animate-float bg-white dark:bg-[#1a1c22] rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none border border-slate-100 dark:border-white/10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Verified!</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold">By Engine</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Integrations Section */}
            <div className="w-full bg-slate-50 relative z-20 border-y border-slate-200 overflow-hidden">
              <Integrations />
            </div>

            {/* Pricing Section */}
            <div className="w-full">
              <Pricing />
            </div>
          </div>
        )}

        {/* --- UPLOAD VIEW --- */}
        {activeTab === 'upload' && (
          <div className="animate-slide-up max-w-3xl mx-auto mt-8 px-6">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Add to your Knowledge Base</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Connect your tools or paste directly to train the AI instantly.</p>
            </div>

            <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
              <BorderBeam duration={8} size={300} reverse className="from-transparent via-blue-500 to-transparent" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-100 pb-8 mb-8 relative z-10">
                {[
                  { id: 'document', icon: <Files className="w-5 h-5" />, label: "Document" },
                  { id: 'email', icon: <MessageSquare className="w-5 h-5" />, label: "Email" },
                  { id: 'meeting_notes', icon: <Briefcase className="w-5 h-5" />, label: "Notes" },
                  { id: 'decision', icon: <Activity className="w-5 h-5" />, label: "Decision" }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setUploadSource(t.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all border-2 ${uploadSource === t.id
                      ? 'border-[#8250f2] bg-purple-50 dark:bg-purple-900/20 text-[#8250f2] dark:text-purple-400'
                      : 'border-transparent bg-slate-50 dark:bg-[#1a1c22]/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252830]'
                      }`}
                  >
                    {t.icon}
                    <span className="text-sm font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Paste Content</label>
                  <textarea
                    value={uploadContent}
                    onChange={(e) => setUploadContent(e.target.value)}
                    placeholder="Paste the raw text of the document or notes here. ContextOS will automatically index and verify it for future searches..."
                    className="w-full h-56 bg-white dark:bg-[#1a1c22]/50 border-2 border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#8250f2] focus:ring-4 focus:ring-purple-500/10 resize-none font-medium text-lg placeholder-slate-400 dark:placeholder-slate-500 shadow-inner dark:shadow-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !uploadContent}
                    className="w-full bg-[#8250f2] hover:bg-[#7245d6] text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Vectorizing...</>
                    ) : (
                      <><UploadCloud className="w-5 h-5" /> Commit to Memory</>
                    )}
                  </button>
                </div>

                {uploadMessage && (
                  <div className="animate-pop-in mt-4 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="font-semibold">{uploadMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="animate-slide-up max-w-[1400px] mx-auto mt-4 pb-12 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* LEFT COLUMN */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                {/* Working Hours */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-7 relative overflow-hidden group">
                  <BorderBeam duration={8} size={200} className="from-transparent via-amber-500 to-transparent" />
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Today&apos;s working hours</h3>
                  <div className="flex items-baseline gap-2 mb-6 border-b border-dashed border-slate-200 dark:border-slate-700 pb-5">
                    <Clock className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">8 h 27m</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Active time</p>
                      <p className="text-xs text-slate-500 font-medium mb-3">6h 17m</p>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] stripe-green animate-progress origin-left transition-all duration-1000"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pause time</p>
                      <p className="text-xs text-slate-500 font-medium mb-3">2h 10m</p>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[30%] stripe-pink animate-progress origin-left transition-all duration-1000 delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Card */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-7 relative overflow-hidden group">
                  <BorderBeam duration={8} size={200} className="from-transparent via-blue-500 to-transparent" />
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    In 30 minutes
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Meeting with Product team</h3>

                  {/* Timeline block */}
                  <div className="relative h-12 mb-2">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 text-right text-xs font-bold text-slate-400 dark:text-slate-500">10:30</div>
                      <div className="w-3 h-3 rounded-full border-2 border-white dark:border-[#1a1c22] bg-blue-500 relative z-10 group-hover:scale-125 transition-transform"></div>
                      <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-3 flex items-center gap-3 transition-colors group-hover:border-blue-200 dark:group-hover:border-blue-500">
                        <Video className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Join on Google Meet</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Design team weekly sync</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-6">
                    <span>10:15<span className="ml-4 text-slate-800 dark:text-slate-200">10:30</span></span>
                    <span><span className="mr-3 text-slate-800 dark:text-slate-200">12:00</span>12:15</span>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between group cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Join on Google Meet</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Video className="w-3 h-3" /> meet.google.com/nux-wq-tu</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE COLUMN - LARGE GRAPHS & TASKS */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Activity Graph Card */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
                  <BorderBeam duration={8} size={350} reverse className="from-transparent via-emerald-500 to-transparent" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Activity</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs font-medium leading-relaxed">You logged <span className="font-bold text-slate-700 dark:text-slate-300">32.2 hours</span> this week — up <span className="font-bold text-slate-700 dark:text-slate-300">4.3 hours</span> from last month.</p>
                    </div>
                    <div className="flex bg-slate-100/80 p-1 rounded-xl">
                      {['Week', 'Month', 'Year'].map(p => (
                        <button key={p} onClick={() => setActivityPeriod(p)} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${activityPeriod === p ? 'bg-white shadow-sm font-bold text-slate-800' : 'font-semibold text-slate-500 hover:text-slate-800'}`}>{p}</button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end gap-16 justify-between mt-auto h-48 relative">
                    {/* Y-axis absolute stat mock */}
                    <div className="absolute bottom-4 left-0">
                      <p className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">32.2h</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 15%</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">vs last month</span>
                      </div>
                    </div>

                    {/* Bar Graph Mock */}
                    <div className="flex items-end gap-3 sm:gap-4 md:gap-5 lg:gap-6 h-full ml-auto w-3/5">
                      {
                        (activityPeriod === 'Week' ? [
                          { h: '60%', d: 'Mon', color: 'bg-blue-500' },
                          { h: '75%', d: 'Tue', color: 'bg-blue-600' },
                          { h: '95%', d: 'Wed', color: 'bg-blue-600', active: true, val: '8.2h' },
                          { h: '50%', d: 'Thu', color: 'bg-blue-500' },
                          { h: '85%', d: 'Fri', color: 'bg-blue-500' },
                          { h: '40%', d: 'Sat', color: 'bg-blue-400' },
                          { h: '65%', d: 'Sun', color: 'bg-blue-600' },
                        ] : activityPeriod === 'Month' ? [
                          { h: '45%', d: 'Wk1', color: 'bg-blue-500' },
                          { h: '80%', d: 'Wk2', color: 'bg-blue-600' },
                          { h: '65%', d: 'Wk3', color: 'bg-blue-500' },
                          { h: '90%', d: 'Wk4', color: 'bg-blue-600', active: true, val: '32.2h' },
                        ] : [
                          { h: '30%', d: 'Q1', color: 'bg-blue-400' },
                          { h: '50%', d: 'Q2', color: 'bg-blue-500' },
                          { h: '70%', d: 'Q3', color: 'bg-blue-500' },
                          { h: '85%', d: 'Q4', color: 'bg-blue-600', active: true, val: '380h' },
                        ]).map((bar, i) => (
                          <div key={i} className="flex flex-col items-center flex-1 group">
                            <div className={`w-full rounded-t-xl relative border ${bar.active ? 'border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-white/5 h-full' : 'border-transparent h-full bg-slate-50 dark:bg-white/5'}`}>
                              <div className={`absolute bottom-0 w-full rounded-xl ${bar.color} ${bar.active ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : ''} animate-slide-up bg-gradient-to-t from-blue-700 to-blue-400 opacity-90 transition-all group-hover:opacity-100`} style={{ height: bar.h, transition: 'height 1s ease-out', animationDelay: `${i * 100}ms` }} key={`${activityPeriod}-${i}`}></div>
                              {bar.active && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#212121] dark:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-10">
                                  {bar.val || '8.2h'}
                                </div>
                              )}
                            </div>
                            <span className={`text-xs mt-3 font-semibold ${bar.active ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{bar.d}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Today's Tasks Blocks */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
                  <BorderBeam duration={10} size={300} className="from-transparent via-indigo-500 to-transparent" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Today&apos;s tasks</h2>
                    <a href="#" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">View all</a>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {/* Active Blue Task Card */}
                    <div className="min-w-[280px] bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full">10:30 - 12:00 AM</span>
                        <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-8 relative z-10">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-100 mb-2 bg-white/10 px-2 py-0.5 rounded-md"><Database className="w-3 h-3" /> English</span>
                        <h3 className="text-lg font-bold leading-tight mb-2">Technical English<br />Session</h3>
                        <p className="text-xs text-blue-100/70 font-medium">Practice terminology and core co...</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/20 pt-4 relative z-10">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-blue-400 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold">EW</div>
                          <div className="w-7 h-7 rounded-full bg-indigo-400 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold">AS</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 2/4</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 12</span>
                        </div>
                      </div>
                    </div>

                    {/* Pending Task Card 1 */}
                    <div className="min-w-[280px] bg-slate-50 dark:bg-[#1a1c22]/50 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-sm relative group hover:-translate-y-1 transition-transform cursor-pointer hover:shadow-md">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-300">01:00 - 02:30 PM</span>
                        <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        </button>
                      </div>
                      <div className="mb-8">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2"><Briefcase className="w-3 h-3" /> Design</span>
                        <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white mb-2">UI Components<br />Workshop</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">Create and refine interface eleme...</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">MK</div>
                          <div className="w-7 h-7 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">PL</div>
                          <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+2</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 3/10</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 14</span>
                        </div>
                      </div>
                    </div>

                    {/* Pending Task Card 2 */}
                    <div className="min-w-[280px] bg-slate-50 dark:bg-[#1a1c22]/50 border border-slate-100 dark:border-white/10 rounded-[2rem] p-6 shadow-sm relative group hover:-translate-y-1 transition-transform cursor-pointer hover:shadow-md">
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-300">2:30 - 16:00 PM</span>
                        <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        </button>
                      </div>
                      <div className="mb-8">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2"><Video className="w-3 h-3" /> Meeting</span>
                        <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white mb-2">Extended Team Sync<br />Meeting</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">Discuss progress, blockers, and ne...</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                        <div className="flex -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">AS</div>
                          <div className="w-7 h-7 rounded-full bg-pink-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">TR</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 0/5</span>
                          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 9</span>
                        </div>
                      </div>
                    </div>

                    {/* Add new space */}
                    <div className="min-w-[100px] flex items-center justify-center">
                      <button className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors">
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-1 flex flex-col gap-6">

                {/* Statistics Gauge Card */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-7 relative overflow-hidden group">
                  <BorderBeam duration={8} size={250} className="from-transparent via-pink-500 to-transparent" />
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Statistics</h3>
                    <button className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Donut Gauge Wrapper */}
                  <div className="relative w-48 h-24 mx-auto mb-10 overflow-hidden">
                    <svg viewBox="0 0 100 50" className="gauge-svg absolute bottom-0" key={`gauge-${statKey}`}>
                      <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-track" />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-progress-green stroke-fill" style={{ "--stroke-percent": 51 }} />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-progress-yellow stroke-fill" style={{ "--stroke-percent": 17 }} />
                      <path d="M 10 50 A 40 40 0 0 1 90 50" className="gauge-progress-pink stroke-fill" style={{ "--stroke-percent": 32 }} />
                    </svg>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
                      <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">350</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block">Tasks</div>
                    </div>
                  </div>

                  {/* Stats Bars */}
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>Completed</span>
                        <span>51%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[51%] stripe-green animate-progress origin-left duration-1000"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>In progress</span>
                        <span>17%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[17%] stripe-orange animate-progress origin-left duration-1000 delay-150"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        <span>Upcoming</span>
                        <span>32%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[32%] stripe-pink animate-progress origin-left duration-1000 delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* By Project List */}
                <div className="glass-card rounded-[2rem] p-6 lg:p-7 relative overflow-hidden group">
                  <BorderBeam duration={8} size={250} reverse className="from-transparent via-purple-500 to-transparent" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">By project</h3>
                    <button className="bg-[#212121] dark:bg-[#33353c] hover:bg-black dark:hover:bg-[#44464d] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>

                  <div className="w-full">
                    <AnimatedListDemo className="h-[400px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

