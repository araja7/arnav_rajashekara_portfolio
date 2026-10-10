import type { CSSProperties } from "react";
import { pt, r1, ring, seeded, type Point } from "@/lib/drawing";
import { Etching, Flame, Lines, Pool, Smoke } from "../Etching";
import { H, W } from "../plate";

/** Smooth 1D noise in [-1, 1], from a seeded lattice. */
function noise(rand: () => number, cells: number) {
  const lattice = Array.from({ length: cells + 2 }, () => rand() * 2 - 1);
  return (t: number) => {
    const x = Math.max(0, t) * cells;
    const i = Math.min(cells, Math.floor(x));
    const f = x - i;
    const s = f * f * (3 - 2 * f);
    return lattice[i] * (1 - s) + lattice[i + 1] * s;
  };
}

type Summit = { x: number; top: number; slope: number };

/**
 * One mountain range: a skyline that is the upper envelope of many weathered peaks,
 * its shadowed faces hatched along the fall line, filled down to the frame's foot so
 * nearer ranges hide farther ones. Beacon summits are kept clean so a pyre can sit on them.
 */
function range(rand: () => number, opts: { base: number; peaks: number; height: [number, number]; rough: number; beacons: Summit[]; hatch: number }) {
  const { base, height, rough, beacons, hatch } = opts;
  const summits: Summit[] = [...beacons];
  for (let i = 0; i < opts.peaks; i++) {
    const x = -60 + rand() * (W + 120);
    if (beacons.some((b) => Math.abs(b.x - x) < 70)) continue;
    summits.push({ x, top: base - (height[0] + rand() * (height[1] - height[0])), slope: 0.55 + rand() * 0.5 });
  }
  const coarse = noise(rand, 22);
  const fine = noise(rand, 90);
  const step = 2;
  const sky: { y: number; owner: Summit }[] = [];
  for (let x = -10; x <= W + 10; x += step) {
    let best = Infinity;
    let owner = summits[0];
    for (const s of summits) {
      const y = s.top + Math.abs(x - s.x) * s.slope * (x > s.x ? 1.08 : 0.92);
      if (y < best) {
        best = y;
        owner = s;
      }
    }
    // Weather the line away from the summits, never on a beacon's top.
    const calm = Math.min(1, Math.abs(x - owner.x) / 26);
    const t = (x + 10) / (W + 20);
    sky.push({ y: Math.min(base, best + (coarse(t) * rough + fine(t) * rough * 0.32) * calm), owner });
  }

  const at = (i: number) => ({ x: -10 + i * step, y: sky[i].y });
  let line = `M${pt(at(0).x, at(0).y)}`;
  for (let i = 1; i < sky.length; i++) line += `L${pt(at(i).x, at(i).y)}`;
  const body = `${line}L${W + 10},${H + 10}L-10,${H + 10}Z`;

  // Hatching falls from the skyline down each face turned away from the light (the right-hand faces).
  let shade = "";
  for (let i = 0; i < sky.length; i += hatch) {
    const { x, y } = at(i);
    const { owner } = sky[i];
    const rise = base - y;
    if (x <= owner.x + 3 || rise < 6) continue;
    const away = Math.min(1, (x - owner.x) / 60);
    const len = rise * (0.12 + 0.5 * (1 - away * 0.6)) * (0.45 + rand() * 0.75);
    shade += `M${pt(x + 0.5, y + 1.5)}l${r1(len * (0.3 + rand() * 0.2))},${r1(len)}`;
  }
  // A ridge spur falls from each tall summit, splitting its lit face from its shadowed one.
  let spurs = "";
  for (const s of summits) {
    const rise = base - s.top;
    const i = Math.round((s.x + 10) / step);
    if (rise < 40 || i < 0 || i >= sky.length || sky[i].owner !== s) continue;
    let x = s.x;
    let y = s.top + 2;
    spurs += `M${pt(x, y)}`;
    const end = s.top + rise * (0.5 + rand() * 0.25);
    while (y < end) {
      y += 6;
      x += 1.2 + (rand() - 0.3) * 2.4;
      spurs += `L${pt(x, y)}`;
    }
  }
  return { line, body, shade, spurs };
}

/** A beacon pyre on a summit: timbers stacked into a cone over a cairn of boulders, cold until lit. */
function pyre({ x, y }: Point, k: number, rand: () => number) {
  const half = 17 * k;
  const tall = 30 * k;
  const foot = y + 4 * k;
  let rocks = "";
  // Outer boulders sit lower down the slope; the nearer ones overlap the farther.
  for (const [dx, dy, size] of [[-1.2, 3, 0.75], [1.15, 3.5, 0.8], [-0.6, 1, 1.05], [0.55, 1.4, 1.1], [0.02, 2.4, 0.85]]) {
    const rx = x + dx * half;
    const ry = foot + dy * k;
    const rr = 6.5 * k * size;
    rocks += `M${pt(rx - rr, ry)}C${pt(rx - rr * 1.05, ry - rr * 1.15)} ${pt(rx + rr * 0.7, ry - rr * 1.3)} ${pt(rx + rr, ry - rr * 0.1)}Q${pt(rx, ry + rr * 0.25)} ${pt(rx - rr, ry)}Z`;
  }
  const base = foot - 6 * k;
  let timbers = "";
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const bx = x - half + t * half * 2;
    const tx = x + (0.5 - t) * half * 0.6;
    timbers += `M${pt(bx, base + rand() * 2 * k)}L${pt(tx, base - tall - (2 + rand() * 5) * k)}`;
  }
  return { rocks, timbers, fire: { x, y: base - tall * 0.3 } };
}

