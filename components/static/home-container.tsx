"use client";
import CategoryShowcase from "@/components/static/ui/categoryImage";
import DynamicFashionGrid from "@/components/static/ui/dynamicFashionGrid";
import EnhancedLogoLoadingScreen from "@/components/static/ui/enhancedLogoLoadingScreen";
import MarqueeSlider from "@/components/static/ui/marqueeSlider";
import ScrollMediaShowcase from "@/components/static/ui/scrollMediaShowcase";
import React, { useState, useEffect } from "react";
import { slideItems, categories } from "@/lib/homePageData";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "grid" | "transition" | "showcase"
  >("showcase"); // Default to showcase
  const [expandingImage, setExpandingImage] = useState<string>("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);

  console.log(expandingImage, isFirstLoad, isTransitioning);

  // Check localStorage immediately on component mount
  useEffect(() => {
    const hasSeenGrid = localStorage.getItem("tiran-fashion-grid-sen");

    if (hasSeenGrid !== "true") {
      // First time user, show the grid
      setCurrentComponent("grid");
      setShowGrid(true);

      // Automatically transition after 5 seconds
      const timer = setTimeout(() => {
        handleGridToShowcaseTransition();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      // Returning user, show showcase directly with no delay
      setCurrentComponent("showcase");
      setShowShowcase(true);
      setIsFirstLoad(false);
    }
  }, []);

  // Handle smooth transition from grid to showcase
  const handleGridToShowcaseTransition = async () => {
    // Mark as seen
    localStorage.setItem("tiran-fashion-grid-seen", "true");

    // Start transition sequence
    setIsTransitioning(true);

    // Get a random image for transition effect
    const randomImage =
      slideItems[Math.floor(Math.random() * slideItems.length)].image;
    setExpandingImage(randomImage);

    // Phase 1: Fade out grid (300ms - reduced from 500ms)
    setShowGrid(false);

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Phase 2: Show transition overlay (600ms - reduced from 1000ms)
    setCurrentComponent("transition");

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Phase 3: Switch to showcase and start showing it immediately
    setCurrentComponent("showcase");
    setShowShowcase(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Phase 4: Complete transition
    setIsTransitioning(false);
    setIsFirstLoad(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* DynamicFashionGrid - shows for exactly 5 seconds on first visit */}
      {currentComponent === "grid" && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ease-out ${
            showGrid ? "opacity-100" : "opacity-0"
          }`}
        >
          <DynamicFashionGrid />
        </div>
      )}

      {/* Main content - ONLY ScrollMediaShowcase renders here */}
      {currentComponent === "showcase" && (
        <div
          className={`relative z-30 transition-all duration-500 ease-out ${
            showShowcase
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-2"
          }`}
        >
          {/* ScrollMediaShowcase - IMMEDIATE rendering with minimal delay */}
          <div
            className={`transition-all duration-600 ease-out ${
              showShowcase
                ? "opacity-100 transform scale-100"
                : "opacity-0 transform scale-98"
            }`}
            style={{
              transitionDelay: "0ms", // No delay for immediate show
            }}
          >
            <ScrollMediaShowcase />
          </div>

          {/* Other components with faster staggered loading */}
          <div
            className={`transition-all duration-500 ease-out ${
              showShowcase
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
            style={{
              transitionDelay: "200ms", // Reduced from 800ms
            }}
          >
            <EnhancedLogoLoadingScreen />
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              showShowcase
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
            style={{
              transitionDelay: "400ms", // Reduced from 1200ms
            }}
          >
            <MarqueeSlider
              items={slideItems}
              speed={20}
              direction="left"
              pauseOnHover={true}
            />{" "}
          </div>

          <div
            className={`transition-all duration-500 ease-out ${
              showShowcase
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
            style={{
              transitionDelay: "600ms", // Reduced from 1600ms
            }}
          >
            <EnhancedLogoLoadingScreen />
          </div>
          <div className="min-h-screen">
            <CategoryShowcase
              categories={categories}
              title="دسته‌بندی‌های ما"
              subtitle="کشف کنید، تجربه کنید، لذت ببرید"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-up-fast {
          from {
            transform: scale(0.2);
            border-radius: 30%;
            opacity: 0.8;
          }
          to {
            transform: scale(1.02);
            border-radius: 0;
            opacity: 1;
          }
        }

        @keyframes fade-in-fast {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-scale-up-fast {
          animation: scale-up-fast 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            forwards;
          transform-origin: center;
        }

        .animate-fade-in-fast {
          animation: fade-in-fast 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Page;
