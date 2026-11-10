import { useMusic } from "@/store/useMusic";

const SRC = "/audio/background.m4a";
const VOLUME = 0.5; // 0 - 1

let audio: HTMLAudioElement | null = null;
let fadeTimer: ReturnType<typeof setInterval> | null = null;

function getAudio() {
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("playing", () =>
      useMusic.getState().setPlaying(true),
    );
    audio.addEventListener("pause", () =>
      useMusic.getState().setPlaying(false),
    );

    // chuyển tab thì tạm dừng, quay lại thì phát tiếp (nếu người dùng đang bật)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        audio?.pause();
      } else if (useMusic.getState().on && audio?.paused) {
        audio.volume = 0;
        audio
          .play()
          .then(() => fadeTo(VOLUME, 800))
          .catch(() => {});
      }
    });
  }
  return audio;
}

function fadeTo(target: number, ms: number, done?: () => void) {
  const a = getAudio();
  if (fadeTimer) clearInterval(fadeTimer);
  const start = a.volume;
  const t0 = performance.now();
  fadeTimer = setInterval(() => {
    const k = Math.min((performance.now() - t0) / ms, 1);
    a.volume = start + (target - start) * k;
    if (k >= 1) {
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = null;
      done?.();
    }
  }, 30);
}

export async function playBgm() {
  const a = getAudio();
  try {
    await a.play();
    fadeTo(VOLUME, 1200);
    useMusic.getState().setOn(true);
    return true;
  } catch {
    useMusic.getState().setOn(false);
    return false;
  }
}

export function pauseBgm() {
  useMusic.getState().setOn(false);
  fadeTo(0, 400, () => audio?.pause());
}
