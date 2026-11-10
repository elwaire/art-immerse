import { create } from "zustand";

type WorldState = {
  active: number; // chỉ số ảnh đang được xem
  setActive: (i: number) => void;
};

export const useWorld = create<WorldState>((set) => ({
  active: 0,
  setActive: (i) => set({ active: i }),
}));
