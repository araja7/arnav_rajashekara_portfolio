import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { r1, smooth } from "@/lib/drawing";
import { H, W, type Ink } from "./plate";


const c = (token: string, alpha?: number) =>
  alpha === undefined ? `hsl(var(--${token}))` : `hsl(var(--${token}) / ${alpha})`;

const voidFill: CSSProperties = { fill: c("void") };

interface EtchingProps {
  /** The scene is dark until it enters view; then the gold rises and the fires catch. */
  lit: boolean;
  /** Animations run only while the plate is on screen. */
  playing: boolean;
  /** Where the scene's own fire sits; the gold is brightest there. */
  light: { x: number; y: number; r: number };
  children: (ink: Ink) => ReactNode;
}

/** A plate of gold line work engraved into the void, lit by its own fire. */
export function Etching({ lit, playing, light, children }: EtchingProps) {
  const uid = useId().replace(/:/g, "");
  const svg = useRef<SVGSVGElement>(null);
  // SMIL motion (the seeing-stone's tracked point) ignores CSS play state, so it is paused here.
  useEffect(() => {
    if (playing) svg.current?.unpauseAnimations();
    else svg.current?.pauseAnimations();
  }, [playing]);
  const ink: Ink = {
    gold: `etch-gold-${uid}`,
    pool: `etch-pool-${uid}`,
    flame: `etch-flame-${uid}`,
    bloom: `etch-bloom-${uid}`,
  };

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="etching absolute inset-0 h-full w-full"
      data-lit={lit || undefined}
      data-playing={playing || undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={ink.gold} gradientUnits="userSpaceOnUse" cx={light.x} cy={light.y} r={light.r}>
          <stop offset="0%" style={{ stopColor: c("gilt-pale") }} />
          <stop offset="14%" style={{ stopColor: c("gold-bright") }} />
          <stop offset="38%" style={{ stopColor: c("gold") }} />
          <stop offset="68%" style={{ stopColor: c("gold-dim") }} />
          <stop offset="100%" style={{ stopColor: "hsl(38 38% 15%)" }} />
        </radialGradient>
        <radialGradient id={ink.pool}>
          <stop offset="0%" style={{ stopColor: c("fire", 0.55) }} />
          <stop offset="35%" style={{ stopColor: c("fire-deep", 0.32) }} />
          <stop offset="100%" style={{ stopColor: c("fire-deep", 0) }} />
        </radialGradient>
        <linearGradient id={ink.flame} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" style={{ stopColor: "hsl(var(--fire-white))" }} />
          <stop offset="35%" style={{ stopColor: "hsl(var(--fire-core))" }} />
          <stop offset="75%" style={{ stopColor: c("fire") }} />
          <stop offset="100%" style={{ stopColor: c("fire-deep") }} />
        </linearGradient>
        <filter id={ink.bloom} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      {children(ink)}
    </svg>
  );
}

