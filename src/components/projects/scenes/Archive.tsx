import { pt, r1, ring, seeded, smooth, type Point } from "@/lib/drawing";
import { Ember, Etching, Flame, Knock, Lines, Pool, Smoke } from "../Etching";
import { H, W } from "../plate";

const rand = seeded(1138);

const CANDLE = { x: 704, flame: 258 };
const TABLE = 314;

/** One scroll seen end-on: its rolled edge, the rod at its heart, and a turn of the roll between. */
const scrollEnd = (x: number, y: number, r: number) => {
  const a = rand() * Math.PI * 2;
  const s = r * 0.62;
  return {
    rim: ring(x, y, r),
    detail: ring(x, y, r * 0.26) + `M${pt(x + s * Math.cos(a), y + s * Math.sin(a))}A${r1(s)},${r1(s)} 0 1 1 ${pt(x + s * Math.cos(a + 4.4), y + s * Math.sin(a + 4.4))}`,
  };
};

// The wall of pigeonholes: most stacked with scrolls, some with bound books, a few tagged.
const CELL = { w: 92, h: 70, board: 6 };
const wall = (() => {
  let frame = "";
  let rims = "";
  let detail = "";
  let tags = "";
  let books = "";
  const ends: (Point & { r: number })[] = [];
  for (let y = -30; y < TABLE; y += CELL.h) frame += `M0,${y}H${W}M0,${y + CELL.board}H${W}`;
  for (let x = -40; x < W; x += CELL.w) frame += `M${x},0V${TABLE}M${x + CELL.board},0V${TABLE}`;
  for (let cy = -30; cy < TABLE; cy += CELL.h) {
    for (let cx = -40; cx < W; cx += CELL.w) {
      const floor = cy + CELL.h;
      const left = cx + CELL.board + 3;
      const room = CELL.w - CELL.board - 6;
      const roll = rand();
      if (roll < 0.08) continue;
      if (roll < 0.3) {
        // Books standing on end, a few leaning.
        let x = left + 2;
        while (x < left + room - 10) {
          const w = 7 + rand() * 7;
          const h = 34 + rand() * 22;
          const lean = rand() < 0.15 ? 6 : 0;
          books += `M${pt(x, floor)}L${pt(x + lean, floor - h)}H${r1(x + lean + w)}L${pt(x + w, floor)}M${pt(x + lean * 0.2, floor - h * 0.2)}h${r1(w)}M${pt(x + lean * 0.8, floor - h * 0.82)}h${r1(w)}`;
          x += w + (lean ? 2 : 0.6);
        }
        continue;
      }
      const r = 10 + rand() * 2.4;
      const across = Math.floor(room / (r * 2));
      const rows = rand() < 0.4 ? 2 : 3;
      const pad = (room - across * r * 2) / 2;
      for (let row = 0; row < rows; row++) {
        const count = across - row;
        for (let i = 0; i < count; i++) {
          if (row > 0 && rand() < 0.2) continue;
          const x = left + pad + r + row * r + i * r * 2 + (rand() - 0.5) * 1.4;
          const y = floor - r - row * r * 1.72 - 0.5;
          const e = scrollEnd(x, y, r * (0.9 + rand() * 0.12));
          rims += e.rim;
          detail += e.detail;
          if (row === 0) ends.push({ x, y, r: r * 0.95 });
          if (row === 0 && i === count - 1 && rand() < 0.25) {
            tags += `M${pt(x + r * 0.4, y + r * 0.5)}L${pt(x + r * 0.9, floor + 10)}M${pt(x + r * 0.9 - 4, floor + 10)}h8l-1,11h-6Z`;
          }
        }
      }
    }
  }
  return { frame, rims, detail, tags, books, ends };
})();

