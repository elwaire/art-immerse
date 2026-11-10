"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  sunglasses?: boolean;
  hat?: string; // màu nón, bỏ trống nếu không đội
  phase?: number;
};

type Mode = "perched" | "fleeing" | "away" | "returning";

const BODY = "#f4f0fb";
const OUTLINE = "#b9a9f0";
const BEAK = "#ff9b8a";

// Bảng đổ bóng 3 bậc cho kiểu hoạt hình
let gradient: THREE.DataTexture | null = null;
function getGradient() {
  if (!gradient) {
    gradient = new THREE.DataTexture(
      new Uint8Array([150, 205, 255]),
      3,
      1,
      THREE.RedFormat,
    );
    gradient.minFilter = THREE.NearestFilter;
    gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
  }
  return gradient;
}

function Toon({ color }: { color: string }) {
  return <meshToonMaterial color={color} gradientMap={getGradient()} />;
}

export default function Bird({
  position,
  sunglasses = false,
  hat,
  phase = 0,
}: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const clock = useThree((s) => s.clock);

  const [px, py, pz] = position;
  const perch = useMemo(() => new THREE.Vector3(px, py, pz), [px, py, pz]);
  const hatBand = useMemo(
    () =>
      hat
        ? "#" + new THREE.Color(hat).multiplyScalar(0.65).getHexString()
        : "#000",
    [hat],
  );

  const st = useRef({
    mode: "perched" as Mode,
    t0: 0,
    dur: 1.5,
    a: new THREE.Vector3(),
    c: new THREE.Vector3(),
    b: new THREE.Vector3(),
    nextLook: 1.5 + phase,
    yawTarget: 0,
    nextBlink: 1 + phase,
    blinkUntil: 0,
    landedAt: -10,
  });

  // Bị rê chuột vào → bay đi
  const flee = () => {
    const s = st.current;
    const now = clock.elapsedTime;
    if (s.mode !== "perched" || now - s.landedAt < 1) return;
    const side = Math.random() < 0.5 ? -1 : 1;
    s.mode = "fleeing";
    s.t0 = now;
    s.dur = 1.2 + Math.random() * 0.4;
    s.a.copy(perch);
    s.c.set(perch.x + side * 3, perch.y + 2.2, perch.z + 1);
    s.b.set(perch.x + side * 14, perch.y + 8, perch.z + 3);
  };

  useFrame((state, delta) => {
    const r = root.current;
    const b = body.current;
    const wl = wingL.current;
    const wr = wingR.current;
    if (!r || !b || !wl || !wr) return;

    const now = state.clock.elapsedTime;
    const s = st.current;
    const damp = THREE.MathUtils.damp;
    let flap = 0.12; // góc cánh: nhỏ = xếp gọn, lớn = giương lên

    // chớp mắt
    if (eyes.current) {
      if (now > s.nextBlink) {
        s.blinkUntil = now + 0.13;
        s.nextBlink = now + 2.5 + Math.random() * 3.5;
      }
      eyes.current.scale.y = now < s.blinkUntil ? 0.1 : 1;
    }

    // đang bay đi xa, chờ đủ thời gian rồi bay về
    if (s.mode === "away") {
      if (now - s.t0 < s.dur) return;
      const side = Math.random() < 0.5 ? -1 : 1;
      s.mode = "returning";
      s.t0 = now;
      s.dur = 1.8 + Math.random() * 0.4;
      s.a.set(perch.x + side * 14, perch.y + 8, perch.z + 3);
      s.c.set(perch.x + side * 2.5, perch.y + 4.5, perch.z + 0.5);
      s.b.copy(perch);
      r.position.copy(s.a);
      r.visible = true;
    }

    if (s.mode === "perched") {
      // thở nhẹ
      const breathe = Math.sin(now * 2 + phase) * 0.015;
      b.position.y = breathe;
      b.scale.y = 1 + breathe;

      // thỉnh thoảng quay đầu nhìn quanh
      if (now > s.nextLook) {
        if (s.yawTarget === 0) {
          const side = Math.random() < 0.5 ? -1 : 1;
          s.yawTarget = side * (0.5 + Math.random() * 0.45);
          s.nextLook = now + 1 + Math.random() * 1.2; // giữ hướng nhìn
        } else {
          s.yawTarget = Math.random() < 0.35 ? -s.yawTarget : 0; // đôi khi liếc sang bên kia
          s.nextLook =
            now +
            (s.yawTarget === 0 ? 2 + Math.random() * 3.5 : 0.9 + Math.random());
        }
      }
      b.rotation.y = damp(b.rotation.y, s.yawTarget, 6, delta);
      b.rotation.z = damp(b.rotation.z, s.yawTarget * 0.12, 6, delta);
      flap = 0.12 + breathe * 3;
    } else {
      // đang bay: đi theo đường cong Bézier a → c → b
      const t = Math.min((now - s.t0) / s.dur, 1);
      const te =
        s.mode === "returning" ? 1 - Math.pow(1 - t, 3) : t * t * (3 - 2 * t);
      const u = 1 - te;

      r.position
        .set(0, 0, 0)
        .addScaledVector(s.a, u * u)
        .addScaledVector(s.c, 2 * u * te)
        .addScaledVector(s.b, te * te);

      const vx = 2 * u * (s.c.x - s.a.x) + 2 * te * (s.b.x - s.c.x);
      b.position.y = 0;
      b.scale.y = 1;
      b.rotation.y = damp(
        b.rotation.y,
        THREE.MathUtils.clamp(vx * 0.06, -0.9, 0.9),
        8,
        delta,
      );
      b.rotation.z = damp(
        b.rotation.z,
        THREE.MathUtils.clamp(-vx * 0.015, -0.4, 0.4),
        8,
        delta,
      );

      // vỗ cánh, chậm dần khi sắp đáp
      const calm =
        s.mode === "returning"
          ? 1 - 0.9 * THREE.MathUtils.smoothstep(t, 0.75, 1)
          : 1;
      flap = 0.12 + (0.85 + Math.sin(now * 26) * 0.8) * calm;

      if (t >= 1) {
        if (s.mode === "fleeing") {
          s.mode = "away";
          s.t0 = now;
          s.dur = 2.5 + Math.random() * 2.5;
          r.visible = false;
        } else {
          s.mode = "perched";
          s.landedAt = now;
          s.yawTarget = 0;
          s.nextLook = now + 1.5 + Math.random() * 2;
          r.position.copy(perch);
        }
      }
    }

    wl.rotation.z = -flap;
    wr.rotation.z = flap;
  });

  return (
    <group
      ref={root}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        flee();
      }}
      onClick={(e) => {
        e.stopPropagation();
        flee();
      }}
    >
      <group ref={body}>
        {/* thân + viền */}
        <group scale={[1, 0.94, 0.96]}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <Toon color={BODY} />
          </mesh>
          <mesh scale={1.06}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color={OUTLINE} side={THREE.BackSide} />
          </mesh>
        </group>

        {/* bụng sáng */}
        <mesh position={[0, -0.1, 0.3]} scale={[0.9, 1, 0.55]}>
          <sphereGeometry args={[0.38, 24, 24]} />
          <Toon color="#ffffff" />
        </mesh>

        {/* đuôi */}
        <mesh position={[0, -0.05, -0.48]} rotation={[-1.2, 0, 0]}>
          <coneGeometry args={[0.14, 0.32, 14]} />
          <Toon color={BODY} />
        </mesh>

        {/* chỏm lông trên đầu */}
        {!hat && (
          <mesh position={[0.02, 0.5, 0.05]} rotation={[0.3, 0, -0.4]}>
            <coneGeometry args={[0.05, 0.2, 12]} />
            <Toon color={BODY} />
          </mesh>
        )}

        {/* má hồng */}
        {[-1, 1].map((sx) => (
          <mesh
            key={sx}
            position={[sx * 0.3, -0.02, 0.35]}
            rotation={[0, sx * 0.8, 0]}
            scale={[1.2, 0.8, 0.35]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ffb3c7" transparent opacity={0.85} />
          </mesh>
        ))}

        {/* mỏ */}
        <mesh position={[0, 0.0, 0.5]} scale={[1.35, 0.8, 1.1]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <Toon color={BEAK} />
        </mesh>
        <mesh position={[0, -0.065, 0.49]} scale={[1.2, 0.6, 1]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <Toon color="#f07a6f" />
        </mesh>

        {/* mắt, hoặc kính râm */}
        {sunglasses ? (
          <group position={[0, 0.13, 0.45]}>
            {[-0.17, 0.17].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.13, 0.13, 0.035, 28]} />
                  <meshStandardMaterial
                    color="#14102a"
                    roughness={0.25}
                    metalness={0.2}
                  />
                </mesh>
                <mesh position={[0, 0, 0.02]}>
                  <torusGeometry args={[0.13, 0.012, 12, 32]} />
                  <meshStandardMaterial color="#0a0818" />
                </mesh>
                <mesh position={[-0.04, 0.05, 0.03]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              </group>
            ))}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.03]} />
              <meshStandardMaterial color="#0a0818" />
            </mesh>
            {[-1, 1].map((sx) => (
              <mesh key={sx} position={[sx * 0.31, 0.02, -0.12]}>
                <boxGeometry args={[0.025, 0.025, 0.3]} />
                <meshStandardMaterial color="#0a0818" />
              </mesh>
            ))}
          </group>
        ) : (
          <group ref={eyes} position={[0, 0.12, 0.44]}>
            {[-0.17, 0.17].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh scale={[0.85, 1.25, 0.6]}>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshStandardMaterial color="#1a1030" roughness={0.3} />
                </mesh>
                <mesh position={[0.02, 0.03, 0.035]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* nón */}
        {hat && (
          <group position={[0, 0.47, 0.02]} rotation={[0.08, 0, 0.14]}>
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.19, 0.24, 0.18, 28]} />
              <Toon color={hat} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.245, 0.245, 0.05, 28]} />
              <Toon color={hatBand} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.38, 0.4, 0.025, 32]} />
              <Toon color={hat} />
            </mesh>
          </group>
        )}

        {/* cánh (xoay quanh điểm gắn trên vai) */}
        <group ref={wingL} position={[-0.45, 0.02, 0]}>
          <mesh position={[-0.03, -0.14, -0.04]} scale={[0.3, 0.85, 0.9]}>
            <sphereGeometry args={[0.26, 20, 20]} />
            <Toon color={BODY} />
          </mesh>
        </group>
        <group ref={wingR} position={[0.45, 0.02, 0]}>
          <mesh position={[0.03, -0.14, -0.04]} scale={[0.3, 0.85, 0.9]}>
            <sphereGeometry args={[0.26, 20, 20]} />
            <Toon color={BODY} />
          </mesh>
        </group>

        {/* chân */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, -0.5, 0.1]} scale={[1, 0.45, 1.5]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <Toon color={BEAK} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
