"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { instagramWall } from "@/lib/data/products";

export function InstagramWall() {
  return (
    <section className="relative px-6 py-28 md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            kicker="Tagged #HouseOfGrails"
            title={
              <>
                The <span className="text-gradient-grail">Community</span> Wall
              </>
            }
          />
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-silver transition-colors hover:text-grail"
          >
            <InstagramIcon size={16} />
            Follow @houseofgrails
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {instagramWall.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={post.image}
                alt="Community post"
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-void/0 text-pearl opacity-0 backdrop-blur-0 transition-all duration-300 group-hover:bg-void/60 group-hover:opacity-100 group-hover:backdrop-blur-sm">
                <Heart size={16} className="fill-ember text-ember" />
                <span className="text-sm font-medium">{post.likes}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
