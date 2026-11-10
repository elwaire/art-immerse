import * as THREE from "three";

type Ctx = CanvasRenderingContext2D;

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function roundRect(
  g: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// tô màu + viền trắng kiểu sticker
function outline(g: Ctx, fill: string) {
  g.fillStyle = fill;
  g.fill();
  g.lineWidth = 5;
  g.lineJoin = "round";
  g.strokeStyle = "#fff6ec";
  g.stroke();
}

const KINDS = [
  "star",
  "smile",
  "sad",
  "heart",
  "triangle",
  "flower",
  "arrow",
  "pill",
] as const;
type Kind = (typeof KINDS)[number];
const WORDS = ["HELLO!", "KEEP GOING", "WOW", "HI", "SCROLL"];

function drawSticker(
  g: Ctx,
  kind: Kind,
  x: number,
  y: number,
  s: number,
  rot: number,
  word: string,
) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);

  switch (kind) {
    case "star": {
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        const rad = i % 2 === 0 ? s : s * 0.45;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad;
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.closePath();
      outline(g, "#ffd24a");
      break;
    }
    case "smile":
    case "sad": {
      const happy = kind === "smile";
      g.beginPath();
      g.arc(0, 0, s, 0, Math.PI * 2);
      outline(g, happy ? "#ffd24a" : "#ff5c8a");
      g.strokeStyle = "#2d1b4e";
      g.fillStyle = "#2d1b4e";
      g.lineWidth = 4;
      g.lineCap = "round";
      if (happy) {
        for (const sx of [-1, 1]) {
          g.beginPath();
          g.arc(sx * s * 0.35, -s * 0.2, s * 0.1, 0, Math.PI * 2);
          g.fill();
        }
        g.beginPath();
        g.arc(0, s * 0.05, s * 0.45, 0.2, Math.PI - 0.2);
        g.stroke();
      } else {
        for (const sx of [-1, 1]) {
          const cx = sx * s * 0.35;
          g.beginPath();
          g.moveTo(cx - s * 0.12, -s * 0.3);
          g.lineTo(cx + s * 0.12, -s * 0.06);
          g.moveTo(cx + s * 0.12, -s * 0.3);
          g.lineTo(cx - s * 0.12, -s * 0.06);
          g.stroke();
        }
        g.beginPath();
        g.arc(0, s * 0.6, s * 0.35, Math.PI + 0.3, -0.3);
        g.stroke();
      }
      break;
    }
    case "heart": {
      g.beginPath();
      g.moveTo(0, s * 0.8);
      g.bezierCurveTo(s * 1.2, s * 0.05, s * 0.8, -s * 0.9, 0, -s * 0.35);
      g.bezierCurveTo(-s * 0.8, -s * 0.9, -s * 1.2, s * 0.05, 0, s * 0.8);
      g.closePath();
      outline(g, "#ff4d6d");
      break;
    }
    case "triangle": {
      g.beginPath();
      g.moveTo(0, -s);
      g.lineTo(s * 0.95, s * 0.75);
      g.lineTo(-s * 0.95, s * 0.75);
      g.closePath();
      outline(g, "#ffb52e");
      g.fillStyle = "#2d1b4e";
      g.font = `bold ${Math.round(s)}px sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("!", 0, s * 0.2);
      break;
    }
    case "flower": {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        g.beginPath();
        g.arc(
          Math.cos(a) * s * 0.55,
          Math.sin(a) * s * 0.55,
          s * 0.4,
          0,
          Math.PI * 2,
        );
        outline(g, "#ff8a3c");
      }
      g.beginPath();
      g.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      outline(g, "#ffd24a");
      break;
    }
    case "arrow": {
      roundRect(g, -s * 0.55, -s * 0.9, s * 1.1, s * 1.8, s * 0.2);
      outline(g, "#8be04e");
      g.strokeStyle = "#2d1b4e";
      g.lineWidth = 5;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.beginPath();
      g.moveTo(0, s * 0.6);
      g.lineTo(0, -s * 0.6);
      g.moveTo(-s * 0.3, -s * 0.3);
      g.lineTo(0, -s * 0.65);
      g.lineTo(s * 0.3, -s * 0.3);
      g.stroke();
      break;
    }
    case "pill": {
      g.font = `bold ${Math.round(s * 0.62)}px sans-serif`;
      const w = g.measureText(word).width + s * 0.8;
      const h = s * 0.95;
      roundRect(g, -w / 2, -h / 2, w, h, h / 2);
      outline(g, "#2d1b4e");
      g.fillStyle = "#8be04e";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(word, 0, 2);
      break;
    }
  }
  g.restore();
}

// Họa tiết thân cột: nền tím xanh + chấm halftone + sticker (lặp lại mỗi ~8 đơn vị chiều cao)
export function makePoleTexture() {
  const W = 512;
  const H = 1632;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;

  g.fillStyle = "#7b84e8";
  g.fillRect(0, 0, W, H);

  g.fillStyle = "rgba(70,60,170,0.2)";
  for (let y = 6, row = 0; y < H; y += 12, row++) {
    for (let x = (row % 2) * 6; x < W; x += 12) {
      g.beginPath();
      g.arc(x, y, 2.4, 0, Math.PI * 2);
      g.fill();
    }
  }

  const r = seeded(11);
  const rows = Math.floor(H / 118);
  for (let row = 0; row < rows; row++) {
    for (let k = 0; k < 2; k++) {
      const x = ((k * 0.5 + (row % 2) * 0.25 + 0.08 + r() * 0.2) % 1) * W;
      const y = 50 + row * 118 + r() * 30;
      const kind = KINDS[Math.floor(r() * KINDS.length)];
      const s = 26 + r() * 14;
      const rot = (r() - 0.5) * 0.7;
      const word = WORDS[Math.floor(r() * WORDS.length)];
      // vẽ 3 lần để sticker không bị cắt ở đường nối của hình trụ
      for (const dx of [-W, 0, W])
        drawSticker(g, kind, x + dx, y, s, rot, word);
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Dải vằn vàng đen
export function makeHazardTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2a1750";
  g.fillRect(0, 0, 256, 64);
  g.fillStyle = "#f2c14e";
  for (let i = -64; i < 256; i += 64) {
    g.beginPath();
    g.moveTo(i, 64);
    g.lineTo(i + 32, 64);
    g.lineTo(i + 64, 0);
    g.lineTo(i + 32, 0);
    g.closePath();
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
