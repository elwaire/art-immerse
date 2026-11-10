import * as THREE from "three";
import { seeded } from "@/lib/random";

const FILL = "#3a1d9f";
const UNDER = "#301490";
const OUTLINE = "#8272f2";

export function makeCloudTexture(seed: number) {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const rand = seeded(seed * 97 + 3);

  const base = H - 40; // đường đáy phẳng
  const lw = 7; // độ dày viền
  const n = 5 + Math.floor(rand() * 3);

  // các chỏm tròn, cao nhất ở giữa
  const bumps = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return {
      x: W * (0.18 + 0.64 * t) + (rand() - 0.5) * 18,
      r: 34 + Math.sin(Math.PI * t) * 60 + rand() * 16,
    };
  });

  const paint = (grow: number, color: string, clipY: number) => {
    g.save();
    g.beginPath();
    g.rect(0, 0, W, clipY);
    g.clip();
    g.fillStyle = color;
    for (const b of bumps) {
      g.beginPath();
      g.arc(b.x, base - b.r * 0.55, b.r + grow, 0, Math.PI * 2);
      g.fill();
    }
    const x0 = bumps[0].x;
    const x1 = bumps[bumps.length - 1].x;
    g.fillRect(x0, base - 50 - grow, x1 - x0, 50 + grow * 2);
    g.restore();
  };

  // 1) thân mây
  paint(0, FILL, base);

  // 2) chỉ tô lên phần đã có thân: đáy tối + đỉnh sáng nhẹ
  g.globalCompositeOperation = "source-atop";
  g.fillStyle = UNDER;
  g.fillRect(0, base - 34, W, 34);
  g.fillStyle = "rgba(160,140,255,0.10)";
  g.fillRect(0, 0, W, base - 110);

  // 3) viền vẽ phía sau thân mây
  g.globalCompositeOperation = "destination-over";
  paint(lw, OUTLINE, base + lw);
  g.globalCompositeOperation = "source-over";

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
