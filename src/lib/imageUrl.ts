// Link http(s) bên ngoài → đi qua proxy. Đường dẫn nội bộ (/photos/...) giữ nguyên.
export function resolveSrc(src: string) {
  return /^https?:\/\//.test(src)
    ? `/api/img?url=${encodeURIComponent(src)}`
    : src;
}
