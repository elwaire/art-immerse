const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

export default function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* chấm halftone */}
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(30,10,100,0.9) 1px, transparent 1.5px)",
          backgroundSize: "6px 6px",
        }}
      />
      {/* hạt nhiễu phim, nhúc nhích nhẹ */}
      <div
        className="absolute -inset-[10%] opacity-[0.2] mix-blend-overlay"
        style={{
          backgroundImage: NOISE,
          animation: "grain 0.8s steps(1) infinite",
        }}
      />
      {/* vignette tối ở rìa */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(10,0,50,0.4) 100%)",
        }}
      />
    </div>
  );
}
