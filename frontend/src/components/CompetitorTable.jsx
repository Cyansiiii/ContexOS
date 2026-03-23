import React from 'react'
import { Check, X, AlertTriangle } from 'lucide-react'

export default function CompetitorTable() {
  const comparisonData = [
    {
      feature: 'Data Privacy',
      contextOS: { type: 'check', text: 'Full offline' },
      notion: { type: 'warning', text: 'Partial' },
      confluence: { type: 'warning', text: 'Partial' },
      glean: { type: 'cross', text: 'Cloud only' },
    },
    {
      feature: 'Hardware Acceleration',
      contextOS: { type: 'check', text: 'Native' },
      notion: { type: 'cross', text: 'No' },
      confluence: { type: 'cross', text: 'No' },
      glean: { type: 'cross', text: 'No' },
    },
    {
      feature: 'DPDP Act Compliant',
      contextOS: { type: 'check', text: 'By design' },
      notion: { type: 'warning', text: 'Partial' },
      confluence: { type: 'warning', text: 'Partial' },
      glean: { type: 'warning', text: 'Partial' },
    },
    {
      feature: 'On-Device Inference',
      contextOS: { type: 'check', text: 'Always' },
      notion: { type: 'cross', text: 'Never' },
      confluence: { type: 'cross', text: 'Never' },
      glean: { type: 'cross', text: 'Never' },
    },
    {
      feature: 'Integration Sync',
      contextOS: { type: 'check', text: 'Automatic' },
      notion: { type: 'cross', text: 'Manual' },
      confluence: { type: 'cross', text: 'Manual' },
      glean: { type: 'check', text: 'Automatic' },
    },
    {
      feature: 'Recurring AI Costs',
      contextOS: { type: 'check', text: 'None' },
      notion: { type: 'cross', text: 'High' },
      confluence: { type: 'cross', text: 'High' },
      glean: { type: 'cross', text: 'High' },
    },
  ]

  const pricingData = [
    {
      feature: 'Cost (50 Users)',
      contextOS: { type: 'price', text: '₹19,999/mo' },
      notion: { type: 'price', text: '₹1,25,000/mo' },
      confluence: { type: 'price', text: '₹85,000/mo' },
      glean: { type: 'price', text: 'Custom Enterprise' },
    },
  ]

  const renderCell = (data, isContextOS = false) => {
    if (data.type === 'price') {
      return (
        <span className={`font-semibold ${isContextOS ? 'text-[#ED1C24] dark:text-rose-300' : 'text-slate-800 dark:text-slate-100'}`}>
          {data.text}
        </span>
      )
    }

    const baseClasses = 'flex items-center justify-center gap-2'

    if (isContextOS || data.type === 'check') {
      return (
        <div className={`${baseClasses} text-emerald-700 dark:text-emerald-300`}>
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{data.text}</span>
        </div>
      )
    }

    if (data.type === 'cross') {
      return (
        <div className={`${baseClasses} text-rose-600 dark:text-rose-400`}>
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">{data.text}</span>
        </div>
      )
    }

    if (data.type === 'warning') {
      return (
        <div className={`${baseClasses} text-amber-600 dark:text-amber-400`}>
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">{data.text}</span>
        </div>
      )
    }

    return null
  }

  const rows = [...comparisonData, ...pricingData]

  return (
    <div className="mx-auto my-16 w-full max-w-5xl px-4">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-['Syne'] text-[28px] font-bold text-slate-900 dark:text-white">How We Compare</h2>
        <p className="mx-auto max-w-2xl text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
          Unlike legacy cloud tools, ContextOS runs on your own hardware, ensuring complete privacy and zero recurring AI cloud costs.
        </p>
      </div>

      <div className="mb-8 w-full overflow-x-auto rounded-[20px] border border-slate-200 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hide-scrollbar dark:border-white/10 dark:bg-[#0f1520] dark:shadow-none">
        <div className="min-w-[800px]">
          <div className="flex h-[60px] border-b border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-[#161e2d]">
            <div className="sticky left-0 z-10 flex w-[200px] shrink-0 items-center border-r border-slate-200 bg-slate-50 px-6 text-sm font-bold text-slate-900 dark:border-white/5 dark:bg-[#161e2d] dark:text-white">
              Feature
            </div>
            <div className="relative flex min-w-[160px] flex-1 flex-col items-center justify-center border-r border-slate-200 bg-rose-50 dark:border-white/5 dark:bg-[#ED1C24]/10">
              <span className="absolute top-1 rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ED1C24] dark:bg-[#ED1C24]/10 dark:text-rose-300">
                You
              </span>
              <span className="mt-3 text-sm font-bold text-[#ED1C24] dark:text-rose-300">ContextOS</span>
            </div>
            <div className="flex min-w-[160px] flex-1 items-center justify-center border-r border-slate-200 text-sm font-bold text-slate-500 dark:border-white/5 dark:text-slate-400">
              Notion AI
            </div>
            <div className="flex min-w-[160px] flex-1 items-center justify-center border-r border-slate-200 text-sm font-bold text-slate-500 dark:border-white/5 dark:text-slate-400">
              Confluence
            </div>
            <div className="flex min-w-[160px] flex-1 items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400">
              Glean
            </div>
          </div>

          {rows.map((row, index) => {
            const isPricing = index === comparisonData.length
            return (
              <div
                key={row.feature}
                className={`flex h-[48px] transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] ${index < rows.length - 1 ? 'border-b border-slate-200 dark:border-white/5' : ''} ${isPricing ? 'bg-slate-50/70 dark:bg-white/[0.01]' : ''}`}
              >
                <div className="sticky left-0 z-10 flex w-[200px] shrink-0 items-center border-r border-slate-200 bg-white px-6 text-[14px] text-slate-800 dark:border-white/5 dark:bg-[#0f1520] dark:text-white">
                  {row.feature}
                </div>
                <div className="flex min-w-[160px] flex-1 items-center justify-center border-r border-slate-200 bg-rose-50/80 dark:border-white/5 dark:bg-[#ED1C24]/5">
                  {renderCell(row.contextOS, true)}
                </div>
                <div className="flex min-w-[160px] flex-1 items-center justify-center border-r border-slate-200 dark:border-white/5">
                  {renderCell(row.notion)}
                </div>
                <div className="flex min-w-[160px] flex-1 items-center justify-center border-r border-slate-200 dark:border-white/5">
                  {renderCell(row.confluence)}
                </div>
                <div className="flex min-w-[160px] flex-1 items-center justify-center">
                  {renderCell(row.glean)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-[22px] border border-[#ED1C24]/20 bg-gradient-to-br from-rose-50 via-white to-emerald-50 p-5 text-center shadow-[0_16px_40px_rgba(237,28,36,0.1)] font-['DM_Sans'] md:p-6 dark:border-[#ED1C24]/20 dark:bg-[linear-gradient(135deg,rgba(237,28,36,0.12),rgba(15,23,42,0.92))] dark:shadow-none">
        <p className="mb-3 text-[14px] leading-relaxed text-slate-700 dark:text-slate-100">
          At 50 users, ContextOS costs ₹19,999/month.
          <br className="hidden sm:block" />
          Notion AI costs ₹1,25,000/month for the same team.
        </p>
        <p className="flex flex-col items-center justify-center gap-2 text-[14px] text-slate-800 dark:text-white sm:flex-row">
          <span>That is</span>
          <span className="text-[24px] font-bold tracking-tight text-emerald-700 dark:text-emerald-300">₹1,05,001</span>
          <span>saved every month.</span>
        </p>
      </div>
    </div>
  )
}