// The seven scrolls the reader has sent for come well out of their holes toward the reader, and kindle in turn.
const RETRIEVED = (() => {
  const wanted = [
    { x: 250, y: 110 },
    { x: 520, y: 40 },
    { x: 150, y: 250 },
    { x: 460, y: 250 },
    { x: 820, y: 170 },
    { x: 640, y: 110 },
    { x: 330, y: 180 },
  ];
  const used = new Set<(typeof wall.ends)[number]>();
  return wanted.map((w) => {
    let best = wall.ends[0];
    let gap = Infinity;
    for (const e of wall.ends) {
      const g = Math.hypot(e.x - w.x, e.y - w.y);
      if (g < gap && !used.has(e)) {
        best = e;
        gap = g;
      }
    }
    used.add(best);
    // Foreshortened toward the reader: the near end is larger and lower, and the body joins it to the hole.
    const near = { x: best.x + best.r * 1.2, y: best.y + best.r * 2.4, r: best.r * 1.6 };
    const dx = near.x - best.x;
    const dy = near.y - best.y;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    const a1 = { x: best.x + nx * best.r, y: best.y + ny * best.r };
    const a2 = { x: best.x - nx * best.r, y: best.y - ny * best.r };
    const b1 = { x: near.x + nx * near.r, y: near.y + ny * near.r };
    const b2 = { x: near.x - nx * near.r, y: near.y - ny * near.r };
    const body = `M${pt(a1.x, a1.y)}L${pt(b1.x, b1.y)}L${pt(b2.x, b2.y)}L${pt(a2.x, a2.y)}Z`;
    const edges = `M${pt(a1.x, a1.y)}L${pt(b1.x, b1.y)}M${pt(a2.x, a2.y)}L${pt(b2.x, b2.y)}`;
    // The roll's body is shaded along its far side, and a ribbon ties it at the middle.
    let shade = "";
    for (let t = 0.12; t < 0.9; t += 0.07) {
      const cx = a1.x + (b1.x - a1.x) * t;
      const cy = a1.y + (b1.y - a1.y) * t;
      const r = best.r + (near.r - best.r) * t;
      shade += `M${pt(cx, cy)}l${r1(-nx * r * 0.45)},${r1(-ny * r * 0.45)}`;
    }
    const m = 0.55;
    const tie = `M${pt(a1.x + (b1.x - a1.x) * m, a1.y + (b1.y - a1.y) * m)}L${pt(a2.x + (b2.x - a2.x) * m, a2.y + (b2.y - a2.y) * m)}`;
    return { near, body, edges, shade, tie, hole: ring(best.x, best.y, best.r) };
  });
})();

// The desk in front: its top running back to the wall, with an unrolled scroll, the candle and the ink.
const desk = `M0,${TABLE}H${W}V${H}H0Z`;
const deskLines = `M0,${TABLE}H${W}M0,${TABLE + 3}H${W}M0,372H${W}M0,377H${W}M0,384H${W}`;

const sheet = (() => {
  const l = 214;
  const r = 572;
  const top = 330;
  const bottom = 364;
  const curve = (y: number, lift: number) => smooth([{ x: l, y }, { x: (l + r) / 2, y: y - lift }, { x: r, y }]);
  const roll = (x: number) => `M${pt(x - 6, top - 4)}A6,4 0 0 0 ${pt(x + 6, top - 4)}A6,4 0 0 0 ${pt(x - 6, top - 4)}M${pt(x - 6, top - 4)}L${pt(x - 6, bottom + 4)}A6,4 0 0 0 ${pt(x + 6, bottom + 4)}L${pt(x + 6, top - 4)}`;
  const body = `${curve(top, 3)}L${pt(r, bottom)}${smooth([{ x: r, y: bottom }, { x: (l + r) / 2, y: bottom - 3 }, { x: l, y: bottom }]).replace(/^M[^C]+/, "")}Z`;
  // Writing: rows of invented strokes, not any real script.
  let script = "";
  for (let row = 0; row < 5; row++) {
    const y = top + 6 + row * 5.6;
    let x = l + 18 + rand() * 6;
    while (x < r - 30) {
      const len = 8 + rand() * 22;
      let d = `M${pt(x, y)}`;
      for (let t = 2.4; t <= len; t += 2.4) d += `L${pt(x + t, y - (Math.sin(t * 1.7 + row) > 0.3 ? 1.6 : 0.2))}`;
      script += d;
      x += len + 5 + rand() * 4;
    }
  }
  return { body, rolls: roll(l) + roll(r), script };
})();

const candle = (() => {
  const { x } = CANDLE;
  const dish = `M${x - 36},366A36,7 0 0 0 ${x + 36},366A36,7 0 0 0 ${x - 36},366ZM${x - 36},366V369A36,7 0 0 0 ${x + 36},369V366`;
  const stick = `M${x - 7},364C${x - 8},356 ${x - 5},352 ${x - 17},346H${x + 17}C${x + 5},352 ${x + 8},356 ${x + 7},364Z`;
  const wax = `M${x - 13},346V272C${x - 8},268 ${x + 8},268 ${x + 13},272V346Z`;
  const drips = `M${x - 13},277C${x - 16},288 ${x - 12},298 ${x - 15},310C${x - 16},314 ${x - 12},316 ${x - 12},310M${x + 8},270C${x + 12},280 ${x + 9},288 ${x + 13},294M${x - 7},346V326M${x + 4},346V336M${x - 2},270C${x - 3},280 ${x + 1},284 ${x - 1},292M${x},269V${CANDLE.flame + 4}`;
  const handle = `M${x + 36},366C${x + 52},366 ${x + 52},352 ${x + 40},352`;
  return { body: dish + stick + wax, lines: dish + stick + wax + drips + handle };
})();

