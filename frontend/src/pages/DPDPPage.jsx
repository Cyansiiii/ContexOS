import {
  ArrowLeft, ArrowUpRight, Check, Shield, Scale, Target, MapPin, Lock, FileCheck2, Database
} from 'lucide-react'

export default function DPDPPage({ setActiveTab }) {
  const goBack = () => setActiveTab ? setActiveTab('search') : (window.location.hash = '')

  const principles = [
    {
      icon: MapPin,
      title: 'Data localisation',
      description: 'All company knowledge stays on local hardware. No automatic routing to foreign inference or storage vendors.',
    },
    {
      icon: Shield,
      title: 'No third-party processing',
      description: 'ContextOS uses local models and local retrieval. Your data is not forwarded to OpenAI, Google, Anthropic, or external copilots.',
    },
    {
      icon: Scale,
      title: 'Operational control',
      description: 'Your team controls retention, deletion, and access inside your own environment instead of depending on a vendor-side policy promise.',
    },
    {
      icon: Target,
      title: 'Purpose limitation',
      description: 'Workspace data is used to answer your internal questions, not to train public models or build advertising and analytics profiles.',
    },
  ]

  const comparisonRows = [
    { feature: 'Data leaves India', us: 'Never by default', them: 'Often vendor-dependent' },
    { feature: 'Third-party processing', us: 'None', them: 'OpenAI / Google / Microsoft / partner stack' },
    { feature: 'Cross-border DPDP risk', us: 'Low', them: 'Elevated' },
    { feature: 'Consent complexity', us: 'Reduced local exposure', them: 'Higher compliance overhead' },
    { feature: 'Penalty exposure', us: 'Reduced operational surface', them: 'Higher governance dependency' },
    { feature: 'Audit visibility', us: 'Local control', them: 'Vendor dependent' },
  ]

  const highlights = [
    'Local inference stack by default',
    'No vendor-side memory retention',
    'Deletion and access remain under your control',
    'Better fit for internal compliance reviews',
  ]

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fffc,rgba(236,253,245,0.85))] text-slate-800 font-['DM_Sans'] pt-24 pb-20 selection:bg-emerald-200 dark:bg-[linear-gradient(180deg,#071019,#0b1220)] dark:text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_65%)] dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_65%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={goBack}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to ContextOS
        </button>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-none md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Check className="h-4 w-4" />
                DPDP Act 2023 ready
              </div>

              <h1 className="mt-6 max-w-3xl font-['Syne'] text-4xl font-black leading-tight tracking-[-0.05em] text-slate-900 dark:text-white md:text-6xl">
                Privacy architecture built for India’s data protection reality.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                ContextOS reduces DPDP risk through local-first architecture. The core idea is simple: sensitive company knowledge should stay inside your environment, under your control.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Primary posture</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Local first</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Cloud exposure</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-300">Minimal</div>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Control model</div>
                  <div className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Self governed</div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              {principles.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
                </div>
              ))}
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none md:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Compliance comparison</div>
                  <h2 className="mt-2 font-['Syne'] text-3xl font-black tracking-[-0.04em] text-slate-900 dark:text-white">
                    Local architecture vs cloud AI tooling
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <FileCheck2 className="h-4 w-4" />
                  Review ready
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-[24px] border border-slate-200 dark:border-slate-800">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300">Feature</th>
                      <th className="border-x border-slate-200 bg-emerald-50 p-5 font-bold text-emerald-700 dark:border-slate-800 dark:bg-emerald-500/10 dark:text-emerald-300">ContextOS</th>
                      <th className="p-5 font-bold text-slate-500 dark:text-slate-400">Cloud AI tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {comparisonRows.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/60 dark:bg-slate-900/50'}>
                        <td className="p-5 font-medium text-slate-700 dark:text-slate-300">{row.feature}</td>
                        <td className="border-x border-slate-200 bg-emerald-50/60 p-5 font-bold text-emerald-700 dark:border-slate-800 dark:bg-emerald-500/5 dark:text-emerald-300">{row.us}</td>
                        <td className="p-5 text-amber-700 dark:text-amber-300">{row.them}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 p-8 shadow-[0_20px_50px_rgba(16,185,129,0.12)] dark:border-emerald-500/20 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(15,23,42,0.92))] dark:shadow-none">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Show this to compliance, legal, and IT security together.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">
                The strongest argument is architectural, not marketing language. If data does not leave your environment by default, the compliance surface is materially smaller.
              </p>
              <a
                href="https://github.com/Cyansiiii/ContextOS/blob/main/DEPLOYMENT.md"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Open compliance brief
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-6 text-[11px] leading-6 text-slate-500 dark:text-slate-400">
                Informational summary only. Formal DPDP interpretation should always be reviewed by legal counsel.
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">Why this page matters</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Most AI tools ask legal teams to trust policy documents. ContextOS reduces the need for trust by keeping inference and memory close to the data source.
              </p>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Key review points</div>
              <div className="mt-4 space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                <Database className="h-4 w-4 text-emerald-500" />
                Practical framing
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                DPDP compliance is broader than infrastructure alone, but local-first system design significantly lowers data-transfer and vendor-processing exposure.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
