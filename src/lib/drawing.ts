/** Pen work shared by the hand-drawn pieces: the About map and the project etchings. */

export type Point = { x: number; y: number };

/** A small seeded random, so every drawing comes out the same on every visit. */
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const r1 = (n: number) => Math.round(n * 10) / 10;

export const pt = (x: number, y: number) => `${r1(x)},${r1(y)}`;

/** A smooth line through the points (Catmull-Rom), open or closed. */
export function smooth(points: Point[], closed = false) {
  const n = points.length;
  const get = (i: number) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pt(points[0].x, points[0].y)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    d += `C${pt(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6)} ${pt(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6)} ${pt(p2.x, p2.y)}`;
  }
  return closed ? `${d}Z` : d;
}

/** A peak in the manner of the films' map: bowed flanks, a ridge falling from the summit, and the shadowed face hatched. */
export function peak(cx: number, base: number, w: number, h: number, rand: () => number) {
  const px = cx + (rand() - 0.5) * w * 0.18;
  const top = base - h;
  const l = cx - w / 2;
  const r = cx + w / 2;
  // A shoulder partway down each side breaks the clean triangle into a weathered peak.
  const ls = { x: l + (px - l) * (0.45 + rand() * 0.15), y: base - h * (0.42 + rand() * 0.14) };
  const rs = { x: px + (r - px) * (0.4 + rand() * 0.2), y: base - h * (0.48 + rand() * 0.16) };
  const flanks = `M${pt(l, base)}Q${pt((l + ls.x) / 2, base - h * 0.08)} ${pt(ls.x, ls.y)}L${pt(px, top)}L${pt(rs.x, rs.y)}Q${pt((rs.x + r) / 2 + 2, base - h * 0.12)} ${pt(r, base)}`;
  const foot = px + w * 0.1;
  let shade = `M${pt(px, top)}L${pt(px + w * 0.04, top + h * 0.45)}L${pt(foot, base - 1)}`;
  // Streaks run down the shadowed face from the ridge, falling with the slope.
  const fall = Math.hypot(r - px, h);
  const ux = (r - px) / fall;
  const uy = h / fall;
  const streaks = Math.max(3, Math.round(h / 3.2));
  for (let i = 1; i < streaks; i++) {
    const t = i / streaks;
    const sx = px + (foot - px) * t + 1.2;
    const sy = top + h * t;
    const len = Math.min(h * (0.5 - t * 0.32), (base - sy) / uy) * (0.75 + rand() * 0.35);
    if (len > 2) shade += `M${pt(sx, sy)}l${r1(ux * len)},${r1(uy * len)}`;
  }
  return { body: `${flanks}Z`, flanks, shade, summit: { x: px, y: top } };
}

/** A circle as a path, so many can share one element. */
export const ring = (x: number, y: number, r: number) =>
  `M${pt(x - r, y)}a${r1(r)},${r1(r)} 0 1 0 ${r1(r * 2)},0a${r1(r)},${r1(r)} 0 1 0 ${r1(-r * 2)},0Z`;
