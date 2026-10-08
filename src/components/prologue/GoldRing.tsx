import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cn } from "@/lib/utils";

export interface RingPointer {
  /** -1..1, where the pointer sits relative to the Ring */
  x: number;
  y: number;
  /** 0..1, how close the pointer is */
  heat: number;
}

interface GoldRingProps {
  ignited: boolean;
  pointer: MutableRefObject<RingPointer>;
  onFail: () => void;
  className?: string;
}

const TEX_W = 4096;
const TEX_H = 512;
const IGNITE_MS = 1300;

type Seg = [string, ...number[]];

// Invented letterforms in unit space: x 0..1 across, y 0 = baseline, -1 = x-height,
// -2 = ascender, +0.9 = descender. Open strokes, tall loops, leaves and spirals,
// shaped so none reads as a roman letter. Not a real alphabet.
const LETTERS: Seg[][] = [
  // tall stem whose head loops over and back into itself
  [["M", 0.3, 0.2], ["C", 0.3, -1, 0.2, -2.05, 0.62, -2.05], ["C", 0.98, -2.05, 0.92, -1.35, 0.42, -1.3]],
  // low wave that flicks up at the end
  [["M", 0, -0.3], ["C", 0.25, -1.05, 0.45, 0.25, 0.7, -0.6], ["C", 0.8, -0.95, 0.95, -0.85, 1, -0.55]],
  // descending stroke with an open crescent off its shoulder
  [["M", 0.22, -1.1], ["C", 0.15, -0.3, 0.3, 0.55, 0.36, 0.9], ["M", 0.22, -0.8], ["C", 0.62, -1.25, 1, -0.7, 0.72, -0.25]],
  // a peaked sweep that turns back up
  [["M", 0.02, -0.15], ["C", 0.35, -1.35, 0.55, -1.35, 0.6, -0.6], ["C", 0.66, 0, 0.95, -0.1, 1, -0.95]],
  // tall stem with a leaf on its side
  [["M", 0.45, 0.15], ["L", 0.45, -1.95], ["M", 0.45, -1.15], ["C", 0.8, -1.5, 1, -1.05, 0.75, -0.75], ["C", 0.6, -0.6, 0.5, -0.75, 0.45, -0.9]],
  // inward spiral
  [["M", 0.5, -0.6], ["C", 0.72, -0.6, 0.72, -0.92, 0.5, -0.97], ["C", 0.18, -1.02, 0.12, -0.45, 0.42, -0.28], ["C", 0.82, -0.1, 1.02, -0.62, 0.95, -1.15]],
  // long descending curve with a hooked foot
  [["M", 0.15, -1.05], ["C", 0.75, -1.1, 0.7, 0.2, 0.55, 0.75], ["C", 0.5, 0.95, 0.25, 0.95, 0.2, 0.7]],
  // a pair of rising strokes joined at the root
  [["M", 0.1, -1.0], ["C", 0.2, -0.3, 0.45, 0.05, 0.5, 0.05], ["C", 0.55, 0.05, 0.8, -0.35, 0.92, -1.25]],
];
const ACCENTS: Seg[][] = [
  [["M", 0.15, -1.55], ["C", 0.35, -1.95, 0.6, -1.25, 0.85, -1.65]],
  [["M", 0.2, -1.6], ["L", 0.21, -1.6], ["M", 0.5, -1.72], ["L", 0.51, -1.72], ["M", 0.8, -1.6], ["L", 0.81, -1.6]],
  [["M", 0.3, -1.5], ["C", 0.45, -1.95, 0.75, -1.9, 0.7, -1.6]],
];

/**
 * Draws the inscription as words of discrete invented letters along the band, written
 * with a simulated broad nib held at an angle (thick-thin contrast). `progress` reveals
 * it left to right.
 */
