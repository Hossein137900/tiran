"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Define the type for each image item
interface ImageItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  link: string;
}

interface ImageGridProps {
  images: ImageItem[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const gridRef = useRef(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Container variants

  // Item variants
  const itemVariants = {
    hidden: { y: 100, opacity: 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 mb-8" dir="rtl">
      <motion.div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8"
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="relative aspect-[5/9] overflow-hidden rounded-sm shadow-md"
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.7 },
            }}
            onHoverStart={() => setHoveredId(image.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <Link href={image.link} className="block h-full w-full">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-700"
                style={{
                  transform: hoveredId === image.id ? "scale(1.1)" : "scale(1)",
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent transition-all duration-300" />

              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <AnimatePresence>
                  {hoveredId === image.id ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className=""
                    >
                      <p className="text-white/90 text-sm mb-2">
                        {image.description}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.h3
                  className="text-white inline text-xl md:text-2xl font-medium"
                  layout
                >
                  {image.title}
                  <ArrowLeft className="w-5 h-5 mr-1 inline" />
                </motion.h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
