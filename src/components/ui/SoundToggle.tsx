"use client";
import { useMusic } from "@/store/useMusic";
import { pauseBgm, playBgm } from "@/lib/bgm";

const NAVY = "#1a1030";

export default function SoundToggle() {
  const on = useMusic((s) => s.on);
  const playing = useMusic((s) => s.playing);

  return (
    <button
      aria-label={on ? "Tắt nhạc" : "Bật nhạc"}
      aria-pressed={on}
      onClick={() => (on ? pauseBgm() : playBgm())}
      className="group fixed right-5 top-5 z-40 h-14 w-14 transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      {/* lớp bóng hồng (lệch lên trái) */}
      <span className="absolute inset-0 -translate-x-[3px] -translate-y-[2px] rounded-full bg-[#ff5fa8] transition-transform duration-200 group-hover:-translate-x-[5px] group-hover:-translate-y-[3px]" />
      {/* lớp bóng xanh lam (lệch xuống phải) */}
      <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-[#6ecbf5] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px]" />
      {/* mặt nút */}
      <span className="absolute inset-0 grid place-items-center rounded-full border-[4px] border-[#1a1030] bg-white">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
          <path d="M3 9.5v5h3.8L12 19V5L6.8 9.5H3z" fill={NAVY} />
          {on ? (
            <>
              <path
                d="M15.2 9a4 4 0 010 6"
                stroke={NAVY}
                strokeWidth="2.2"
                strokeLinecap="round"
                style={
                  playing
                    ? { animation: "wave 1.2s ease-in-out infinite" }
                    : undefined
                }
              />
              <path
                d="M17.8 6.5a8 8 0 010 11"
                stroke={NAVY}
                strokeWidth="2.2"
                strokeLinecap="round"
                style={
                  playing
                    ? { animation: "wave 1.2s ease-in-out 0.25s infinite" }
                    : undefined
                }
              />
            </>
          ) : (
            <path
              d="M16 9.5l5 5M21 9.5l-5 5"
              stroke="#ff3d7f"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          )}
        </svg>
      </span>
    </button>
  );
}
