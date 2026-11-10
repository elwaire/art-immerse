"use client";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Toon } from "./Toon";

const DIST = 1.45; // khoảng cách từ trục cột tới biển
const SIZE = 1.9; // cạnh biển
const FACE = 1.62; // cạnh mặt ảnh

type Props = { src: string; y: number; theta: number };

export default function Sign({ src, y, theta }: Props) {
  const base = useTexture(src);

  // cắt ảnh cho vừa mặt biển vuông (kiểu object-fit: cover)
  const tex = useMemo(() => {
    const t = base.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    const img = base.image as { width: number; height: number };
    const ratio = img.width / img.height;
    if (ratio > 1) {
      t.repeat.set(1 / ratio, 1);
      t.offset.set((1 - 1 / ratio) / 2, 0);
    } else {
      t.repeat.set(1, ratio);
      t.offset.set(0, (1 - ratio) / 2);
    }
    t.needsUpdate = true;
    return t;
  }, [base]);

  return (
    // theta: góc của biển quanh cột; rotation.y = theta để mặt biển hướng ra ngoài
    <group
      position={[Math.sin(theta) * DIST, y, Math.cos(theta) * DIST]}
      rotation={[0, theta, 0]}
    >
      {/* khung */}
      <mesh>
        <boxGeometry args={[SIZE, SIZE, 0.12]} />
        <Toon color="#f7f2ff" />
      </mesh>
      {/* mặt trước = ảnh */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[FACE, FACE]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* mặt sau */}
      <mesh position={[0, 0, -0.07]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[FACE, FACE]} />
        <meshBasicMaterial color="#5b4fc4" />
      </mesh>
      {/* hai thanh nối biển vào cột */}
      {[0.5, -0.5].map((by) => (
        <mesh
          key={by}
          position={[0, by, -0.565]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.05, 0.05, 1.07, 10]} />
          <Toon color="#3b3470" />
        </mesh>
      ))}
    </group>
  );
}
