"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/ui/animated-list"
import { Database, Video, FileText, BrainCircuit } from "lucide-react"

let notifications = [
    { n: 'Figma Project', d: 'Working on UI components', s: 'Completed', c: 'text-emerald-500 bg-emerald-50 border-emerald-100', ic: 'bg-blue-50 text-blue-600', i: <Database className="w-4 h-4" /> },
    { n: 'Zoom Client Meeting', d: 'Client Onboarding Flow', s: 'Upcoming', c: 'text-pink-500 bg-pink-50 border-pink-100', ic: 'bg-indigo-50 text-indigo-600', i: <Video className="w-4 h-4" /> },
    { n: 'English Session', d: 'Weekly speaking training', s: 'In progress', c: 'text-orange-500 bg-orange-50 border-orange-100', ic: 'bg-amber-50 text-amber-600', i: <FileText className="w-4 h-4" /> },
    { n: 'Behance Case Study', d: 'Preparing project visuals', s: 'Upcoming', c: 'text-pink-500 bg-pink-50 border-pink-100', ic: 'bg-blue-600 text-white', i: <BrainCircuit className="w-4 h-4" /> },
]

notifications = Array.from({ length: 5 }, () => notifications).flat()

const Notification = ({ n, d, s, c, ic, i }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto w-full cursor-pointer overflow-hidden p-3 rounded-2xl bg-white dark:bg-[#1a1c22]/50 shadow-sm shadow-slate-200/50 dark:shadow-none border border-transparent dark:border-white/10 hover:border-slate-100 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[102%]",
                // dark styles
                "transform-gpu dark:backdrop-blur-md"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${ic}`}>
                        {i}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200 leading-tight">{n}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{d}</p>
                    </div>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${c}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    {s}
                </span>
            </div>
        </figure>
    )
}

export function AnimatedListDemo({
    className,
}) {
    return (
        <div
            className={cn(
                "relative flex h-[400px] w-full flex-col overflow-hidden",
                className
            )}
        >
            <AnimatedList>
                {notifications.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>

            <div className="from-slate-50 dark:from-[#0f1115] pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t to-transparent"></div>
        </div>
    )
}
