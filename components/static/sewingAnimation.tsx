"use client";
import { useRef, Suspense, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html, useProgress, Environment } from "@react-three/drei";
import * as THREE from "three";

// Loading indicator component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-24 h-24 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-purple-800 text-lg font-medium">
          {progress.toFixed(0)}% loaded
        </span>
      </div>
    </Html>
  );
}

// GLB Model Sewing Machine - enhanced with interactions
function SewingMachine(props: any) {
  // Load the GLB file
  const { scene } = useGLTF("/assets/old_sewing_machine.glb");
  const group = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();
  const { viewport, camera } = useThree();
  
  // State for zoom functionality
  const [isZoomed, setIsZoomed] = useState(false);
  const [initialCameraPosition] = useState(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      return camera.position.clone();
    }
    return new THREE.Vector3(0, 0, 5);
  });
  
  // Set initial rotation to show front face
  useEffect(() => {
    if (group.current) {
      // Adjust these values to show the front face of your model
      group.current.rotation.set(0, Math.PI, 0); // This rotates to show the front
    }
  }, []);

  // Handle double click for zoom
  useEffect(() => {
    const handleDoubleClick = () => {
      setIsZoomed(prev => !prev);
      
      if (camera instanceof THREE.PerspectiveCamera) {
        if (!isZoomed) {
          // Zoom in
          camera.position.set(0, 0, 2.5);
        } else {
          // Zoom out
          camera.position.copy(initialCameraPosition);
        }
      }
    };
    
    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [isZoomed, camera, initialCameraPosition]);

  // Use scroll position and mouse position to control rotation
  useFrame((state) => {
    if (group.current) {
      // Get scroll progress and calculate rotation speed
      const scrollValue = scrollYProgress.get();
      const rotationSpeed = 0.5 + scrollValue * 2; // Increase speed based on scroll
      
      // Base rotation from scroll - only affects Y axis
      const scrollRotation = state.clock.getElapsedTime() * rotationSpeed * 0.1;
      group.current.rotation.y = Math.PI + scrollRotation; // Start from front face (PI) and add rotation
      
      // Mouse position affects tilt (X and Z rotation)
      // Only apply if not zoomed in
      if (!isZoomed) {
        const mouseX = (state.mouse.x * viewport.width) / 20;
        const mouseY = (state.mouse.y * viewport.height) / 20;
        
        // Smooth transition to target rotation
        group.current.rotation.x = THREE.MathUtils.lerp(
          group.current.rotation.x,
          mouseY * 0.05,
          0.1
        );
        
        group.current.rotation.z = THREE.MathUtils.lerp(
          group.current.rotation.z,
          -mouseX * 0.05,
          0.1
        );
      }
      
      // Add gentle floating motion
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* The GLB model with increased scale */}
      <primitive 
        object={scene.clone()} 
        scale={[1.7, 1.7, 1.7]}  // Scale set to 1.2 as requested
        position={[0, 0, 0]}
      />
    </group>
  );
}

// Preload the GLB model
useGLTF.preload("/assets/old_sewing_machine.glb");

// Main component
export default function SewingAnimation() {
  return (
    <div className="relative  w-full overflow-hidden h-screen">
      <Canvas 
        shadows 
        dpr={[1, 2]}
        camera={{ 
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
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

        <Suspense fallback={<Loader />}>
          <SewingMachine position={[0, -0.5, 0]} />
        </Suspense>
        
        <Environment preset="city" />
      </Canvas>

      {/* Instructions overlay */}
    
    </div>
  );
}
