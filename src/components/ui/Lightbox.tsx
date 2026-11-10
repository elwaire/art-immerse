"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS } from "@/data/photos";
import { resolveSrc } from "@/lib/imageUrl";
import { scrollToPhoto } from "@/lib/scroll";
import { useViewer } from "@/store/useViewer";

const ZOOM = 2.5;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const ICON = {
  fill: "none",
  stroke: "#1a1030",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// nút tròn đúng phong cách mẫu: trắng, viền đậm, bóng lệch hồng và xanh lam
function RoundBtn({
  label,
  onClick,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`group relative h-12 w-12 shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14 ${className}`}
    >
      <span className="absolute inset-0 -translate-x-[3px] -translate-y-[2px] rounded-full bg-[#ff5fa8] transition-transform duration-200 group-hover:-translate-x-[5px] group-hover:-translate-y-[3px]" />
      <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-[#6ecbf5] transition-transform duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px]" />
      <span className="absolute inset-0 grid place-items-center rounded-full border-[4px] border-[#1a1030] bg-white">
        {children}
      </span>
    </button>
  );
}

const ChevronL = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
const ChevronR = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export default function Lightbox({ urls }: { urls: string[] }) {
  const index = useViewer((s) => s.index);
  const dir = useViewer((s) => s.dir);
  const isOpen = index !== null;
  const count = PHOTOS.length;

  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    moved: boolean;
  } | null>(null);

  const [zoom, setZoom] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const [hiLoaded, setHiLoaded] = useState<string | null>(null);

  const resetZoom = useCallback(() => {
    setZoom(false);
    setPan({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    const i = useViewer.getState().index;
    useViewer.getState().close();
    resetZoom();
    if (i !== null) scrollToPhoto(i); // cảnh 3D cuộn tới ảnh vừa xem
  }, [resetZoom]);

  const go = useCallback(
    (d: number) => {
      resetZoom();
      useViewer.getState().go(d, count);
    },
    [count, resetZoom],
  );

  // phím tắt + khoá cuộn trang khi đang mở
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, go]);

  if (index === null) return null;

  const photo = PHOTOS[index];
  const low = urls[index];
  const hi = photo.full ? resolveSrc(photo.full) : null;
  const hiReady = hi !== null && hiLoaded === hi;
  const ratio = ratios[low] ?? 1.4;
  const known = ratios[low] !== undefined;

  // giới hạn kéo để không lộ khoảng trống ngoài ảnh
  const clampPan = (x: number, y: number, rect: DOMRect) => {
    const mx = (rect.width * (ZOOM - 1)) / 2;
    const my = (rect.height * (ZOOM - 1)) / 2;
    return { x: clamp(x, -mx, mx), y: clamp(y, -my, my) };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      px: pan.x,
      py: pan.y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) > 6) d.moved = true;
    if (zoom && d.moved) {
      setPan(
        clampPan(d.px + dx, d.py + dy, e.currentTarget.getBoundingClientRect()),
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    setDragging(false);
    if (!d) return;

    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const rect = e.currentTarget.getBoundingClientRect();

    if (!d.moved) {
      // bấm: phóng to tại điểm bấm, hoặc thu lại
      if (zoom) {
        resetZoom();
      } else {
        const px = e.clientX - (rect.left + rect.width / 2);
        const py = e.clientY - (rect.top + rect.height / 2);
        setZoom(true);
        setPan(clampPan(-px * (ZOOM - 1), -py * (ZOOM - 1), rect));
      }
    } else if (
      !zoom &&
      Math.abs(dx) > 60 &&
      Math.abs(dx) > Math.abs(dy) * 1.5
    ) {
      go(dx < 0 ? 1 : -1); // vuốt ngang để chuyển ảnh
    }
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      tabIndex={-1}
      className="fixed inset-x-0 top-0 z-[60] flex touch-none flex-col overscroll-contain outline-none"
      style={{
        height: "100dvh",
        fontFamily: "var(--font-baloo), system-ui, sans-serif",
      }}
    >
      {/* nền mờ: bấm để đóng */}
      <div
        className="absolute inset-0 bg-[#0d0830]/90 backdrop-blur-md"
        style={{ animation: "fade-in 0.25s ease-out" }}
        onClick={close}
      />

      {/* ===== thanh trên ===== */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-6">
        <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-extrabold tabular-nums tracking-widest text-white">
          {pad(index + 1)} / {pad(count)}
        </span>

        <div className="flex items-center gap-4">
          <RoundBtn
            label={zoom ? "Thu nhỏ" : "Phóng to"}
            onClick={() => (zoom ? resetZoom() : setZoom(true))}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
              <path d={zoom ? "M8.5 11h5" : "M8.5 11h5M11 8.5v5"} />
            </svg>
          </RoundBtn>
          <RoundBtn label="Đóng" onClick={close}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" {...ICON}>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </RoundBtn>
        </div>
      </header>

      {/* ===== vùng ảnh: chiếm hết chỗ còn lại ===== */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center gap-3 px-3 md:gap-6 md:px-8">
        <RoundBtn
          label="Ảnh trước"
          onClick={() => go(-1)}
          className="hidden md:block"
        >
          <ChevronL />
        </RoundBtn>

        {/* container query: ảnh tự co vừa khít vùng này */}
        <div
          className="relative h-full min-w-0 flex-1"
          style={{ containerType: "size" }}
        >
          <div
            className="absolute inset-0 grid place-items-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) close(); // bấm vùng trống để đóng
            }}
          >
            <div
              key={photo.id}
              className="rounded-xl bg-[#fdf6ee] p-2 shadow-[0_0_0_3px_#1a1030,-5px_-4px_0_3px_#ff5fa8,6px_6px_0_3px_#6ecbf5,0_30px_60px_rgba(0,0,0,0.55)] md:p-2.5"
              style={{
                opacity: known ? 1 : 0,
                animation: `${dir > 0 ? "lb-next" : "lb-prev"} 0.35s cubic-bezier(.2,1,.3,1)`,
              }}
            >
              <div
                className="relative select-none overflow-hidden rounded-md bg-[#0d0830]"
                style={{
                  width: `min(calc(100cqw - 28px), calc((100cqh - 28px) * ${ratio}))`,
                  aspectRatio: `${ratio}`,
                  cursor: zoom ? (dragging ? "grabbing" : "grab") : "zoom-in",
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                  drag.current = null;
                  setDragging(false);
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom ? ZOOM : 1})`,
                    transition:
                      dragging && zoom ? "none" : "transform 0.25s ease-out",
                  }}
                >
                  <img
                    src={low}
                    alt={photo.title}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-contain"
                    onLoad={(e) => {
                      const im = e.currentTarget;
                      setRatios((r) => ({
                        ...r,
                        [low]: im.naturalWidth / im.naturalHeight,
                      }));
                    }}
                  />
                  {hi && (
                    <img
                      src={hi}
                      alt=""
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                      style={{ opacity: hiReady ? 1 : 0 }}
                      onLoad={() => setHiLoaded(hi)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <RoundBtn
          label="Ảnh sau"
          onClick={() => go(1)}
          className="hidden md:block"
        >
          <ChevronR />
        </RoundBtn>
      </div>

      {/* ===== chân trang: tên, mô tả, điều hướng ===== */}
      <footer className="relative z-10 flex flex-col items-center gap-2 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center md:pb-8">
        <span
          className="max-w-full rounded-2xl px-4 py-1 text-xs font-extrabold uppercase leading-tight tracking-wider text-[#1b0f4d] shadow-[0_3px_0_rgba(0,0,0,0.35)] md:text-sm"
          style={{
            background: "linear-gradient(90deg,#ffe14a,#ffb02e,#ff7a59)",
          }}
        >
          {photo.title}
        </span>

        {photo.caption && (
          <p className="line-clamp-3 max-w-2xl text-sm font-semibold text-white/85 md:line-clamp-4 md:text-base">
            {photo.caption}
          </p>
        )}

        <p className="text-[11px] font-semibold tracking-wide text-white/50 md:text-xs">
          {zoom
            ? "Kéo để di chuyển · bấm để thu nhỏ"
            : "Bấm vào ảnh để phóng to"}
        </p>

        {/* điện thoại: mũi tên nằm ở chân trang */}
        <div className="mt-1 flex gap-10 md:hidden">
          <RoundBtn label="Ảnh trước" onClick={() => go(-1)}>
            <ChevronL />
          </RoundBtn>
          <RoundBtn label="Ảnh sau" onClick={() => go(1)}>
            <ChevronR />
          </RoundBtn>
        </div>
      </footer>
    </div>
  );
}
