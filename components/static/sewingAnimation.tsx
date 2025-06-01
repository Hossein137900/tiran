"use client";
import { useRef, Suspense, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, useProgress, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "react-responsive";


interface SewingMachineProps {
  className?: string;
  style?: React.CSSProperties;

}

// Loading indicator component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-gray-800 text-base md:text-lg font-medium">
          {Math.round(progress)}% loaded
        </span>
      </div>
    </Html>
  );
}

// GLB Model Sewing Machine - enhanced with interactions
function SewingMachine(props: SewingMachineProps) {

  // Load the GLB file
  const { scene } = useGLTF("/assets/old_sewing_machine.glb");
  const group = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();
  const {  camera } = useThree();

  // Responsive state
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  // const isDesktop = useMediaQuery({ minWidth: 1024 });

  // State for interactions
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [rotationVelocity, setRotationVelocity] = useState({ x: 0, y: 0 });
  const [initialCameraPosition] = useState(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      return camera.position.clone();
    }
    return new THREE.Vector3(0, 0, 5);
  });

  // Determine scale based on device size
  const getModelScale = () => {
    if (isMobile) return [1.2, 1.2, 1.2];
    if (isTablet) return [1.5, 1.5, 1.5];
    return [1.7, 1.7, 1.7]; // desktop
  };

  // Set initial rotation to show front face
  useEffect(() => {
    if (group.current) {
      group.current.rotation.set(0, Math.PI, 0);
    }
  }, []);

  // Handle double click/tap for zoom
  useEffect(() => {
    const handleDoubleClick = () => {
      setIsZoomed((prev) => !prev);

      if (camera instanceof THREE.PerspectiveCamera) {
        if (!isZoomed) {
          // Zoom in - adjust for device size
          const zoomLevel = isMobile ? 3.5 : isTablet ? 3 : 2.5;
          camera.position.set(0, 0, zoomLevel);
        } else {
          // Zoom out
          camera.position.copy(initialCameraPosition);
        }
      }
    };

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, [isZoomed, camera, initialCameraPosition, isMobile, isTablet]);

  // Touch and mouse event handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setLastTouch({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastTouch.x;
        const deltaY = e.touches[0].clientY - lastTouch.y;

        // Update rotation velocity based on touch movement
        setRotationVelocity({
          x: deltaY * 0.005,
          y: -deltaX * 0.005,
        });

        setLastTouch({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      // Apply damping to rotation velocity
      setRotationVelocity((prev) => ({
        x: prev.x * 0.9,
        y: prev.y * 0.9,
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setLastTouch({ x: e.clientX, y: e.clientY });
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastTouch.x;
        const deltaY = e.clientY - lastTouch.y;

        setRotationVelocity({
          x: deltaY * 0.002,
          y: -deltaX * 0.002,
        });

        setLastTouch({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Add event listeners
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Remove event listeners
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, lastTouch]);

  // Frame update for animations and interactions
  useFrame((state) => {
    if (group.current) {
      // Get scroll progress for base rotation
      const scrollValue = scrollYProgress.get();

      // Apply rotation velocity with damping when not being dragged
      if (!isDragging) {
        setRotationVelocity((prev) => ({
          x: prev.x * 0.95,
          y: prev.y * 0.95,
        }));
      }

      // Apply rotation from user interaction
      group.current.rotation.x += rotationVelocity.x;
      group.current.rotation.y += rotationVelocity.y;

      // Add gentle floating motion - scale based on device size
      const floatAmplitude = isMobile ? 0.05 : 0.1;
      group.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.5) * floatAmplitude;

      // If not being actively dragged, add subtle auto-rotation
      if (
        !isDragging &&
        Math.abs(rotationVelocity.x) < 0.001 &&
        Math.abs(rotationVelocity.y) < 0.001
      ) {
        const autoRotationSpeed = 0.2 + scrollValue * 0.3;
        group.current.rotation.y +=
          state.clock.getDelta() * autoRotationSpeed * 0.1;
      }

      // Limit rotation on X axis to prevent flipping
      group.current.rotation.x = THREE.MathUtils.clamp(
        group.current.rotation.x,
        -Math.PI / 3,
        Math.PI / 3
      );
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive
        object={scene.clone()}
        scale={getModelScale()}
        position={[0, isMobile ? -0.3 : 0, 0]}
      />
    </group>
  );
}

// Preload the GLB model
useGLTF.preload("/assets/old_sewing_machine.glb");

// Main component
export default function SewingAnimation() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="relative w-full md:mt-96 xl:mt-[450px] overflow-hidden h-[50vh] md:h-[70vh] lg:h-screen">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0, isMobile ? 6 : 5],
          fov: isMobile ? 60 : 50,
          near: 0.1,
          far: 1000,
        }}
        className="touch-none"
      >
        {/* Enhanced lighting for better visibility */}
        <ambientLight intensity={0.7} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[-10, 5, -10]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        <directionalLight position={[0, 5, 5]} intensity={0.5} castShadow />

        <Suspense fallback={<Loader />}>
          <SewingMachine />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}

    </div>
  );
}