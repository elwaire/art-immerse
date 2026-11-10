"use client";
import { useEffect } from "react";

type Props = {
  progress: number;
  ready: boolean; // đã tải xong
  entered: boolean; // người dùng đã bấm vào
  onEnter: () => void;
};

export default function Loader({ progress, ready, entered, onEnter }: Props) {
  // khoá cuộn cho tới khi người dùng bấm vào
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ${
        entered ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(180deg,#4b32d4,#3b1b9e)",
        fontFamily: "var(--font-baloo), system-ui, sans-serif",
      }}
    >
      {!ready ? (
        <>
          <div className="h-16 w-16 animate-bounce rounded-full bg-white shadow-[0_6px_0_#c9a8f0]" />
          <div className="h-2.5 w-56 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,#ffe14a,#ff5a8a)",
              }}
            />
          </div>
          <p className="text-lg font-bold tracking-widest text-white">
            LOADING {Math.round(progress)}%
          </p>
        </>
      ) : (
        <>
          <button onClick={onEnter} className="group relative">
            <span className="absolute inset-0 -translate-x-[3px] -translate-y-[2px] rounded-full bg-[#ff5fa8] transition-transform group-hover:-translate-x-[5px] group-hover:-translate-y-[3px]" />
            <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-[#6ecbf5] transition-transform group-hover:translate-x-[6px] group-hover:translate-y-[6px]" />
            <span className="relative block rounded-full border-4 border-[#1a1030] bg-white px-10 py-3 text-xl font-extrabold tracking-wider text-[#1a1030] transition-transform group-active:scale-95">
              BẤM ĐỂ VÀO
            </span>
          </button>
          <p className="text-sm font-semibold text-white/70">
            ♪ Trang có nhạc nền, bấm biểu tượng loa để tắt
          </p>
        </>
      )}
    </div>
  );
}
