import { seeded } from "@/lib/random";

const STAR_COLORS = ["#ffffff", "#cfe9ff", "#ffd1ec", "#c9fff1"];

const STARS = (() => {
  const r = seeded(5);
  return Array.from({ length: 110 }, () => ({
    x: (r() * 100).toFixed(2),
    y: (r() * 100).toFixed(2),
    s: +(1 + r() * 2.2).toFixed(2),
    c: STAR_COLORS[Math.floor(r() * STAR_COLORS.length)],
    d: +(2 + r() * 4).toFixed(2),
    delay: +(r() * 5).toFixed(2),
  }));
})();

const SPARKLES = (() => {
  const r = seeded(9);
  return Array.from({ length: 14 }, () => ({
    x: (r() * 96 + 2).toFixed(2),
    y: (r() * 96 + 2).toFixed(2),
    s: Math.round(10 + r() * 12),
    d: +(3 + r() * 4).toFixed(2),
    delay: +(r() * 6).toFixed(2),
  }));
})();

export default function Sky() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #4b32d4 0%, #4a24bd 45%, #3b1b9e 100%)",
      }}
    >
      {/* quầng sáng và vùng tối để có chiều sâu */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 72% 38%, rgba(130,100,255,0.35), transparent 70%), radial-gradient(50% 40% at 15% 85%, rgba(20,5,90,0.45), transparent 70%)",
        }}
      />

      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            background: s.c,
            boxShadow: `0 0 ${s.s * 2.5}px ${s.c}`,
            animation: `twinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {SPARKLES.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animation: `sparkle ${s.d}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <path
            d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z"
            fill="#ffffff"
          />
        </svg>
      ))}
    </div>
  );
}
