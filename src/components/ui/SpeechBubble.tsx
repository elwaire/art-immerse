"use client";
import { useEffect, useState } from "react";
import { PHOTOS } from "@/data/photos";
import { useWorld } from "@/store/useWorld";
import { scrollToPhoto, scrollToTop } from "@/lib/scroll";
import ParrotAvatar from "./ParrotAvatar";

const GUIDE_NAME = "KIWI"; // đổi tên vẹt tại đây
const NAVY = "#1a1030";
const HALFTONE_MASK = "linear-gradient(200deg, black 0%, transparent 45%)";

// Chữ hiện dần như đang gõ. Gắn kèm text để tự reset khi đổi ảnh.
function useTypewriter(text: string, speed = 20) {
  const [state, setState] = useState({ text, n: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) =>
        s.text === text
          ? { text, n: Math.min(s.n + 1, text.length) }
          : { text, n: 1 },
      );
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  const n = state.text === text ? state.n : 0;
  return { shown: text.slice(0, n), done: n >= text.length };
}

export default function SpeechBubble() {
  const active = useWorld((s) => s.active);
  const [open, setOpen] = useState(true);
  const [hop, setHop] = useState(0);

  const photo = PHOTOS[active];
  const isFirst = active === 0;
  const isLast = active === PHOTOS.length - 1;
  const caption = photo.caption ?? "";
  const { shown, done } = useTypewriter(caption);

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-20 flex flex-col items-start md:bottom-8 md:left-8"
      style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif" }}
    >
      {/* ===== bong bóng ===== */}
      <div
        className={`relative mb-9 ml-5 w-[min(27rem,calc(100vw-2.5rem))] origin-bottom-left -rotate-[0.8deg] transition duration-300 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        {/* hai lớp bóng lệch màu */}
        <span className="absolute inset-0 -translate-x-[3px] -translate-y-[3px] rounded-[28px] bg-[#ff5fa8]" />
        <span className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-[28px] bg-[#6ecbf5]" />

        {/* thân bong bóng */}
        <div
          key={photo.id}
          className="relative rounded-[28px] border-[3px] border-[#1a1030] bg-[#fffdf6] px-6 pb-4 pt-7 text-[#1a1030]"
          style={{ animation: "bubble-pop 0.4s cubic-bezier(.2,1.4,.4,1)" }}
        >
          {/* halftone xanh lam ở góc trên phải */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[25px] opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(#6ecbf5 1.2px, transparent 1.7px)",
              backgroundSize: "7px 7px",
              maskImage: HALFTONE_MASK,
              WebkitMaskImage: HALFTONE_MASK,
            }}
          />

          {/* nhãn tên vẹt */}
          <span
            className="absolute -top-[17px] left-5 rounded-md border-2 border-[#ff5fa8] bg-[#1a1030] px-3 py-[3px] text-[13px] font-bold tracking-[0.25em] text-white"
            style={{
              fontFamily: "var(--font-mono-tag), ui-monospace, monospace",
            }}
          >
            {GUIDE_NAME}
          </span>

          {/* tên ảnh */}
          <h3 className="relative pr-5 text-[19px] font-extrabold leading-tight">
            {photo.title}
          </h3>

          {/* mô tả: chừa sẵn chỗ để bong bóng không giật to khi chữ hiện dần */}
          {caption && (
            <p className="relative mt-1.5 line-clamp-4 text-[15px] font-semibold leading-snug text-[#1a1030]/80">
              <span className="invisible">{caption}</span>
              <span className="absolute inset-0">
                {shown}
                {!done && (
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#1a1030]" />
                )}
              </span>
            </p>
          )}

          {/* chân: chấm tiến độ + nút */}
          <div className="relative mt-3.5 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {PHOTOS.map((p, i) => (
                <button
                  key={p.id}
                  aria-label={`Ảnh ${i + 1}`}
                  onClick={() => scrollToPhoto(i)}
                  className="h-3 w-3 rounded-full border-2 border-[#1a1030] transition-transform hover:scale-125"
                  style={{
                    background: i === active ? NAVY : "transparent",
                    transform: i === active ? "scale(1.15)" : undefined,
                  }}
                />
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                aria-label="Ảnh trước"
                disabled={isFirst}
                onClick={() => scrollToPhoto(active - 1)}
                className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-[#1a1030] bg-white shadow-[0_3px_0_#1a1030] transition active:translate-y-[2px] active:shadow-none disabled:opacity-35"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#1a1030">
                  <path d="M17 4L7 12l10 8z" />
                </svg>
              </button>
              <button
                onClick={() =>
                  isLast ? scrollToTop() : scrollToPhoto(active + 1)
                }
                className="rounded-full border-[3px] border-[#1a1030] bg-[#ee5fa3] px-5 py-1.5 text-sm font-extrabold tracking-wider text-white shadow-[0_3px_0_#1a1030] transition hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none"
              >
                {isLast ? "TOP ▲" : "NEXT ▶"}
              </button>
            </div>
          </div>
        </div>

        {/* đuôi chỉ xuống vẹt */}
        <svg
          className="absolute -bottom-[31px] left-5"
          width="48"
          height="36"
          viewBox="0 0 48 36"
          fill="none"
        >
          <path d="M6 0L46 0L8 34Z" fill="#6ecbf5" transform="translate(5 5)" />
          <path d="M6 0L46 0L8 34Z" fill="#fffdf6" />
          <path
            d="M6.3 5L8 34L40.4 5"
            stroke="#1a1030"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* nút thu gọn */}
        <button
          aria-label="Thu gọn"
          onClick={() => setOpen(false)}
          className="absolute -right-2.5 -top-2.5 grid h-8 w-8 place-items-center rounded-full border-2 border-[#6ecbf5] bg-[#1a1030] text-white transition hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* ===== nhân vật: nhảy lên mỗi khi đổi ảnh hoặc bị bấm ===== */}
      <div
        key={`${photo.id}-${hop}`}
        className="pointer-events-auto -mt-1"
        style={{ animation: "parrot-hop 0.6s ease-out" }}
      >
        <ParrotAvatar
          talking={open && !done}
          alert={!open}
          onClick={() => {
            setOpen((o) => !o);
            setHop((h) => h + 1);
          }}
        />
      </div>
    </div>
  );
}
