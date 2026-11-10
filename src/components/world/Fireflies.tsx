"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35 + aPhase * 6.2831;

    // bay lượn nhẹ nhàng quanh vị trí gốc
    p.x += sin(t * 1.3 + aPhase * 10.0) * 0.6;
    p.y += cos(t * 0.9 + aPhase * 7.0) * 0.5 + sin(uTime * 0.2 + aPhase * 20.0) * 0.3;
    p.z += sin(t * 0.7) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(aSize * uPixelRatio * (14.0 / -mv.z), 2.0);

    // nhấp nháy
    vTwinkle = 0.45 + 0.55 * sin(uTime * (0.8 + aPhase * 1.5) + aPhase * 30.0);
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(smoothstep(0.5, 0.0, d), 2.5); // quầng sáng mềm
    float core = smoothstep(0.12, 0.0, d);          // lõi sáng
    vec3 col = vColor * (glow + core * 1.2);
    gl_FragColor = vec4(col, (glow * 0.9 + core) * vTwinkle);
  }
`;

// vàng ấm, cam nhạt, xanh lá nhạt, xanh dương nhạt
const PALETTE = [
  [1.0, 0.9, 0.5],
  [1.0, 0.78, 0.38],
  [0.7, 1.0, 0.7],
  [0.65, 0.85, 1.0],
];

type Props = { width: number; top: number; bottom: number };

export default function Fireflies({ width, top, bottom }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const { positions, phases, sizes, colors } = useMemo(() => {
    const height = top - bottom;
    const count = Math.round(height * 3); // ~3 đốm sáng trên mỗi đơn vị chiều cao
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = bottom + Math.random() * height;
      positions[i * 3 + 2] = -9 + Math.random() * 12; // nhiều độ sâu khác nhau
      phases[i] = Math.random();
      sizes[i] = 4 + Math.random() * 6;
      colors.set(PALETTE[Math.floor(Math.random() * PALETTE.length)], i * 3);
    }
    return { positions, phases, sizes, colors };
  }, [width, top, bottom]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: dpr } }),
    [dpr],
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
