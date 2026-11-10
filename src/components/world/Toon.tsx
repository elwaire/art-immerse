import * as THREE from "three";

let gradient: THREE.DataTexture | null = null;

export function getGradient() {
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

export function Toon({
  color = "#ffffff",
  map = null,
}: {
  color?: string;
  map?: THREE.Texture | null;
}) {
  return (
    <meshToonMaterial color={color} map={map} gradientMap={getGradient()} />
  );
}
