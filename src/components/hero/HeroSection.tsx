"use client";

import dynamic from "next/dynamic";

// The 3D canvas must never render on the server (WebGL / window access).
const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-void" />,
});

interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
}

export function HeroSection({ heroTitle, heroSubtitle }: HeroSectionProps) {
  return <Hero3D heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
}
