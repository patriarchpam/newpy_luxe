"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Expand } from "lucide-react";
import { GALLERY, GALLERY_CATEGORIES, GalleryCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface GalleryClientProps {
  showFilter?: boolean;
  itemsLimit?: number;
}

export function GalleryClient({ showFilter = true, itemsLimit }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const filteredGallery =
    activeCategory === "All"
      ? GALLERY
      : GALLERY.filter((img) => img.category === activeCategory);

  const displayItems = itemsLimit ? filteredGallery.slice(0, itemsLimit) : filteredGallery;

  const slides = displayItems.map((img) => ({ src: img.src, alt: img.alt }));

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Category Filter */}
      {showFilter && (
        <div
          role="tablist"
          aria-label="Filter gallery by category"
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "h-11 rounded-full px-6 text-[11px] uppercase tracking-[0.18em] transition-colors font-medium",
                activeCategory === cat
                  ? "bg-ink text-white"
                  : "border border-black/10 text-ash hover:border-plum-400 hover:text-plum-600 bg-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry Grid */}
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 auto-rows-[180px] sm:auto-rows-[240px]">
        <AnimatePresence>
          {displayItems.map((item, i) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              className="row-span-1"
            >
              <button
                type="button"
                onClick={() => openLightbox(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-cloud"
                aria-label={`View ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-noir/70 via-noir/0 to-noir/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex w-full items-center justify-between p-4 text-left text-xs uppercase tracking-[0.16em] text-white font-sans">
                    {item.alt || item.category}
                    <Expand size={15} className="shrink-0" />
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {displayItems.length === 0 && (
        <div className="text-center py-20 text-ash font-sans">
          No images available in this category yet.
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(15, 14, 17, 0.95)" } }}
      />
    </>
  );
}
