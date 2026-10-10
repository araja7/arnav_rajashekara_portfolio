import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface GoldRingProps {
  ignited: boolean;
  onFail: () => void;
  className?: string;
}

// The band, in world units: a heavy comfort-fit band, domed outside and gently
// rounded inside, about a quarter as wide as it is across the finger hole.
const INNER = 1;
const OUTER = 1.22;
const HALF_WIDTH = 0.25;
const ROUNDNESS = 2.6; // superellipse exponent of the cross-section

const AROUND = 512;
const PROFILE = 128;

const TEX_W = 4096;
const TEX_H = 640;
const IGNITE_MS = 2200;

/** Cross-section of the band in (r, z), resampled to even arc length, with outward normals. */
function bandProfile() {
  const mid = (INNER + OUTER) / 2;
  const half = (OUTER - INNER) / 2;
  const f = (x: number) => Math.sign(x) * Math.abs(x) ** (2 / ROUNDNESS);
  // Starts on the lower edge, crosses the outer face, the upper edge, then the inner face.
  const dense: [number, number][] = [];
  const N = 4096;
  for (let i = 0; i <= N; i++) {
    const p = -Math.PI / 2 + (i / N) * Math.PI * 2;
    dense.push([mid + half * f(Math.cos(p)), HALF_WIDTH * f(Math.sin(p))]);
  }
  const lengths = [0];
  for (let i = 1; i <= N; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  }
  const total = lengths[N];
  const at = (s: number): [number, number] => {
    let k = 1;
    while (k < N && lengths[k] < s) k++;
    const t = (s - lengths[k - 1]) / (lengths[k] - lengths[k - 1] || 1);
    return [dense[k - 1][0] + (dense[k][0] - dense[k - 1][0]) * t, dense[k - 1][1] + (dense[k][1] - dense[k - 1][1]) * t];
  };

  const points: { r: number; z: number; nr: number; nz: number; v: number }[] = [];
  for (let j = 0; j <= PROFILE; j++) {
    const s = (j / PROFILE) * total;
    const [r, z] = at(s);
    const [r0, z0] = at((s - total / 2048 + total) % total);
    const [r1, z1] = at((s + total / 2048) % total);
    const len = Math.hypot(z1 - z0, r1 - r0) || 1;
    points.push({ r, z, nr: (z1 - z0) / len, nz: -(r1 - r0) / len, v: j / PROFILE });
  }
  // Where the middle of each face falls in v, and the length of the cross-section.
  const outerV = lengths[N / 4] / total;
  const innerV = lengths[(3 * N) / 4] / total;
  return { points, total, outerV, innerV };
}