function drawInscription(ctx: CanvasRenderingContext2D, progress: number) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  if (progress <= 0) return;

  let seed = 23;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // The texture is flipped in Y: the band's viewer-facing side is the lower half.
  const baseline = TEX_H * 0.82;
  const W = 46; // letter width, texels
  const H = 54; // x-height, texels (the band squashes texture vertically)
  const nib = 11; // nib width, texels
  const angle = -0.62; // nib angle, radians

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, TEX_W * progress, TEX_H);
  ctx.clip();
  ctx.strokeStyle = "#ffd6a6";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "#ff6a1a";
  ctx.shadowBlur = 10;

  const trace = (segs: Seg[], x0: number) => {
    // Sweep the path along the nib's edge: strokes across the nib come out thick, along it thin.
    for (let k = 0; k <= nib; k += 1.5) {
      const ox = Math.cos(angle) * (k - nib / 2);
      const oy = Math.sin(angle) * (k - nib / 2);
      const X = (x: number) => x0 + x * W + ox;
      const Y = (y: number) => baseline + y * H + oy;
      ctx.beginPath();
      for (const [op, ...n] of segs) {
        if (op === "M") ctx.moveTo(X(n[0]), Y(n[1]));
        else if (op === "L") ctx.lineTo(X(n[0]), Y(n[1]));
        else ctx.bezierCurveTo(X(n[0]), Y(n[1]), X(n[2]), Y(n[3]), X(n[4]), Y(n[5]));
      }
      ctx.stroke();
    }
  };

  let x = 24;
  while (x < TEX_W - W * 2) {
    const length = 2 + Math.floor(rnd() * 5);
    for (let i = 0; i < length && x < TEX_W - W; i++) {
      trace(LETTERS[Math.floor(rnd() * LETTERS.length)], x);
      if (rnd() < 0.3) trace(ACCENTS[Math.floor(rnd() * ACCENTS.length)], x);
      x += W * 1.25;
    }
    x += W * 0.95; // space between words
  }
  ctx.restore();
}

/** The Ring as rendered gold: a physically based metal band lit by firelight, its inscription burning in. */
export function GoldRing({ ignited, pointer, onFail, className }: GoldRingProps) {
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.75;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 5.4);

    // Firelight: warm key from above-left, ember glow from beneath
    const key = new THREE.DirectionalLight(0xffd7a0, 2.2);
    key.position.set(-2.5, 3, 4);
    scene.add(key);
    const ember = new THREE.PointLight(0xff5a14, 18, 9, 1.6);
    ember.position.set(0.4, -2.2, 1.6);
    scene.add(ember);

    const canvas = document.createElement("canvas");
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onFail();
      return;
    }
    drawInscription(ctx, 0);
    const inscription = new THREE.CanvasTexture(canvas);
    inscription.colorSpace = THREE.SRGBColorSpace;
    inscription.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const gold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f0b54a"),
      metalness: 1,
      roughness: 0.16,
      clearcoat: 0.4,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color("#ff6a1a"),
      emissiveMap: inscription,
      emissiveIntensity: 0,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.125, 96, 384), gold);
    scene.add(ring);

    const resize = () => {
      const size = mount.clientWidth;
      renderer.setSize(size, size, false);
      renderer.domElement.style.width = `${size}px`;
      renderer.domElement.style.height = `${size}px`;
    };
    resize();
    const resizer = new ResizeObserver(resize);
    resizer.observe(mount);

    let visible = true;
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    watcher.observe(mount);

    let lastProgress = 0;
    let heat = 0;
    let tiltX = 0;
    let tiltY = 0;
    let frame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const t = reduce ? 0 : clock.getElapsedTime();

      // ease toward the pointer
      tiltX += (pointer.current.x - tiltX) * 0.06;
      tiltY += (pointer.current.y - tiltY) * 0.06;
      heat += (pointer.current.heat - heat) * 0.05;

      ring.rotation.y = Math.sin(t * 0.42) * 0.55 + tiltX * 0.5;
      ring.rotation.x = 0.32 + Math.sin(t * 0.29) * 0.08 - tiltY * 0.4;
      ring.rotation.z = Math.sin(t * 0.17) * 0.05;

      let progress = 0;
      if (ignitedRef.current) {
        const start = igniteStart.current ?? performance.now();
        progress = reduce ? 1 : Math.min(1, (performance.now() - start) / IGNITE_MS);
      }
      if (progress !== lastProgress) {
        drawInscription(ctx, progress);
        inscription.needsUpdate = true;
        lastProgress = progress;
      }
      const flicker = reduce ? 0 : Math.sin(t * 7.3) * 0.08 + Math.sin(t * 13.1) * 0.05;
      gold.emissiveIntensity = progress > 0 ? 2.6 + heat * 1.8 + flicker : 0;
      ember.intensity = (ignitedRef.current ? 22 : 10) + heat * 14 + flicker * 20;

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizer.disconnect();
      watcher.disconnect();
      ring.geometry.dispose();
      gold.dispose();
      inscription.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFail, pointer]);

  return <div ref={mountRef} className={cn("aspect-square", className)} />;
}