const rand = seeded(3019);

const stars = (() => {
  const tiers = ["", "", ""];
  for (let i = 0; i < 110; i++) {
    const x = rand() * W;
    const y = rand() * rand() * 260;
    const t = Math.min(2, Math.floor(rand() * rand() * 3.4));
    tiers[t] += ring(x, y, 0.5 + t * 0.35);
  }
  return tiers;
})();

// The chain runs from the nearest beacon on the left to the last, small on the far horizon.
const BEACONS = {
  first: { x: 176, top: 116, slope: 0.95 },
  second: { x: 452, top: 196, slope: 0.85 },
  third: { x: 642, top: 232, slope: 0.8 },
  fourth: { x: 790, top: 262, slope: 0.75 },
  fifth: { x: 906, top: 280, slope: 0.7 },
};

const RANGES = [
  range(rand, { base: 312, peaks: 16, height: [18, 52], rough: 7, beacons: [BEACONS.fourth, BEACONS.fifth], hatch: 3 }),
  range(rand, { base: 352, peaks: 12, height: [40, 110], rough: 12, beacons: [BEACONS.third], hatch: 3 }),
  range(rand, { base: 384, peaks: 9, height: [60, 150], rough: 16, beacons: [BEACONS.second], hatch: 2 }),
  range(rand, { base: 410, peaks: 5, height: [40, 110], rough: 22, beacons: [BEACONS.first], hatch: 2 }),
];

// Aerial perspective: the farther the range, the more haze sits in front of it.
const HAZE = ["hsl(34 22% 7%)", "hsl(33 20% 5%)", "hsl(32 20% 3.4%)", "hsl(var(--void))"];
const WEIGHT = [
  { line: 0.6, shade: 0.4, opacity: 0.45 },
  { line: 0.8, shade: 0.5, opacity: 0.62 },
  { line: 1, shade: 0.6, opacity: 0.8 },
  { line: 1.3, shade: 0.75, opacity: 1 },
];

const CHAIN = [
  { at: BEACONS.first, k: 1.5 },
  { at: BEACONS.second, k: 0.95 },
  { at: BEACONS.third, k: 0.7 },
  { at: BEACONS.fourth, k: 0.5 },
  { at: BEACONS.fifth, k: 0.38 },
].map((b, i) => ({ ...b, ...pyre({ x: b.at.x, y: b.at.top }, b.k, rand), delay: 700 + i * 520 }));

/** Bumblebee: a chain of beacons on the mountain tops, each catching from the last. */
export function Beacons({ lit, playing }: { lit: boolean; playing: boolean }) {
  return (
    <Etching lit={lit} playing={playing} light={{ x: 176, y: 80, r: 1000 }}>
      {(ink) => (
        <>
          <g className="etch-lines">
            {stars.map((d, t) => (
              <path key={t} d={d} fill={`url(#${ink.gold})`} opacity={0.3 + t * 0.25} />
            ))}
            {RANGES.map((r, i) => (
              <g key={i} opacity={WEIGHT[i].opacity}>
                <path d={r.body} style={{ fill: HAZE[i] } as CSSProperties} />
                <Lines d={r.shade} ink={ink} width={WEIGHT[i].shade} opacity={0.7} />
                <Lines d={r.spurs} ink={ink} width={WEIGHT[i].shade} />
                <Lines d={r.line} ink={ink} width={WEIGHT[i].line} />
              </g>
            ))}
            {CHAIN.map((b, i) => (
              <g key={i} opacity={WEIGHT[3 - Math.min(3, i)].opacity}>
                <path d={b.rocks} style={{ fill: "hsl(var(--void))" }} />
                <Lines d={b.rocks} ink={ink} width={Math.max(0.45, b.k * 0.7)} />
              </g>
            ))}
          </g>

          <g className="etch-fire">
            {CHAIN.map((b, i) => (
              <g key={i}>
                <Pool x={b.fire.x} y={b.fire.y - 10 * b.k} rx={170 * b.k} ry={120 * b.k} ink={ink} delay={b.delay} />
                <Smoke x={b.fire.x} y={b.fire.y - 18 * b.k} rise={130 * b.k} drift={80 * b.k} ink={ink} delay={b.delay + 600} width={Math.max(0.4, 0.8 * b.k)} />
                <Flame x={b.fire.x} y={b.fire.y} size={40 * b.k} ink={ink} delay={b.delay} sparks={b.k > 0.6} />
              </g>
            ))}
          </g>

          {/* The timbers stand in front of their own fire, so the flames burn up through the stack. */}
          <g className="etch-lines">
            {CHAIN.map((b, i) => (
              <g key={i} opacity={WEIGHT[3 - Math.min(3, i)].opacity}>
                <Lines d={b.timbers} ink={ink} width={Math.max(0.6, b.k * 1.1)} />
              </g>
            ))}
          </g>
        </>
      )}
    </Etching>
  );
}
