import { create } from "zustand";

/**
 * Coordinates the cinematic boot sequence across the loader and the hero.
 * loaded        → GLB + scene assets finished loading
 * introComplete → the 10-beat GSAP intro timeline has finished
 */
interface ExperienceState {
  loaded: boolean;
  introComplete: boolean;
  setLoaded: (v: boolean) => void;
  setIntroComplete: (v: boolean) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  loaded: false,
  introComplete: false,
  setLoaded: (v) => set({ loaded: v }),
  setIntroComplete: (v) => set({ introComplete: v }),
}));
