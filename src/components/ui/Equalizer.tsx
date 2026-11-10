type Props = { playing: boolean; bars?: number; className?: string };

export default function Equalizer({
  playing,
  bars = 4,
  className = "h-5",
}: Props) {
  return (
    <span className={`flex items-end gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="h-full w-[3px] origin-bottom rounded-full"
          style={{
            background: "linear-gradient(180deg,#ffe14a,#ff5a8a)",
            animation: `eq ${0.7 + i * 0.13}s ease-in-out ${i * 0.1}s infinite`,
            animationPlayState: playing ? "running" : "paused",
          }}
        />
      ))}
    </span>
  );
}
