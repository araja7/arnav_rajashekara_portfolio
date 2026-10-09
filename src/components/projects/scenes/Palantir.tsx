import { useId, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { pt, r1, ring, seeded, smooth, type Point } from "@/lib/drawing";
import { Etching, Flame, Knock, Lines, Pool } from "../Etching";
import { H, W } from "../plate";

const ORB = { x: 380, y: 170, r: 90 };
const DAIS = 334;

const rand = seeded(7);

/** An arc of a circle as a path, angles in degrees, clockwise from three o'clock. */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => pt(cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180));
  return `M${p(a0)}A${r1(r)},${r1(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};

// The tower's black stone: heavy ribs drawing together as they rise, laid in courses,
// every other rib turned from the light and hatched across.
const WINDOW = { x: 742, w: 58, top: 42, foot: 292 };
const ribs = (() => {
  let edges = "";
  let joints = "";
  let shade = "";
  const lean = (x0: number, y: number) => ORB.x + (x0 - ORB.x) * (1 - 0.14 * (1 - y / H));
  let x0 = 40;
  let facet = 0;
  while (x0 < W + 40) {
    const w = 38 + rand() * 26;
    const at = (x: number, y: number) => ({ x: lean(x, y), y });
    const top = at(x0, 0);
    const foot = at(x0, DAIS);
    // Each rib's edge is a rounded arris: a line and a second, finer one beside it.
    edges += `M${pt(top.x, top.y)}L${pt(foot.x, foot.y)}M${pt(top.x + 3.2, top.y)}L${pt(foot.x + 3.2, foot.y)}`;
    // Courses: joints across the rib at staggered heights.
    for (let y = 26 + rand() * 40; y < DAIS - 8; y += 52 + rand() * 30) {
      const l = at(x0 + 3, y);
      const r = at(x0 + w, y + 1);
      joints += `M${pt(l.x, l.y)}L${pt(r.x, r.y)}`;
    }
    if (facet % 2 === 1) {
      // Shadowed ribs: uneven strokes, longer and closer away from the light, crossed where it is darkest.
      const far = Math.min(1, Math.abs(x0 + w / 2 - ORB.x) / 400);
      for (let y = 4 + rand() * 8; y < DAIS - 4; y += 4 + rand() * (8 - far * 4)) {
        const r = at(x0 + w - 2 - rand() * 4, y + 2);
        const reach = (0.2 + far * 0.5) * (0.5 + rand() * 0.9);
        const l = at(x0 + w - 2 - (w - 7) * Math.min(1, reach), y + 2 + (rand() - 0.5) * 3);
        shade += `M${pt(r.x, r.y)}L${pt(l.x, l.y)}`;
        if (far > 0.55 && rand() < 0.35) {
          const c = at(x0 + w - 4 - rand() * w * 0.4, y);
          shade += `M${pt(c.x, c.y)}l${r1(-6 - rand() * 6)},${r1(5 + rand() * 4)}`;
        }
      }
    }
    x0 += w;
    facet++;
  }
  return { edges, joints, shade };
})();

// A lancet slit in the wall, pointed like the tower's horns, open on the night.
const windowShape = (() => {
  const { x, w, top, foot } = WINDOW;
  return `M${x - w / 2},${foot}V${top + 70}C${x - w / 2},${top + 30} ${x - 6},${top + 12} ${x},${top}C${x + 6},${top + 12} ${x + w / 2},${top + 30} ${x + w / 2},${top + 70}V${foot}Z`;
})();
const windowFrame = (() => {
  const { x, w, top, foot } = WINDOW;
  const o = 9;
  return `M${x - w / 2 - o},${foot + 6}V${top + 66}C${x - w / 2 - o},${top + 22} ${x - 8},${top + 2} ${x},${top - 12}C${x + 8},${top + 2} ${x + w / 2 + o},${top + 22} ${x + w / 2 + o},${top + 66}V${foot + 6}ZM${x - w / 2 - o - 6},${foot + 6}H${x + w / 2 + o + 6}V${foot + 12}H${x - w / 2 - o - 6}Z`;
})();
const night = (() => {
  let stars = "";
  for (let i = 0; i < 16; i++) stars += ring(WINDOW.x - WINDOW.w / 2 + 6 + rand() * (WINDOW.w - 12), WINDOW.top + 30 + rand() * 170, 0.5 + rand() * 0.6);
  // Far peaks under the stars, and the moon's sliver.
  const hills = smooth([
    { x: WINDOW.x - 30, y: 262 },
    { x: WINDOW.x - 14, y: 238 },
    { x: WINDOW.x + 2, y: 252 },
    { x: WINDOW.x + 16, y: 230 },
    { x: WINDOW.x + 30, y: 250 },
  ]);
  const moon = `M${WINDOW.x + 8},92A12,12 0 1 1 ${WINDOW.x + 8},116A9,9 0 1 0 ${WINDOW.x + 8},92Z`;
  return { stars, hills, moon };
})();

// The dais: three round steps about the stand, risers hatched on their shadowed side.
const dais = (() => {
  const steps = [
    { rx: 196, ry: 26, y: DAIS + 34 },
    { rx: 152, ry: 20, y: DAIS + 18 },
    { rx: 110, ry: 14, y: DAIS + 4 },
  ];
  let body = "";
  let lines = "";
  let shade = "";
  for (const s of steps) {
    const top = s.y - 10;
    body += `M${ORB.x - s.rx},${top}A${s.rx},${s.ry} 0 0 0 ${ORB.x + s.rx},${top}V${s.y}A${s.rx},${s.ry} 0 0 1 ${ORB.x - s.rx},${s.y}ZM${ORB.x - s.rx},${top}A${s.rx},${s.ry} 0 0 1 ${ORB.x + s.rx},${top}Z`;
    lines += `M${ORB.x - s.rx},${top}A${s.rx},${s.ry} 0 1 1 ${ORB.x + s.rx},${top}A${s.rx},${s.ry} 0 1 1 ${ORB.x - s.rx},${top}M${ORB.x - s.rx},${top}V${s.y}A${s.rx},${s.ry} 0 0 0 ${ORB.x + s.rx},${s.y}V${top}`;
    for (let a = 20; a < 90; a += 6) {
      const x = ORB.x + s.rx * Math.cos((a * Math.PI) / 180);
      const y = top + s.ry * Math.sin((a * Math.PI) / 180);
      shade += `M${pt(x, y + 1.5)}v${r1(8.5 * (0.6 + (a - 20) / 140))}`;
    }
  }
  return { body, lines, shade };
})();

// The stand: a waisted stem and two claws that follow the stone's curve up from the collar.
const STEM_TOP = ORB.y + ORB.r + 2;
const stem = `M${ORB.x - 30},${DAIS - 6}C${ORB.x - 18},${DAIS - 16} ${ORB.x - 12},${DAIS - 34} ${ORB.x - 14},${STEM_TOP}H${ORB.x + 14}C${ORB.x + 12},${DAIS - 34} ${ORB.x + 18},${DAIS - 16} ${ORB.x + 30},${DAIS - 6}Z`;
const stemShade = (() => {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const x = ORB.x + 4 + i * 2.6;
    d += `M${pt(x, STEM_TOP + 4)}L${pt(x + i * 1.6, DAIS - 9)}`;
  }
  return d;
})();
const claws = [-1, 1]
  .map((side) => {
    const at = (deg: number, r: number) => {
      const a = ((90 + side * (deg - 90)) * Math.PI) / 180;
      return { x: ORB.x + r * Math.cos(a), y: ORB.y + r * Math.sin(a) };
    };
    const outer: Point[] = [];
    const inner: Point[] = [];
    for (let deg = 104; deg <= 160; deg += 4) {
      const t = (deg - 104) / 56;
      outer.push(at(deg, ORB.r + 11 - t * 7));
      inner.push(at(deg, ORB.r + 1.5));
    }
    const tip = at(166, ORB.r + 8);
    return `${smooth([...outer, tip])}L${pt(inner[inner.length - 1].x, inner[inner.length - 1].y)}${smooth(inner.reverse()).replace(/^M/, "L")}Z`;
  })
  .join("");
const collar = `M${ORB.x - 20},${STEM_TOP - 10}H${ORB.x + 20}V${STEM_TOP + 2}H${ORB.x - 20}Z`;

// A pillar in the near dark, standing in front of everything like cut paper: coursed, its lit edge catching the stone's fire.
const pillar = `M-10,0H58L66,${H + 10}H-10Z`;
const pillarLines = (() => {
  const lit = (y: number) => 58 + (y / H) * 8;
  let d = `M58,0L66,${H}M52,0L59.5,${H}`;
  for (let y = 38 + rand() * 20; y < H; y += 48 + rand() * 26) d += `M-10,${r1(y)}L${r1(lit(y))},${r1(y + 1 + rand() * 2)}`;
  // Shadow deepens away from the lit edge: uneven strokes, crossed in the darkest part.
  for (let y = 3 + rand() * 4; y < H; y += 3 + rand() * 6) {
    const start = lit(y) - 6 - rand() * 4;
    const len = 6 + rand() * rand() * 34;
    d += `M${r1(start)},${r1(y)}l${r1(-len)},${r1(1 + rand() * 2.5)}`;
    if (rand() < 0.3) d += `M${r1(start - 18 - rand() * 14)},${r1(y)}l${r1(-8 - rand() * 8)},${r1(-6 - rand() * 4)}`;
  }
  return d;
})();

// Inside the glass: fire held in the dark, low in the stone.
const CORE = { x: ORB.x + 10, y: ORB.y + 46 };
const glints = [
  { x: ORB.x - 52, y: ORB.y - 58, s: 7 },
  { x: ORB.x + 62, y: ORB.y + 40, s: 4 },
]
  .map(({ x, y, s }) => `M${x - s},${y}H${x + s}M${x},${y - s}V${y + s}`)
  .join("");

// The tracked path, a tilted ellipse through the stone, as one closed curve.
const ORBIT = (() => {
  const pts = [];
  const tilt = (-16 * Math.PI) / 180;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x = 58 * Math.cos(a);
    const y = 20 * Math.sin(a);
    pts.push({ x: ORB.x + x * Math.cos(tilt) - y * Math.sin(tilt), y: ORB.y + 6 + x * Math.sin(tilt) + y * Math.cos(tilt) });
  }
  return smooth(pts, true);
})();
const RETICLE = "M-9,-5V-9H-5M5,-9H9V-5M9,5V9H5M-5,9H-9V5";

/** ApexClip: a seeing-stone in a black tower's chamber, following one bright point as it moves through the fire inside. */
export function Palantir({ lit, playing }: { lit: boolean; playing: boolean }) {
  const uid = useId().replace(/:/g, "");
  const glass = `glass-${uid}`;
  const inside = `inside-${uid}`;
  const reduce = useReducedMotion();

  return (
    <Etching lit={lit} playing={playing} light={{ x: ORB.x, y: ORB.y, r: 660 }}>
      {(ink) => (
        <>
          <defs>
            <radialGradient id={glass} cx="0.44" cy="0.4" r="0.66">
              <stop offset="0%" style={{ stopColor: "hsl(24 30% 8%)" }} />
              <stop offset="72%" style={{ stopColor: "hsl(28 24% 3.5%)" }} />
              <stop offset="100%" style={{ stopColor: "hsl(30 20% 2%)" }} />
            </radialGradient>
            <clipPath id={inside}>
              <circle cx={ORB.x} cy={ORB.y} r={ORB.r - 3} />
            </clipPath>
          </defs>

          <g className="etch-lines">
            <Lines d={ribs.shade} ink={ink} width={0.4} opacity={0.45} />
            <Lines d={ribs.joints} ink={ink} width={0.55} opacity={0.6} />
            <Lines d={ribs.edges} ink={ink} width={0.75} opacity={0.75} />

            <Knock d={windowFrame} />
            <Lines d={windowFrame} ink={ink} width={0.9} opacity={0.8} />
            <Knock d={windowShape} />
            <Lines d={windowShape} ink={ink} width={0.7} opacity={0.8} />
            <path d={night.stars} style={{ fill: "hsl(var(--gold-bright))" }} opacity="0.55" />
            <path d={night.moon} style={{ fill: "hsl(var(--bone))" }} opacity="0.6" />
            <Lines d={night.hills} ink={ink} width={0.6} opacity={0.5} />

            <Knock d={`M0,${DAIS - 10}H${W}V${H}H0Z`} />
            <Lines d={`M0,${DAIS - 10}H${W}`} ink={ink} width={0.5} opacity={0.4} />
            <Knock d={dais.body} />
            <Lines d={dais.shade} ink={ink} width={0.5} opacity={0.7} />
            <Lines d={dais.lines} ink={ink} width={0.9} />

            <Knock d={stem} />
            <Lines d={stemShade} ink={ink} width={0.5} opacity={0.75} />
            <Lines d={stem} ink={ink} width={1.25} />

            <circle cx={ORB.x} cy={ORB.y} r={ORB.r} fill={`url(#${glass})`} />
            <Lines d={ring(ORB.x, ORB.y, ORB.r) + ring(ORB.x, ORB.y, ORB.r - 5)} ink={ink} width={1.3} />
            {/* The window's reflection, high on the glass, and two glints of gold. */}
            <path d={arc(ORB.x, ORB.y, ORB.r - 14, 198, 252)} fill="none" style={{ stroke: "hsl(var(--gilt-pale) / 0.7)" }} strokeWidth="2.4" strokeLinecap="round" />
            <path d={arc(ORB.x, ORB.y, ORB.r - 22, 214, 232)} fill="none" style={{ stroke: "hsl(var(--gilt-pale) / 0.5)" }} strokeWidth="1" strokeLinecap="round" />
            <path d={glints} style={{ stroke: "hsl(var(--gilt-pale))" }} strokeWidth="0.8" strokeLinecap="round" />

            <Knock d={claws + collar} />
            <Lines d={claws + collar} ink={ink} width={1.3} />
          </g>

          <g className="etch-fire">
            <Pool x={ORB.x} y={ORB.y} rx={320} ry={230} ink={ink} delay={500} />
            <Pool x={ORB.x} y={DAIS + 20} rx={240} ry={36} ink={ink} delay={700} />
            <g clipPath={`url(#${inside})`}>
              <Pool x={CORE.x} y={CORE.y - 24} rx={80} ry={70} ink={ink} delay={600} />
              <Flame x={CORE.x} y={CORE.y} size={64} ink={ink} delay={800} sparks={false} />
              <path d={ORBIT} fill="none" style={{ stroke: "hsl(var(--gold) / 0.22)" }} strokeWidth="0.6" strokeDasharray="2 4" />
            </g>
            {/* The tracked point and its reticle travel together. */}
            <g className="etch-ember" style={{ "--d": "1800ms" } as CSSProperties}>
              <g transform={reduce ? `translate(${r1(ORB.x - 48)} ${r1(ORB.y + 26)})` : undefined}>
                {!reduce && <animateMotion dur="5s" repeatCount="indefinite" path={ORBIT} />}
                <circle r="5" style={{ fill: "hsl(var(--fire))" }} filter={`url(#${ink.bloom})`} />
                <circle r="1.8" style={{ fill: "hsl(var(--fire-white))" }} />
                <path d={RETICLE} fill="none" style={{ stroke: "hsl(var(--gold-bright))" }} strokeWidth="1" />
              </g>
            </g>
          </g>

          <g className="etch-lines">
            <Knock d={pillar} />
            <Lines d={pillarLines} ink={ink} width={1.2} opacity={0.85} />
          </g>
        </>
      )}
    </Etching>
  );
}
