"use client";
import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CategoryItem {
  id: number;
  imageDefault: string; // Black & white image
  imageHover: string; // Colorful image
  title: string;
  subtitle?: string;
  description?: string;
  color?: string;
  icon?: string;
}
interface MixedGridCardProps {
  category: CategoryItem;
  index: number;
  isHovered: boolean;
  size: string;
}

interface MixedGridShowcaseProps {
  categories: CategoryItem[];
  title?: string;
  subtitle?: string;
}

const MixedGridShowcase: React.FC<MixedGridShowcaseProps> = ({
  categories,
  title = "دسته‌بندی‌های ما",
  subtitle = "کشف کنید، تجربه کنید، لذت ببرید",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Changed once: true to once: false to allow repeated animations
  const isInView = useInView(containerRef, {
    once: false,
    margin: "-20%",
    amount: 0.1,
  });

  // Update animation key when component comes into view
  React.useEffect(() => {
    if (isInView) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [isInView]);

  // Smaller grid layout patterns with overlay support
  const gridPatterns = [
    {
      size: "large",
      span: "md:col-span-1 md:row-span-1",
      height: "h-52 md:h-80",
      zIndex: "z-50",
      priority: "high",
      overlap: "none",
    },
    {
      size: "medium",
      span: "md:col-span-1 md:row-span-3",
      height: "h-48 md:h-80",
      zIndex: "z-40",
      priority: "medium",
      overlap: "slight",
    },
    {
      size: "small",
      span: "md:col-span-1 md:row-span-3",
      height: "h-32 md:h-75",
      zIndex: "z-30",
      priority: "low",
      overlap: "moderate",
    },
    {
      size: "wide",
      span: "md:col-span-1 md:row-span-1",
      height: "h-40 md:h-80",
      zIndex: "z-45",
      priority: "high",
      overlap: "minimal",
    },
    {
      size: "small",
      span: "md:col-span-2 md:row-span-4",
      height: "h-56 md:h-88",
      zIndex: "z-35",
      priority: "low",
      overlap: "moderate",
    },
    {
      size: "featured",
      span: "md:col-span-2 md:row-span-4",
      height: "h-72 md:h-88",
      zIndex: "z-60",
      priority: "featured",
      overlap: "artistic",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Updated item variants for right/left entrance with reset capability
  const itemVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: index % 2 === 0 ? -300 : 300, // Come from left or right
      y: 50,
      scale: 0.7,
      rotate: index % 2 === 0 ? -15 : 15,
      filter: "blur(8px)",
    }),
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    }),
  };

  return (
    <div ref={containerRef} className="px-4 py-12  h-full relative">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image */}
        <motion.div
          className="absolute bg-black inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>

      {/* Title Section */}
      <motion.div
        className="text-center mb-16 relative z-10"
        key={`title-${animationKey}`}
        initial={{ opacity: 0, y: -50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white my-4 pt-8 drop-shadow-2xl"
          transition={{ duration: 4, repeat: Infinity }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 border-b pb-3 max-w-2xl mx-auto  drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Smaller Mixed Grid Layout with Overlays */}
      <motion.div
        className="max-w-5xl mx-auto relative z-10"
        key={`container-${animationKey}`} // Key to force re-animation
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-min relative">
          {categories.map((category, index) => {
            const pattern = gridPatterns[index % gridPatterns.length];

            return (
              <motion.div
                key={`${category.id}-${animationKey}`} // Key to force re-animation
                custom={index}
                variants={itemVariants}
                className={`${pattern.span} ${pattern.height} ${pattern.zIndex} group cursor-pointer relative`}
                style={{
                  marginTop: index > 0 ? `${(index % 3) * -20}px` : "0px", // Overlapping effect
                  marginLeft:
                    index % 2 === 1 ? `${(index % 2) * -10}px` : "0px",
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{
                  scale: 1.05,
                  zIndex: 100,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <MixedGridCard
                  category={category}
                  index={index}
                  isHovered={hoveredIndex === index}
                  size={pattern.size}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

// Mixed Grid Card Component (Updated for smaller size)

const MixedGridCard: React.FC<MixedGridCardProps> = ({
  category,
  //   index,
  isHovered,
  size,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showColorImage, setShowColorImage] = useState(false);
  console.log(imageLoaded);

  return (
    <div
      className={`relative space-x-2 w-full h-full overflow-hidden  shadow-lg group transform transition-all duration-300`}
      onMouseEnter={() => setShowColorImage(true)}
      onMouseLeave={() => setShowColorImage(false)}
    >
      {/* Image Container */}
      <div className="absolute inset-0">
        {/* Default B&W Image */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: showColorImage ? 0 : 1,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={category.imageDefault}
            alt={category.title}
            fill
            className="object-cover"
            style={{
              filter: "grayscale(100%) contrast(1.1) brightness(0.9)",
            }}
            onLoad={() => setImageLoaded(true)}
            sizes={`(max-width: 768px) 50vw, ${
              size === "medium" ? "25vw" : size === "wide" ? "50vw" : "12.5vw"
            }`}
          />
        </motion.div>

        {/* Hover Color Image */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: 1,
                scale: 1.15,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onAnimationStart={() => setShowColorImage(true)}
              onAnimationComplete={() => setShowColorImage(false)}
            >
              <Image
                src={category.imageHover}
                alt={`${category.title} - Color`}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl md:rounded-2xl"
        style={{
          background: `radial-gradient(circle at center, ${category.color}20 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white z-10`}
        dir="rtl"
      >
        <motion.div
          animate={{
            y: isHovered ? -5 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.h3
            className={`text-sm md:text-base font-bold`}
            animate={{
              color: isHovered ? category.color || "#8B5CF6" : "#ffffff",
            }}
            transition={{ duration: 0.3 }}
          >
            {category.title}
          </motion.h3>
        </motion.div>
      </div>

      {/* Hover Shine Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MixedGridShowcase;
