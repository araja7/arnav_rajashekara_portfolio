import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  centered?: boolean;
  className?: string;
}

/** A title card: gold capitals out of the dark, a ring between two rules. */
export function SectionHeading({ title, subtitle, as: Tag = "h2", centered = true, className }: SectionHeadingProps) {
  const isPage = Tag === "h1";
  const reduce = useReducedMotion();
  const MotionTag = Tag === "h1" ? motion.h1 : motion.h2;
  const rise = reduce
    ? {}
    : isPage
      ? {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.2, ease },
        }
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-10% 0px" },
          transition: { duration: 1.1, ease },
        };

  return (
    <header className={cn(isPage ? "mb-16 md:mb-24" : "mb-10 md:mb-14", centered && "text-center", className)}>
      <MotionTag
        {...rise}
        className={cn(
          "gilded font-semibold uppercase leading-[0.98] tracking-[0.06em]",
          isPage ? "text-[clamp(2.5rem,7vw,5.5rem)]" : "text-[clamp(1.8rem,4vw,2.9rem)]"
        )}
      >
        {title}
      </MotionTag>
      <div className={cn("mt-6 flex items-center gap-3", centered && "justify-center")} aria-hidden="true">
        <span className={cn("gold-rule w-16 md:w-28", !centered && "hidden")} />
        <span className="h-2.5 w-2.5 rounded-full shadow-[inset_0_0_0_1.5px_hsl(var(--gold))]" />
        <span className="gold-rule w-16 md:w-28" />
      </div>
      {subtitle && (
        <p
          className={cn(
            "mt-6 max-w-2xl text-lg md:text-xl font-light italic leading-relaxed text-bone-dim",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
