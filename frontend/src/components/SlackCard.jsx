import { useMemo, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, CheckCircle2, Loader2, Lock, MessageSquare } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATES = {
  DISCONNECTED: 'disconnected',
  CONFIGURE: 'configure',
  SYNCING: 'syncing',
  RESULT: 'result',
}

export default function SlackCard() {
  const [state, setState] = useState(STATES.DISCONNECTED)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    bot_token: '',
    channel_id: '',
    channel_name: '',
  })

  const isReady = useMemo(
    () => form.bot_token.trim() && form.channel_id.trim() && form.channel_name.trim(),
    [form]
  )

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  const handleSync = async () => {
    setState(STATES.SYNCING)
    setError('')
    setResult(null)

    try {
      const { data } = await axios.post(`${API}/slack/sync`, form)
      setResult(data)
      setState(STATES.RESULT)
    } catch (err) {
      setError(err.response?.data?.detail || 'Slack sync failed. Check the connector settings and try again.')
      setState(STATES.CONFIGURE)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#4A154B]/15 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-[#4A154B]/25 dark:bg-slate-950 dark:shadow-none">
      <div className="absolute -right-14 -top-10 h-32 w-32 rounded-full bg-[#4A154B]/8 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4A154B]/10 text-[#4A154B] dark:text-[#E01E5A]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Slack</h3>
                <span className="rounded-full border border-[#ED1C24]/20 bg-[#ED1C24]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ED1C24]">
                  Beta
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Local Slack channel sync for announcements and decisions
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            {state === STATES.SYNCING ? 'Syncing' : state === STATES.RESULT ? 'Configured' : state === STATES.CONFIGURE ? 'Configure' : 'Disconnected'}
          </span>
        </div>

        {state === STATES.DISCONNECTED ? (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Connect a Slack bot token and a target channel to pull selected workspace knowledge into ContextOS without sending it to external AI APIs.
            </p>
            <button
              type="button"
              onClick={() => setState(STATES.CONFIGURE)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6fca49] to-[#2f8b45] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(52,138,67,0.22)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_34px_rgba(52,138,67,0.28)]"
            >
              <MessageSquare className="h-4 w-4" />
              Connect Slack
            </button>
          </div>
        ) : null}

        {state === STATES.CONFIGURE ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Bot Token</span>
              <input
                type="password"
                value={form.bot_token}
                onChange={(event) => handleChange('bot_token', event.target.value)}
                placeholder="xoxb-..."
                className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Channel ID</span>
              <input
                type="text"
                value={form.channel_id}
                onChange={(event) => handleChange('channel_id', event.target.value)}
                placeholder="C0123456789"
                className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Channel Name</span>
              <input
                type="text"
                value={form.channel_name}
                onChange={(event) => handleChange('channel_name', event.target.value)}
                placeholder="eng-updates"
                className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              Slack content stays in the local ContextOS pipeline. Use a restricted bot token for demo-time channel sync.
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!isReady}
              onClick={handleSync}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6fca49] to-[#2f8b45] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(52,138,67,0.22)] transition-all hover:scale-[1.01] hover:shadow-[0_20px_34px_rgba(52,138,67,0.28)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sync Slack
            </button>
          </div>
        ) : null}

        {state === STATES.SYNCING ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              Syncing Slack channel into local memory...
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#6fca49] via-[#2f8b45] to-[#6EE7C3]" />
            </div>
          </div>
        ) : null}

        {state === STATES.RESULT && result ? (
          <div className="space-y-4">
            <div className={`flex items-start gap-3 rounded-2xl px-4 py-4 text-sm ${
              result.status === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300'
            }`}>
              {result.status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
              <div>
                <div className="font-bold">{result.message}</div>
                <div className="mt-1 text-xs opacity-80">
                  Channel: {result.channel_name || form.channel_name} · Synced: {result.channels_synced}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setState(STATES.CONFIGURE)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Update Settings
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
