import { create } from "zustand";

type MusicState = {
  on: boolean; // người dùng đang bật nhạc
  playing: boolean; // nhạc đang thực sự phát
  error: string | null; // lỗi khi phát nhạc
  setOn: (v: boolean) => void;
  setPlaying: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useMusic = create<MusicState>((set) => ({
  on: false,
  playing: false,
  error: null,
  setOn: (on) => set({ on }),
  setPlaying: (playing) => set({ playing }),
  setError: (error) => set({ error }),
}));
