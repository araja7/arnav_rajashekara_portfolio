import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { ExternalLink } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { timeline } from "@/lib/content";
import { cn } from "@/lib/utils";
import { peak, pt, r1, seeded, smooth, type Point } from "@/lib/drawing";

type Entry = (typeof timeline)[number];
type Box = { l: number; r: number; t: number; b: number };
type Chart = { w: number; h: number; road: string; marks: Mark[] };

function groupByYear(entries: readonly Entry[]) {
  const groups: { year: string; entries: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.year === entry.year) last.entries.push(entry);
    else groups.push({ year: entry.year, entries: [entry] });
  }
  return groups;
}

/** Map symbols, inked by hand: a tower for study, a town for work, a beacon for a win. */
function PlaceSymbol({ type }: { type: Entry["type"] }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" strokeLinejoin="round" className="h-[26px] w-[26px]">
      {type === "education" && (
        <path d="M7.5 21V10.5h9V21M6.5 10.5V7h2.2v1.4h2V7h2.6v1.4h2V7h2.2v3.5M10.4 21v-3a1.6 1.6 0 0 1 3.2 0v3M4.5 21h15M12 7V2.8l3 1.1-3 1.1" />
      )}
      {type === "work" && (
        <path d="M3 20.5v-6.8l4.3-3.8 4.3 3.8v6.8M11.6 20.5V10.2L16.3 6l4.7 4.2v10.3M2 20.5h20M14.8 20.5v-3.4h3v3.4M5.8 20.5v-2.6h3v2.6" />
      )}
      {type === "project" && (
        <>
          <path d="M2.5 21c3.4-5.6 15.6-5.6 19 0M12 17.1v-5.4M8.6 11.7h6.8l-1.1 2.1H9.7z" />
          <path className="text-ink-red" d="M12 10.2c-2-.9-2.2-3.4-.1-6.4.4 1.6 2.2 2.3 1.9 4.2-.1.9-.8 1.7-1.8 2.2z" />
        </>
      )}
    </svg>
  );
}

/** An original compass rose with the north point in red ink. */
function Compass({ className }: { className?: string }) {
  return (
    <svg data-compass viewBox="-50 -50 100 100" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinejoin="round">
      <circle r="27" strokeWidth="0.8" />
      <circle r="23.5" strokeWidth="0.5" strokeDasharray="1.2 2.2" />
      <path d="M17 -17 3.2 -3.2M17 17 3.2 3.2M-17 17-3.2 3.2M-17 -17-3.2 -3.2" strokeWidth="0.7" />
      <path d="M0 -46 5.2 -5.2 0 0ZM46 0 5.2 5.2 0 0ZM0 46-5.2 5.2 0 0ZM-46 0-5.2 -5.2 0 0Z" fill="currentColor" strokeWidth="0.6" />
      <path d="M44 0 5.2 -5.2 0 0ZM0 44 5.2 5.2 0 0ZM-44 0-5.2 5.2 0 0Z" strokeWidth="0.6" />
      <path d="M0 -46-5.2 -5.2 0 0Z" className="text-ink-red" fill="currentColor" stroke="currentColor" strokeWidth="0.6" />
      <circle r="2.2" fill="hsl(var(--parchment))" strokeWidth="0.7" />
    </svg>
  );
}

