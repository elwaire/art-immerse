"use client";
import { useState } from "react";
import { PHOTOS } from "@/data/photos";
import { useWorld } from "@/store/useWorld";
import { scrollToPhoto } from "@/lib/scroll";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const active = useWorld((s) => s.active);

  return (
    <>
      <button
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        className="fixed left-5 top-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#2b3fb8] shadow-[0_4px_0_#1a2a80] transition hover:scale-105"
      >
        <span className="flex flex-col gap-1.5">
          <i className="block h-1 w-7 rounded bg-white" />
          <i className="block h-1 w-7 rounded bg-white" />
          <i className="block h-1 w-7 rounded bg-white" />
        </span>
      </button>

      {open && (
        <nav
          className="fixed left-5 top-24 z-30 w-64 rounded-3xl border-4 border-[#ffb3d9] bg-[#fffdf8] p-3 shadow-[4px_4px_0_#6ecbf5]"
          style={{ animation: "pop-in 0.25s ease-out" }}
        >
          <ul className="flex flex-col gap-1">
            {/* {PHOTOS.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    scrollToPhoto(i);
                    setOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left font-semibold transition ${
                    i === active
                      ? "bg-[#1a1030] text-white"
                      : "text-[#1a1030] hover:bg-[#f0e6ff]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} · {p.title}
                </button>
              </li>
            ))} */}
            <li>
              <a href="/">
                <button
                  className={`w-full rounded-xl text-[#1a1030] hover:bg-[#f0e6ff] px-3 py-2 text-left font-semibold transition`}
                >
                  Home
                </button>
              </a>
            </li>
            <li>
              <a href="https://www.elwaire.com/">
                <button
                  className={`w-full rounded-xl text-[#1a1030] hover:bg-[#f0e6ff] px-3 py-2 text-left font-semibold transition`}
                >
                  Studio
                </button>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
