import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TheRing } from "@/components/prologue/TheRing";
import { siteConfig } from "@/lib/content";

const GoldRing = lazy(() => import("@/components/prologue/GoldRing").then((m) => ({ default: m.GoldRing })));

const ease = [0.16, 1, 0.3, 1] as const;
// The Ring is seen at an angle, so its frame is wide: a 16:10 box that fits a phone.
const ringBox = "aspect-[16/10] w-[min(clamp(300px,62vh,560px),calc(100vw_-_2rem))]";

export function HeroSection() {
  const reduce = useReducedMotion();
  const [ignited, setIgnited] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const handleFail = useCallback(() => setWebglFailed(true), []);

  // The arrival: the Ring falls and settles, then its inscription catches fire.
  useEffect(() => {
    if (reduce) {
      setIgnited(true);
      return;
    }
    const timer = window.setTimeout(() => setIgnited(true), 1500);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1.4, delay, ease },
        };

  const fallback = (
    <div className={`${ringBox} flex items-center justify-center`}>
      <TheRing ignited={ignited} className="aspect-square h-full p-[8%] drop-shadow-[0_24px_40px_hsl(0_0%_0%/0.85)]" />
    </div>
  );

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24">
      {/* Firelight pooling in the smoke beneath the Ring */}
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] h-[40vh] w-[56vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,hsl(var(--fire-deep)/0.55),hsl(var(--fire-deep)/0.14)_55%,transparent)] blur-2xl transition-opacity duration-1000"
        style={{ opacity: ignited ? 1 : 0.2 }}
        aria-hidden="true"
      />

      <motion.div
        className="relative"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: -140, scale: 0.55 },
              animate: { opacity: 1, y: 0, scale: 1 },
              transition: { duration: 1.6, ease },
            })}
      >
        {webglFailed ? (
          fallback
        ) : (
          <Suspense fallback={<div className={ringBox} />}>
            <GoldRing ignited={ignited} onFail={handleFail} className={ringBox} />
          </Suspense>
        )}
      </motion.div>

      <div className="relative mt-4 text-center md:mt-6">
        <motion.h1
          {...rise(1.9)}
          className="font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold uppercase leading-[0.95] tracking-[0.06em]"
        >
          <span className="gilded">Hi, I'm Arnav</span>
        </motion.h1>
        <motion.div {...rise(2.25)} className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-5">
          <span className="gold-rule hidden flex-1 sm:block" aria-hidden="true" />
          <p className="credit whitespace-nowrap text-[0.62rem] tracking-[0.14em] text-bone sm:text-[0.72rem] sm:tracking-[0.24em] md:text-sm">
            {siteConfig.title}
          </p>
          <span className="gold-rule hidden flex-1 sm:block" aria-hidden="true" />
        </motion.div>
        <motion.div {...rise(2.55)} className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild variant="hero" size="xl">
            <Link to="/projects">
              View Projects
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="heroOutline" size="xl">
            <Link to="/contact">Contact Me</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
