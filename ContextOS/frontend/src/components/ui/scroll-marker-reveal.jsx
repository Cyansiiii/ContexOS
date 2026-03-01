import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ScrollMarkerReveal({
    children,
    className,
    markerColor = "bg-purple-200 dark:bg-purple-900/60",
    delay = 0
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

    return (
        <span ref={ref} className={cn("relative inline-block", className)}>
            <motion.span
                className={cn("absolute -left-1 -right-1 bottom-[5%] top-[10%] z-0 rounded-[4px]", markerColor)}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay }}
            />
            <span className="relative z-10">{children}</span>
        </span>
    );
}
