"use client";
import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Bird from "./Bird";
import Sign from "./Sign";
import { Toon } from "./Toon";
import { SPACING, photoY } from "./path";
import { makeHazardTexture, makePoleTexture } from "./poleTextures";

type Props = { x: number; count: number; signUrls: string[] };

const R = 0.4;
const TOP = 6;
const TURN_PER_SPACING = 0.6; // cột xoay 0.6 vòng sau mỗi khoảng cuộn giữa 2 ảnh
const K = TURN_PER_SPACING * Math.PI * 2;
const SIGN_DROP = 2.7; // biển nằm dưới mỗi khung ảnh một đoạn
const STRAP_COLORS = ["#f08a3c", "#f2c14e", "#3b5bff"];
const DARK = "#2d1b4e";

export default function Pole({ x, count, signUrls }: Props) {
  const core = useRef<THREE.Group>(null);
  const bottom = photoY(count - 1) - 8;
  const H = TOP - bottom;

  const poleTex = useMemo(() => {
    const t = makePoleTexture();
    t.repeat.set(1, H / 8);
    return t;
  }, [H]);

  const hazardTex = useMemo(() => {
    const t = makeHazardTexture();
    t.repeat.set(2, 1);
    return t;
  }, []);

  // độ cao các cánh tay (đứng yên)
  const armYs = useMemo(
    () => Array.from({ length: count }, (_, i) => photoY(i) + 1.8),
    [count],
  );

  // đai màu; hộp kỹ thuật chỉ gắn ở chỗ không vướng cánh tay và biển
  const straps = useMemo(() => {
    const n = Math.floor(H / 3.5);
    return Array.from({ length: n }, (_, i) => {
      const y = TOP - 2 - i * 3.5;
      const free = armYs.every(
        (a) => Math.abs(y + 1 - a) > 1.9 && Math.abs(y + 1 - (a - 4.5)) > 1.6,
      );
      return {
        y,
        color: STRAP_COLORS[i % 3],
        angle: i * 2.1,
        box: i % 3 === 1 && free,
      };
    });
  }, [H, armYs]);

  const hazards = useMemo(
    () =>
      Array.from(
        { length: Math.floor(H / 12) + 1 },
        (_, i) => TOP - 0.9 - i * 12,
      ),
    [H],
  );

  // cột xoay theo độ cao camera (tức là theo chiều cuộn)
  useFrame((state) => {
    if (core.current)
      core.current.rotation.y = (-state.camera.position.y / SPACING) * K;
  });

  return (
    <group position={[x, 0, -0.5]}>
      {/* ===== PHẦN XOAY THEO CUỘN ===== */}
      <group ref={core}>
        {/* thân cột có sticker */}
        <mesh position={[0, (TOP + bottom) / 2, 0]}>
          <cylinderGeometry args={[R, R, H, 48]} />
          <Toon map={poleTex} />
        </mesh>

        {/* nắp đáy */}
        <mesh position={[0, bottom, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.4, 32]} />
          <Toon color={DARK} />
        </mesh>

        {/* nắp đỉnh + vòng vàng + ăng-ten */}
        <mesh position={[0, TOP + 0.2, 0]}>
          <cylinderGeometry args={[0.34, 0.48, 0.5, 32]} />
          <Toon color={DARK} />
        </mesh>
        <mesh position={[0, TOP - 0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.14, 32]} />
          <Toon color="#f2c14e" />
        </mesh>
        <mesh position={[0, TOP + 1.0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <Toon color={DARK} />
        </mesh>
        <mesh position={[0, TOP + 1.55, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <Toon color="#ff5c8a" />
        </mesh>

        {/* dải vằn vàng đen */}
        {hazards.map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.8, 40]} />
            <Toon map={hazardTex} />
          </mesh>
        ))}

        {/* đai màu + khoá đai + hộp kỹ thuật */}
        {straps.map((s, i) => (
          <group key={i} position={[0, s.y, 0]}>
            <mesh>
              <cylinderGeometry args={[0.45, 0.45, 0.5, 40]} />
              <Toon color={s.color} />
            </mesh>
            <group rotation={[0, s.angle, 0]}>
              <mesh position={[0, 0, 0.46]}>
                <boxGeometry args={[0.16, 0.36, 0.1]} />
                <Toon color={DARK} />
              </mesh>
              {s.box && (
                <group position={[0, 1.0, 0.65]}>
                  <mesh>
                    <boxGeometry args={[0.8, 1.0, 0.5]} />
                    <Toon color="#7fd6cf" />
                  </mesh>
                  <mesh position={[0, 0.3, 0.26]}>
                    <boxGeometry args={[0.5, 0.12, 0.04]} />
                    <Toon color={DARK} />
                  </mesh>
                  <mesh position={[0, -0.1, 0.26]}>
                    <circleGeometry args={[0.09, 16]} />
                    <meshBasicMaterial color="#ff5c8a" />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        ))}

        {/* các biển ảnh: mỗi biển một góc, xoay ra phía trước đúng lúc camera tới */}
        {signUrls.length > 0 &&
          Array.from({ length: count }, (_, i) => {
            const y = photoY(i) - SIGN_DROP;
            return (
              <Suspense key={i} fallback={null}>
                <Sign
                  src={signUrls[i % signUrls.length]}
                  y={y}
                  theta={(y / SPACING) * K}
                />
              </Suspense>
            );
          })}
      </group>

      {/* ===== PHẦN ĐỨNG YÊN: vòng đỡ + cánh tay + chim ===== */}
      {armYs.map((armY, i) => (
        <group key={i}>
          <mesh position={[0, armY, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.36, 36]} />
            <Toon color="#5f67d1" />
          </mesh>
          <mesh position={[-0.55, armY, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.3]} />
            <Toon color="#5f67d1" />
          </mesh>
          <mesh position={[-2, armY, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 4, 16]} />
            <Toon color="#7f88ea" />
          </mesh>
          <Bird position={[-1.6, armY + 0.67, 0]} sunglasses phase={i} />
          <Bird
            position={[-2.8, armY + 0.67, 0]}
            hat="#9b7bff"
            phase={i + 1.5}
          />
        </group>
      ))}
    </group>
  );
}
