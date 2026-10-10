import { pt, r1, ring, seeded, smooth, type Point } from "@/lib/drawing";
import { Ember, Etching, Flame, Knock, Lines, Pool, Smoke } from "../Etching";
import { H, W } from "../plate";

const rand = seeded(2941);

const GROUND = 328;
const KILN = { x: 470, apex: 112, half: 124, mouth: 50 };
const WHEEL = { x: 800, y: 160, r: 98 };

const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos((deg * Math.PI) / 180),
  y: cy + r * Math.sin((deg * Math.PI) / 180),
});

// The hall is hewn out of the mountain: bedding planes run across the rock at uneven
// spacing, dipping and breaking off, cut through here and there by cracks and pick-marks.
const strata = (() => {
  let beds = "";
  let cracks = "";
  let y = 18;
  while (y < GROUND - 14) {
    const dip = (rand() - 0.5) * 0.08;
    let x = -10 + rand() * 60;
    while (x < W) {
      const len = 30 + rand() * rand() * 260;
      if (rand() > 0.3) {
        const pts: Point[] = [];
        for (let t = 0; t <= 1.0001; t += 0.2) pts.push({ x: x + len * t, y: y + (x + len * t) * dip + (rand() - 0.5) * 4 });
        beds += smooth(pts);
      }
      x += len + 14 + rand() * 70;
    }
    y += 10 + rand() * rand() * 46;
  }
  for (let i = 0; i < 22; i++) {
    const cx = rand() * W;
    const cy = 20 + rand() * (GROUND - 60);
    let d = `M${pt(cx, cy)}`;
    let px = cx;
    let py = cy;
    for (let k = 0; k < 3 + Math.floor(rand() * 3); k++) {
      px += (rand() - 0.5) * 12;
      py += 6 + rand() * 9;
      d += `L${pt(px, py)}`;
    }
    cracks += d;
  }
  return { beds, cracks };
})();
const ground = (() => {
  const pts: Point[] = [];
  for (let x = -10; x <= W + 10; x += 40) pts.push({ x, y: GROUND + (rand() - 0.5) * 4 });
  return smooth(pts);
})();
// Stones on the floor: small rounded shapes, more of them and larger toward the front.
const stones = (() => {
  let d = "";
  for (let i = 0; i < 34; i++) {
    const y = GROUND + 8 + rand() ** 0.7 * (H - GROUND - 8);
    const x = rand() * W;
    const near = (y - GROUND) / (H - GROUND);
    const r = 2 + near * 5 * (0.6 + rand() * 0.6);
    d += `M${pt(x - r, y)}C${pt(x - r, y - r * 1.1)} ${pt(x + r * 0.8, y - r * 1.2)} ${pt(x + r, y)}Z`;
  }
  return d;
})();

// The kiln: a dome of fitted stone, bound with iron, its mouth full of fire and a flue rising out of frame.
const dome = (() => {
  const l = KILN.x - KILN.half;
  const r = KILN.x + KILN.half;
  const outline = `M${l},${GROUND}C${l},${GROUND - 120} ${KILN.x - 70},${KILN.apex} ${KILN.x},${KILN.apex}C${KILN.x + 70},${KILN.apex} ${r},${GROUND - 120} ${r},${GROUND}Z`;
  // Sample the right side of the dome so bands and hatching can follow its curve.
  const right: Point[] = [];
  for (let t = 0; t <= 1.0001; t += 0.02) {
    const u = 1 - t;
    const p = [
      { x: KILN.x, y: KILN.apex },
      { x: KILN.x + 70, y: KILN.apex },
      { x: r, y: GROUND - 120 },
      { x: r, y: GROUND },
    ];
    right.push({
      x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
      y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
    });
  }
  const widthAt = (y: number) => {
    for (let i = 1; i < right.length; i++) if (right[i].y >= y) return right[i].x - KILN.x;
    return KILN.half;
  };
  let bands = "";
  let rivets = "";
  for (const y of [176, 246]) {
    const w = widthAt(y);
    const w2 = widthAt(y + 8);
    bands += smooth([{ x: KILN.x - w, y }, { x: KILN.x, y: y + 9 }, { x: KILN.x + w, y }]);
    bands += smooth([{ x: KILN.x - w2, y: y + 8 }, { x: KILN.x, y: y + 17 }, { x: KILN.x + w2, y: y + 8 }]);
    for (let i = -3; i <= 3; i++) {
      const t = i / 3.6;
      rivets += ring(KILN.x + t * w * 0.94, y + 4.5 + 9 * (1 - t * t), 1.4);
    }
  }
  // Stone courses between the bands, curving with the dome.
  let courses = "";
  for (const y of [146, 212, 286]) {
    const w = widthAt(y);
    courses += smooth([{ x: KILN.x - w, y }, { x: KILN.x, y: y + 7 }, { x: KILN.x + w, y }]);
  }
  // Hatching on the shadowed right of the dome, following its curve.
  let shade = "";
  for (let i = 8; i < right.length - 2; i++) {
    const p = right[i];
    const len = 10 + (i / right.length) * 26;
    shade += `M${pt(p.x - 2, p.y + 1)}l${r1(-len)},${r1(len * 0.12)}`;
  }
  return { outline, bands, rivets, courses, shade };
})();

