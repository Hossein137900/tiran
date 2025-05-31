"use client";
import DynamicFashionGrid from "@/components/static/ui/dynamicFashionGrid";
import EnhancedLogoLoadingScreen from "@/components/static/ui/enhancedLogoLoadingScreen";
import MarqueeSlider from "@/components/static/ui/marqueeSlider";
import ScrollMediaShowcase from "@/components/static/ui/scrollMediaShowcase";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "grid" | "transition" | "showcase"
  >("showcase"); // Default to showcase
  const [expandingImage, setExpandingImage] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const slideImages = [
    "/assets/images/fashion/1.avif",
    "/assets/images/fashion/2.avif",
    "/assets/images/fashion/3.avif",
    "/assets/images/fashion/4.avif",
    "/assets/images/fashion/5.avif",
    "/assets/images/fashion/6.avif",
  ];

  // Check localStorage immediately on component mount
  useEffect(() => {
    const hasSeenGrid = localStorage.getItem("tiran-fashion-grid-seen");

    if (hasSeenGrid !== "true") {
      // First time user, show the grid
      setCurrentComponent("grid");

      // Automatically transition after 5 seconds
      const timer = setTimeout(() => {
        // Mark as seen and start transition
        localStorage.setItem("tiran-fashion-grid-seen", "true");

        // Get a random image for transition
        const randomImage =
          slideImages[Math.floor(Math.random() * slideImages.length)];
        setExpandingImage(randomImage);
        setCurrentComponent("transition");

        // After 2 seconds, show the main content
        setTimeout(() => {
          setCurrentComponent("showcase");
        }, 2000);
      }, 5000);

      return () => clearTimeout(timer);
    }

    setIsFirstLoad(false);
  }, []);

  // Handle manual grid completion (if user interacts before 5 seconds)
  const handleGridComplete = (centerImage: string) => {
    localStorage.setItem("tiran-fashion-grid-seen", "true");
    setExpandingImage(centerImage);
    setCurrentComponent("transition");

    setTimeout(() => {
      setCurrentComponent("showcase");
    }, 2000);
  };



  return (
    <div className="relative min-h-screen">
      {/* DynamicFashionGrid - shows for exactly 5 seconds on first visit */}
      {currentComponent === "grid" && (
        <DynamicFashionGrid onComplete={handleGridComplete} />
      )}

      {/* Expanding image transition */}
      {currentComponent === "transition" && (
        <div className="fixed inset-0 z-50">
          <img
            src={expandingImage}
            alt="Transition"
            className="w-full h-full object-cover animate-scale-up"
          />
        </div>
      )}

      {/* Main content - shows after transition or directly for returning users */}
      {currentComponent === "showcase" && (
        <div className={`${!isFirstLoad ? "animate-fade-in" : ""}`}>
          <ScrollMediaShowcase />
          <EnhancedLogoLoadingScreen />
          <MarqueeSlider images={slideImages} speed={25} direction="right" />
          <EnhancedLogoLoadingScreen />
        </div>
      )}

      <style jsx>{`
        @keyframes scale-up {
          from {
            transform: scale(0.1);
            border-radius: 12px;
          }
          to {
            transform: scale(1);
            border-radius: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-scale-up {
          animation: scale-up 1s ease-out forwards;
          transform-origin: center;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default Page;
