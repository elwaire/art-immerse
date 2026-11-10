import { NextRequest } from "next/server";

// Chỉ cho phép lấy ảnh từ các domain này (tránh bị lợi dụng làm proxy)
const ALLOWED_HOSTS = ["i.pinimg.com", "images.unsplash.com", "picsum.photos"];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("Bad url", { status: 400 });
  }

  if (
    target.protocol !== "https:" ||
    !ALLOWED_HOSTS.includes(target.hostname)
  ) {
    return new Response("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(target, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "error",
  }).catch(() => null);

  if (!upstream || !upstream.ok) {
    return new Response("Upstream error", { status: 502 });
  }

  const type = upstream.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) {
    return new Response("Not an image", { status: 415 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
