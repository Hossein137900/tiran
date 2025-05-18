import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Create a custom hook to generate a single stitch's motion values
function useStitchMotion(
  scrollYProgress: MotionValue<number>,
  appearAt: number
) {
  const pathLength = useTransform(
    scrollYProgress,
    [appearAt, appearAt + 0.02],
    [0, 1]
  );

  const opacity = useTransform(
    scrollYProgress,
    [appearAt - 0.01, appearAt],
    [0, 1]
  );

  return { pathLength, opacity };
}

// Create a component for a single stitch
const Stitch = ({
  stitch,
  scrollYProgress,
}: {
  stitch: { x1: number; y1: number; x2: number; y2: number; appearAt: number };
  scrollYProgress: MotionValue<number>;
}) => {
  const { pathLength, opacity } = useStitchMotion(
    scrollYProgress,
    stitch.appearAt
  );

  return (
    <motion.line
      x1={stitch.x1}
      y1={stitch.y1}
      x2={stitch.x2}
      y2={stitch.y2}
      stroke="#333"
      strokeWidth="1.5"
      initial={{ pathLength: 0, opacity: 0 }}
      style={{
        pathLength,
        opacity,
      }}
    />
  );
};

const StitchAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress for animations
  const needleY = useTransform(scrollYProgress, [0, 1], [0, "100vh"]);

  // Create a more natural needle movement with a bobbing effect
  const needleX = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    [0, 5, -2, 6, -3, 7, -2, 5, -3, 6, 0]
  );

  // Needle rotation for realistic sewing motion
  const needleRotation = useTransform(
    scrollYProgress,
    [
      0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
      0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
    ],
    [0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0, 15, 0]
  );

  // Generate stitch points that will appear progressively
  const stitchPoints = Array.from({ length: 100 }, (_, i) => ({
    x1: 40,
    y1: 100 + i * 100,
    x2: 60,
    y2: 100 + i * 100,
    appearAt: i / 100, // When this stitch should appear during scroll
  }));

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex justify-start items-start fixed top-0 left-0 pointer-events-none"
    >
      <svg
        width="100"
        height="100vh"
        viewBox="0 0 100 10000"
        preserveAspectRatio="xMidYMin slice"
        className="bg-gray-100 shadow-lg"
      >
        {/* Fabric background with texture */}
        <rect width="100" height="10000" fill="#f8f5f2" />
        <pattern
          id="fabricTexture"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
        >
          <rect width="20" height="20" fill="#f8f5f2" />
          <path
            d="M 0,0 L 20,20 M 20,0 L 0,20"
            stroke="#f0ebe5"
            strokeWidth="1"
          />
        </pattern>
        <rect
          width="100"
          height="10000"
          fill="url(#fabricTexture)"
          opacity="0.5"
        />

        {/* Stitches that appear progressively */}
        {stitchPoints.map((stitch, i) => (
          <Stitch key={i} stitch={stitch} scrollYProgress={scrollYProgress} />
        ))}

        {/* Thread that follows the needle with a slight delay */}
        <motion.path
          d={`M50,0 
              ${stitchPoints
                .map((p, i) => {
                  // Create a wavy thread path that follows the stitches
                  const offset = i % 2 === 0 ? 5 : -5;
                  return `L${50 + offset},${p.y1}`;
                })
                .join(" ")}`}
          fill="none"
          stroke="#d63031"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          style={{
            pathLength: scrollYProgress,
          }}
        />

        {/* Needle with realistic shape */}
        <motion.g
          style={{
            x: needleX,
            y: needleY,
            rotate: needleRotation,
            transformOrigin: "50% 0%",
          }}
        >
          {/* Needle body */}
          <rect x="48" y="-25" width="4" height="30" fill="#d1d1d1" rx="2" />

          {/* Needle point */}
          <path d="M48,-25 L50,-30 L52,-25 Z" fill="#a1a1a1" />

          {/* Needle eye */}
          <ellipse cx="50" cy="-10" rx="2" ry="3" fill="#888" />
          <ellipse cx="50" cy="-10" rx="1" ry="2" fill="#555" />

          {/* Thread through needle */}
          <path
            d="M50,-10 C55,-10 55,-5 50,-5 C45,-5 45,-10 50,-10"
            fill="none"
            stroke="#d63031"
            strokeWidth="1"
          />
        </motion.g>

        {/* Finger thimble that appears occasionally */}
        <motion.g
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0.3, 0.31, 0.4, 0.41, 0.7, 0.71, 0.8, 0.81],
              [0, 1, 1, 0, 0, 1, 1, 0]
            ),
            x: useTransform(
              scrollYProgress,
              [0.3, 0.4, 0.7, 0.8],
              [70, 65, 70, 65]
            ),
            y: needleY,
          }}
        >
          <ellipse cx="0" cy="0" rx="15" ry="20" fill="#b0b0b0" />
          <ellipse cx="0" cy="-5" rx="12" ry="10" fill="#909090" />
          <pattern
            id="thimblePattern"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <circle cx="2" cy="2" r="0.5" fill="#808080" />
          </pattern>
          <ellipse cx="0" cy="-5" rx="10" ry="8" fill="url(#thimblePattern)" />
        </motion.g>
      </svg>
    </div>
  );
};

export default StitchAnimation;
