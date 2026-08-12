/**
 * Mutable animation rig shared between the GSAP intro timeline and the R3F
 * scene. GSAP writes to these fields outside the React render loop; the scene
 * reads them every frame in useFrame. This keeps the cinematic sequence at
 * 60fps with zero React re-renders.
 */
export interface RigState {
  /** 0 = far cinematic start, 1 = hero framing (drives camera path) */
  camReveal: number;
  /** 0 = hidden, 1 = fully materialised (car paint opacity) */
  reveal: number;
  /** 1 = wireframe, 0 = solid */
  wireframe: number;
  /** 0..1 headlight intensity */
  lights: number;
  /** 0..1 ambient particle opacity */
  particles: number;
  /** base car spin from the intro (radians) */
  baseSpin: number;
  /** normalised scroll progress through the pinned hero, 0..1 */
  scroll: number;
  /** normalised pointer for parallax, -1..1 */
  pointer: { x: number; y: number };
}

export const createRig = (): RigState => ({
  camReveal: 0,
  reveal: 0,
  wireframe: 1,
  lights: 0,
  particles: 0,
  baseSpin: 0,
  scroll: 0,
  pointer: { x: 0, y: 0 },
});
