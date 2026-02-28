import React from "react"
import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full px-6 py-2 text-center font-semibold transition-all duration-300",
        className
      )}
      {...props}>
      <div className="flex items-center gap-2 relative z-10">
        <div
          className="bg-[#212121] dark:bg-white h-2 w-2 rounded-full transition-transform duration-500 group-hover:scale-[100] group-data-[active=true]:scale-[100] origin-center relative z-0"></div>
        <span
          className="relative z-10 inline-block transition-colors duration-300 group-hover:text-white dark:group-hover:text-[#212121] group-data-[active=true]:text-white dark:group-data-[active=true]:text-[#212121]">
          {children}
        </span>
      </div>
    </button>
  );
}
