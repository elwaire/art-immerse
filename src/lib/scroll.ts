import { photoProgress } from "@/components/world/path";
import { PHOTOS } from "@/data/photos";

export function scrollToPhoto(index: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({
    top: photoProgress(index, PHOTOS.length) * max,
    behavior: "smooth",
  });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
