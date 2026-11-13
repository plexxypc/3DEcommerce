"use client";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils, type Group, type MeshStandardMaterial, type Object3D, type SpotLight } from "three";
import type { Product } from "@/data/products";
import { brand } from "@/brand/adelana";
import { dprCap, type Tier } from "@/lib/capability";

const GAP = 3.4;
const Y = 1.5;

// Guided rail: the camera slides along X; focus eases in on Z. Eased (damped), never linear.
function Rig({ index, focus, products }: { index: number; focus: string | null; products: Product[] }) {
  const { camera, invalidate, size } = useThree();
  const portrait = size.width < size.height;
  useFrame((_, dt) => {
    // portrait phones: pull back so the piece clears the header and the bottom sheet
    const x = index * GAP, z = focus ? (portrait ? 5.6 : 3.6) : 7.2, y = focus ? (portrait ? Y - 0.55 : Y) : 1.7;
    const d = Math.abs(camera.position.x - x) + Math.abs(camera.position.z - z) + Math.abs(camera.position.y - y);
    camera.position.x = MathUtils.damp(camera.position.x, x, 4, dt);
    camera.position.z = MathUtils.damp(camera.position.z, z, 4, dt);
    camera.position.y = MathUtils.damp(camera.position.y, y, 4, dt);
    camera.lookAt(camera.position.x, Y, 0);
    if (d > 0.002) invalidate(); // render on demand: nothing animates when settled
  });
  useEffect(() => { invalidate(); }, [index, focus, products, invalidate]);
  return null;
}

// A spotLight aims at its target object, which defaults to the world origin.
// Give each plinth its own target so every piece is lit where it stands.
function PlinthSpot({ dimmed }: { dimmed: boolean }) {
  const light = useRef<SpotLight>(null);
  const target = useRef<Object3D>(null);
  useEffect(() => { if (light.current && target.current) light.current.target = target.current; }, []);
  return (
    <>
      <object3D ref={target} position={[0, Y, 0]} />
      <spotLight ref={light} position={[0, 5, 2.5]} angle={0.5} penumbra={0.8} intensity={dimmed ? 20 : 90} color={brand.scene.keyLight} />
    </>
  );
}

function Piece({ p, i, focus, onFocus }: { p: Product; i: number; focus: string | null; onFocus: (s: string) => void }) {
  const tex = useTexture(p.image);
  const mat = useRef<MeshStandardMaterial>(null);
  const group = useRef<Group>(null);
  const { invalidate } = useThree();
  const dimmed = focus !== null && focus !== p.slug;
  const sold = p.stock <= 0;
  useFrame((_, dt) => {
    if (!mat.current) return;
    const target = dimmed ? 0.25 : 1;
    mat.current.opacity = MathUtils.damp(mat.current.opacity, target, 6, dt);
    if (Math.abs(mat.current.opacity - target) > 0.01) invalidate();
  });
  return (
    <group ref={group} position={[i * GAP, 0, 0]}>
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[1.8, 0.7, 1.2]} /><meshStandardMaterial color="#1b1819" roughness={0.9} /></mesh>
      <mesh position={[0, Y + 0.2, 0]} onClick={(e) => { e.stopPropagation(); onFocus(p.slug); }}
        onPointerOver={() => (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
        <planeGeometry args={[1.6, 2]} />
        <meshStandardMaterial ref={mat} map={tex} transparent color={sold ? "#8a8a8a" : "#ffffff"} roughness={0.6} />
      </mesh>
      {/* gallery spot: one light per plinth, deep falloff */}
      <PlinthSpot dimmed={dimmed} />
    </group>
  );
}

export default function Scene({ products, index, focus, tier, onFocus, onReady }: {
  products: Product[]; index: number; focus: string | null; tier: Tier; onFocus: (s: string | null) => void; onReady: () => void;
}) {
  const span = (products.length - 1) * GAP;
  return (
    <Canvas role="img" aria-label="3D studio showing the shop's pieces on plinths" frameloop="demand" dpr={[1, dprCap(tier)]}
      camera={{ fov: 42, position: [0, 1.7, 7.2] }} gl={{ antialias: tier === "high", powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); location.assign("/shop"); }); onReady(); }}
      onPointerMissed={() => focus && onFocus(null)}>
      <color attach="background" args={[brand.tokens.ground]} />
      <fog attach="fog" args={[brand.scene.fog, 8, 20]} />
      <ambientLight intensity={0.12} />
      {/* warm rim from behind: one light story across the whole set */}
      <pointLight position={[span / 2, 2.5, -3]} intensity={30} distance={span + 12} color={brand.scene.rimLight} />
      <mesh position={[span / 2, 3, -1.2]}><planeGeometry args={[span + 20, 12]} /><meshStandardMaterial color="#141011" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[span / 2, 0, 3]}><planeGeometry args={[span + 24, 20]} /><meshStandardMaterial color="#0f0d0e" roughness={0.8} /></mesh>
      <Rig index={index} focus={focus} products={products} />
      <Suspense fallback={null}>
        {products.map((p, i) => (<Piece key={p.slug} p={p} i={i} focus={focus} onFocus={onFocus} />))}
      </Suspense>
    </Canvas>
  );
}
