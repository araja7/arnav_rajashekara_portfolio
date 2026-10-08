import { useId } from "react";
import { cn } from "@/lib/utils";

interface TheRingProps {
  /** The inscription burns into view as a sweep around the band. */
  ignited?: boolean;
  className?: string;
}

const c = (token: string, alpha?: number) =>
  alpha === undefined ? `hsl(var(--${token}))` : `hsl(var(--${token}) / ${alpha})`;

/** One continuous flowing line around the band: invented line work, not a real script. */
const INSCRIPTION = (() => {
  const points: string[] = [];
  const steps = 900;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = 67 + 2.6 * Math.sin(t * 41) * (0.55 + 0.45 * Math.sin(t * 7 + 1.3)) + 0.9 * Math.sin(t * 97);
    points.push(`${(100 + r * Math.sin(t)).toFixed(2)},${(100 - r * Math.cos(t)).toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
})();

/**
 * The Ring as flat vector line work. Used small (nav, contact) and as the fallback
 * when the rendered GoldRing can't run.
 */
export function TheRing({ ignited = false, className }: TheRingProps) {
  const id = useId().replace(/:/g, "");
  const band = `band-${id}`;
  const blur = `blur-${id}`;

  return (
    <svg viewBox="0 0 200 200" className={cn("overflow-visible", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={band} x1="0.15" y1="0.05" x2="0.85" y2="0.95">
          <stop offset="0%" style={{ stopColor: c("gold-bright") }} />
          <stop offset="35%" style={{ stopColor: c("gold") }} />
          <stop offset="62%" style={{ stopColor: "hsl(40 50% 20%)" }} />
          <stop offset="85%" style={{ stopColor: c("gold") }} />
          <stop offset="100%" style={{ stopColor: "hsl(40 50% 16%)" }} />
        </linearGradient>
        <filter id={blur} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <path
        fillRule="evenodd"
        d="M100 26 a74 74 0 1 1 0 148 a74 74 0 1 1 0 -148 Z M100 40 a60 60 0 1 0 0 120 a60 60 0 1 0 0 -120 Z"
        fill={`url(#${band})`}
      />
      <path d="M44 66 A64 64 0 0 1 116 30" fill="none" style={{ stroke: "hsl(46 95% 92% / 0.8)" }} strokeWidth="1.8" strokeLinecap="round" />

      <g
        style={{
          opacity: ignited ? 1 : 0,
          strokeDasharray: 1600,
          strokeDashoffset: ignited ? 0 : 1600,
          transition: "stroke-dashoffset 1300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease-out",
        }}
      >
        <path d={INSCRIPTION} fill="none" style={{ stroke: c("fire") }} strokeWidth="2.6" filter={`url(#${blur})`} />
        <path d={INSCRIPTION} fill="none" style={{ stroke: "hsl(28 100% 74%)" }} strokeWidth="0.9" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
