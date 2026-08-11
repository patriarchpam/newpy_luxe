"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const IMAGES = [
  { src: "/images/hero.png", alt: "Braided hair and soft glam makeup" },
  { src: "/images/nails.png", alt: "Manicured nails" },
  { src: "/images/makeup.png", alt: "Soft glam makeup" },
  { src: "/images/hair.png", alt: "Beautiful hair styling" },
  { src: "/images/henna.png", alt: "Intricate henna design" },
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3500); // Change image every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[560px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotate: -2 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-white/10"
          style={{ transformOrigin: "center center" }}
        >
          <Image
            src={IMAGES[currentIndex].src}
            alt={IMAGES[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Decorative dots to show progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {IMAGES.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? "w-6 bg-plum-500" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
