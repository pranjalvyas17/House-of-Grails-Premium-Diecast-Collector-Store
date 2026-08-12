"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
import type { RecentPurchase } from "@/lib/data/productDetail";

export function RecentlyPurchased({ feed }: { feed: RecentPurchase[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % feed.length), 3800);
    return () => clearInterval(id);
  }, [feed.length]);

  const current = feed[index];

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
      <CircleUserRound size={18} className="shrink-0 text-ion" />
      <div className="min-h-[2.5rem] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs text-silver"
          >
            <span className="font-medium text-pearl">{current.name}</span> from{" "}
            {current.location} claimed this{" "}
            <span className="text-ion">{current.minutesAgo} min ago</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
