/**
 * Smoke drifting through the void: low-frequency fractal noise thresholded into
 * separate wisps, faded at the edges, moving at two speeds. The ground stays black.
 */
const wisps = (seed: number, freq: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='900'><filter id='s' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='4' seed='${seed}'/><feColorMatrix values='0 0 0 0 0.56  0 0 0 0 0.47  0 0 0 0 0.38  4.2 0 0 0 -2.55'/></filter><rect width='100%' height='100%' filter='url(#s)'/></svg>`
  )}")`;

export function Smoke() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -inset-[15%] opacity-[0.3] motion-safe:animate-smoke-drift [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_20%,transparent_75%)]"
        style={{ backgroundImage: wisps(3, "0.0018 0.0075"), backgroundSize: "cover" }}
      />
      <div
        className="absolute -inset-[15%] opacity-[0.2] motion-safe:animate-smoke-drift [animation-delay:-13s] [animation-duration:38s] [mask-image:radial-gradient(ellipse_80%_55%_at_40%_70%,#000_15%,transparent_70%)]"
        style={{ backgroundImage: wisps(9, "0.0026 0.01"), backgroundSize: "cover" }}
      />
    </div>
  );
}
