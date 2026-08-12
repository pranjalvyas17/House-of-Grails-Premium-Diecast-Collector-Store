"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { RigState } from "./rig";
import { palette } from "@/lib/design/tokens";

/** Resting yaw — a centred 3/4 front view. Tweak to taste (try +Math.PI if the
 *  car faces away at rest). */
const MODEL_YAW = 0.5;
/** Extra yaw applied across the scroll so we end on a rear view, nose to the
 *  right. ~123°. */
const SCROLL_YAW = 2.15;
/** Normalised size of the longest dimension, in world units. */
const TARGET_SIZE = 5.6;

const ION = new THREE.Color(palette.ion);

export function PorscheModel({ rig }: { rig: RigState }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/Porsche_911.glb");

  // Collect paint materials + remember their original emissive so we can tint
  // during the wireframe beat and restore for the solid reveal.
  const materials = useMemo(() => {
    const list: { mat: THREE.MeshStandardMaterial; emissive: THREE.Color }[] = [];
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.envMapIntensity = 0.75;
            list.push({ mat: m, emissive: m.emissive.clone() });
          }
        });
      }
    });
    return list;
  }, [scene]);

  // Normalise scale + rest the car on y = 0 (for contact shadows).
  const fit = useMemo(() => {
    // The source turntable scene includes a large backdrop/floor mesh
    // (named "Plane002") behind the car — invisible in the render, but its
    // geometry is ~2.7x the car's own footprint and was dragging every
    // "fit the car to the scene" measurement (size, scale, ground offset)
    // out to match the BACKDROP's proportions instead of the visible car's,
    // which is what made the car read as floating well above its own
    // contact shadow at every rotation. Confirmed via runtime bounding-box
    // logging per mesh — every actual body/glass/wheel mesh has normal
    // car-sized bounds; only "Plane002_0" spans the full scene. Excluded
    // by name from the fit measurement only — it still renders (or not)
    // exactly as the source file intended, this just stops it from being
    // measured as part of "the car."
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry || mesh.name.startsWith("Plane002")) return;
      mesh.geometry.computeBoundingBox();
      const meshBox = mesh.geometry.boundingBox;
      if (meshBox) box.union(meshBox.clone().applyMatrix4(mesh.matrixWorld));
    });
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);
    return {
      scale,
      // Local-space offset applied to an INNER pivot (the <primitive>
      // below), not the outer rotating group. This puts the car's true
      // geometric center — not the GLTF's arbitrary raw origin — at the
      // group's local (0,0,0), so spinning the outer group (MODEL_YAW,
      // scroll, pointer parallax) rotates around the car itself and keeps
      // its bottom pinned at y=0. Applying this offset to the group's own
      // position instead (as before) rotated around the raw origin, which
      // visibly drifted the car sideways off-center as it turned.
      pivotOffset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [scene]);

  useEffect(() => {
    return () => materials.forEach(({ mat, emissive }) => mat.emissive.copy(emissive));
  }, [materials]);

  useFrame(() => {
    if (!group.current) return;

    // Rotation = resting yaw + intro settle + scroll choreography + parallax.
    group.current.rotation.y =
      MODEL_YAW + rig.baseSpin + rig.scroll * SCROLL_YAW + rig.pointer.x * 0.25;
    group.current.rotation.x = rig.pointer.y * 0.06;
    // Bottom is already pinned at local y=0 via the pivot offset below —
    // only a subtle idle float is layered on top.
    group.current.position.y = Math.sin(performance.now() * 0.0006) * 0.05;

    const wire = rig.wireframe > 0.5;
    for (const { mat, emissive } of materials) {
      mat.wireframe = wire;
      mat.transparent = true;
      if (wire) {
        // wireframe fades in as rig.wireframe goes 1 -> 0.5
        mat.opacity = THREE.MathUtils.clamp((1 - rig.wireframe) * 2, 0, 1) * 0.75;
        mat.emissive.copy(ION);
        mat.emissiveIntensity = 0.6;
      } else {
        mat.opacity = rig.reveal;
        mat.emissive.copy(emissive); // restore original emissive
        mat.emissiveIntensity = 1;
      }
    }
  });

  return (
    // Two nested groups on purpose: the OUTER one (ref) only ever gets a
    // rotation + the ground-level position in useFrame, so it rotates
    // around the car's own center (see `fit.pivotOffset` above). Folding
    // the recenter offset and the rotation onto the SAME node would just
    // reproduce the original bug — Three.js applies a node's own
    // position/scale to its children BEFORE that node's rotation, so an
    // offset living on the rotating node itself still gets swept around
    // the raw origin along with the mesh.
    <group ref={group} dispose={null}>
      <group scale={fit.scale}>
        <primitive object={scene} position={fit.pivotOffset} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/Porsche_911.glb");
