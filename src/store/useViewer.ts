import { create } from "zustand";

type ViewerState = {
  index: number | null; // ảnh đang xem phóng to (null = đóng)
  dir: 1 | -1; // hướng chuyển ảnh, dùng cho hiệu ứng trượt
  open: (i: number) => void;
  close: () => void;
  go: (delta: number, count: number) => void;
};

export const useViewer = create<ViewerState>((set) => ({
  index: null,
  dir: 1,
  open: (index) => set({ index, dir: 1 }),
  close: () => set({ index: null }),
  go: (delta, count) =>
    set((s) =>
      s.index === null
        ? s
        : { index: (s.index + delta + count) % count, dir: delta > 0 ? 1 : -1 },
    ),
}));
