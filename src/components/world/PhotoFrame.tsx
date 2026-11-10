"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useViewer } from "@/store/useViewer";

type Props = {
  position: [number, number, number];
  rotationZ?: number;
  src: string;
  scale?: number;
  index: number; // thứ tự ảnh, dùng khi bấm để phóng to
};

const FRAME_W = 5.6; // vùng chứa ảnh (to hơn trước)
const FRAME_H = 3.9;
const BORDER = 0.14;
const REVEAL_DIST = 6;

function easeOutBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export default function PhotoFrame({
  position,
  rotationZ = 0,
  src,
  scale = 1,
  index,
}: Props) {
  const texture = useTexture(src);
  const group = useRef<THREE.Group>(null);
  const reveal = useRef(0);
  const hovered = useRef(false);
  const hover = useRef(0);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const [w, h] = useMemo(() => {
    const img = texture.image as { width: number; height: number };
    const ratio = img.width / img.height;
    const frameRatio = FRAME_W / FRAME_H;
    return ratio > frameRatio
      ? [FRAME_W, FRAME_W / ratio]
      : [FRAME_H * ratio, FRAME_H];
  }, [texture]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const dy = Math.abs(state.camera.position.y - position[1]);
    reveal.current = THREE.MathUtils.damp(
      reveal.current,
      dy < REVEAL_DIST ? 1 : 0,
      5,
      delta,
    );
    hover.current = THREE.MathUtils.damp(
      hover.current,
      hovered.current ? 1 : 0,
      10,
      delta,
    );

    const e = easeOutBack(reveal.current);
    g.visible = reveal.current > 0.01;
    g.position.x = position[0] - (1 - e) * 2;
    g.scale.setScalar(
      Math.max(scale * (0.9 + 0.1 * e) * (1 + hover.current * 0.03), 0.0001),
    );
    g.rotation.z = rotationZ - (1 - e) * 0.25;
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (reveal.current < 0.5) return;
        hovered.current = true;
        document.body.style.cursor = "zoom-in";
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (reveal.current < 0.5) return;
        hovered.current = false;
        document.body.style.cursor = "";
        useViewer.getState().open(index);
      }}
    >
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[w + BORDER * 2, h + BORDER * 2]} />
        <meshBasicMaterial color="#fdf6ee" />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
