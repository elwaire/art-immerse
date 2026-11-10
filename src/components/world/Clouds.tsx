"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "@/lib/random";
import { CAM_Z, FOV } from "./path";
import { makeCloudTexture } from "./cloudTexture";

const TAN_HALF = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

type Props = { top: number; bottom: number };

export default function Clouds({ top, bottom }: Props) {
  const size = useThree((s) => s.size);
  const aspect = size.width / size.height;
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const textures = useMemo(() => [1, 2, 3].map(makeCloudTexture), []);

  const clouds = useMemo(() => {
    const rand = seeded(21);
    const count = Math.round((top - bottom) * 0.6);
    return Array.from({ length: count }, () => {
      const z = -4 - rand() * 12; // luôn nằm sau ảnh và cột
      const d = CAM_Z - z; // khoảng cách tới camera
      const visW = 2 * TAN_HALF * d * aspect; // bề rộng nhìn thấy ở độ sâu này
      return {
        x: (rand() - 0.5) * visW,
        y: bottom + rand() * (top - bottom),
        z,
        visW,
        w: visW * (0.16 + rand() * 0.16),
        // tốc độ trôi: mây gần hơi nhanh hơn mây xa
        speed: visW * (0.008 + rand() * 0.014) * (14 / d),
        tex: Math.floor(rand() * 3),
        flip: rand() > 0.5 ? 1 : -1,
        // mây xa mờ hơn một chút
        opacity: THREE.MathUtils.clamp(
          0.55 + 0.45 * (1 - (d - 12) / 12),
          0.5,
          1,
        ),
        phase: rand() * Math.PI * 2,
      };
    });
  }, [top, bottom, aspect]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    clouds.forEach((c, i) => {
      const m = refs.current[i];
      if (!m) return;
      c.x -= c.speed * delta; // trôi từ phải sang trái
      const limit = c.visW / 2 + c.w / 2;
      if (c.x < -limit) c.x = limit; // ra khỏi màn hình thì quay lại bên phải
      m.position.set(c.x, c.y + Math.sin(t * 0.3 + c.phase) * 0.15, c.z); // nhấp nhô nhẹ
    });
  });

  return (
    <>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[c.x, c.y, c.z]}
          scale={[c.flip, 1, 1]}
        >
          <planeGeometry args={[c.w, c.w / 2]} />
          <meshBasicMaterial
            map={textures[c.tex]}
            transparent
            opacity={c.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}
