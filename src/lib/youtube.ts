export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(v: number): void;
  destroy(): void;
};

type YTEvent = { target: YTPlayer; data: number };

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: YTEvent) => void;
        onStateChange?: (e: YTEvent) => void;
        onError?: (e: YTEvent) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YT_PLAYING = 1;

let apiPromise: Promise<YTNamespace> | null = null;

export function loadYouTube(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      )
    ) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}
