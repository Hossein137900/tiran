"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  useScroll,
} from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  PresentationControls,
  Environment,
  Float,
  Text,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// Fabric component with realistic texture and stitching animation
function Fabric() {
  const fabricRef = useRef<THREE.Mesh>(null);
  const fabricTexture = useTexture("/assets/images/imagegrow.avif");
  const stitchesRef = useRef<THREE.InstancedMesh>(null);
  const [stitches, setStitches] = useState<
    { x: number; y: number; z: number }[]
  >([]);
  const maxStitches = 100;
  const stitchProgress = useRef(0);

  // Create initial stitch positions
  useEffect(() => {
    const newStitches = [];
    for (let i = 0; i < maxStitches; i++) {
      newStitches.push({
        x: (Math.random() - 0.5) * 0.8,
        y: 0.01,
        z: -0.3 + (i / maxStitches) * 0.6,
      });
    }
    setStitches(newStitches);
  }, []);

  useFrame((state) => {
    if (fabricRef.current) {
      // Gentle wave effect on fabric
      fabricRef.current.position.y =
        -0.3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.01;
    }

    if (stitchesRef.current) {
      // Animate stitches appearing one by one
      stitchProgress.current += 0.2;
      const visibleStitches = Math.min(
        Math.floor(stitchProgress.current),
        maxStitches
      );

      const dummy = new THREE.Object3D();
      for (let i = 0; i < maxStitches; i++) {
        if (i < visibleStitches) {
          const { x, y, z } = stitches[i];
          dummy.position.set(x, y, z);
          dummy.updateMatrix();
          stitchesRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      stitchesRef.current.instanceMatrix.needsUpdate = true;

      // Reset animation when all stitches are visible
      if (
        visibleStitches === maxStitches &&
        state.clock.getElapsedTime() % 10 < 0.1
      ) {
        stitchProgress.current = 0;
      }
    }
  });

  return (
    <>
      {/* Fabric */}
      <mesh
        ref={fabricRef}
        position={[0, -0.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[1.2, 0.8, 20, 20]} />
        <meshStandardMaterial
          map={fabricTexture}
          color="#7e5a9b"
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.1}
          bumpMap={fabricTexture}
          bumpScale={0.05}
        />
      </mesh>

      {/* Stitches */}
      <instancedMesh
        ref={stitchesRef}
        args={[undefined, undefined, maxStitches]}
        castShadow
      >
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </instancedMesh>
    </>
  );
}

// Enhanced needle component with thread physics
function NeedleAnimation() {
  const needleRef = useRef<THREE.Mesh>(null);
  const threadRef = useRef<THREE.Line>(null);
  const threadPoints = useRef<THREE.Vector3[]>([]);
  const threadGeometry = useRef<THREE.BufferGeometry>(
    new THREE.BufferGeometry()
  );

  // Initialize thread points
  useEffect(() => {
    threadPoints.current = [];
    for (let i = 0; i < 10; i++) {
      threadPoints.current.push(new THREE.Vector3(0, 0.8 - i * 0.08, 0));
    }
    threadGeometry.current.setFromPoints(threadPoints.current);
  }, []);

  useFrame((state) => {
    if (needleRef.current) {
      // Create up and down motion for the needle
      const needleY =
        -0.1 - Math.abs(Math.sin(state.clock.getElapsedTime() * 5)) * 0.2;
      needleRef.current.position.y = needleY;

      // Update thread physics
      if (threadPoints.current.length > 0) {
        // First point follows the needle
        threadPoints.current[threadPoints.current.length - 1].y = needleY;

        // Apply simple physics to thread points
        for (let i = threadPoints.current.length - 2; i >= 0; i--) {
          const currentPoint = threadPoints.current[i];
          const nextPoint = threadPoints.current[i + 1];

          // Move current point toward next point with lag
          currentPoint.y += (nextPoint.y - currentPoint.y) * 0.3;
          currentPoint.x += (nextPoint.x - currentPoint.x) * 0.3;

          // Add some oscillation
          currentPoint.x +=
            Math.sin(state.clock.getElapsedTime() * 2 + i * 0.5) * 0.002;
        }

        // Update geometry
        threadGeometry.current.setFromPoints(threadPoints.current);
        if (threadRef.current) {
          threadRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }
    }
  });

  return (
    <>
      {/* Needle */}
      <mesh ref={needleRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Thread */}
      <line ref={threadRef} geometry={threadGeometry.current}>
        <lineBasicMaterial attach="material" color="#f00" linewidth={2} />
      </line>

      {/* Needle tip */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <coneGeometry args={[0.02, 0.05, 8]} />
        <meshStandardMaterial color="#ddd" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
}

// Improved sewing machine with more details
function SewingMachine(props: any) {
  const group = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();
  const { viewport } = useThree();

  // Use scroll position to control rotation
  useFrame((state) => {
    if (group.current) {
      // Base rotation with scroll influence
      const scrollInfluence = scrollYProgress.get() * Math.PI * 2;
      group.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 + scrollInfluence;

      // Tilt based on mouse position
      const mouseX = (state.mouse.x * viewport.width) / 2;
      const mouseY = (state.mouse.y * viewport.height) / 2;
      group.current.rotation.x = mouseY * 0.01;
      group.current.rotation.z = -mouseX * 0.01;
    }

    if (wheelRef.current) {
      // Rotate the wheel continuously
      wheelRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Machine base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Machine body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.8, 0.8]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Machine arm */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Hand wheel */}
      <mesh ref={wheelRef} position={[0.8, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wheel spokes */}
      <mesh position={[0.8, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.35, 0.03, 0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.8, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.35, 0.03, 0.03]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[-0.6, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="gold" metalness={1} roughness={0.3} />
      </mesh>

      {/* Brand name */}
      <Text
        position={[-0.5, 0.5, 0.41]}
        rotation={[0, 0, 0]}
        fontSize={0.1}
        color="gold"
        anchorX="center"
        anchorY="middle"
      >
        TIRAN
      </Text>

      {/* Needle mechanism */}
      <NeedleAnimation />

      {/* Fabric */}
      <Fabric />
    </group>
  );
}

// Particles effect with scroll interaction
// Particles effect with fixed values to avoid hydration errors
const ParticlesEffect = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Only create particles on the client side after component mounts
    const particles: HTMLDivElement[] = [];
    const container = particlesRef.current;

    if (!container) return;

    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full bg-purple-300 opacity-70";
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = particle.style.width;

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Animation properties
      particle.style.animation = `float ${
        Math.random() * 10 + 5
      }s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      // Set custom property for X translation
      particle.style.setProperty("--x-offset", `${Math.random() * 100 - 50}px`);

      container.appendChild(particle);
      particles.push(particle);
    }

    // Update particles based on scroll
    const unsubscribe = scrollYProgress.onChange((latest) => {
      particles.forEach((p) => {
        // Adjust particle speed based on scroll
        const speed = 5 + latest * 10;
        p.style.animation = `float ${
          Math.random() * 10 + speed
        }s linear infinite`;

        // Change direction based on scroll
        const direction = latest > 0.5 ? -1 : 1;
        p.style.setProperty("--direction", String(direction));
      });
    });

    return () => {
      particles.forEach((p) => p.remove());
      unsubscribe();
    };
  }, [scrollYProgress]); // Only run this effect on the client after mount

  return (
    <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(calc(-100px * var(--direction, 1)))
              translateX(var(--x-offset, 0px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Animated stitching pattern overlay
const StitchingOverlay = () => {
  const { scrollYProgress } = useScroll();
  const pathControls = useAnimation();
  const pathLength = useMotionValue(0);
  const pathOpacity = useTransform(pathLength, [0, 0.5, 1], [0, 1, 1]);

  // Stitch patterns that respond to scroll
  const stitchPatterns = [
    "M20,50 Q30,30 40,50 Q50,70 60,50 Q70,30 80,50",
    "M20,40 L30,60 L40,40 L50,60 L60,40 L70,60 L80,40",
    "M20,50 C30,30 40,70 50,50 C60,30 70,70 80,50",
    "M20,50 Q35,20 50,50 Q65,80 80,50",
  ];

  const [currentPattern, setCurrentPattern] = useState(0);

  useEffect(() => {
    // Change pattern based on scroll position
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const patternIndex = Math.min(
        Math.floor(latest * stitchPatterns.length),
        stitchPatterns.length - 1
      );

      if (patternIndex !== currentPattern) {
        setCurrentPattern(patternIndex);

        // Animate the new pattern
        pathControls
          .start({
            pathLength: 0,
            transition: { duration: 0.1 },
          })
          .then(() => {
            pathControls.start({
              pathLength: 1,
              transition: { duration: 1.5, ease: "easeInOut" },
            });
          });
      }
    });

    // Initial animation
    pathControls.start({
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" },
    });

    return () => unsubscribe();
  }, [scrollYProgress, currentPattern, pathControls, stitchPatterns.length]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="max-w-md"
      >
        <motion.path
          d={stitchPatterns[currentPattern]}
          stroke="#ff3e00"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={pathControls}
          style={{ pathLength, opacity: pathOpacity }}
        />
      </svg>
    </div>
  );
};

// Scroll-triggered text animations
const ScrollText = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.9], [100, 0]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5, 0.6], [0, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.8, 0.9], [0, 1, 1]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <motion.div
        className="text-4xl md:text-6xl font-bold text-center text-purple-900 mb-4"
        style={{ y: y1, opacity: opacity1 }}
      >
        <span className="block">Crafting Fashion</span>
      </motion.div>

      <motion.div
        className="text-2xl md:text-3xl font-medium text-center text-purple-700 mb-4"
        style={{ y: y2, opacity: opacity2 }}
      >
        <span className="block">Stitch by Stitch</span>
      </motion.div>

      <motion.div
        className="text-lg md:text-xl text-center text-purple-600 max-w-md px-4"
        style={{ y: y3, opacity: opacity3 }}
      >
        <span className="block">
          Discover our premium collection of handcrafted designs
        </span>
      </motion.div>
    </div>
  );
};

// Interactive elements
const InteractiveElements = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-6 z-30">
      <motion.button
        className="px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg"
        whileHover={{ scale: 1.05, backgroundColor: "#7e22ce" }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHoveredButton("shop")}
        onMouseLeave={() => setHoveredButton(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Shop Collection
      </motion.button>

      <motion.button
        className="px-6 py-3 bg-white text-purple-600 rounded-full shadow-lg border border-purple-200"
        whileHover={{ scale: 1.05, backgroundColor: "#f3e8ff" }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHoveredButton("learn")}
        onMouseLeave={() => setHoveredButton(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Learn More
      </motion.button>

      {hoveredButton === "shop" && (
        <motion.div
          className="absolute -top-16 bg-white px-4 py-2 rounded-lg shadow-md text-purple-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Explore our latest designs
        </motion.div>
      )}

      {hoveredButton === "learn" && (
        <motion.div
          className="absolute -top-16 bg-white px-4 py-2 rounded-lg shadow-md text-purple-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Discover our crafting process
        </motion.div>
      )}
    </div>
  );
};

// Main component with scroll interactions
export default function SewingAnimation() {
  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#ffffff", "#fff", "#fff"]
  );

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float rotationIntensity={0.4} floatIntensity={0.2}>
            <SewingMachine position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]} />
          </Float>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>

      <StitchingOverlay />
      <ParticlesEffect />
      <ScrollText />
      <InteractiveElements />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-purple-600"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-sm mb-1">Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5L12 19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