const MOUTH_Y = GROUND - 62;
const mouth = `M${KILN.x - KILN.mouth},${GROUND - 14}V${MOUTH_Y}A${KILN.mouth},${KILN.mouth} 0 0 1 ${KILN.x + KILN.mouth},${MOUTH_Y}V${GROUND - 14}Z`;
const mouthStones = (() => {
  let d = `M${KILN.x - KILN.mouth - 16},${GROUND - 14}V${MOUTH_Y}A${KILN.mouth + 16},${KILN.mouth + 16} 0 0 1 ${KILN.x + KILN.mouth + 16},${MOUTH_Y}V${GROUND - 14}`;
  for (let a = 180; a <= 360; a += 20) {
    const p = polar(KILN.x, MOUTH_Y, KILN.mouth, a);
    const q = polar(KILN.x, MOUTH_Y, KILN.mouth + 16, a);
    d += `M${pt(p.x, p.y)}L${pt(q.x, q.y)}`;
  }
  d += `M${KILN.x - KILN.mouth - 22},${GROUND - 14}H${KILN.x + KILN.mouth + 22}V${GROUND - 4}H${KILN.x - KILN.mouth - 22}Z`;
  return d;
})();
const flue = `M${KILN.x - 16},${KILN.apex + 4}V44H${KILN.x - 22}V34H${KILN.x + 22}V44H${KILN.x + 16}V${KILN.apex + 4}Z`;
const flueLines = `M${KILN.x - 16},84H${KILN.x + 16}M${KILN.x - 16},90H${KILN.x + 16}M${KILN.x + 6},48V${KILN.apex}M${KILN.x + 11},48V${KILN.apex}`;

const coals = (() => {
  let d = "";
  for (let i = 0; i < 18; i++) {
    const x = KILN.x - KILN.mouth + 8 + rand() * (KILN.mouth * 2 - 16);
    const y = GROUND - 16 - rand() * 7 * (1 - Math.abs(x - KILN.x) / KILN.mouth);
    const r = 3 + rand() * 3;
    d += `M${pt(x - r, y)}Q${pt(x - r * 0.6, y - r * 1.3)} ${pt(x + r * 0.2, y - r)}Q${pt(x + r * 1.1, y - r * 0.6)} ${pt(x + r, y)}`;
  }
  return d;
})();

const FIRES = [
  { x: KILN.x - 26, size: 34, delay: 500 },
  { x: KILN.x + 2, size: 48, delay: 300 },
  { x: KILN.x + 28, size: 36, delay: 650 },
];

// Great bellows on a trestle, their nozzle run into the kiln's flank.
const bellows = (() => {
  const body = `M232,262L338,280L338,292L232,312C214,304 210,270 232,262Z`;
  let pleats = "";
  for (let i = 1; i < 6; i++) {
    const x = 232 + i * 17;
    pleats += `M${pt(x, 262 + i * 3)}Q${pt(x - 5, 287)} ${pt(x, 312 - i * 3.4)}`;
  }
  const nozzle = `M338,282L${KILN.x - KILN.half + 8},280M338,290L${KILN.x - KILN.half + 8},288`;
  const handle = `M226,268L196,250M226,306L196,322`;
  const trestle = `M246,309L238,${GROUND}M324,292L332,${GROUND}M240,320H330`;
  return { body, lines: body + pleats + nozzle + handle + trestle };
})();

