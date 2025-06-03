"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mediaItems } from "@/lib/homePageData";
import { ScrollMediaShowcaseProps } from "@/types/type";

const ScrollMediaShowcase = ({
  initialCenterImage,
  transitionComplete,
}: ScrollMediaShowcaseProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [hasCompletedCycle, setHasCompletedCycle] = useState(false);
  const [accumulatedScroll, setAccumulatedScroll] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialImage] = useState(initialCenterImage || "");

  // Total steps needed to show all items once
  const totalSteps = mediaItems.length;
  const scrollStepSize = 50; // Pixels per step

  useEffect(() => {
    if (initialImage) {
      const timer = setTimeout(() => {
        setIsInitializing(false);
        if (transitionComplete) transitionComplete();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [initialImage, transitionComplete]);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Lock/unlock scroll based on component state
  useEffect(() => {
    if (!isMounted) return;

    if (isScrollLocked) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Allow scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isScrollLocked, isMounted]);

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

  // Handle wheel events for controlled scrolling
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isMounted || !containerRef.current || !isActive) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Check if we're in the component area
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        if (!hasCompletedCycle) {
          e.preventDefault();

          const deltaY = e.deltaY;
          const newAccumulatedScroll = Math.max(0, accumulatedScroll + deltaY);
          setAccumulatedScroll(newAccumulatedScroll);

          // Calculate progress based on accumulated scroll
          const progress = Math.min(
            newAccumulatedScroll / (totalSteps * scrollStepSize),
            1
          );
          setScrollProgress(progress);

          // Calculate which media item should be shown
          const newIndex = Math.floor(progress * totalSteps);
          const clampedIndex = Math.min(newIndex, totalSteps - 1);

          if (clampedIndex !== currentIndex) {
            setCurrentIndex(clampedIndex);
          }

          // Check if we've completed the cycle
          if (progress >= 1 && !hasCompletedCycle) {
            setHasCompletedCycle(true);
            setIsScrollLocked(false);

            // Small delay before allowing normal scroll
            setTimeout(() => {
              setIsActive(false);
            }, 500);
          }
        }
      }
    },
    [
      isMounted,
      isActive,
      hasCompletedCycle,
      accumulatedScroll,
      currentIndex,
      totalSteps,
    ]
  );

  // Handle regular scroll events for activation
  const handleScroll = useCallback(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Activate when container enters viewport
    if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
      if (!isActive && !hasCompletedCycle) {
        setIsActive(true);
        setIsScrollLocked(true);
      }
    }

    // Deactivate when container leaves viewport (only if cycle is complete)
    if (hasCompletedCycle && (rect.bottom < 0 || rect.top > windowHeight)) {
      setIsActive(false);
      setIsScrollLocked(false);
    }
  }, [isMounted, isActive, hasCompletedCycle]);

  // Add scroll and wheel listeners
  useEffect(() => {
    if (!isMounted) return;

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleScroll, handleWheel, isMounted]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      ref={containerRef}
      className="mt-12 relative min-h-screen"
    >
      {/* Scroll indicator */}
      {isActive && !hasCompletedCycle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            Scroll to explore ({currentIndex + 1}/{totalSteps})
          </div>
          <div className="w-full bg-white/20 rounded-full h-1 mt-2">
            <motion.div
              className="bg-white rounded-full h-1"
              initial={{ width: "0%" }}
              animate={{ width: `${scrollProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Sticky container for media showcase */}
      <div className="sticky top-21 md:top-20 h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
          transition={{
            duration: 2.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="w-full max-w-7xl mx-auto px-8 relative"
        >
          <div className="relative h-[80vh] flex items-center justify-center">
            {/* Mobile Layout */}
            <div className="block md:hidden w-full px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{
                  duration: 1.8,
                  delay: 0.6,
                  ease: "easeOut",
                }}
                className="relative h-[60vh] flex items-center justify-center w-full"
              >
                {/* Left Image - Mobile Version */}
                <motion.div
                  initial={{ opacity: 0, x: -50, rotate: -25 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -50,
                    rotate: isVisible ? -25 : -35,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <div className="w-24 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-xl border border-white/20 relative">
                    <AnimatePresence mode="wait" custom={1}>
                      <motion.div
                        key={`mobile-left-${currentIndex}`}
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: 0.1,
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
                </motion.div>
                {/* Center Video - Mobile Version */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.8,
                  }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="relative z-20"
                >
                  <div className="w-45 h-64 sm:w-56 sm:h-72 overflow-hidden shadow-2xl border-2 border-white/30 relative">
                    <AnimatePresence mode="wait" custom={1}>
                      <motion.div
                        key={`center-mobile-${currentIndex}`}
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: 0.1,
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
                        <div className="absolute bottom-3 left-3 right-3 text-center">
                          <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="text-sm sm:text-base font-bold text-white mb-1"
                          >
                            {centerVideo.title}
                          </motion.h2>
                          <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="text-gray-200 text-xs sm:text-sm line-clamp-2"
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
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-lg -z-10"
                    />
                  </div>
                </motion.div>

                {/* Right Image - Mobile Version */}
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 25 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : 50,
                    rotate: isVisible ? 25 : 35,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.8,
                    ease: "easeOut",
                  }}
                  className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10"
                >
                  <div className="w-24 h-36 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-xl border border-white/20 relative">
                    <AnimatePresence mode="wait" custom={1}>
                      <motion.div
                        key={`mobile-right-${currentIndex}`}
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: 0.1,
                          ease: [0.25, 0.46, 0.45, 0.94],
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
                </motion.div>

                {/* Mobile Background Effects */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: isVisible ? [0.03, 0.08, 0.03] : 0,
                    scale: isVisible ? [1, 1.1, 1] : 0.5,
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: isVisible ? [0.03, 0.08, 0.03] : 0,
                    scale: isVisible ? [1.1, 1, 1.1] : 0.5,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3.2,
                  }}
                  className="absolute bottom-1/4 right-1/4 w-20 h-20 sm:w-28 sm:h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"
                />

                {/* Progress Indicators - Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 20,
                  }}
                  transition={{
                    duration: 1,
                    delay: 1.5,
                    ease: "easeOut",
                  }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
                >
                  {mediaItems
                    .filter((item) => item.type === "video")
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index ===
                          Math.floor(
                            (currentIndex / mediaItems.length) *
                              mediaItems.filter((item) => item.type === "video")
                                .length
                          )
                            ? "bg-white scale-125"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                </motion.div>

                {/* Additional Floating Elements for Mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? [0, -10, 0] : 0,
                    rotate: isVisible ? [0, 5, 0] : 0,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: 1.8 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute top-16 left-8 w-3 h-3 bg-white/20 rounded-full blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? [0, 10, 0] : 0,
                    rotate: isVisible ? [0, -5, 0] : 0,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: 2 },
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                    rotate: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    },
                  }}
                  className="absolute top-20 right-12 w-2 h-2 bg-white/15 rounded-full blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? [0, -8, 0] : 0,
                    x: isVisible ? [0, 5, 0] : 0,
                  }}
                  transition={{
                    opacity: { duration: 1, delay: 2.2 },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    },
                    x: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    },
                  }}
                  className="absolute bottom-16 left-12 w-2.5 h-2.5 bg-white/10 rounded-full blur-sm"
                />
              </motion.div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center w-full">
              {/* Left Image - Fixed Position with Slide Animation */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -30 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  x: isVisible ? 0 : -100,
                  rotate: isVisible ? -30 : -40,
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute left-35 top-1/2 transform -translate-y-1/2 z-10"
              >
                <div className="w-72 h-96 overflow-hidden shadow-2xl border border-white/20 relative">
                  <AnimatePresence mode="wait" custom={1}>
                    <motion.div
                      key={`left-${currentIndex}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.1,
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
              </motion.div>

              {/* Center Video - Fixed Position with Slide Animation */}
              <div className="relative z-20">
                {isInitializing && initialImage && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <img
                      src={initialImage}
                      alt="Transition center"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  </motion.div>
                )}
                <div className="w-96 h-[520px] overflow-hidden shadow-2xl border-2 border-white/30 relative">
                  <AnimatePresence mode="wait" custom={1}>
                    <motion.div
                      key={`center-${currentIndex}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.1,
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
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isVisible ? [0.5, 0.8, 0.5] : 0,
                      scale: isVisible ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      opacity: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                      },
                    }}
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10"
                  />
                </div>
              </div>

              {/* Right Image - Fixed Position with Slide Animation */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 30 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  x: isVisible ? 0 : 100,
                  rotate: isVisible ? 30 : 40,
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="absolute right-35 top-1/2 transform -translate-y-1/2 z-10"
              >
                <div className="w-72 h-96 overflow-hidden shadow-2xl border border-white/20 relative">
                  <AnimatePresence mode="wait" custom={1}>
                    <motion.div
                      key={`right-${currentIndex}`}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
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
              </motion.div>

              {/* Desktop Background Effects */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: isVisible ? [0.05, 0.15, 0.05] : 0,
                  scale: isVisible ? [1, 1.2, 1] : 0.5,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: isVisible ? [0.05, 0.15, 0.05] : 0,
                  scale: isVisible ? [1.2, 1, 1.2] : 0.5,
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4,
                }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
              />

              {/* Progress Indicators - Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 30,
                }}
                transition={{
                  duration: 1.2,
                  delay: 2,
                  ease: "easeOut",
                }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3"
              >
                {mediaItems
                  .filter((item) => item.type === "video")
                  .map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        index ===
                        Math.floor(
                          (currentIndex / mediaItems.length) *
                            mediaItems.filter((item) => item.type === "video")
                              .length
                        )
                          ? "bg-white scale-150 shadow-lg"
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
              </motion.div>

              {/* Additional Floating Elements for Desktop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? [0, -20, 0] : 0,
                  rotate: isVisible ? [0, 10, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 1.5, delay: 2.5 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute top-20 left-20 w-6 h-6 bg-white/15 rounded-full blur-sm"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? [0, 15, 0] : 0,
                  rotate: isVisible ? [0, -8, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 1.5, delay: 3 },
                  y: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                  rotate: {
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  },
                }}
                className="absolute top-32 right-24 w-4 h-4 bg-white/12 rounded-full blur-sm"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? [0, -12, 0] : 0,
                  x: isVisible ? [0, 8, 0] : 0,
                }}
                transition={{
                  opacity: { duration: 1.5, delay: 3.5 },
                  y: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                  },
                  x: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                  },
                }}
                className="absolute bottom-24 left-32 w-5 h-5 bg-white/10 rounded-full blur-sm"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spacer for scroll height - only needed if cycle is not complete */}
      {!hasCompletedCycle && <div className="h-[200vh]" />}
    </motion.div>
  );
};

export default ScrollMediaShowcase;
