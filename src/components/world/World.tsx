"use client";
import { Suspense, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Rig from "./Rig";
import PhotoFrame from "./PhotoFrame";
import Pole from "./Pole";
import Fireflies from "./Fireflies";
import { CAM_Z, FOV, photoY } from "./path";
import { PHOTOS } from "@/data/photos";
import Clouds from "./Clouds";

function Scene({ urls, signUrls }: { urls: string[]; signUrls: string[] }) {
  const size = useThree((s) => s.size);

  // chiều rộng nhìn thấy được tại mặt phẳng z = 0
  const vw = useMemo(() => {
    const aspect = size.width / size.height;
    return 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z * aspect;
  }, [size.width, size.height]);

  const photoX = -vw * 0.12;
  const poleX = vw * 0.36;
  const scale = Math.min(1, Math.max(0.4, vw / 12));

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />

      <Rig />

      <Clouds top={5} bottom={photoY(PHOTOS.length - 1) - 6} />

      <Fireflies
        width={vw * 1.4}
        top={5}
        bottom={photoY(PHOTOS.length - 1) - 6}
      />

      <Pole x={poleX} count={PHOTOS.length} signUrls={signUrls} />

      <Suspense fallback={null}>
        {PHOTOS.map((p, i) => (
          <PhotoFrame
            key={p.id}
            index={i}
            src={urls[i]}
            position={[photoX, photoY(i) + 0.4, 0]} // nhích lên một chút
            rotationZ={(i % 2 === 0 ? -1 : 1) * 0.06}
            scale={scale}
          />
        ))}
      </Suspense>
    </>
  );
}

export default function World({
  urls,
  signUrls,
}: {
  urls: string[];
  signUrls: string[];
}) {
  return (
    <Canvas flat camera={{ position: [0, 0, CAM_Z], fov: FOV }} dpr={[1, 1.75]}>
      <Scene urls={urls} signUrls={signUrls} />
    </Canvas>
  );
}