/** A road through the points: every bend leaves and arrives heading south, so it only ever runs down the page. */
function trace(points: Point[]) {
  let d = `M${r1(points[0].x)},${r1(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const q = points[i];
    const k = (q.y - p.y) / 2;
    d += ` C${r1(p.x)},${r1(p.y + k)} ${r1(q.x)},${r1(q.y - k)} ${r1(q.x)},${r1(q.y)}`;
  }
  return d;
}

/** One stroke or wash of the mapmaker's pen. Filled marks knock out the parchment beneath, so nearer hills and trees hide the ones behind. */
type Mark = { d: string; tone: number; width: number; fill?: boolean; stroke?: boolean; dash?: string };

/** A range of peaks in two rows along a strip, parted where the road goes through. */
function range(strip: Box, passX: number, rand: () => number): Mark[] {
  const tall = strip.b - strip.t;
  const rows: Mark[] = [];
  const row = (base: number, size: number, offset: number) => {
    let body = "";
    let lines = "";
    let x = strip.l + offset;
    while (x < strip.r - 16) {
      const w = size * (0.85 + rand() * 0.6);
      const h = Math.min(base - strip.t, w * (0.55 + rand() * 0.3));
      const mid = x + w / 2;
      if (Math.abs(mid - passX) > 46 + w / 2 && x + w <= strip.r) {
        const p = peak(mid, base - rand() * 3, w, h, rand);
        body += p.body;
        lines += p.flanks + p.shade;
      }
      x += w * (0.95 + rand() * 0.12);
    }
    rows.push({ d: body, tone: 0, width: 0, fill: true, stroke: false }, { d: lines, tone: 0.72, width: 0.95 });
  };
  row(strip.b - tall * 0.3, Math.min(52, tall * 0.8), 14);
  row(strip.b, Math.min(42, tall * 0.62), 0);
  return rows;
}

/** A wood drawn as rows of round crowns, the nearer rows hiding the farther. */
function forest(cx: number, cy: number, rx: number, ry: number, rand: () => number): Mark[] {
  const s = 5.6;
  const marks: Mark[] = [];
  const rows = Math.max(2, Math.floor((ry * 2) / (s * 1.25)));
  const lean = (rand() - 0.5) * rx * 0.5;
  for (let k = 0; k <= rows; k++) {
    const y = cy - ry + (ry * 2 * k) / rows;
    const dy = (y - cy) / ry;
    const half = rx * Math.sqrt(Math.max(0, 1 - dy * dy)) * (0.7 + rand() * 0.45);
    if (half < s) continue;
    const mid = cx + lean * dy + (rand() - 0.5) * s * 2;
    let body = "";
    let lines = "";
    for (let x = mid - half + (k % 2) * s * 0.9; x <= mid + half; x += s * 1.75 + rand() * 1.2) {
      const ty = y + (rand() - 0.5) * 1.6;
      const z = s * (0.8 + rand() * 0.4);
      const crown = `M${pt(x - z, ty)}A${r1(z)},${r1(z * 1.12)} 0 0 1 ${pt(x + z, ty)}`;
      body += `${crown}Z`;
      lines += crown + `M${pt(x + z * 0.45, ty - z * 0.55)}q${r1(z * 0.25)},${r1(z * 0.3)} ${r1(z * 0.18)},${r1(z * 0.7)}`;
      if (k === rows || rand() < 0.12) lines += `M${pt(x, ty)}v${r1(z * 0.75)}`;
    }
    marks.push({ d: body, tone: 0, width: 0, fill: true, stroke: false }, { d: lines, tone: 0.62, width: 0.85 });
  }
  return marks;
}

/** Rows of rounded downs, each with its lee side hatched. */
function downs(cx: number, cy: number, rx: number, ry: number, rand: () => number): Mark[] {
  const marks: Mark[] = [];
  const rows = Math.max(2, Math.round(ry / 18));
  for (let k = 0; k <= rows; k++) {
    const y = cy - ry + (ry * 2 * k) / rows;
    const dy = (y - cy) / ry;
    const half = rx * Math.sqrt(Math.max(0, 1 - dy * dy)) * (0.75 + rand() * 0.35);
    let body = "";
    let lines = "";
    for (let x = cx - half + (k % 2) * 14 + rand() * 10; x < cx + half - 14; ) {
      const w = 12 + rand() * 9;
      const h = w * (0.5 + rand() * 0.25);
      const hill = `M${pt(x, y)}Q${pt(x + w, y - h * 2)} ${pt(x + w * 2, y)}`;
      body += `${hill}Z`;
      lines += hill;
      for (let j = 0; j < 3; j++) {
        const t = 0.58 + j * 0.13;
        const hx = x + w * 2 * t;
        const hy = y - h * 4 * t * (1 - t) + 1;
        lines += `M${pt(hx, hy)}l${r1(-w * 0.12)},${r1(h * 0.55 * (1 - j * 0.2))}`;
      }
      x += w * 2 + 2 + rand() * 14;
    }
    marks.push({ d: body, tone: 0, width: 0, fill: true, stroke: false }, { d: lines, tone: 0.6, width: 0.85 });
  }
  return marks;
}

/** A river from its source to where it leaves the sheet, thickening as it goes, with one stream joining it. */
function river(from: Point, to: Point, rand: () => number): Mark[] {
  const points: Point[] = [from];
  const steps = 6;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const bend = Math.sin(t * Math.PI) * (rand() - 0.5) * 34;
    points.push({ x: from.x + (to.x - from.x) * t * t + bend, y: from.y + (to.y - from.y) * Math.sqrt(t) + (rand() - 0.5) * 8 });
  }
  points.push(to);
  const join = points[3];
  const spring = { x: join.x - (to.x - from.x) * 0.35 + (rand() - 0.5) * 20, y: join.y - 28 - rand() * 14 };
  return [
    { d: smooth(points.slice(0, 4)), tone: 0.62, width: 0.95 },
    { d: smooth(points.slice(3)), tone: 0.66, width: 1.5 },
    { d: smooth([spring, { x: (spring.x + join.x) / 2 + 6, y: (spring.y + join.y) / 2 }, join]), tone: 0.55, width: 0.75 },
  ];
}

/** A still lake with its ripples drawn inside the shore. */
function lake(cx: number, cy: number, rx: number, ry: number, rand: () => number): Mark[] {
  const shore: Point[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const k = 0.78 + rand() * 0.34;
    shore.push({ x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k });
  }
  const inset = (f: number) => shore.map((p) => ({ x: cx + (p.x - cx) * f, y: cy + (p.y - cy) * f }));
  return [
    { d: smooth(shore, true), tone: 0.66, width: 1.1 },
    { d: smooth(inset(0.78), true), tone: 0.38, width: 0.7, dash: "9 5 3 5" },
    { d: smooth(inset(0.52), true), tone: 0.28, width: 0.6, dash: "6 6" },
  ];
}

function tufts(cx: number, cy: number, rx: number, ry: number, rand: () => number) {
  let d = "";
  for (let i = 0; i < 14; i++) {
    const x = cx + (rand() - 0.5) * rx * 2;
    const y = cy + (rand() - 0.5) * ry * 2;
    d += `M${pt(x - 3.5, y)}h7M${pt(x, y)}l-2.2,-4.2M${pt(x, y)}v-5M${pt(x, y)}l2.2,-4.2`;
  }
  return { d, tone: 0.5, width: 0.75 } satisfies Mark;
}

/** The open ground beside a place, filled with a different country each time. */
function wilderness(area: Box, k: number, rand: () => number, ctx: { mid: number; edgeL: number; edgeR: number; ridges: Box[] }): Mark[] {
  const w = area.r - area.l;
  const h = area.b - area.t;
  if (w < 80 || h < 50) return [];
  const out = (area.l + area.r) / 2 > ctx.mid ? 1 : -1;
  const inner = out > 0 ? area.l : area.r;
  const across = (f: number) => inner + out * f * w;
  const edge = out > 0 ? ctx.edgeR : ctx.edgeL;
  const cy = area.t + h / 2;

  // Rivers rise in the range above when there is one, otherwise from a spring.
  const source = (x: number): Point => {
    const ridge = ctx.ridges.find((r) => r.l < x && r.r > x && r.b < area.t && area.t - r.b < 160);
    return { x, y: ridge ? ridge.b - 2 : area.t + 4 };
  };

  switch (k % 4) {
    case 0:
      return [
        ...river(source(across(0.72)), { x: edge, y: area.t + h * 0.82 }, rand),
        ...forest(across(0.3), cy, w * 0.27, h * 0.36, rand),
      ];
    case 1:
      return [...downs(across(0.4), cy - h * 0.05, w * 0.34, h * 0.3, rand), tufts(across(0.82), area.t + h * 0.78, w * 0.1, h * 0.12, rand)];
    case 2:
      return [
        ...river(source(across(0.62)), { x: across(0.66), y: cy - h * 0.12 }, rand),
        ...lake(across(0.7), cy + h * 0.12, w * 0.16, h * 0.18, rand),
        ...forest(across(0.24), cy, w * 0.2, h * 0.3, rand),
        tufts(across(0.7), area.t + h * 0.92, w * 0.12, h * 0.06, rand),
      ];
    default: {
      const marks: Mark[] = [];
      marks.push(...forest(across(0.68), cy - h * 0.18, w * 0.24, h * 0.2, rand));
      let body = "";
      let lines = "";
      for (let i = 0; i < 3; i++) {
        const p = peak(across(0.18 + i * 0.17), cy + h * 0.28 - (i % 2) * 6, 34 + rand() * 12, 30 + rand() * 18, rand);
        body += p.body;
        lines += p.flanks + p.shade;
      }
      marks.push({ d: body, tone: 0, width: 0, fill: true, stroke: false }, { d: lines, tone: 0.72, width: 0.95 });
      return marks;
    }
  }
}

/** The western shore below the journey's start: the coast falls away to the south-west, the sea rippled along it, an island offshore. */
function coast(band: Box, rand: () => number): Mark[] {
  const w = band.r - band.l;
  const h = band.b - band.t;
  const shore: Point[] = [];
  const reach = 0.62 + rand() * 0.12;
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const x = band.l + w * reach * t + Math.sin(t * 19) * 6;
    const y = band.t + 12 + (h - 12) * Math.pow(t, 1.6) + Math.sin(t * 13 + 1) * 7 + (rand() - 0.5) * 6 - 22 * Math.exp(-(((t - 0.45) / 0.09) ** 2));
    shore.push({ x, y: Math.min(y, band.b + 6) });
  }
  const marks: Mark[] = [{ d: smooth(shore), tone: 0.72, width: 1.25 }];
  for (let k = 1; k <= 6; k++) {
    const off = 4 + k * k * 1.8;
    let d = "";
    let run: Point[] = [];
    const flush = () => {
      if (run.length > 1) d += smooth(run);
      run = [];
    };
    shore.forEach((p, i) => {
      const a = shore[Math.max(0, i - 1)];
      const b = shore[Math.min(shore.length - 1, i + 1)];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const q = { x: p.x - (dy / len) * off, y: p.y + (dx / len) * off };
      if (q.y > band.b || q.x < band.l + 2 || rand() < 0.05 + k * 0.05) flush();
      else run.push(q);
    });
    flush();
    marks.push({ d, tone: 0.5 - k * 0.05, width: 0.7 });
  }
  const isle = { x: band.l + w * (0.12 + rand() * 0.1), y: band.t + h * 0.72 };
  if (isle.y + 16 < band.b) {
    marks.push(...lake(isle.x, isle.y, 20, 7, rand).slice(0, 1), {
      d: smooth(Array.from({ length: 9 }, (_, i) => ({ x: isle.x - 30 + i * 7.5, y: isle.y + 12 + Math.sin(i) * 1.5 }))),
      tone: 0.35,
      width: 0.6,
    });
  }
  return marks;
}

/** Small marks scattered over the remaining open country, kept clear of every word and of the road. */
function scatter(field: Box, taken: Box[], road: Point[], rand: () => number, cell: number): Mark {
  let d = "";
  const clear = (x: number, y: number) =>
    !taken.some((b) => x > b.l - 16 && x < b.r + 16 && y > b.t - 16 && y < b.b + 16) && !road.some((p) => Math.hypot(p.x - x, p.y - y) < 26);
  for (let y = field.t; y < field.b; y += cell) {
    for (let x = field.l; x < field.r; x += cell) {
      if (rand() > 0.3) continue;
      const px = x + rand() * cell;
      const py = y + rand() * cell;
      if (!clear(px, py)) continue;
      const kind = rand();
      if (kind < 0.7) {
        d += `M${pt(px - 9, py)}q9,-11 18,0M${pt(px + 4, py - 4)}l-1.4,3.4M${pt(px + 7, py - 2)}l-1,2`;
        if (rand() < 0.5) d += `M${pt(px + 7, py + 3)}q7,-9 14,0`;
      } else {
        d += `M${pt(px - 3.5, py)}h7M${pt(px, py)}l-2.2,-4.2M${pt(px, py)}v-5M${pt(px, py)}l2.2,-4.2`;
      }
    }
  }
  return { d, tone: 0.42, width: 0.8 };
}

/** Points along the road, for keeping scattered marks off it. */
function alongRoad(points: Point[]) {
  const out: Point[] = [];
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const q = points[i];
    const k = (q.y - p.y) / 2;
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      const u = 1 - t;
      out.push({
        x: u * u * u * p.x + 3 * u * u * t * p.x + 3 * u * t * t * q.x + t * t * t * q.x,
        y: u * u * u * p.y + 3 * u * u * t * (p.y + k) + 3 * u * t * t * (q.y - k) + t * t * t * q.y,
      });
    }
  }
  return out;
}

/** Read where the places, passes and open ground landed in the layout, and chart the road and the country through them. */
function chartSheet(sheet: HTMLElement): Chart {
  const box = sheet.getBoundingClientRect();
  const at = (el: Element): Box => {
    const r = el.getBoundingClientRect();
    return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top };
  };
  const wide = window.matchMedia("(min-width: 768px)").matches;
  const neat = wide ? 35 : 15;
  const rand = seeded(1954);
  const points: Point[] = [];
  const marks: Mark[] = [];
  const taken: Box[] = [];
  const ridges: Box[] = [];
  const opens: Box[] = [];
  let last: "pass" | "place" | null = null;

  const stops = Array.from(sheet.querySelectorAll<HTMLElement>("[data-stop]"));
  stops.forEach((stop, i) => {
    const m = at(stop);
    const here = { x: (m.l + m.r) / 2, y: (m.t + m.b) / 2 };
    if (i === 0) points.push({ x: here.x, y: wide ? 40 : 26 });

    if (stop.dataset.stop === "pass") {
      points.push(here);
      const header = stop.parentElement;
      const label = header?.querySelector("h3 span");
      if (label) taken.push(at(label));
      const ridge = header?.querySelector("[data-ridge]");
      if (ridge) {
        const strip = at(ridge);
        ridges.push(strip);
        taken.push(strip);
        marks.push(...range(strip, here.x, rand));
      }
      last = "pass";
      return;
    }

    const place = stop.closest("[data-place]");
    if (!place) return;
    taken.push(at(place), m);
    const prev = points[points.length - 1];
    if (last === "place") {
      // Swing out into the open ground behind the place just left, clear of the one ahead.
      const away = Math.sign(prev.x - box.width / 2) || -1;
      const x = wide ? box.width / 2 + away * box.width * (0.16 + rand() * 0.12) : prev.x + 9 + rand() * 7;
      points.push({ x, y: (prev.y + here.y) / 2 });
    }
    points.push(here);
    const bottom = at(place).b + 6;
    if (i < stops.length - 1 && bottom - here.y > 30) points.push({ x: here.x, y: bottom });

    const open = place.querySelector("[data-wilds]");
    if (open) {
      const area = at(open);
      if (area.r - area.l > 0) opens.push(area);
    }
    last = "place";
  });

  const terrain: Mark[] = [];
  opens.forEach((area, k) => {
    taken.push(area);
    terrain.push(...wilderness(area, k, rand, { mid: box.width / 2, edgeL: neat, edgeR: box.width - neat, ridges }));
  });

  const lastPlace = taken.reduce((b, t) => Math.max(b, t.b), 0);
  const band = { l: neat, r: box.width - neat, t: lastPlace + (wide ? 40 : 28), b: box.height - neat };
  sheet.querySelectorAll("[data-compass]").forEach((c) => {
    const b = at(c);
    if (b.r - b.l > 0) taken.push(b);
  });

  const field = { l: neat + 14, r: box.width - neat - 30, t: neat + 14, b: band.t - 24 };
  return {
    w: box.width,
    h: box.height,
    road: points.length > 1 ? trace(points) : "",
    marks: [scatter(field, taken, alongRoad(points), rand, wide ? 46 : 40), ...marks, ...terrain, ...(band.b - band.t > 60 ? coast(band, rand) : [])],
  };
}

function useChart(sheetRef: RefObject<HTMLDivElement>) {
  const [chart, setChart] = useState<Chart | null>(null);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    let frame = 0;
    const redraw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setChart(chartSheet(sheet)));
    };
    setChart(chartSheet(sheet));
    const observer = new ResizeObserver(redraw);
    observer.observe(sheet);
    document.fonts?.ready.then(redraw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [sheetRef]);

  return chart;
}

/** Ink the road down to wherever the reader has scrolled, with the Ring travelling at its head. */
function useJourney(
  chart: Chart | null,
  sheetRef: RefObject<HTMLDivElement>,
  roadRef: RefObject<SVGPathElement>,
  inkRef: RefObject<SVGPathElement>,
  ringRef: RefObject<SVGGElement>,
  still: boolean
) {
  useEffect(() => {
    const sheet = sheetRef.current;
    const road = roadRef.current;
    const ink = inkRef.current;
    const ring = ringRef.current;
    if (!chart?.road || !sheet || !road || !ink || !ring) return;

    const total = road.getTotalLength();
    const step = 6;
    const n = Math.max(1, Math.ceil(total / step));
    const ys = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) ys[i] = road.getPointAtLength(Math.min(i * step, total)).y;

    const lengthAt = (y: number) => {
      if (y <= ys[0]) return 0;
      if (y >= ys[n]) return total;
      let lo = 0;
      let hi = n;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
      }
      const f = (y - ys[lo]) / (ys[hi] - ys[lo] || 1);
      return Math.min(total, (lo + f) * step);
    };

    const place = (len: number) => {
      const p = road.getPointAtLength(len);
      ring.setAttribute("transform", `translate(${r1(p.x)} ${r1(p.y)})`);
    };
    ink.style.strokeDasharray = `${total} ${total}`;

    if (still) {
      ink.style.strokeDashoffset = "0";
      place(0);
      return;
    }

    let shown = -1;
    let target = 0;
    let frame = 0;
    const tick = () => {
      const next = shown < 0 ? target : shown + (target - shown) * 0.12;
      shown = Math.abs(target - next) < 0.5 ? target : next;
      ink.style.strokeDashoffset = String(total - shown);
      place(shown);
      frame = shown === target ? 0 : requestAnimationFrame(tick);
    };
    const follow = () => {
      target = lengthAt(window.innerHeight * 0.6 - sheet.getBoundingClientRect().top);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    follow();
    window.addEventListener("scroll", follow, { passive: true });
    window.addEventListener("resize", follow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", follow);
      window.removeEventListener("resize", follow);
    };
  }, [chart, sheetRef, roadRef, inkRef, ringRef, still]);
}

/** The years as a map of the journey: a road inked back from now to the start, through each place on the way. */
export function Timeline() {
  const stages = groupByYear(timeline);
  const sheetRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const inkRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const still = useReducedMotion() ?? false;
  const chart = useChart(sheetRef);
  useJourney(chart, sheetRef, roadRef, inkRef, ringRef, still);

  let n = 0;

  return (
    <div ref={sheetRef} className="relative isolate px-7 pb-44 pt-16 sm:px-10 md:px-16 md:pb-56 md:pt-24">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="map-burn" x="-4%" y="-2%" width="108%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 -z-20 h-96 bg-[radial-gradient(ellipse_55%_45%_at_50%_45%,hsl(var(--fire-deep)/0.28),transparent_70%)]" />
      <div aria-hidden="true" className="parchment absolute inset-0 -z-10" />
      <div aria-hidden="true" className="map-folds absolute inset-3 -z-10 md:inset-5" />
      <div aria-hidden="true" className="absolute inset-[11px] -z-10 border border-ink/35 md:inset-[30px]" />
      <div aria-hidden="true" className="absolute inset-[15px] -z-10 border border-ink/20 md:inset-[35px]" />

      {chart && (
        <svg
          aria-hidden="true"
          width={chart.w}
          height={chart.h}
          viewBox={`0 0 ${chart.w} ${chart.h}`}
          className="pointer-events-none absolute inset-0 -z-10 overflow-visible"
        >
          <defs>
            <mask id="road-inked" maskUnits="userSpaceOnUse" x={0} y={0} width={chart.w} height={chart.h}>
              <path ref={inkRef} d={chart.road} fill="none" stroke="white" strokeWidth={8} />
            </mask>
            <linearGradient id="ring-gilt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="hsl(var(--gilt-pale))" />
              <stop offset="0.35" stopColor="hsl(var(--gold-bright))" />
              <stop offset="0.55" stopColor="hsl(var(--gilt-deep))" />
              <stop offset="0.75" stopColor="hsl(var(--gilt-rich))" />
              <stop offset="1" stopColor="hsl(var(--gilt-shade))" />
            </linearGradient>
          </defs>
          <g strokeLinecap="round" strokeLinejoin="round">
            {chart.marks.map((mark, i) => (
              <path
                key={i}
                d={mark.d}
                fill={mark.fill ? "hsl(var(--parchment) / 0.6)" : "none"}
                stroke={mark.stroke === false ? "none" : `hsl(var(--ink) / ${mark.tone})`}
                strokeWidth={mark.width}
                strokeDasharray={mark.dash}
              />
            ))}
          </g>
          <path ref={roadRef} d={chart.road} fill="none" stroke="hsl(var(--ink) / 0.22)" strokeWidth={1.2} strokeDasharray="7 6" strokeLinecap="round" />
          <path d={chart.road} fill="none" stroke="hsl(var(--ink-red))" strokeWidth={1.8} strokeDasharray="7 6" strokeLinecap="round" mask="url(#road-inked)" />
          <g ref={ringRef} style={{ filter: "drop-shadow(0 2px 1.5px hsl(var(--scorch) / 0.55))" }}>
            <circle r={7} fill="none" stroke="url(#ring-gilt)" strokeWidth={3.4} />
            <circle r={8.6} fill="none" stroke="hsl(var(--gilt-pale) / 0.5)" strokeWidth={0.5} />
          </g>
        </svg>
      )}

      <Compass className="absolute left-8 top-10 hidden w-[4.5rem] text-ink/70 md:block" />
      <Compass className="absolute right-6 top-6 w-11 text-ink/70 md:hidden" />

      <ol>
        {stages.map((stage, s) => {
          const flip = s % 2 === 1;
          return (
            <li key={stage.year}>
              <div className="relative flex h-28 items-center md:h-40">
                <h3
                  className={cn(
                    "pl-11 font-display text-[1.75rem] font-semibold leading-none tracking-[0.42em] text-ink md:w-[44%] md:pl-0 md:text-[2.9rem]",
                    flip ? "md:ml-auto md:text-left" : "md:text-right"
                  )}
                >
                  {/* Pull the trailing tracking back so the year sits flush against the pass. */}
                  <span className={cn(!flip && "md:-mr-[0.42em]")}>{stage.year}</span>
                </h3>
                <span data-stop="pass" aria-hidden="true" className="absolute left-4 top-1/2 h-0 w-0 md:left-1/2" />
                <span
                  data-ridge
                  aria-hidden="true"
                  className={cn(
                    "absolute right-0 top-1/2 h-14 w-[34%] -translate-y-1/2 md:h-24 md:w-[42%]",
                    flip ? "md:left-[4%] md:right-auto" : "md:right-[4%]"
                  )}
                />
              </div>

              <ol className="space-y-14 pb-6 md:space-y-24 md:pb-10">
                {stage.entries.map((item) => {
                  const left = n++ % 2 === 0;
                  return (
                    <li
                      key={`${stage.year}-${item.title}`}
                      data-place
                      className={cn("relative pl-11 md:w-[44%] md:pl-0", left ? "md:mr-auto md:text-right" : "md:ml-auto")}
                    >
                      <span
                        data-stop="place"
                        aria-hidden="true"
                        className={cn(
                          "absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full text-ink",
                          "bg-[radial-gradient(circle,hsl(var(--parchment))_55%,hsl(var(--parchment)/0)_72%)]",
                          left ? "md:-right-12 md:left-auto" : "md:-left-12"
                        )}
                      >
                        <PlaceSymbol type={item.type} />
                      </span>
                      <span
                        data-wilds
                        aria-hidden="true"
                        className={cn("absolute inset-y-2 hidden w-[82%] md:block", left ? "left-[136%]" : "-left-[118%]")}
                      />
                      <h4 className="font-display text-[1.12rem] font-semibold leading-snug tracking-[0.02em] text-ink md:text-[1.3rem]">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 italic text-ink-red">{item.company}</p>
                      <p className="mt-3 leading-[1.7] text-ink-faded [font-weight:400]">{item.description}</p>
                      {"link" in item && item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="credit mt-4 inline-flex min-h-11 items-center gap-1.5 text-[0.64rem] text-ink-red underline decoration-ink-red/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                        >
                          {item.linkLabel ?? "Learn more"}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
