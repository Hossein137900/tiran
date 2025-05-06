import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ImageGrowProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  overlayColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  buttonColor?: string;
  buttonBgColor?: string;
  height?: string;
}

const ImageGrow: React.FC<ImageGrowProps> = ({
  imageSrc,
  title,
  description,
  buttonText,
  buttonLink,
  overlayColor = "rgba(0, 0, 0, 0.5)",
  titleColor = "white",
  descriptionColor = "rgba(255, 255, 255, 0.9)",
  buttonColor = "white",
  buttonBgColor = "rgba(0, 0, 0, 0.3)",
  height,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the section as the target for scroll animation with extended offset
  // This makes the animation happen over a longer scroll distance
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"], // Animation spans the entire viewport passage
  });

  // Transform values with more delayed progression
  // The key numbers here control when the animation happens during scroll
  const containerWidth = useTransform(
    scrollYProgress,
    [0.1, 0.4], // Starts later (0.1) and ends later (0.6)
    ["70%", "100%"]
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0.1, 0.7], // Even more extended for scale
    [1.2, 1]
  );

  const imageX = useTransform(scrollYProgress, [0.1, 0.65], ["-7%", "0%"]);

  // Content animation based on scroll - delayed further
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4], // Content appears later in the animation
    [0.1, 1]
  );

  const contentY = useTransform(scrollYProgress, [0.3, 0.7], [30, 0]);

  // Border radius animation - extended
  const borderRadius = useTransform(
    scrollYProgress,
    [0.1, 0.65],
    ["2px", "0px"]
  );

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden -mt-20" // Increased margin for more scroll space
      style={{ height }}
    >
      <motion.div
        ref={containerRef}
        className="relative h-full mx-auto overflow-hidden"
        style={{
          width: containerWidth,
          borderRadius,
        }}
        transition={{ duration: 0.8 }} // Slower base transition
      >
        {/* Image container with scale and position effect */}
        <motion.div
          className="w-full h-full relative overflow-hidden"
          style={{
            scale: imageScale,
            x: imageX,
          }}
          transition={{ duration: 1.2 }} // Even slower for image movement
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          {/* Overlay with content */}
          <div
            className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center"
            style={{ backgroundColor: overlayColor }}
          >
            <motion.div
              className="max-w-2xl"
              style={{
                opacity: contentOpacity,
                y: contentY,
              }}
              transition={{ duration: 1.5 }} // Slowest for content
            >
              <h2
                className="text-4xl md:text-5xl font-light mb-4"
                style={{ color: titleColor }}
              >
                {title}
              </h2>

              <p
                className="text-lg md:text-xl mb-8 "
                style={{ color: descriptionColor }}
              >
                {description}
              </p>

              <Link href={buttonLink}>
                <motion.button
                  className="px-6 py-3 rounded-md bg-opacity-5 font-medium text-lg"
                  style={{
                    color: buttonColor,
                    backgroundColor: buttonBgColor,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }} // Softer spring
                >
                  {buttonText}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative elements with extended animations */}
      <motion.div
        className="absolute top-[15%] left-[5%] w-8 h-8 rounded-full bg-white/20 backdrop-blur-md"
        style={{
          opacity: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
          scale: useTransform(scrollYProgress, [0.2, 0.5], [0, 1]),
        }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[8%] w-12 h-12 rounded-full bg-white/20 backdrop-blur-md"
        style={{
          opacity: useTransform(scrollYProgress, [0.3, 0.6], [0, 1]),
          scale: useTransform(scrollYProgress, [0.3, 0.6], [0, 1]),
        }}
      />
    </div>
  );
};

export default ImageGrow;
