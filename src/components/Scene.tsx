"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending, CanvasTexture, MathUtils, RepeatWrapping, SRGBColorSpace, Vector3,
  type Group, type MeshStandardMaterial, type Object3D, type PerspectiveCamera, type PointLight, type SpotLight,
} from "three";
import type { Product } from "@/data/products";
import { brand } from "@/brand/adelana";
import { dprCap, type Tier } from "@/lib/capability";

// The Studio is a gallery corridor. Pieces hang on ceiling rods, alternating left and
// right of the aisle, receding into the fog towards a glowing adeLAna sign. The camera
// walks the aisle (guided rail). Everything is generated in code: zero extra downloads.
const STEP = 3.6;   // distance between pieces along the aisle
const SIDE = 1.15;  // how far off-centre each piece hangs
const HALL = 3.4;   // half-width of the hall
const CEIL = 3.9;
const PY = 1.6;     // piece centre height
const PW = 1.5, PH = 1.875; // 4:5, matches catalogue images
const slot = (i: number) => ({ x: (i % 2 ? 1 : -1) * SIDE, z: -i * STEP });

/* ---------- procedural textures (client only, tiny) ---------- */
function noiseTexture(size: number, base: number, amp: number, blotches: number) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.fillStyle = `rgb(${base},${base},${base})`; g.fillRect(0, 0, size, size);
  for (let i = 0; i < blotches; i++) {
    const r = 30 + Math.random() * 70, x = Math.random() * size, y = Math.random() * size;
    const v = Math.round(base + (Math.random() - 0.5) * amp);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${v},${v},${v},.30)`); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const img = g.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amp * 0.6;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace;
  return t;
}
function rugTexture() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3b0f12"; g.fillRect(0, 0, 256, 512);
  g.strokeStyle = "#c9a24b"; g.lineWidth = 6; g.strokeRect(10, -10, 236, 540);
  g.lineWidth = 2; g.strokeRect(24, -10, 208, 540);
  g.fillStyle = "#7a1b1f";
  for (let y = 0; y < 512; y += 128) {
    g.beginPath(); g.moveTo(128, y + 14); g.lineTo(196, y + 64); g.lineTo(128, y + 114); g.lineTo(60, y + 64); g.closePath(); g.fill();
    g.strokeStyle = "#c9a24b"; g.lineWidth = 2; g.stroke();
  }
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace;
  return t;
}
function poolTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,225,170,1)"); gr.addColorStop(1, "rgba(255,225,170,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}
function signTexture(text: string) {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 256;
  const g = c.getContext("2d")!;
  g.font = "italic 150px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = "#ff2a1a"; g.shadowBlur = 50; g.fillStyle = "#ff5a44";
  g.fillText(text, 512, 135); g.fillText(text, 512, 135);
  return new CanvasTexture(c);
}

/* ---------- camera rail ---------- */
function Rig({ index, focus }: { index: number; focus: string | null }) {
  const { camera, invalidate, size, pointer } = useThree();
  const look = useRef(new Vector3(0, 1.5, -3));
  const portrait = size.width < size.height;
  useEffect(() => {
    if (!matchMedia("(hover: hover)").matches) return; // desktop only: gentle mouse parallax
    const f = () => invalidate();
    addEventListener("pointermove", f);
    return () => removeEventListener("pointermove", f);
  }, [invalidate]);
  useFrame((_, dt) => {
    const cam = camera as PerspectiveCamera;
    const s = slot(index), focused = focus !== null;
    const d = focused ? (portrait ? 4.7 : 3.6) : portrait ? 6.8 : 5.4; // distance from piece
    const tx = focused ? s.x : s.x * 0.35 + pointer.x * 0.3;
    const ty = focused ? PY - (portrait ? 0.1 : 0) : 1.55 + pointer.y * 0.08;
    const tz = s.z + d;
    const lx = focused ? s.x : s.x * 0.8, ly = focused ? PY - (portrait ? 0.8 : 0.05) : 1.45, lz = s.z - (focused ? 0 : 2.2);
    const k = 3.6;
    cam.position.x = MathUtils.damp(cam.position.x, tx, k, dt);
    cam.position.y = MathUtils.damp(cam.position.y, ty, k, dt);
    cam.position.z = MathUtils.damp(cam.position.z, tz, k, dt);
    const L = look.current;
    L.x = MathUtils.damp(L.x, lx, k, dt); L.y = MathUtils.damp(L.y, ly, k, dt); L.z = MathUtils.damp(L.z, lz, k, dt);
    const fov = portrait ? 58 : 46;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.lookAt(L);
    const moving = Math.abs(cam.position.x - tx) + Math.abs(cam.position.y - ty) + Math.abs(cam.position.z - tz)
      + Math.abs(L.x - lx) + Math.abs(L.y - ly) + Math.abs(L.z - lz);
    if (moving > 0.003) invalidate(); // render on demand: nothing animates when settled
  });
  useEffect(() => { invalidate(); }, [index, focus, size.width, size.height, invalidate]);
  return null;
}

/* ---------- one light story: hard key on the active piece + coloured rim + low ambient ---------- */
function Lights({ index }: { index: number }) {
  const key = useRef<SpotLight>(null), rim = useRef<PointLight>(null), tgt = useRef<Object3D>(null);
  const { invalidate } = useThree();
  useEffect(() => { if (key.current && tgt.current) key.current.target = tgt.current; }, []);
  useFrame((_, dt) => {
    const k = key.current, r = rim.current, t = tgt.current;
    if (!k || !r || !t) return;
    const s = slot(index), e = (a: number, b: number) => MathUtils.damp(a, b, 4, dt);
    k.position.set(e(k.position.x, s.x * 0.7), 4.4, e(k.position.z, s.z + 3.4));
    t.position.set(e(t.position.x, s.x), PY, e(t.position.z, s.z));
    r.position.set(e(r.position.x, -s.x * 2.2), 2.2, e(r.position.z, s.z - 2.4));
    if (Math.abs(k.position.z - (s.z + 3.4)) > 0.01) invalidate();
  });
  return (
    <>
      <object3D ref={tgt} position={[0, PY, 0]} />
      <spotLight ref={key} position={[0, 4.4, 3.4]} angle={0.55} penumbra={0.9} intensity={130} distance={14} decay={2} color={brand.scene.keyLight} />
      <pointLight ref={rim} position={[2, 2.2, -2]} intensity={38} distance={10} decay={2} color={brand.scene.rimLight} />
    </>
  );
}

/* ---------- a hung piece ---------- */
function Piece({ p, i, focus, onFocus, pool, rotRef }: {
  p: Product; i: number; focus: string | null; onFocus: (s: string) => void; pool: CanvasTexture; rotRef: React.RefObject<number>;
}) {
  const tex = useTexture(p.image);
  const mat = useRef<MeshStandardMaterial>(null), tilt = useRef<Group>(null);
  const { invalidate } = useThree();
  const { x, z } = slot(i);
  const dimmed = focus !== null && focus !== p.slug, mine = focus === p.slug, sold = p.stock <= 0;
  useFrame((_, dt) => {
    if (mat.current) {
      const target = dimmed ? 0.18 : 1;
      mat.current.opacity = MathUtils.damp(mat.current.opacity, target, 6, dt);
      if (Math.abs(mat.current.opacity - target) > 0.01) invalidate();
    }
    if (tilt.current) {
      const want = mine ? rotRef.current : 0; // drag to tilt while focused; springs back
      tilt.current.rotation.y = MathUtils.damp(tilt.current.rotation.y, want, 8, dt);
      if (Math.abs(tilt.current.rotation.y - want) > 0.002) invalidate();
    }
  });
  const open = (e: { stopPropagation: () => void }) => { e.stopPropagation(); if (!focus) onFocus(p.slug); };
  return (
    <group position={[x, 0, z]}>
      {/* ceiling rod + track fixture */}
      <mesh position={[0, (CEIL + PY + PH / 2) / 2, 0]}><cylinderGeometry args={[0.012, 0.012, CEIL - PY - PH / 2, 6]} /><meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} /></mesh>
      <mesh position={[0, CEIL - 0.1, 0.9]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.07, 0.1, 0.22, 10]} /><meshStandardMaterial color="#111" emissive="#ffd9a0" emissiveIntensity={0.25} metalness={0.6} roughness={0.5} /></mesh>
      {/* light pool on the floor in front of the piece */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.9]}>
        <planeGeometry args={[3.6, 3.6]} /><meshBasicMaterial map={pool} transparent opacity={dimmed ? 0.05 : 0.32} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={tilt} position={[0, PY, 0]}>
        <mesh onClick={open} onPointerOver={() => !focus && (document.body.style.cursor = "pointer")} onPointerOut={() => (document.body.style.cursor = "")}>
          <boxGeometry args={[PW + 0.14, PH + 0.14, 0.07]} />
          <meshStandardMaterial color="#17120f" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.04]} onClick={open}>
          <planeGeometry args={[PW, PH]} />
          {/* emissive map keeps the product the brightest thing even outside the key light */}
          <meshStandardMaterial ref={mat} map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={sold ? 0.05 : 0.14}
            transparent color={sold ? "#8a8a8a" : "#ffffff"} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- the hall ---------- */
function Hall({ n }: { n: number }) {
  const len = (n - 1) * STEP + 16, zMid = -((n - 1) * STEP) / 2 - 2, zEnd = -(n - 1) * STEP - 8.5;
  const { plaster, floorTex, rug, sign } = useMemo(() => {
    const plaster = noiseTexture(256, 120, 70, 50); plaster.repeat.set(len / 5, 1);
    const floorTex = noiseTexture(256, 110, 50, 30); floorTex.repeat.set(2, len / 4);
    const rug = rugTexture(); rug.repeat.set(1, len / 5);
    return { plaster, floorTex, rug, sign: signTexture(brand.name) };
  }, [len]);
  useEffect(() => () => { plaster.dispose(); floorTex.dispose(); rug.dispose(); sign.dispose(); }, [plaster, floorTex, rug, sign]);
  return (
    <>
      {/* walls: grazing light picks out the plaster */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * HALL, CEIL / 2, zMid]} rotation={[0, -s * Math.PI / 2, 0]}>
          <planeGeometry args={[len, CEIL]} />
          <meshStandardMaterial map={plaster} bumpMap={plaster} bumpScale={2.2} color="#a08b7e" roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, CEIL / 2, zEnd]}><planeGeometry args={[HALL * 2, CEIL]} /><meshStandardMaterial map={plaster} color="#4a3a34" roughness={1} /></mesh>
      {/* floor, ceiling, rug runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, zMid]}><planeGeometry args={[HALL * 2, len]} /><meshStandardMaterial map={floorTex} bumpMap={floorTex} bumpScale={1.2} color="#2b2422" roughness={0.45} metalness={0.15} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, zMid]}><planeGeometry args={[2.2, len]} /><meshStandardMaterial map={rug} color="#8c8078" roughness={0.9} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEIL, zMid]}><planeGeometry args={[HALL * 2, len]} /><meshStandardMaterial color="#0e0b0b" roughness={1} /></mesh>
      {/* ceiling track rails */}
      {[-SIDE, SIDE].map((x) => (<mesh key={x} position={[x, CEIL - 0.03, zMid]}><boxGeometry args={[0.06, 0.05, len]} /><meshStandardMaterial color="#1b1717" metalness={0.8} roughness={0.4} /></mesh>))}
      {/* glowing sign at the end of the hall */}
      <mesh position={[0, 2.1, zEnd + 0.05]}><planeGeometry args={[4.4, 1.1]} /><meshBasicMaterial map={sign} transparent toneMapped={false} /></mesh>
      <pointLight position={[0, 1.6, zEnd + 1.6]} intensity={22} distance={9} decay={2} color="#ff3b2a" />
    </>
  );
}

export default function Scene({ products, index, focus, tier, onFocus, onReady }: {
  products: Product[]; index: number; focus: string | null; tier: Tier; onFocus: (s: string | null) => void; onReady: () => void;
}) {
  const pool = useMemo(() => poolTexture(), []);
  useEffect(() => () => pool.dispose(), [pool]);
  // drag to tilt the focused piece (clamped); wheel/swipe rail moves are handled in the HTML shell
  const rotRef = useRef(0);
  const down = useRef<{ x: number; r: number } | null>(null);
  return (
    <Canvas role="img" aria-label="3D gallery hall showing the shop's pieces hanging along a corridor" frameloop="demand" dpr={[1, dprCap(tier)]}
      camera={{ fov: 46, position: [0, 1.55, 5] }} gl={{ antialias: tier === "high", powerPreference: "high-performance" }}
      onCreated={({ gl, invalidate }) => {
        const el = gl.domElement;
        el.addEventListener("webglcontextlost", (e) => { e.preventDefault(); location.assign("/shop"); });
        el.addEventListener("pointerdown", (e) => { down.current = { x: e.clientX, r: rotRef.current }; });
        el.addEventListener("pointermove", (e) => {
          if (!down.current) return;
          rotRef.current = MathUtils.clamp(down.current.r + (e.clientX - down.current.x) * 0.006, -0.55, 0.55); invalidate();
        });
        const up = () => { down.current = null; rotRef.current = 0; invalidate(); };
        addEventListener("pointerup", up); addEventListener("pointercancel", up);
        onReady();
      }}
      onPointerMissed={() => focus && onFocus(null)}>
      <color attach="background" args={[brand.tokens.ground]} />
      <fog attach="fog" args={[brand.scene.fog, 7, 24]} />
      <ambientLight intensity={0.38} />
      <hemisphereLight args={["#ffe6c4", "#150f10", 0.35]} />
      <Lights index={index} />
      <Hall n={products.length} />
      <Rig index={index} focus={focus} />
      <Suspense fallback={null}>
        {products.map((p, i) => (<Piece key={p.slug} p={p} i={i} focus={focus} onFocus={onFocus} pool={pool} rotRef={rotRef} />))}
      </Suspense>
    </Canvas>
  );
}
