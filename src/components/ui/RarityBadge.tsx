import { Gem, Flame, Zap, Circle } from "lucide-react";
import type { Rarity } from "@/lib/data/products";
import { rarityLabel } from "@/lib/data/products";

const config: Record<Rarity, { icon: typeof Gem; className: string }> = {
  standard: { icon: Circle, className: "text-silver border-slate/60 bg-smoke/40" },
  limited: { icon: Zap, className: "text-ion border-ion/30 bg-ion/10" },
  chase: { icon: Flame, className: "text-ember border-ember/30 bg-ember/10" },
  grail: { icon: Gem, className: "text-grail border-grail/40 bg-grail/10 glow-grail" },
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  const { icon: Icon, className } = config[rarity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] backdrop-blur-md ${className}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {rarityLabel[rarity]}
    </span>
  );
}
