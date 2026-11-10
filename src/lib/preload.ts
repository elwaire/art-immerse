import { resolveSrc } from "./imageUrl";

// Khung thay thế khi ảnh không tải được
export const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550">
      <rect width="100%" height="100%" fill="#c9b8f5"/>
      <text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" font-size="32" fill="#1a1030">Không tải được ảnh</text>
    </svg>`,
  );

// Trả về URL dùng được; không bao giờ reject hay treo
export function preloadPhoto(src: string, timeout = 12000): Promise<string> {
  return new Promise((resolve) => {
    const url = resolveSrc(src);
    const img = new Image();
    const timer = setTimeout(() => {
      console.error("[photos] quá thời gian chờ:", src);
      resolve(PLACEHOLDER);
    }, timeout);
    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    img.onerror = () => {
      clearTimeout(timer);
      console.error("[photos] tải lỗi:", src);
      resolve(PLACEHOLDER);
    };
    img.src = url;
  });
}
