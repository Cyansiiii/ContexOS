import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const ERROR_CONFIGS = {
  OLLAMA_OFFLINE: { emoji: '🔴', title: 'AI Engine Offline', cmdHint: 'ollama serve' },
  CHROMADB_EMPTY: { emoji: '📭', title: 'No Memories Yet', cmdHint: null },
  GMAIL_TOKEN_EXPIRED: { emoji: '🔑', title: 'Gmail Session Expired', cmdHint: null },
  EMBEDDING_FAILED: { emoji: '⚠️', title: 'Embedding Failed', cmdHint: 'ollama serve' },
  CHROMADB_ERROR: { emoji: '💾', title: 'Database Error', cmdHint: null },
  OLLAMA_NO_MODEL: { emoji: '📦', title: 'Model Not Found', cmdHint: 'ollama pull phi3:mini' },
}

export default function ErrorCard({ error_code, user_message, recovery_action, onRetry, onDismiss, onNavigate }) {
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); onDismiss?.(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onDismiss])

  const config = ERROR_CONFIGS[error_code] || { emoji: '⚠️', title: 'Something Went Wrong', cmdHint: null }

  return (
    <div className="animate-slide-up relative overflow-hidden bg-[#ED1C24]/[0.04] border border-[#ED1C24]/20 rounded-2xl p-5 mb-4">
      {/* Auto-dismiss countdown bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-[#ED1C24]/40 transition-all duration-1000 ease-linear"
        style={{ width: `${(countdown / 8) * 100}%` }}
      />

      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">{config.emoji}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{config.title}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{user_message}</p>

          {config.cmdHint && (
            <div className="mt-3 bg-[#1a1a1a] rounded-lg px-3 py-2 font-mono text-xs text-[#ED1C24]">
              $ {config.cmdHint}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            {recovery_action === 'add_memory' ? (
              <button
                onClick={() => onNavigate?.('upload')}
                className="px-4 py-2 rounded-lg bg-[#ED1C24] text-white text-xs font-bold hover:bg-[#d41920] transition-colors min-h-[36px]"
              >
                Add your first memory →
              </button>
            ) : recovery_action === 'reconnect_gmail' ? (
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-lg bg-[#ED1C24] text-white text-xs font-bold hover:bg-[#d41920] transition-colors min-h-[36px]"
              >
                Reconnect Gmail
              </button>
            ) : (
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-lg bg-[#ED1C24] text-white text-xs font-bold hover:bg-[#d41920] transition-colors min-h-[36px]"
              >
                {recovery_action === 'start_ollama' ? 'Retry' : 'Try Again'}
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[36px]"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button onClick={onDismiss} className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
