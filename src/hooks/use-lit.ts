import { useEffect, useRef, useState } from "react";

/**
 * Vault lighting: a case is dark until it enters view, then its light
 * cuts on (no fade) and stays on. Reduced motion starts every case lit.
 */
export function useLit<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setLit(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, lit };
}