/** Line work drawn with the scene's fire-lit gold. */
export function Lines({ d, ink, width = 1, opacity, dash }: { d: string; ink: Ink; width?: number; opacity?: number; dash?: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={`url(#${ink.gold})`}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
}

/** A filled shape that hides whatever was drawn behind it. */
export function Knock({ d }: { d: string }) {
  return <path d={d} style={voidFill} />;
}

/** A pool of firelight. It warms up as the scene lights and swells while the visitor attends. */
export function Pool({ x, y, rx, ry, ink, delay = 0 }: { x: number; y: number; rx: number; ry: number; ink: Ink; delay?: number }) {
  return (
    <ellipse
      className="etch-pool"
      cx={x}
      cy={y}
      rx={rx}
      ry={ry}
      fill={`url(#${ink.pool})`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    />
  );
}

/** One tongue of flame rooted at the origin and one unit tall: a narrow S that bends toward its tip. */
const tongue = (w: number, lean: number) => {
  const n = (v: number) => +v.toFixed(3);
  return `M${n(-w / 2)},0C${n(-w / 2)},-.42 ${n(lean - w * 0.2)},-.66 ${n(lean)},-1C${n(lean + w * 0.04)},-.62 ${n(w / 2)},-.42 ${n(w / 2)},0Q0,${n(w * 0.7)} ${n(-w / 2)},0Z`;
};

/** A fire is a cluster of tongues, each flickering on its own: [x offset, height, width, lean]. */
const TONGUES: [number, number, number, number][] = [
  [0, 1, 0.42, 0.05],
  [-0.15, 0.7, 0.32, -0.13],
  [0.16, 0.78, 0.3, 0.11],
  [-0.27, 0.42, 0.24, -0.2],
  [0.28, 0.38, 0.22, 0.2],
];

/** Sparks lifting off a fire: [x offset, rise, drift, delay]. */
const SPARKS: [number, number, number, number][] = [
  [-0.1, 1.9, -0.3, 0],
  [0.12, 2.3, 0.25, 900],
  [0.02, 1.6, 0.1, 1700],
  [-0.2, 2.1, -0.15, 2400],
];

/**
 * A fire that catches when the scene lights, after `delay` ms. It is three nested
 * moves: catching (grows from its root), flaring (when the visitor attends) and
 * flickering (each tongue on its own, always, while on screen), so the transforms never fight.
 */
export function Flame({ x, y, size, ink, delay = 0, sparks = true }: { x: number; y: number; size: number; ink: Ink; delay?: number; sparks?: boolean }) {
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      <g className="etch-flame" style={{ "--d": `${delay}ms` } as CSSProperties}>
        <g className="etch-flare">
          <ellipse cx="0" cy={r1(-size * 0.3)} rx={r1(size * 0.42)} ry={r1(size * 0.5)} style={{ fill: c("fire-deep") }} filter={`url(#${ink.bloom})`} opacity="0.9" />
          {TONGUES.map(([dx, h, w, lean], i) => (
            <g key={i} transform={`translate(${r1(dx * size)} 0)`}>
              <g
                className="etch-flicker"
                style={{ animationDuration: `${1300 + ((i * 397 + delay) % 900)}ms`, animationDelay: `${-((i * 613 + delay * 3) % 1900)}ms` }}
              >
                <path d={tongue(w, lean)} transform={`scale(${r1(size * h)})`} fill={`url(#${ink.flame})`} />
                {i === 0 && <path d={tongue(w * 0.55, lean * 0.6)} transform={`scale(${r1(size * 0.46)})`} style={{ fill: "hsl(var(--fire-white))" }} opacity="0.9" />}
              </g>
            </g>
          ))}
          {sparks &&
            SPARKS.map(([dx, rise, drift, d], i) => (
              <circle
                key={i}
                className="etch-spark"
                cx={r1(dx * size)}
                cy={r1(-size * 0.6)}
                r={r1(Math.max(0.6, size * 0.035))}
                style={{ "--rise": `${r1(-rise * size)}px`, "--drift": `${r1(drift * size)}px`, animationDelay: `${d + (delay % 700)}ms` } as CSSProperties}
              />
            ))}
        </g>
      </g>
    </g>
  );
}

/**
 * Smoke off a fire, engraved as a few soft strands that lean with the wind and part
 * as they rise; the column sways slowly while the plate is on screen.
 */
export function Smoke({ x, y, rise, drift, ink, delay = 0, strands = 3, width = 0.7 }: { x: number; y: number; rise: number; drift: number; ink: Ink; delay?: number; strands?: number; width?: number }) {
  let d = "";
  for (let s = 0; s < strands; s++) {
    const pts = [];
    const off = (s - (strands - 1) / 2) * Math.max(1.5, rise * 0.025);
    for (let t = 0; t <= 1.0001; t += 0.1) {
      const sway = Math.sin(t * 6 + s * 1.9) * rise * 0.07 * t;
      // The strands part as they rise, so the column widens and thins.
      pts.push({ x: x + off * (1 + t * 5) + drift * t * t + sway, y: y - rise * t });
    }
    d += smooth(pts);
  }
  return (
    <g className="etch-smoke" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <g className="etch-sway">
        <path d={d} fill="none" stroke={`url(#${ink.gold})`} strokeWidth={width * 7} strokeLinecap="round" filter={`url(#${ink.bloom})`} opacity="0.35" />
        <path d={d} fill="none" stroke={`url(#${ink.gold})`} strokeWidth={width} strokeLinecap="round" opacity="0.8" />
      </g>
    </g>
  );
}

/** Something that glows hot rather than burns (an ember, a kindled scroll, a ring on the anvil): it catches after `delay` ms. */
export function Ember({ d, ink, delay = 0, width = 1.4 }: { d: string; ink: Ink; delay?: number; width?: number }) {
  return (
    <g className="etch-ember" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <path d={d} fill="none" style={{ stroke: c("fire") }} strokeWidth={width * 3} filter={`url(#${ink.bloom})`} />
      <path d={d} fill="none" style={{ stroke: "hsl(var(--fire-core))" }} strokeWidth={width} strokeLinecap="round" />
    </g>
  );
}