// The anvil on its stump, in the near ground, and a ring left on its face.
const anvil = `M98,302C120,300 146,298 166,296H300V312C288,314 282,316 276,322C270,328 268,334 270,340H286L292,350H184L190,340H206C208,332 204,324 192,318C174,312 138,308 98,302Z`;
const anvilLines = `M166,296V307M174,306H270M166,307C142,306 120,304 98,302M206,340H270`;
const anvilShade = (() => {
  let d = "";
  for (let x = 252; x < 298; x += 3.2) d += `M${pt(x, 314 + (x - 252) * 0.1)}L${pt(x - 3, 338)}`;
  for (let x = 196; x < 214; x += 3) d += `M${pt(x, 324)}L${pt(x + 2, 338)}`;
  return d;
})();
const stump = `M176,350H300L304,${H + 4}H172Z`;
const stumpLines = (() => {
  let d = "";
  for (let i = 0; i < 7; i++) {
    const x = 184 + i * 17 + rand() * 6;
    d += smooth([
      { x, y: 354 },
      { x: x + (rand() - 0.5) * 6, y: 376 },
      { x: x + (rand() - 0.5) * 4, y: H },
    ]);
  }
  for (let x = 282; x < 302; x += 3) d += `M${pt(x, 354)}L${pt(x + 1, H)}`;
  return d;
})();
const ANVIL_RING = { x: 254, y: 294 };

// The hour-wheel, cut into a stone boss on the rock: the sun above the hub, the moon below.
const wheel = (() => {
  const { x, y, r } = WHEEL;
  let teeth = "";
  for (let i = 0; i < 24; i++) {
    const a = i * 15 - 90;
    const p = polar(x, y, r, a - 3.4);
    const q = polar(x, y, r + 9, a - 2.6);
    const s = polar(x, y, r + 9, a + 2.6);
    const t = polar(x, y, r, a + 3.4);
    teeth += `M${pt(p.x, p.y)}L${pt(q.x, q.y)}L${pt(s.x, s.y)}L${pt(t.x, t.y)}`;
  }
  const rims = ring(x, y, r) + ring(x, y, r - 6) + ring(x, y, 60) + ring(x, y, 12) + ring(x, y, 4.5);
  let spokes = "";
  for (let i = 0; i < 6; i++) {
    const a = i * 60 + 30;
    for (const off of [-3, 3]) {
      const p = polar(x, y, 12, a + off * 2.2);
      const q = polar(x, y, 60, a + off * 0.5);
      spokes += `M${pt(p.x, p.y)}L${pt(q.x, q.y)}`;
    }
  }
  // Hatching in the rim's shadowed lower right.
  let shade = "";
  for (let a = -10; a < 100; a += 4) {
    const p = polar(x, y, r - 5, a);
    const q = polar(x, y, r - 0.5, a + 1);
    shade += `M${pt(p.x, p.y)}L${pt(q.x, q.y)}`;
  }
  const ticks: string[] = [];
  for (let i = 0; i < 24; i++) {
    const a = i * 15 - 90;
    const p = polar(x, y, 70, a);
    const q = polar(x, y, i % 6 === 0 ? 87 : 81, a);
    ticks.push(`M${pt(p.x, p.y)}L${pt(q.x, q.y)}`);
  }
  let sun = ring(x, y - 34, 7.5);
  for (let i = 0; i < 12; i++) {
    const p = polar(x, y - 34, 10.5, i * 30);
    const q = polar(x, y - 34, i % 2 ? 14 : 17, i * 30);
    sun += `M${pt(p.x, p.y)}L${pt(q.x, q.y)}`;
  }
  const moon = `M${x - 4},${y + 24}A11,11 0 1 0 ${x - 4},${y + 46}A8.5,8.5 0 1 1 ${x - 4},${y + 24}Z`;
  const boss = ring(x, y, r + 22);
  // The hand points into the night hours, drawn in gold like the rest of the wheel.
  const tip = polar(x, y, 66, 104);
  const l = polar(x, y, 6, 14);
  const rr = polar(x, y, 6, 194);
  const tail = polar(x, y, 18, 284);
  const hand = `M${pt(tail.x, tail.y)}L${pt(l.x, l.y)}L${pt(tip.x, tip.y)}L${pt(rr.x, rr.y)}ZM${pt(x, y)}L${pt(tip.x, tip.y)}`;
  return { teeth, rims, spokes, shade, ticks, sun, moon, boss, hand };
})();

