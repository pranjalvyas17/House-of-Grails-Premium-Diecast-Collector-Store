"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  border?: boolean;
  tilt?: boolean;
  style?: CSSProperties;
}

/** Glass panel with cursor spotlight and optional 3D hover tilt. 21st.dev-style primitive. */
export function GlassCard({
  children,
  className = "",
  strong = false,
  border = true,
  tilt = false,
  style,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);

    if (tilt) {
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    }
  };

  const handleLeave = () => {
    if (tilt && ref.current) {
      ref.current.style.setProperty("--rx", "0deg");
      ref.current.style.setProperty("--ry", "0deg");
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: tilt
          ? "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))"
          : undefined,
        transition: "transform 0.4s var(--ease-silk)",
        ...style,
      }}
      className={`spotlight relative ${strong ? "glass-strong" : "glass"} ${
        border ? "border-gradient" : ""
      } rounded-[var(--radius-glass)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
