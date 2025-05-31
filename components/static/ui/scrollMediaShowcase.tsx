"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
  title: string;
  description: string;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    alt: "Creative Design 1",
    title: "Digital Innovation",
    description: "Pushing boundaries in digital creativity",
  },
  {
    id: 2,
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Motion Graphics",
    description: "Bringing ideas to life through motion",
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    alt: "Creative Design 2",
    title: "Visual Storytelling",
    description: "Crafting narratives through visual design",
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    alt: "Creative Design 3",
    title: "Brand Identity",
    description: "Creating memorable brand experiences",
  },
  {
    id: 5,
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Interactive Media",
    description: "Engaging audiences through interaction",
  },
  {
    id: 6,
    type: "image",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    alt: "Creative Design 4",
    title: "Future Vision",
    description: "Envisioning tomorrow's digital landscape",
  },
  {
    id: 7,
    type: "image",
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    alt: "Creative Design 5",
    title: "Artistic Expression",
    description: "Where art meets technology",
  },
  {
    id: 8,
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Dynamic Content",
    description: "Creating engaging experiences",
  },
  {
    id: 9,
    type: "image",
    src: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=600&fit=crop",
    alt: "Creative Design 6",
    title: "Innovation Hub",
    description: "The future of creative design",
  },
];

const ScrollMediaShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get only videos for center position
  const getCenterVideo = () => {
    const videos = mediaItems.filter((item) => item.type === "video");
    const videoIndex = Math.floor(
      (currentIndex / mediaItems.length) * videos.length
    );
    return videos[videoIndex % videos.length];
  };

  // Get only images for left and right positions
  const getSideImages = () => {
    const images = mediaItems.filter((item) => item.type === "image");
    const leftIndex = Math.floor(
      (currentIndex / mediaItems.length) * images.length
    );
    const rightIndex = (leftIndex + 1) % images.length;
    return {
      left: images[leftIndex % images.length],
      right: images[rightIndex],
    };
  };

  const centerVideo = getCenterVideo();
  const sideImages = getSideImages();

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const containerHeight = container.offsetHeight;

    // Check if container is in viewport
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      // Calculate scroll progress within the container
      const scrolled = Math.max(0, windowHeight - rect.top);
      const maxScroll = windowHeight + containerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);

      setScrollProgress(progress);

      // Activate when container enters viewport
      if (!isActive && rect.top <= windowHeight * 0.8) {
        setIsActive(true);
      }

      // Calculate which media set should be shown based on scroll progress
      const totalSteps = mediaItems.length;
      const newIndex = Math.floor(progress * totalSteps);
      const clampedIndex = Math.min(newIndex, totalSteps - 1);

      if (clampedIndex !== currentIndex) {
        setCurrentIndex(clampedIndex);
      }

      // Deactivate when container leaves viewport
      if (isActive && rect.bottom < 0) {
        setIsActive(false);
      }
    }
  }, [isMounted, isActive, currentIndex]);

  // Add scroll listener
  useEffect(() => {
    if (!isMounted) return;

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [handleScroll, isMounted]);

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 1,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 100 : -100,
      opacity: 1,
      scale: 1,
    }),
  };

  // Don't render on server
  if (!isMounted) {
    return (
      <div className="min-h-[300vh] bg-black flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-8 relative">
          <div className="relative h-[80vh] flex items-center justify-center">
            <div className="w-96 h-[520px] rounded-3xl bg-gray-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-[300vh] relative">
      {/* Sticky container for media showcase */}
      <div className="sticky top-28 h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="w-full max-w-7xl mx-auto px-8 relative">
          <div className="relative h-[80vh] flex items-center justify-center">
            {/* Left Image - Fixed Position with Slide Animation */}
            <div className="absolute left-35 top-1/2 transform -translate-y-1/2 z-10 -rotate-[30deg]">
              <div className="w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={`left-${currentIndex}`}
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={sideImages.left.src}
                      alt={sideImages.left.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Center Video - Fixed Position with Slide Animation */}
            <div className="relative z-20">
              <div className="w-96 h-[520px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 relative">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={`center-${currentIndex}`}
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.1,
                    }}
                    className="absolute inset-0"
                  >
                    <video
                      src={centerVideo.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-8 left-6 right-6 text-center">
                      <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="text-3xl font-bold text-white mb-3"
                      >
                        {centerVideo.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="text-gray-200 text-lg"
                      >
                        {centerVideo.description}
                      </motion.p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10"
                />
              </div>
            </div>

            {/* Right Image - Fixed Position with Slide Animation */}
            <div className="absolute right-35 top-1/2 transform -translate-y-1/2 z-10 rotate-[30deg]">
              <div className="w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative">
                <AnimatePresence mode="wait" custom={1}>
                  <motion.div
                    key={`right-${currentIndex}`}
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: 0.2,
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={sideImages.right.src}
                      alt={sideImages.right.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* Progress Dots */}

          {/* Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (window?.innerWidth || 1920),
                  y: Math.random() * (window?.innerHeight || 1080),
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * (window?.innerWidth || 1920),
                  y: Math.random() * (window?.innerHeight || 1080),
                  opacity: [0, Math.random() * 0.3 + 0.1, 0],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
              />
            ))}
          </div>
          {/* Ambient Glow Effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          />
        </div>
      </div>

      {/* Spacer for scroll height */}
      <div className="h-screen" />
    </div>
  );
};

export default ScrollMediaShowcase;
