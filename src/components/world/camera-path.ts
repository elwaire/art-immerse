import * as THREE from "three";

export const CAMERA_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 6),
  new THREE.Vector3(1.5, 0.3, -3),
  new THREE.Vector3(-1.5, 0, -12),
  new THREE.Vector3(1.5, 0.3, -21),
  new THREE.Vector3(0, 0, -30),
  new THREE.Vector3(0, 0, -38),
]);

export const END = 0.8;

// Chia đều n khung ảnh trên đoạn camera đi qua (từ 0.1 đến 0.7)
export function getFrameT(count: number): number[] {
  if (count <= 1) return [0.1];
  const start = 0.1;
  const end = 0.7;
  return Array.from(
    { length: count },
    (_, i) => start + ((end - start) * i) / (count - 1),
  );
}
