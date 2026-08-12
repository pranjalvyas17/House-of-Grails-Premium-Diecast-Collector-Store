"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { communityStats } from "@/lib/data/products";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v).toLocaleString()}${suffix}`;
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function CommunityStats() {
  return (
    <section id="community" className="relative overflow-hidden px-6 py-24 md:px-14">
      <div className="pointer-events-none absolute inset-0 aurora opacity-40" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {communityStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center"
          >
            <p
              className="font-display font-semibold text-gradient-grail"
              style={{ fontSize: "var(--text-title)" }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ash">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
