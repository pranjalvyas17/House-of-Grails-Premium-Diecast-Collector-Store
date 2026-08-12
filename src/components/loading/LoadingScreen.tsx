"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useExperience } from "@/lib/store/experience";

const MIN_DURATION = 1600; // ms — keep the ignition cinematic even if cached

export function LoadingScreen() {
  const { progress } = useProgress();
  const setLoaded = useExperience((s) => s.setLoaded);
  const [display, setDisplay] = useState(0);
  const start = useRef(0);

  useEffect(() => {
    start.current = Date.now();
  }, []);

  // Ease the displayed counter toward the real progress.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setDisplay((d) => d + (progress - d) * 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  // When fully loaded, respect the minimum cinematic duration, then hand off.
  useEffect(() => {
    if (progress < 100) return;
    const wait = Math.max(0, MIN_DURATION - (Date.now() - start.current)) + 500;
    const t = setTimeout(() => setLoaded(true), wait);
    return () => clearTimeout(t);
  }, [progress, setLoaded]);

  const pct = Math.min(100, Math.round(display));

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void noise"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Drifting gradient */}
      <div className="pointer-events-none absolute inset-0 aurora opacity-60" />

      {/* Floating particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-grail/70"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center px-8">
        {/* 911 wireframe drawing in */}
        <svg
          viewBox="0 0 420 150"
          className="mb-10 w-[min(70vw,420px)] overflow-visible"
          fill="none"
        >
          <motion.path
            d="M20 108 C 40 104, 70 102, 95 92 C 120 70, 150 58, 210 56 C 270 54, 320 66, 360 86 C 385 96, 400 104, 402 108 L 402 116 C 402 120, 398 122, 392 122 L 360 122 M 60 122 L 352 122 M 95 92 C 130 84, 300 84, 330 90"
            stroke="url(#grad)"
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          {/* Wheels */}
          {[110, 320].map((cx) => (
            <motion.circle
              key={cx}
              cx={cx}
              cy={122}
              r={22}
              stroke="url(#grad)"
              strokeWidth={1.4}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 1, ease: "easeInOut" }}
            />
          ))}
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="420" y2="0">
              <stop offset="0%" stopColor="#7db4ff" />
              <stop offset="50%" stopColor="#ecc788" />
              <stop offset="100%" stopColor="#d4af6a" />
            </linearGradient>
          </defs>
        </svg>

        <h1 className="font-display text-2xl font-semibold tracking-[0.25em] text-pearl">
          THE HOUSE OF <span className="text-gradient-grail">GRAILS</span>
        </h1>

        {/* Progress bar */}
        <div className="mt-10 h-px w-[min(70vw,420px)] origin-left overflow-hidden bg-smoke/60">
          <motion.div
            className="h-full w-full origin-left bg-linear-to-r from-ion via-grail-bright to-grail"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
        <div className="mt-4 flex w-[min(70vw,420px)] items-center justify-between text-xs tracking-[0.3em] text-ash">
          <span>LOADING ASSETS</span>
          <span className="tabular-nums text-platinum">
            {String(pct).padStart(3, "0")}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
