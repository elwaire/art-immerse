"use client";
import { useEffect, useRef } from "react";
import { MUSIC } from "@/data/music";
import { loadYouTube, YT_PLAYING, type YTPlayer } from "@/lib/youtube";
import { useMusic } from "@/store/useMusic";
import Equalizer from "./Equalizer";

const GRADIENT =
  "linear-gradient(120deg,#ff5a8a,#ffb02e,#ffe14a,#46d3ff,#8a5cff,#ff5a8a)";
const VIDEO_URL = `https://www.youtube.com/watch?v=${MUSIC.videoId}`;

const VINYL =
  "conic-gradient(from 20deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 12%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.22) 62%, rgba(255,255,255,0) 75%), " +
  "radial-gradient(circle, #1b0f4d 0 3%, #ff7aa8 3.5% 23%, transparent 23.5%), " +
  "repeating-radial-gradient(circle, #14102c 0 2px, #241a4d 2px 4px)";

export default function MusicPlayer() {
  const on = useMusic((s) => s.on);
  return on ? <Card /> : null;
}

function Card() {
  const playing = useMusic((s) => s.playing);
  const error = useMusic((s) => s.error);
  const holder = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTube().then((YT) => {
      if (cancelled || !holder.current) return;
      const mount = document.createElement("div");
      holder.current.appendChild(mount);

      player.current = new YT.Player(mount, {
        videoId: MUSIC.videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: MUSIC.videoId, // cần có để loop hoạt động với 1 video
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(MUSIC.volume);
            e.target.playVideo();
          },
          onStateChange: (e) =>
            useMusic.getState().setPlaying(e.data === YT_PLAYING),
          onError: () =>
            useMusic
              .getState()
              .setError("Video này không cho phép phát trên trang khác."),
        },
      });
    });

    return () => {
      cancelled = true;
      player.current?.destroy();
      player.current = null;
      useMusic.getState().setPlaying(false);
    };
  }, []);

  const toggle = () => {
    const p = player.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  return (
    <div
      className="fixed right-4 top-[88px] z-30 w-[262px] md:bottom-8 md:right-8 md:top-auto"
      style={{
        fontFamily: "var(--font-baloo), system-ui, sans-serif",
        animation: "bubble-pop 0.5s cubic-bezier(.2,1.4,.4,1)",
      }}
    >
      {/* thanh tiêu đề */}
      <div className="mb-2 flex h-10 items-center gap-2 rounded-full border-2 border-white/80 bg-[#1b0f4d]/90 pl-3 pr-1.5 text-white shadow-[0_6px_0_rgba(10,0,60,0.4)] backdrop-blur">
        <Equalizer playing={playing} className="h-4" />

        <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[13px] font-bold">
          <div
            className="inline-flex"
            style={{ animation: "marquee 9s linear infinite" }}
          >
            <span className="pr-6">
              ♪ {MUSIC.title} · {MUSIC.artist}
            </span>
            <span className="pr-6">
              ♪ {MUSIC.title} · {MUSIC.artist}
            </span>
          </div>
        </div>

        <button
          aria-label={playing ? "Tạm dừng" : "Phát"}
          onClick={toggle}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
              <rect x="5" y="4" width="5" height="16" rx="1.5" />
              <rect x="14" y="4" width="5" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#fff">
              <path d="M7 4l13 8-13 8z" />
            </svg>
          )}
        </button>

        <button
          aria-label="Đóng và tắt nhạc"
          onClick={() => useMusic.getState().setOn(false)}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-sm font-bold transition hover:bg-[#ff5a8a]"
        >
          ✕
        </button>
      </div>

      {/* đĩa than lòi ra từ bìa album */}
      <div className="relative h-[208px]">
        <div
          className="absolute left-0 top-[9px] h-[190px] w-[190px] rounded-full"
          style={{
            background: VINYL,
            boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
            animation: "spin-slow 3.2s linear infinite",
            animationPlayState: playing ? "running" : "paused",
          }}
        />

        {/* bìa album = trình phát YouTube 200×200 */}
        <div
          className="absolute right-0 top-0 h-[208px] w-[208px] rounded-[22px] p-1 shadow-[0_10px_26px_rgba(0,0,0,0.5)]"
          style={{ background: GRADIENT }}
        >
          <div
            ref={holder}
            className="relative h-[200px] w-[200px] overflow-hidden rounded-[18px] bg-[#0d0830] [&_iframe]:h-full [&_iframe]:w-full"
          />
          {error && (
            <div className="absolute inset-1 grid place-items-center rounded-[18px] bg-[#1b0f4d] p-3 text-center text-sm font-semibold text-white">
              <div>
                <p>{error}</p>
                <a
                  href={VIDEO_URL}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-block rounded-full bg-[#ff5a8a] px-3 py-1 text-xs font-extrabold"
                >
                  Mở trên YouTube ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
