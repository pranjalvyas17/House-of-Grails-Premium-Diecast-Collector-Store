"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { palette } from "@/lib/design/tokens";

/** Shared studio lightformer rig — the museum's signature reflections, no external HDRI. */
export function StudioEnvironment({ resolution = 256 }: { resolution?: number }) {
  return (
    <Environment resolution={resolution}>
      <Lightformer form="rect" intensity={1.6} position={[0, 5, -4]} scale={[10, 4, 1]} color={palette.pearl} />
      <Lightformer form="rect" intensity={1.1} position={[-6, 2, 2]} scale={[6, 6, 1]} color={palette.ion} />
      <Lightformer form="rect" intensity={1.1} position={[6, 2, 2]} scale={[6, 6, 1]} color={palette.grailBright} />
      <Lightformer form="circle" intensity={2.2} position={[0, 6, 3]} scale={[3, 3, 1]} color={palette.pearl} />
    </Environment>
  );
}
