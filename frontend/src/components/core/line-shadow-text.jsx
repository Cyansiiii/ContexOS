import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
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
            className={`relative z-0 inline-flex ${className}`}
            data-text={content}
            {...props}
        >
            {content}
            <motion.span
                className="absolute top-0 left-0 -z-10 text-transparent pointer-events-none"
                style={{
                    WebkitTextStroke: `2px ${shadowColor}`,
                }}
                animate={{
                    x: [0, 4, 0],
                    y: [0, 4, 0]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                }}
            >
                {content}
            </motion.span>
        </span>
    );
}