const quill = (() => {
  const pot = `M790,346C786,358 788,366 800,368H830C842,366 844,358 840,346ZM790,346A25,5 0 0 1 840,346`;
  const spine: Point[] = [
    { x: 814, y: 344 },
    { x: 830, y: 312 },
    { x: 852, y: 282 },
    { x: 880, y: 256 },
  ];
  let barbs = "";
  for (let t = 0.32; t < 1; t += 0.035) {
    const i = Math.min(2, Math.floor(t * 3));
    const f = t * 3 - i;
    const a = spine[i];
    const b = spine[i + 1];
    const x = a.x + (b.x - a.x) * f;
    const y = a.y + (b.y - a.y) * f;
    const reach = 14 * Math.sin(Math.PI * Math.min(1, (t - 0.28) / 0.72));
    barbs += `M${pt(x, y)}l${r1(-reach * 0.9)},${r1(-reach * 0.25)}M${pt(x, y)}l${r1(reach * 0.35)},${r1(reach * 0.75)}`;
  }
  return { pot, spine: smooth(spine), barbs };
})();

// Two closed scrolls lying on the desk at the left, tied.
const closed = (() => {
  let d = "";
  for (const [x, y, len] of [[70, 352, 112], [92, 336, 96]]) {
    d += `M${x},${y - 7}H${x + len}M${x},${y + 7}H${x + len}M${x},${y - 7}A4,7 0 0 0 ${x},${y + 7}A4,7 0 0 0 ${x},${y - 7}M${x + len},${y - 7}A4,7 0 0 1 ${x + len},${y + 7}`;
    d += `M${x + len * 0.5},${y - 7}V${y + 7}M${x + len * 0.5 + 3},${y - 7}V${y + 7}M${x + len * 0.5 + 1.5},${y + 7}l-4,9M${x + len * 0.5 + 1.5},${y + 7}l5,8`;
  }
  return d;
})();

/** StockRAG: an archive of scrolls by candlelight, the few the reader needs kindling one by one. */
export function Archive({ lit, playing }: { lit: boolean; playing: boolean }) {
  return (
    <Etching lit={lit} playing={playing} light={{ x: CANDLE.x - 60, y: CANDLE.flame - 40, r: 600 }}>
      {(ink) => (
        <>
          <g className="etch-lines">
            <Lines d={wall.frame} ink={ink} width={0.8} opacity={0.5} />
            <Lines d={wall.rims} ink={ink} width={0.75} opacity={0.85} />
            <Lines d={wall.detail} ink={ink} width={0.45} opacity={0.7} />
            <Lines d={wall.tags} ink={ink} width={0.6} opacity={0.8} />
            <Lines d={wall.books} ink={ink} width={0.7} opacity={0.85} />
            {RETRIEVED.map((s, i) => (
              <g key={i}>
                <Knock d={s.hole + s.body} />
                <Lines d={s.shade} ink={ink} width={0.6} />
                <Lines d={s.edges + s.tie} ink={ink} width={1.3} />
                <Knock d={ring(s.near.x, s.near.y, s.near.r)} />
                <Lines d={ring(s.near.x, s.near.y, s.near.r) + ring(s.near.x, s.near.y, s.near.r * 0.62) + ring(s.near.x, s.near.y, s.near.r * 0.24)} ink={ink} width={1.2} />
              </g>
            ))}

            <Knock d={desk} />
            <Lines d={deskLines} ink={ink} width={0.8} opacity={0.7} />
            <Knock d={sheet.body} />
            <Lines d={sheet.body + sheet.rolls} ink={ink} width={0.9} />
            <Lines d={sheet.script} ink={ink} width={0.55} opacity={0.75} />
            <Lines d={closed} ink={ink} width={0.8} />
            <Knock d={quill.pot} />
            <Lines d={quill.pot} ink={ink} width={0.9} />
            <Lines d={quill.barbs} ink={ink} width={0.45} opacity={0.85} />
            <Lines d={quill.spine} ink={ink} width={1} />
            <Knock d={candle.body} />
            <Lines d={candle.lines} ink={ink} width={0.95} />
          </g>

          <g className="etch-fire">
            <Pool x={CANDLE.x} y={CANDLE.flame - 20} rx={360} ry={240} ink={ink} delay={400} />
            {RETRIEVED.map((s, i) => (
              <g key={i}>
                <Pool x={s.near.x} y={s.near.y} rx={s.near.r * 3.4} ry={s.near.r * 3} ink={ink} delay={1300 + i * 380} />
                <Ember d={ring(s.near.x, s.near.y, s.near.r)} ink={ink} delay={1300 + i * 380} width={1.4} />
              </g>
            ))}
            <Smoke x={CANDLE.x} y={CANDLE.flame - 34} rise={120} drift={26} ink={ink} delay={1200} strands={1} width={0.6} />
            <Flame x={CANDLE.x} y={CANDLE.flame} size={36} ink={ink} delay={300} sparks={false} />
            {/* The wick, dark against the flame's root. */}
            <path d={`M${CANDLE.x},270C${CANDLE.x + 0.5},264 ${CANDLE.x - 1},260 ${CANDLE.x + 1.5},254`} fill="none" style={{ stroke: "hsl(var(--ink))" }} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </>
      )}
    </Etching>
  );
}
