import { motion } from "framer-motion";
export function LineShadowText({
    children,
    shadowColor = "var(--purple-600, #7c3aed)",
    className = "",
    ...props
}) {
    const content = typeof children === "string" ? children : null;

    if (!content) {
        throw new Error("LineShadowText only accepts string children");
    }

    return (
        <span
            className={`relative z-0 inline-block overflow-visible pb-[0.12em] ${className}`}
            data-text={content}
            {...props}
        >
            {content}
            <motion.span
                className="pointer-events-none absolute left-0 top-0 -z-10 text-transparent"
                style={{
                    WebkitTextStroke: `2px ${shadowColor}`,
                }}
                animate={{
                    x: [0, 5, 0],
                    y: [0, 4, 0]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut"
                }}
            >
                {content}
            </motion.span>
        </span>
    );
}