function bandGeometry(profile: ReturnType<typeof bandProfile>["points"]) {
  const count = (AROUND + 1) * (PROFILE + 1);
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  let n = 0;
  for (let i = 0; i <= AROUND; i++) {
    const u = i / AROUND;
    const a = u * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    for (const p of profile) {
      position.set([p.r * c, p.r * s, p.z], n * 3);
      normal.set([p.nr * c, p.nr * s, p.nz], n * 3);
      uv.set([u, p.v], n * 2);
      n++;
    }
  }
  const index: number[] = [];
  const row = PROFILE + 1;
  for (let i = 0; i < AROUND; i++) {
    for (let j = 0; j < PROFILE; j++) {
      const a = i * row + j;
      const b = (i + 1) * row + j;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(index);
  return geometry;
}

type Seg = [string, ...number[]];
interface Glyph {
  w: number;
  tall?: boolean;
  d: Seg[];
}

// Letterforms in the manner of the Ring's calligraphy: stems that rise or fall and
// hook at their ends, carrying round bows; open arches, bowls and hooks; marks
// floating above. Unit space: x across the letter, y 0 = baseline, -1 = bow height,
// -2 = ascender, +1 = descender. Sequences are random, so nothing here spells a word.
const FALL: Seg[] = [["M", 0.16, -1.04], ["C", 0.17, -0.4, 0.17, 0.4, 0.15, 0.7], ["C", 0.13, 0.95, -0.02, 1.0, -0.08, 0.84]];
const RISE: Seg[] = [["M", 0.15, 0.04], ["C", 0.14, -0.7, 0.15, -1.5, 0.16, -1.82], ["C", 0.17, -2.06, 0.36, -2.1, 0.42, -1.94]];
const BOW: Seg[] = [["M", 0.16, -0.98], ["C", 0.56, -1.22, 0.9, -0.96, 0.78, -0.56], ["C", 0.68, -0.22, 0.4, -0.02, 0.16, -0.06]];
const BOW_OPEN: Seg[] = [["M", 0.16, -0.98], ["C", 0.56, -1.22, 0.92, -0.96, 0.8, -0.52], ["C", 0.74, -0.3, 0.6, -0.16, 0.44, -0.1]];
const left = (segs: Seg[]): Seg[] => segs.map(([op, ...n]) => [op, ...n.map((v, i) => (i % 2 ? v : 0.9 - v))]);

const GLYPHS: Glyph[] = [
  { w: 0.92, d: [...FALL, ...BOW] },
  { w: 0.92, d: [...FALL, ...BOW_OPEN] },
  { w: 1.2, d: [...FALL, ...BOW, ["M", 0.48, -0.94], ["C", 0.84, -1.2, 1.18, -0.94, 1.06, -0.54], ["C", 0.98, -0.22, 0.74, -0.04, 0.5, -0.07]] },
  { w: 0.92, tall: true, d: [...RISE, ...BOW] },
  { w: 0.92, tall: true, d: [...RISE, ...BOW_OPEN] },
  { w: 0.92, d: left([...FALL, ...BOW]) },
  { w: 0.92, tall: true, d: left([...RISE, ...BOW_OPEN]) },
  // double arch, the second leg trailing away
  { w: 1.16, d: [["M", 0.04, 0.02], ["C", 0.02, -0.55, 0.12, -1.02, 0.34, -1.02], ["C", 0.54, -1.02, 0.58, -0.7, 0.54, -0.42], ["M", 0.52, -0.7], ["C", 0.6, -1.0, 0.84, -1.06, 0.96, -0.9], ["C", 1.08, -0.7, 1.04, -0.24, 1.0, 0.0], ["C", 0.98, 0.12, 1.08, 0.16, 1.16, 0.08]] },
  // single arch
  { w: 0.92, d: [["M", 0.06, 0.02], ["C", 0.04, -0.65, 0.22, -1.04, 0.48, -1.02], ["C", 0.76, -1.0, 0.84, -0.64, 0.8, 0.0], ["C", 0.79, 0.12, 0.88, 0.14, 0.94, 0.06]] },
  // open bowl with a lifted end
  { w: 1.0, d: [["M", 0.04, -0.9], ["C", 0.1, -1.08, 0.12, -0.8, 0.08, -0.5], ["C", 0.06, -0.1, 0.24, 0.02, 0.46, 0.0], ["C", 0.74, -0.02, 0.86, -0.4, 0.82, -0.98], ["C", 0.84, -1.12, 0.94, -1.12, 1.0, -1.04]] },
  // forked stroke falling into a long tail
  { w: 0.9, d: [["M", 0.06, -0.96], ["C", 0.1, -0.42, 0.56, -0.42, 0.62, -1.02], ["M", 0.62, -1.02], ["C", 0.62, -0.3, 0.48, 0.42, 0.22, 0.86], ["C", 0.12, 1.0, 0.0, 0.92, 0.02, 0.8]] },
  // hook rising from the line
  { w: 0.9, d: [["M", 0.1, 0.06], ["C", 0.02, -0.5, 0.2, -1.1, 0.56, -1.04], ["C", 0.84, -1.0, 0.9, -0.76, 0.78, -0.6], ["C", 0.7, -0.5, 0.58, -0.56, 0.6, -0.66]] },
  // reversed curve
  { w: 0.94, d: [["M", 0.84, -0.9], ["C", 0.58, -1.14, 0.12, -1.0, 0.28, -0.62], ["C", 0.42, -0.32, 0.9, -0.42, 0.78, -0.1], ["C", 0.68, 0.12, 0.28, 0.08, 0.1, -0.12]] },
  // tall looped stroke
  { w: 0.92, tall: true, d: [["M", 0.2, 0.04], ["C", 0.08, -0.6, 0.1, -1.4, 0.46, -1.78], ["C", 0.72, -2.04, 0.96, -1.84, 0.84, -1.6], ["M", 0.2, -0.52], ["C", 0.48, -0.82, 0.88, -0.62, 0.74, -0.24]] },
  // stem through both lines, one bow
  { w: 0.92, tall: true, d: [["M", 0.16, -1.82], ["C", 0.17, -2.06, 0.36, -2.1, 0.42, -1.94], ["M", 0.16, -1.82], ["L", 0.16, 0.7], ["C", 0.14, 0.95, -0.02, 1.0, -0.08, 0.84], ...BOW] },
];

// Marks set above the short letters: dots, a stroke, curls and a wave.
const MARKS: Seg[][] = [
  [["M", 0.22, -1.34], ["L", 0.25, -1.37], ["M", 0.48, -1.58], ["L", 0.51, -1.61], ["M", 0.74, -1.34], ["L", 0.77, -1.37]],
  [["M", 0.34, -1.3], ["C", 0.44, -1.46, 0.56, -1.62, 0.7, -1.78]],
  [["M", 0.48, -1.44], ["L", 0.51, -1.47]],
  [["M", 0.26, -1.34], ["C", 0.24, -1.82, 0.84, -1.84, 0.76, -1.42]],
  [["M", 0.74, -1.34], ["C", 0.76, -1.82, 0.16, -1.84, 0.24, -1.42]],
  [["M", 0.04, -1.42], ["C", 0.32, -1.76, 0.6, -1.2, 0.94, -1.54]],
  [["M", 0.3, -1.36], ["C", 0.32, -1.62, 0.48, -1.72, 0.62, -1.62], ["M", 0.62, -1.62], ["C", 0.74, -1.54, 0.8, -1.7, 0.86, -1.82]],
];

interface Row {
  /** canvas row the line of letters is centred on */
  centre: number;
  /** x-height, world units */
  height: number;
  /** canvas pixels per world unit, across and along the band */
  kx: number;
  ky: number;
  /** written upside down and backwards, for the inside of the band */
  inverted: boolean;
  seed: number;
}

/**
 * Writes one line of letters right around the band as a white mask. `weight` thins
 * the nib for the hot core; `vary` makes some letters burn hotter than others.
 */
function writeRow(ctx: CanvasRenderingContext2D, row: Row, weight = 1, vary = false) {
  let seed = row.seed;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const hx = row.height * row.kx;
  const hy = row.height * row.ky;
  const baseline = row.centre + 0.5 * hy;
  const nib = 0.34 * hx * weight;
  const angle = -0.72;
  const slant = 0.2; // the hand leans forward

  // Lay out words of three to seven letters, then spread the slack between them so
  // the line closes on itself with an ordinary word space.
  const gap = 0.08;
  const space = 0.62;
  const words: { glyph: Glyph; mark: Seg[] | null }[][] = [];
  let width = 0;
  for (;;) {
    const word: { glyph: Glyph; mark: Seg[] | null }[] = [];
    const length = 3 + Math.floor(rnd() * 5);
    let w = 0;
    for (let i = 0; i < length; i++) {
      const glyph = GLYPHS[Math.floor(rnd() * GLYPHS.length)];
      const mark = !glyph.tall && rnd() < 0.62 ? MARKS[Math.floor(rnd() * MARKS.length)] : null;
      word.push({ glyph, mark });
      w += glyph.w + gap;
    }
    if ((width + w + space) * hx > TEX_W) break;
    words.push(word);
    width += w + space;
  }
  const slack = (TEX_W / hx - width) / words.length;

  ctx.save();
  if (row.inverted) {
    ctx.translate(TEX_W / 2, row.centre);
    ctx.rotate(Math.PI);
    ctx.translate(-TEX_W / 2, -row.centre);
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = Math.max(1.2, 0.06 * hx * weight);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const trace = (segs: Seg[], x0: number) => {
    // Sweep the path along the nib's edge: strokes across the nib come out thick, along it thin.
    for (let k = 0; k <= nib; k += 1.25) {
      const ox = Math.cos(angle) * (k - nib / 2);
      const oy = Math.sin(angle) * (k - nib / 2);
      const X = (x: number, y: number) => x0 + (x - y * slant) * hx + ox;
      const Y = (y: number) => baseline + y * hy + oy;
      ctx.beginPath();
      for (const [op, ...p] of segs) {
        if (op === "M") ctx.moveTo(X(p[0], p[1]), Y(p[1]));
        else if (op === "L") ctx.lineTo(X(p[0], p[1]), Y(p[1]));
        else ctx.bezierCurveTo(X(p[0], p[1]), Y(p[1]), X(p[2], p[3]), Y(p[3]), X(p[4], p[5]), Y(p[5]));
      }
      ctx.stroke();
    }
  };

  let heatSeed = row.seed * 7 + 1;
  const heat = () => (heatSeed = (heatSeed * 16807) % 2147483647) / 2147483647;
  let x = (space + slack) / 2;
  for (const word of words) {
    for (const { glyph, mark } of word) {
      ctx.globalAlpha = vary ? 0.45 + 0.55 * heat() : 1;
      trace(glyph.d, x * hx);
      if (mark) trace(mark, x * hx + (glyph.w - 1) * 0.5 * hx);
      x += glyph.w + gap;
    }
    x += space + slack;
  }
  ctx.restore();
}

/**
 * The inscription as light, in the film's colours: a deep crimson bloom, a red-orange
 * glow, letters of saturated orange, and an amber-hot core that runs hotter in some
 * letters than others. Only the halos add; the letters themselves are laid over them,
 * so the strokes stay orange instead of stacking up to a pale yellow.
 */
function paintInscription(rows: Row[]) {
  const layer = () => {
    const c = document.createElement("canvas");
    c.width = TEX_W;
    c.height = TEX_H;
    return c;
  };
  const body = layer();
  const core = layer();
  const out = layer();
  const b = body.getContext("2d");
  const c = core.getContext("2d");
  const o = out.getContext("2d");
  if (!b || !c || !o) return null;
  for (const row of rows) {
    writeRow(b, row);
    writeRow(c, row, 0.42, true);
  }

  o.fillStyle = "#000";
  o.fillRect(0, 0, TEX_W, TEX_H);
  // Coloured copies are cast as offset shadows, which every canvas implementation supports.
  const cast = (mask: HTMLCanvasElement, color: string, blur: number, alpha: number, mode: GlobalCompositeOperation) => {
    o.save();
    o.globalCompositeOperation = mode;
    o.globalAlpha = alpha;
    o.shadowColor = color;
    o.shadowBlur = blur;
    o.shadowOffsetX = TEX_W;
    o.drawImage(mask, -TEX_W, 0);
    o.restore();
  };
  cast(body, "#6e0600", 34, 1, "lighter");
  cast(body, "#c41e00", 14, 0.9, "lighter");
  cast(body, "#ff4400", 4, 0.9, "lighter");
  cast(body, "#ff6a0a", 0, 1, "source-over");
  cast(core, "#ff9a12", 3, 0.85, "source-over");
  cast(core, "#ffc23a", 0, 0.9, "source-over");
  return out;
}

/** A dark room lit by a warm softbox above and fire below, for the gold to reflect. */
function firelitRoom() {
  const room = new THREE.Scene();
  const hdr = (hex: number, k: number) => new THREE.Color(hex).multiplyScalar(k);
  room.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(20, 32, 16),
      new THREE.MeshBasicMaterial({ color: hdr(0x1c1610, 0.3), side: THREE.BackSide }),
    ),
  );
  const panel = (hex: number, k: number, w: number, h: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: hdr(hex, k), side: THREE.DoubleSide }),
    );
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
  };
  panel(0xfff0d6, 16, 7, 3.5, -5, 7, 5); // key, high and to the left
  panel(0xffe8c4, 6, 12, 1.4, 0, 9, -4); // long strip overhead, behind
  panel(0xffb85a, 2, 14, 4, 0, -7, 2); // the fire beneath
  panel(0xffe2b4, 5, 1.4, 9, 8, 1, -2); // rim to the right
  panel(0xffd9a8, 1.4, 9, 5, 2, 1, 9); // faint warm fill from the front
  return room;
}

