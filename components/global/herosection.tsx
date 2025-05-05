"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  videoBackground?: string;
}

interface HeroSectionProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
  height?: string;
  overlayColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  showMuteControl?: boolean;
}

// Pre-generate random values to avoid hydration mismatches
const particlePositions = Array.from({ length: 20 }).map(() => ({
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  scale: (Math.random() * 0.5 + 0.5).toFixed(2),
}));

const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  autoPlayInterval,
  height,
  overlayColor = "rgba(0, 0, 0, 0.4)",
  titleColor = "white",
  descriptionColor = "rgba(255, 255, 255, 0.9)",
  // showMuteControl = false,
}) => {
  // All state hooks
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // All ref hooks
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // All motion value hooks - MUST be called unconditionally
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Set isClient to true once component mounts to enable client-only features
  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
  };

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide, autoPlayInterval]);

  // Enhance the dragX motion value with better constraints

  // Replace your existing variants with these improved ones
  // Replace your existing variants with these fade variants
  const variants = {
    enter: () => ({
      opacity: 0,
      scale: 1,
      zIndex: 0,
    }),
    center: {
      opacity: 1,
      scale: 1,
      zIndex: 1,
      transition: {
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 1, ease: "easeInOut" },
        zIndex: { delay: 0.3 },
      },
    },

    exit: () => ({
      opacity: 0,
      scale: 1,
      zIndex: 0,
      transition: {
        opacity: { duration: 0.8, ease: "easeInOut" },
        scale: { duration: 1, ease: "easeInOut" },
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        // Fixed easing function
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    }),
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.5 },
    },
  };

  const progressBarVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        ease: "linear",
      },
    },
  };

  return (
    <div className="relative w-full" style={{ height }} ref={containerRef}>
      {/* Background Images/Videos with Animation */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
          onAnimationStart={() => setIsTransitioning(true)}
          onAnimationComplete={() => setIsTransitioning(false)}
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            priority
            className="object-cover"
            // sizes="100vw"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80" />

          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                className="overflow-hidden mb-4"
                variants={textVariants}
                custom={0}
              >
                <motion.span
                  className="inline-block text-sm md:text-base uppercase tracking-widest font-semibold mb-2"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Slide {currentSlide + 1} of {slides.length}
                </motion.span>
              </motion.div>

              <motion.div
                className="overflow-hidden mb-6"
                variants={textVariants}
                custom={1}
              >
                <motion.h1
                  className="text-3xl md:text-5xl font-bold leading-tight"
                  style={{ color: titleColor }}
                >
                  {slides[currentSlide].title}
                </motion.h1>
              </motion.div>

              <motion.div
                className="overflow-hidden mb-8"
                variants={textVariants}
                custom={2}
              >
                <motion.p
                  className="text-lg md:text-xl text-rose-500 max-w-2xl mx-auto"
                  style={{ color: descriptionColor }}
                >
                  {slides[currentSlide].description}
                </motion.p>
              </motion.div>

              {slides[currentSlide].ctaText && (
                <motion.div variants={textVariants} custom={3}>
                  <a
                    href={slides[currentSlide].ctaLink || "#"}
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white bg-transparent rounded-full border-2 border-white hover:border-transparent"
                  >
                    <span className="absolute inset-0 w-full h-full backdrop-blur-2xl bg-gradient-to-br from-gray-500 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                    <span className="relative flex items-center">
                      {slides[currentSlide].ctaText}
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "loop",
                          duration: 1.5,
                          repeatDelay: 1,
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </motion.svg>
                    </span>
                  </a>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows with enhanced design */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-4 md:px-12 z-20">
        <motion.button
          onClick={() => {
            prevSlide();
            resetAutoPlay();
          }}
          className="group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white transition-all hover:bg-white/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous slide"
        >
          <ChevronLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </motion.button>

        {/* Center controls */}
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
                resetAutoPlay();
              }}
              className="relative h-2 rounded-full overflow-hidden transition-all"
              style={{
                width: currentSlide === index ? "3rem" : "0.75rem",
                backgroundColor:
                  currentSlide === index
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(255, 255, 255, 0.4)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            >
              {currentSlide === index && isAutoPlaying && (
                <motion.div
                  className="absolute left-0 top-0 h-full bg-white/80"
                  variants={progressBarVariants}
                  initial="initial"
                  animate="animate"
                  key={`progress-${currentSlide}`}
                />
              )}
            </button>
          ))}
        </div>

        <motion.button
          onClick={() => {
            nextSlide();
            resetAutoPlay();
          }}
          className="group flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white transition-all hover:bg-white/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next slide"
        >
          <ChevronRight
            size={24}
            className="group-hover:translate-x-1 transition-transform"
          />
        </motion.button>
      </div>

      {/* Controls panel */}

      {/* Enhanced swipe instruction - visible only on mobile */}
      <motion.div
        className="absolute bottom-24 left-0 right-0 flex justify-center items-center md:hidden z-20"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [10, 0, 0, -10],
        }}
        transition={{
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          repeat: 2,
          repeatDelay: 2,
        }}
      >
        <div className="flex items-center space-x-2 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full">
          <motion.div
            animate={{ x: [-5, 5, -5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 16L3 12M3 12L7 8M3 12H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="text-white text-sm">Swipe to navigate</span>
          <motion.div
            animate={{ x: [5, -5, 5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 8L21 12M21 12L17 16M21 12H3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Perspective tilt effect based on mouse position - client-side only */}
      {isClient && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            perspective: 1000,
          }}
        >
          <motion.div
            className="w-full h-full"
            style={{
              rotateX, // Use the motion value defined at the top
              rotateY, // Use the motion value defined at the top
            }}
            whileHover={{
              rotateX: [-1, 1, -1],
              rotateY: [-1, 1, -1],
              transition: {
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear",
              },
            }}
          />
        </motion.div>
      )}

      {/* Floating particles effect - using pre-generated positions to avoid hydration errors */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-20"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                scale: Number(particle.scale),
              }}
              animate={{
                y: [null, `${(particle.y + 30) % 100}%`],
                opacity: [0.2, 0.5, 0.2],
                scale: [null, Number(particle.scale) * 0.8],
              }}
              transition={{
                duration: 10 + (i % 10),
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
    </div>
  );
};

export default HeroSection;
