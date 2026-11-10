"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAM_Z, FIRST_Y, SPACING, totalDistance } from "./path";
import { PHOTOS } from "@/data/photos";
import { useWorld } from "@/store/useWorld";

export default function Rig() {
  const smooth = useRef(0);

  useFrame((state, delta) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;

    smooth.current = THREE.MathUtils.damp(smooth.current, progress, 5, delta);

    // camera chỉ đi xuống, không xoay, không tiến lùi
    const y = -smooth.current * totalDistance(PHOTOS.length);
    state.camera.position.set(0, y, CAM_Z);

    // ảnh đang xem = ảnh gần camera nhất
    const idx = THREE.MathUtils.clamp(
      Math.round((-y - FIRST_Y) / SPACING),
      0,
      PHOTOS.length - 1,
    );
    const store = useWorld.getState();
    if (store.active !== idx) store.setActive(idx);
  });

  return null;
}
