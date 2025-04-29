"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface LocomotiveScrollLayoutProps {
  children: ReactNode;
}

export default function LocomotiveScrollLayout({
  children,
}: LocomotiveScrollLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [locomotiveScrollRef, setLocomotiveScrollRef] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize and manage Locomotive Scroll
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let scrollInstance: any = null;

    // Dynamically import Locomotive Scroll only on the client side
    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;

        // Destroy any existing instance first
        if (locomotiveScrollRef) {
          locomotiveScrollRef.destroy();
        }

        // Create new instance with improved settings
        scrollInstance = new LocomotiveScroll({
          el: containerRef.current as HTMLElement,
          smooth: true,
          multiplier: 1,
          lerp: 0.1, // Lower value for smoother scrolling
          smartphone: {
            smooth: true,
          },

          reloadOnContextChange: true,
          resetNativeScroll: true,
        });

        // Update scroll on window resize
        const handleResize = () => {
          if (scrollInstance) {
            scrollInstance.update();
          }
        };

        // Add event listeners
        window.addEventListener("resize", handleResize);

        // Update scroll when images and other resources finish loading
        window.addEventListener("load", () => {
          if (scrollInstance) {
            setTimeout(() => {
              scrollInstance.update();
            }, 500);
          }
        });

        // Set the instance to state
        setLocomotiveScrollRef(scrollInstance);

        return () => {
          window.removeEventListener("resize", handleResize);
          if (scrollInstance) {
            scrollInstance.destroy();
          }
        };
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error);
        // Fallback to native scrolling if locomotive fails
        return () => {};
      }
    };

    const cleanup = initLocomotiveScroll();

    return () => {
      // Properly clean up the scroll instance
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [isClient]);

  // Update locomotive scroll when content changes
  useEffect(() => {
    if (locomotiveScrollRef) {
      // Small delay to ensure DOM is updated
      const updateTimeout = setTimeout(() => {
        locomotiveScrollRef.update();
      }, 200);

      return () => clearTimeout(updateTimeout);
    }
  }, [children, locomotiveScrollRef]);

  // Handle scroll to top when route changes
  useEffect(() => {
    if (locomotiveScrollRef) {
      const handleRouteChange = () => {
        locomotiveScrollRef.scrollTo(0, { duration: 0, disableLerp: true });
      };

      // You can integrate this with your router if needed
      // For example with Next.js router events

      return () => {
        // Clean up event listeners if needed
      };
    }
  }, [locomotiveScrollRef]);

  return (
    <motion.div
      ref={containerRef}
      data-scroll-container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="smooth-scroll-container"
    >
      {children}
    </motion.div>
  );
}
