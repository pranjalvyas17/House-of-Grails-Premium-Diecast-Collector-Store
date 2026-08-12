"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { PorscheModel } from "./PorscheModel";
import { Particles } from "./Particles";
import type { RigState } from "./rig";
import { palette } from "@/lib/design/tokens";
import { StudioEnvironment } from "@/components/three/StudioEnvironment";

const CAM_START = new THREE.Vector3(0, 3.6, 12.5); // intro: far + high
const CAM_HERO = new THREE.Vector3(0, 1.35, 8.6); //  rest: centred 3/4
const CAM_FINAL = new THREE.Vector3(0.6, 1.05, 4.7); // scrolled: close-in
const HERO_TARGET = new THREE.Vector3(0, 0.85, 0);
const FINAL_TARGET = new THREE.Vector3(-1.7, 0.7, 0); // shift subject to the right
const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();

/** Intro rail (camReveal) → scroll choreography (scroll) → pointer parallax.
 *  The scroll base is applied directly so the car is adjacent to the scroll;
 *  only the pointer parallax is eased, keeping motion smooth without lag. */
function CameraRig({ rig }: { rig: RigState }) {
  const camera = useThree((s) => s.camera);
  const par = useRef({ x: 0, y: 0 });
  useFrame(() => {
    // Scroll base — direct, so the framing is locked to scroll position.
    _pos.lerpVectors(CAM_START, CAM_HERO, rig.camReveal);
    _pos.lerp(CAM_FINAL, rig.scroll);

    // Smoothed parallax (eases out as we reach the final framing).
    const fade = 1 - rig.scroll;
    par.current.x += (rig.pointer.x * 0.6 * fade - par.current.x) * 0.08;
    par.current.y += (-rig.pointer.y * 0.35 * fade - par.current.y) * 0.08;

    camera.position.set(
      _pos.x + par.current.x,
      _pos.y + par.current.y,
      _pos.z
    );

    _target.copy(HERO_TARGET).lerp(FINAL_TARGET, rig.scroll);
    _target.x += par.current.x * 0.4;
    camera.lookAt(_target);
  });
  return null;
}

/** Two forward spotlights that ignite on cue (light only — no visible discs). */
function Headlights({ rig }: { rig: RigState }) {
  const lRef = useRef<THREE.SpotLight>(null);
  const rRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const i = rig.lights;
    if (lRef.current) lRef.current.intensity = i * 60;
    if (rRef.current) rRef.current.intensity = i * 60;
  });

  return (
    <group position={[0, 0.55, 2.1]}>
      {[-0.62, 0.62].map((x, idx) => (
        <spotLight
          key={x}
          ref={idx === 0 ? lRef : rRef}
          position={[x, 0, 0]}
          target-position={[x * 2, -0.3, 8]}
          angle={0.5}
          penumbra={0.8}
          distance={18}
          color={palette.pearl}
          intensity={0}
        />
      ))}
    </group>
  );
}

export function Scene({ rig }: { rig: RigState }) {
  return (
    <>
      <color attach="background" args={[palette.void]} />
      <fog attach="fog" args={[palette.void, 10, 26]} />

      {/* Key + rim lighting (kept moody — the museum is dark) */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 9, 6]} intensity={0.85} color={palette.pearl} />
      <directionalLight position={[-8, 4, -6]} intensity={0.4} color={palette.ion} />
      <pointLight position={[0, 3, -6]} intensity={10} color={palette.grail} />

      {/* Reflections from a lightformer studio rig (no external HDRI) */}
      <StudioEnvironment />

      <PorscheModel rig={rig} />
      <Headlights rig={rig} />
      <Particles rig={rig} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={palette.obsidian} metalness={0.6} roughness={0.7} />
      </mesh>
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.75}
        scale={22}
        blur={2.6}
        far={8}
        resolution={1024}
        color="#000000"
      />

      <CameraRig rig={rig} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.25}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0009)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}
