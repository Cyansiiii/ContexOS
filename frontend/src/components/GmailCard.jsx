/**
 * GmailCard.jsx — Gmail integration card for the Add Memory Hub.
 *
 * State Machine:
 *   DISCONNECTED → CONNECTING → CONNECTED_IDLE → SYNCING
 *
 * Interactions:
 *   - Connect Gmail → opens OAuth in new tab, polls /gmail/status
 *   - Sync Now → POST /gmail/sync → shows result toast
 *   - Handles token_expired, ollama_offline errors gracefully
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { Mail, CheckCircle2, AlertTriangle, Loader2, RefreshCw } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Gmail "G" logo as inline SVG
const GmailIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6L12 13L2 6V4L12 11L22 4V6Z" fill="#EA4335" />
    <path d="M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6L12 13L22 6Z" fill="#EA4335" opacity="0.3" />
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#EA4335" strokeWidth="1.5" fill="none" />
  </svg>
)

const STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED_IDLE: 'connected_idle',
  SYNCING: 'syncing',
}

export default function GmailCard() {
  const [state, setState] = useState(STATES.DISCONNECTED)
  const [lastSync, setLastSync] = useState(null)
  const [emailCount, setEmailCount] = useState(0)
  const [toast, setToast] = useState(null) // { type: 'success'|'error', message }
  const [syncResult, setSyncResult] = useState(null)
  const pollRef = useRef(null)
  const toastTimeout = useRef(null)

  // ─── Check initial status on mount ──────────────────────────────
  useEffect(() => {
    checkStatus()
  }, [])

  // ─── Auto-detect ?gmail=connected in URL ────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('gmail') === 'connected') {
      setState(STATES.CONNECTED_IDLE)
      checkStatus()
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // ─── Toast auto-dismiss ─────────────────────────────────────────
  useEffect(() => {
    if (toast) {
      toastTimeout.current = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(toastTimeout.current)
    }
  }, [toast])

  // ─── Cleanup polling on unmount ─────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const checkStatus = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/gmail/status`)
      if (data.connected) {
        setState(STATES.CONNECTED_IDLE)
        setLastSync(data.last_sync)
        setEmailCount(data.email_count)
      }
    } catch {
      // Ignore — backend may be down
    }
  }, [])

  // ─── Connect Gmail ──────────────────────────────────────────────
  const handleConnect = async () => {
    setState(STATES.CONNECTING)
    try {
      const { data } = await axios.get(`${API}/gmail/connect`)

      if (data.status === 'already_connected') {
        setState(STATES.CONNECTED_IDLE)
        checkStatus()
        return
      }

      // Open Google OAuth in new tab
      window.open(data.auth_url, '_blank')

      // Poll /gmail/status every 2s for up to 60s
      let elapsed = 0
      pollRef.current = setInterval(async () => {
        elapsed += 2
        if (elapsed > 60) {
          clearInterval(pollRef.current)
          pollRef.current = null
          setState(STATES.DISCONNECTED)
          showToast('error', 'Connection timed out. Try again.')
          return
        }
        try {
          const res = await axios.get(`${API}/gmail/status`)
          if (res.data.connected) {
            clearInterval(pollRef.current)
            pollRef.current = null
            setState(STATES.CONNECTED_IDLE)
            setLastSync(res.data.last_sync)
            setEmailCount(res.data.email_count)
            showToast('success', 'Gmail connected successfully!')
          }
        } catch {
          // Ignore polling errors
        }
      }, 2000)
    } catch {
      setState(STATES.DISCONNECTED)
      showToast('error', 'Failed to start Gmail connection.')
    }
  }

  // ─── Sync Now ───────────────────────────────────────────────────
  const handleSync = async () => {
    setState(STATES.SYNCING)
    setSyncResult(null)
    try {
      const { data } = await axios.post(`${API}/gmail/sync`, { max_emails: 75 })

      if (data.error === 'token_expired') {
        setState(STATES.DISCONNECTED)
        showToast('error', 'Session expired. Reconnect Gmail.')
        return
      }
      if (data.error === 'ollama_offline') {
        setState(STATES.CONNECTED_IDLE)
        showToast('error', 'Ollama is not running. Start Ollama and try again.')
        return
      }

      setSyncResult(data)
      setState(STATES.CONNECTED_IDLE)
      setLastSync(new Date().toISOString())
      setEmailCount(prev => prev + (data.synced || 0))
      showToast('success', data.message || `Synced ${data.synced} emails from Gmail`)
    } catch (err) {
      setState(STATES.CONNECTED_IDLE)
      const detail = err.response?.data?.detail
      if (typeof detail === 'object' && detail?.error === 'ollama_offline') {
        showToast('error', 'Ollama is not running. Start Ollama and try again.')
      } else if (typeof detail === 'object' && detail?.error === 'quota_exceeded') {
        showToast('error', 'Gmail API quota exceeded. Try again later.')
      } else {
        showToast('error', 'Sync failed. Check backend logs.')
      }
    }
  }

  const showToast = (type, message) => {
    setToast({ type, message })
  }

  const formatTime = (iso) => {
    if (!iso) return 'Never'
    try {
      const d = new Date(iso)
      return d.toLocaleString('en-IN', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="relative group">
      {/* Card */}
      <div className="
        relative overflow-hidden rounded-2xl p-6
        bg-white/[0.03] dark:bg-white/[0.05]
        backdrop-blur-xl
        border border-[rgba(110,231,195,0.15)]
        transition-all duration-300
        hover:border-[rgba(110,231,195,0.3)]
        hover:shadow-[0_0_30px_rgba(110,231,195,0.06)]
      ">
        {/* Subtle glow in connected state */}
        {state === STATES.CONNECTED_IDLE && (
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#6EE7C3]/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Header row */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`
              w-11 h-11 rounded-xl flex items-center justify-center
              transition-all duration-300
              ${state === STATES.CONNECTED_IDLE || state === STATES.SYNCING
                ? 'bg-[#6EE7C3]/10 shadow-[0_0_12px_rgba(110,231,195,0.15)]'
                : 'bg-white/5'
              }
            `}>
              <GmailIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-['DM_Sans'] tracking-tight">
                Gmail
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {state === STATES.CONNECTED_IDLE || state === STATES.SYNCING ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-[#6EE7C3] shadow-[0_0_6px_#6EE7C3]" />
                    <span className="text-xs font-medium text-[#6EE7C3]">Connected</span>
                  </>
                ) : state === STATES.CONNECTING ? (
                  <>
                    <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                    <span className="text-xs font-medium text-amber-400">Connecting…</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-xs font-medium text-slate-500">Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Email count badge */}
          {emailCount > 0 && (state === STATES.CONNECTED_IDLE || state === STATES.SYNCING) && (
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
              {emailCount} emails
            </div>
          )}
        </div>

        {/* Body — changes per state */}
        <div className="relative z-10">

          {/* DISCONNECTED */}
          {state === STATES.DISCONNECTED && (
            <button
              onClick={handleConnect}
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-[#EA4335]/80 to-[#EA4335]
                hover:from-[#EA4335] hover:to-[#d33426]
                text-white font-bold text-sm
                transition-all duration-300
                flex items-center justify-center gap-2
                shadow-lg shadow-[#EA4335]/10
                hover:shadow-[#EA4335]/20
              "
            >
              <Mail className="w-4 h-4" />
              Connect Gmail
            </button>
          )}

          {/* CONNECTING */}
          {state === STATES.CONNECTING && (
            <div className="flex items-center justify-center gap-3 py-3 text-sm font-medium text-amber-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              Opening Google sign-in…
            </div>
          )}

          {/* CONNECTED_IDLE */}
          {state === STATES.CONNECTED_IDLE && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Last sync: {formatTime(lastSync)}</span>
              </div>
              <button
                onClick={handleSync}
                className="
                  w-full py-3 rounded-xl
                  bg-gradient-to-r from-[#6EE7C3]/20 to-[#6EE7C3]/10
                  hover:from-[#6EE7C3]/30 hover:to-[#6EE7C3]/20
                  border border-[#6EE7C3]/20
                  hover:border-[#6EE7C3]/40
                  text-[#6EE7C3] font-bold text-sm
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </button>
            </div>
          )}

          {/* SYNCING */}
          {state === STATES.SYNCING && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Loader2 className="w-4 h-4 animate-spin text-[#6EE7C3]" />
                Syncing emails… (fetching)
              </div>
              {/* Animated progress bar */}
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full animate-gmail-progress"
                  style={{
                    background: 'linear-gradient(90deg, #ED1C24, #6EE7C3)',
                    width: '70%',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sync result summary */}
        {syncResult && state === STATES.CONNECTED_IDLE && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 relative z-10">
            <span className="text-[#6EE7C3] font-bold">{syncResult.synced}</span> synced
            · <span className="text-slate-500 font-bold">{syncResult.skipped}</span> skipped
            · <span className="font-bold">{syncResult.total_chunks}</span> chunks
          </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`
          absolute -bottom-14 left-0 right-0 mx-auto w-[95%]
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          text-xs font-bold shadow-2xl
          animate-slide-up
          transition-all duration-300 z-50
          ${toast.type === 'success'
            ? 'bg-[#6EE7C3]/10 border border-[#6EE7C3]/20 text-[#6EE7C3]'
            : 'bg-[#ED1C24]/10 border border-[#ED1C24]/20 text-[#ED1C24]'
          }
        `}>
          {toast.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertTriangle className="w-4 h-4 shrink-0" />
          }
          <span className="truncate">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
