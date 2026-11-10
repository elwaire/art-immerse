"use client";
import { useEffect, useState } from "react";
import World from "@/components/world/World";
import Sky from "@/components/ui/Sky";
import FilmGrain from "@/components/ui/FilmGrain";
import Loader from "@/components/ui/Loader";
import Menu from "@/components/ui/Menu";
import SoundToggle from "@/components/ui/SoundToggle";
import SpeechBubble from "@/components/ui/SpeechBubble";
import { PHOTOS } from "@/data/photos";
import { SIGNS } from "@/data/signs";
import { preloadPhoto } from "@/lib/preload";
import { playBgm } from "@/lib/bgm";
import Lightbox from "@/components/ui/Lightbox";

const ALL = [...PHOTOS.map((p) => p.src), ...SIGNS.map((s) => s.src)];

export default function Experience() {
  const [ready, setReady] = useState<{
    photos: string[];
    signs: string[];
  } | null>(null);
  const [settled, setSettled] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let count = 0;
    Promise.all(
      ALL.map((src) =>
        preloadPhoto(src).then((u) => {
          count += 1;
          if (!cancelled) setSettled(count);
          return u;
        }),
      ),
    ).then((list) => {
      if (!cancelled) {
        setReady({
          photos: list.slice(0, PHOTOS.length),
          signs: list.slice(PHOTOS.length),
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // bấm vào → mở trang và phát nhạc cùng lúc
  const enter = () => {
    setEntered(true);
    playBgm();
  };

  return (
    <>
      <div className="fixed inset-0">
        <Sky />
        <div className="absolute inset-0">
          {ready && <World urls={ready.photos} signUrls={ready.signs} />}
        </div>
        <FilmGrain />
      </div>

      <Loader
        progress={(settled / ALL.length) * 100}
        ready={ready !== null}
        entered={entered}
        onEnter={enter}
      />
      <Menu />
      <SoundToggle />
      <SpeechBubble />
      {ready && <Lightbox urls={ready.photos} />}

      <div style={{ height: `${(PHOTOS.length + 1) * 100}vh` }} />
    </>
  );
}
