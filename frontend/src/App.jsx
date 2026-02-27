import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Search, Database, MessageSquare, BrainCircuit,
  Activity, UploadCloud, ChevronRight, Zap,
  CheckCircle2, ShieldCheck, Sparkles, Files, Briefcase
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
  const [activeTab, setActiveTab] = useState('search') // 'search', 'upload', 'dashboard'

  const [uploadContent, setUploadContent] = useState('')
  const [uploadSource, setUploadSource] = useState('document')
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const [stats, setStats] = useState({ total_memories: 0, recent_activity: [] })
  const [amdStatus, setAmdStatus] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchStats = async () => {
        setStatsLoading(true)
        try {
          const [statsRes, amdRes] = await Promise.all([
            axios.get('http://localhost:8000/stats'),
            axios.get('http://localhost:8000/amd-status')
          ])
          setStats(statsRes.data)
          setAmdStatus(amdRes.data)
        } catch (error) {
          console.error("Error fetching stats:", error)
        }
        setStatsLoading(false)
      }
      fetchStats()
    }
  }, [activeTab])

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
    <div className="min-h-screen text-slate-800 selection:bg-purple-200 overflow-x-hidden relative hero-gradient">

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('search')}>
              <div className="bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ContextOS</span>
            </div>

            {/* Mock Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <span className="hover:text-slate-900 cursor-pointer flex items-center gap-1">Product <ChevronRight className="w-3 h-3 rotate-90" /></span>
              <span className="hover:text-slate-900 cursor-pointer flex items-center gap-1">Solutions <ChevronRight className="w-3 h-3 rotate-90" /></span>
              <span className="hover:text-slate-900 cursor-pointer flex items-center gap-1">Resources <ChevronRight className="w-3 h-3 rotate-90" /></span>
              <span className="hover:text-slate-900 cursor-pointer">Pricing</span>
            </div>
          </div>

          {/* Action Tabs - Replaced standard nav with app routing */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${activeTab === 'dashboard' ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${activeTab === 'upload' ? 'text-slate-900 bg-slate-100' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Add Memory
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block"></div>
            <button
              onClick={() => setActiveTab('search')}
              className="text-sm font-bold bg-[#8250f2] hover:bg-[#7245d6] text-white px-6 py-2.5 rounded-full shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5"
            >
              Search Hub
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="pt-32 pb-24 px-6 relative z-10 min-h-screen">

        {/* --- SEARCH / HOME VIEW --- */}
        {activeTab === 'search' && (
          <div className="animate-slide-up max-w-7xl mx-auto relative">

            {/* HERO TYPOGRAPHY */}
            <div className="text-center max-w-4xl mx-auto mb-16 relative z-10 pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-sm font-medium text-slate-600 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Your AI Source of Truth</span>
              </div>
              <h1 className="text-[3.5rem] md:text-[5rem] font-bold leading-[1.05] tracking-tight text-slate-900 mb-6">
                Ready to try AI built on <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">your knowledge?</span>
              </h1>
              <p className="text-xl text-slate-600 font-normal mb-8 max-w-2xl mx-auto">
                <span className="font-semibold text-slate-800">Ask, chat, and research</span> using verified company knowledge. Always cited. Always secure.
              </p>

              {/* SECURITY BADGES (Mocking Guru) */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-12">
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
                <div className="relative bg-white border border-slate-200 flex items-center p-3 rounded-full shadow-2xl hover:shadow-xl transition-all h-20 pl-8">
                  <Search className="w-7 h-7 text-[#8250f2]" />
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                    placeholder="Ask anything about your company's knowledge..."
                    className="w-full bg-transparent border-none outline-none text-slate-800 text-xl px-4 py-2 font-medium placeholder-slate-400"
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
              <div className="max-w-3xl mx-auto mt-8 relative z-20 animate-pop-in">
                <div className="glass-card rounded-3xl p-8 lg:p-10 text-left border-t-[6px] border-[#8250f2]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">Verified Answer</h3>
                  </div>

                  <div className="prose prose-lg text-slate-700 leading-relaxed font-medium">
                    <p className="whitespace-pre-wrap">{answer}</p>
                  </div>

                  {sources && sources.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
                        <Database className="w-3 h-3" /> Sources Consulted
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sources.map((source, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors shadow-sm">
                            <Files className="w-4 h-4 text-slate-400" />
                            <span className="capitalize">{source.type || 'Document'}</span>
                            <span className="text-slate-400">·</span>
                            <span className="capitalize truncate max-w-[150px]">{source.source}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      className={`absolute ${chat.pos} animate-float ${chat.delay} bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 max-w-xs flex gap-3 text-sm font-medium text-slate-700 float-bubble`}
                    >
                      {chat.type === "q" ? (
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs">
                          {chat.user[0].toUpperCase()}
                        </div>
                      ) : (
                        <div className="mt-0.5 shrink-0">{chat.icon}</div>
                      )}
                      <span>{chat.text}</span>
                    </div>
                  ))}

                  {/* Verified absolute badge mock */}
                  <div className="absolute right-0 bottom-32 animate-float bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="font-bold text-slate-900">Verified!</span>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">By Engine</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- UPLOAD VIEW --- */}
        {activeTab === 'upload' && (
          <div className="animate-slide-up max-w-3xl mx-auto mt-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">Add to your Knowledge Base</h2>
              <p className="text-lg text-slate-600">Connect your tools or paste directly to train the AI instantly.</p>
            </div>

            <div className="glass-card rounded-[2rem] p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-100 pb-8 mb-8">
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
                      ? 'border-[#8250f2] bg-purple-50 text-[#8250f2]'
                      : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {t.icon}
                    <span className="text-sm font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Paste Content</label>
                  <textarea
                    value={uploadContent}
                    onChange={(e) => setUploadContent(e.target.value)}
                    placeholder="Paste the raw text of the document or notes here. ContextOS will automatically index and verify it for future searches..."
                    className="w-full h-56 bg-white border-2 border-slate-200 rounded-2xl p-5 text-slate-800 focus:outline-none focus:border-[#8250f2] focus:ring-4 focus:ring-purple-500/10 resize-none font-medium text-lg placeholder-slate-400 shadow-inner"
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
          <div className="animate-slide-up max-w-6xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Knowledge Workspace</h2>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Operational
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden group border-slate-200">
                <div className="absolute -right-6 -top-6 p-6 bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                  <Database className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-slate-500 font-semibold mb-2">Total Memories</h3>
                <p className="text-5xl font-bold text-slate-900 tracking-tight">
                  {statsLoading ? "..." : stats.total_memories}
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Activity className="w-4 h-4" /> Live from ChromaDB
                </div>
              </div>

              <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden group border-slate-200">
                <div className="absolute -right-6 -top-6 p-6 bg-purple-50 rounded-full group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-12 h-12 text-[#8250f2]" />
                </div>
                <h3 className="text-slate-500 font-semibold mb-2">Queries Answered</h3>
                <p className="text-5xl font-bold text-slate-900 tracking-tight">
                  {statsLoading ? "..." : stats.recent_activity.length}
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                  <BrainCircuit className="w-4 h-4" /> 100% Local Privacy
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/30 to-orange-500/30 blur-3xl rounded-full"></div>
                <h3 className="text-slate-400 font-semibold mb-2 relative z-10 flex items-center justify-between">
                  AI Engine Status
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>ACTIVE</span>
                </h3>
                <p className="text-2xl font-bold mb-6 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  {amdStatus ? amdStatus.device : "AMD Ryzen AI"}
                </p>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-medium text-slate-400">Model</span>
                    <span className="text-sm font-bold bg-slate-800 px-2 py-1 rounded">Ollama Phi-3 Mini</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-medium text-slate-400">Cloud Calls</span>
                    <span className="text-sm font-bold bg-slate-800 px-2 py-1 rounded text-emerald-400">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Privacy</span>
                    <span className="text-sm font-bold bg-slate-800 px-2 py-1 rounded">{amdStatus ? amdStatus.privacy : "100% Local"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stream */}
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Usage</h3>
            <div className="glass-card rounded-3xl p-4 md:p-6 border-slate-200">
              {statsLoading ? (
                <div className="text-center text-slate-500 py-8">Loading activity...</div>
              ) : stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-100 last:border-0 group cursor-pointer">
                    <div className="flex items-start sm:items-center gap-4 mb-2 sm:mb-0">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {item.author[0]}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold group-hover:text-[#8250f2] transition-colors">{item.q}</p>
                        <p className="text-sm text-slate-500 font-medium">Asked by {item.author}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-400 whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full">{item.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">No recent queries. Ask a question to see it here!</div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default App