// Night runs from ten in the evening to six in the morning: midnight sits at the foot of the wheel.
const NIGHT = [22, 23, 0, 1, 2, 3, 4, 5];
const hourTick = (h: number) => wheel.ticks[(h + 12) % 24];

/** GridSmart: a forge hewn into the mountain that works through the night, when the hour-wheel says the fire is cheapest. */
export function Forge({ lit, playing }: { lit: boolean; playing: boolean }) {
  return (
    <Etching lit={lit} playing={playing} light={{ x: KILN.x, y: GROUND - 50, r: 640 }}>
      {(ink) => (
        <>
          <g className="etch-lines">
            <Lines d={strata.beds} ink={ink} width={0.55} opacity={0.45} />
            <Lines d={strata.cracks} ink={ink} width={0.5} opacity={0.4} />
            <Knock d={`M0,${GROUND}H${W}V${H}H0Z`} />
            <Lines d={stones} ink={ink} width={0.6} opacity={0.6} />
            <Lines d={ground} ink={ink} width={1.1} />

            <Knock d={wheel.boss} />
            <Lines d={wheel.boss} ink={ink} width={0.6} opacity={0.5} />
            <Lines d={wheel.teeth + wheel.rims} ink={ink} width={0.95} />
            <Lines d={wheel.shade} ink={ink} width={0.45} opacity={0.7} />
            <Lines d={wheel.spokes} ink={ink} width={0.7} />
            <Lines d={wheel.ticks.join("")} ink={ink} width={1} />
            <Lines d={wheel.sun + wheel.moon} ink={ink} width={0.8} />
            <Knock d={wheel.hand} />
            <Lines d={wheel.hand} ink={ink} width={1} />

            <Knock d={flue} />
            <Lines d={flue + flueLines} ink={ink} width={0.9} />
            <Knock d={dome.outline} />
            <Lines d={dome.shade} ink={ink} width={0.45} opacity={0.7} />
            <Lines d={dome.courses} ink={ink} width={0.6} opacity={0.7} />
            <Lines d={dome.bands} ink={ink} width={1} />
            <path d={dome.rivets} fill={`url(#${ink.gold})`} />
            <Lines d={dome.outline} ink={ink} width={1.25} />
            <Knock d={mouthStones} />
            <Lines d={mouthStones} ink={ink} width={1} />
            <Knock d={mouth} />

            <Knock d={bellows.body} />
            <Lines d={bellows.lines} ink={ink} width={1} />
          </g>

          <g className="etch-fire">
            <Pool x={KILN.x} y={GROUND - 40} rx={380} ry={240} ink={ink} delay={300} />
            <Pool x={KILN.x} y={GROUND + 16} rx={320} ry={50} ink={ink} delay={500} />
            <Smoke x={KILN.x} y={36} rise={70} drift={-30} ink={ink} delay={1400} strands={3} width={0.7} />
            {FIRES.map((f, i) => (
              <Flame key={i} x={f.x} y={GROUND - 14} size={f.size} ink={ink} delay={f.delay} sparks={i === 1} />
            ))}
            <Ember d={coals} ink={ink} delay={200} width={0.9} />
            {NIGHT.map((h, i) => (
              <Ember key={h} d={hourTick(h)} ink={ink} delay={1100 + i * 160} width={1.4} />
            ))}
          </g>

          {/* The anvil stands in the near ground, cut dark in front of the hall like paper. */}
          <g className="etch-lines">
            <Knock d={anvil + stump} />
            <Lines d={anvilShade} ink={ink} width={0.55} opacity={0.8} />
            <Lines d={anvil + anvilLines} ink={ink} width={1.6} />
            <Lines d={stump + stumpLines} ink={ink} width={1} />
          </g>
          <g className="etch-fire">
            <Pool x={ANVIL_RING.x} y={ANVIL_RING.y} rx={40} ry={24} ink={ink} delay={2000} />
            <Ember d={`M${ANVIL_RING.x - 9},${ANVIL_RING.y}A9,3 0 1 0 ${ANVIL_RING.x + 9},${ANVIL_RING.y}A9,3 0 1 0 ${ANVIL_RING.x - 9},${ANVIL_RING.y}Z`} ink={ink} delay={2000} width={1.6} />
          </g>
        </>
      )}
    </Etching>
  );
}