/** The Ring as rendered gold: a plain, mirror-polished band whose inscription shows in fire. */
export function GoldRing({ ignited, onFail, className }: GoldRingProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const ignitedRef = useRef(ignited);
  const igniteStart = useRef<number | null>(null);

  useEffect(() => {
    ignitedRef.current = ignited;
    if (ignited && igniteStart.current === null) igniteStart.current = performance.now();
  }, [ignited]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onFail();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    const canvasEl = renderer.domElement;
    canvasEl.setAttribute("aria-hidden", "true");
    // Out of flow, so the canvas never feeds its own size back into the frame's.
    canvasEl.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    canvasEl.style.opacity = "0";
    canvasEl.style.transition = "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)";
    mount.appendChild(canvasEl);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(firelitRoom(), 0.02).texture;
    scene.environment = environment;

    const camera = new THREE.PerspectiveCamera(26, 1.6, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    const key = new THREE.DirectionalLight(0xffe4bc, 1.1);
    key.position.set(-3, 4, 4);
    scene.add(key);
    const ember = new THREE.PointLight(0xff7a24, 3, 8, 1.6);
    ember.position.set(0.3, -2, 1.4);
    scene.add(ember);

    const { points, total, outerV, innerV } = bandProfile();
    const ky = TEX_H / total;
    const painted = paintInscription([
      { centre: (1 - outerV) * TEX_H, height: 0.074, kx: TEX_W / (Math.PI * 2 * OUTER), ky, inverted: false, seed: 23 },
      { centre: (1 - innerV) * TEX_H, height: 0.062, kx: TEX_W / (Math.PI * 2 * INNER), ky, inverted: true, seed: 71 },
    ]);
    if (!painted) {
      renderer.dispose();
      canvasEl.remove();
      onFail();
      return;
    }
    const inscription = new THREE.CanvasTexture(painted);
    inscription.colorSpace = THREE.SRGBColorSpace;
    inscription.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const gold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffcf5c"),
      metalness: 1,
      roughness: 0.11,
      emissive: new THREE.Color("#ffffff"),
      emissiveMap: inscription,
      emissiveIntensity: 0,
    });
    // Heat moves through the letters: slow, overlapping swells of brightness around the band.
    const shimmer = { value: 0 };
    gold.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = shimmer;
      shader.fragmentShader = `uniform float uTime;\n${shader.fragmentShader}`.replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        #ifdef USE_EMISSIVEMAP
          float u = vEmissiveMapUv.x * 6.2832;
          totalEmissiveRadiance *= 0.8 + 0.2 * sin(u * 9.0 + uTime * 0.9) * sin(u * 4.0 - uTime * 0.55 + 1.7);
        #endif`,
      );
    };
    const geometry = bandGeometry(points);
    const ring = new THREE.Mesh(geometry, gold);
    // Held still: seen from a little above, front of the band toward the viewer, a slight cant.
    ring.rotation.set(-Math.PI / 2 + 0.46, 0, 0);
    const holder = new THREE.Group();
    holder.rotation.z = -0.07;
    holder.add(ring);
    scene.add(holder);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(mount);

    let visible = true;
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    watcher.observe(mount);

    let frame = 0;
    let shown = false;
    const clock = new THREE.Clock();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();

      let heat = 0;
      if (ignitedRef.current) {
        const start = igniteStart.current ?? performance.now();
        const p = reduce ? 1 : Math.min(1, (performance.now() - start) / IGNITE_MS);
        heat = 1 - (1 - p) ** 3;
      }
      // The letters breathe a little, like metal in a fire; the Ring itself never moves.
      const flicker = reduce ? 0 : Math.sin(t * 5.1) * 0.05 + Math.sin(t * 11.7) * 0.03;
      shimmer.value = reduce ? 0 : t;
      gold.emissiveIntensity = heat * (1.75 + flicker);
      ember.intensity = 3 + heat * (6 + flicker * 20);

      renderer.render(scene, camera);
      if (!shown) {
        shown = true;
        canvasEl.style.opacity = "1";
      }
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      geometry.dispose();
      gold.dispose();
      inscription.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvasEl.remove();
    };
  }, [onFail]);

  return <div ref={mountRef} className={cn("relative aspect-[16/10]", className)} />;
}
