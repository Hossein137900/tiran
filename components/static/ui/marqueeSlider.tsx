"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface SlideItem {
  image: string;
  title: string;
  description: string;
}

interface MarqueeSliderProps {
  items: SlideItem[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

const MarqueeSlider: React.FC<MarqueeSliderProps> = ({
  items,
  speed = 20,
  direction = "left",
  pauseOnHover = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stable animation name using useMemo
  const animationName = useMemo(() => {
    return `marquee-${direction}-${Math.random().toString(36).substr(2, 9)}`;
  }, [direction]);

  // Set client state after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update container width and mobile state
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions, isClient]);

  // Calculate item dimensions
  const itemWidth = isMobile ? 220 : 200;
  const gap = 32;
  const itemWithGap = itemWidth + gap;

  // Calculate how many complete sets we need
  const itemsPerSet = items.length;
  const oneSetWidth = itemsPerSet * itemWithGap;

  // Ensure we have enough items to fill screen + buffer for seamless loop
  const setsNeeded = Math.max(3, Math.ceil((containerWidth * 2) / oneSetWidth));
  const infiniteItems = Array(setsNeeded).fill(items).flat();

  // Create CSS for animation
  const createAnimationCSS = useCallback(() => {
    const keyframes =
      direction === "left"
        ? `
        @keyframes ${animationName} {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-${oneSetWidth}px); }
        }
      `
        : `
        @keyframes ${animationName} {
          0% { transform: translateX(-${oneSetWidth}px); }
          100% { transform: translateX(0px); }
        }
      `;

    return `
      ${keyframes}
      
      .marquee-track-${animationName} {
        animation: ${animationName} ${speed}s linear infinite;
        will-change: transform;
        backface-visibility: hidden;
      }

      .marquee-container-${animationName}:hover .marquee-track-${animationName} {
        animation-play-state: ${pauseOnHover ? "paused" : "running"};
      }

      @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      .shine-effect {
        animation: shine 1s ease-in-out;
      }

      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
  }, [oneSetWidth, speed, direction, pauseOnHover, animationName]);

  useEffect(() => {
    if (!isClient) return;

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = createAnimationCSS();
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [createAnimationCSS, isClient]);

  // Don't render animation classes until client-side
  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className="w-full overflow-hidden py-12"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-8">
          {items.map((item, index) => (
            <div
              key={`initial-${index}`}
              className="group"
              style={{
                height: "280px",
                width: "400px",
                flexShrink: 0,
              }}
            >
              <div className="relative h-full overflow-hidden shadow-lg bg-gray-900 cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div
                  className="absolute bottom-3 right-3 flex flex-col p-4"
                  dir="rtl"
                >
                  <div className="text-white">
                    <h3 className="text-lg font-bold mb-2 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-3 mb-3">
                      {item.description}
                    </p>

                    {/* Decorative line */}
                    <div className="h-0.5 bg-white w-12" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden py-12 marquee-container-${animationName}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
      }}
    >
      <div className={`flex items-center gap-8 marquee-track-${animationName}`}>
        {infiniteItems.map((item, index) => {
          const setIndex = Math.floor(index / items.length);
          const itemIndex = index % items.length;

          return (
            <div
              key={`set-${setIndex}-item-${itemIndex}`}
              className="group"
              style={{
                height: isMobile ? "200px" : "280px",
                width: isMobile ? "300px" : "400px",
                flexShrink: 0,
              }}
            >
              <div className="relative h-full overflow-hidden shadow-lg bg-gray-900 cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  draggable={false}
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
                    isMobile
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Content Overlay */}
                <div
                  className="absolute bottom-3 right-3 flex flex-col p-4"
                  dir="rtl"
                >
                  <div
                    className={`text-white transition-all duration-500 ease-out ${
                      isMobile
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    }`}
                  >
                    <h3 className="text-lg font-bold mb-2 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-3 mb-3">
                      {item.description}
                    </p>

                    {/* Decorative line */}
                    <div
                      className={`h-0.5 bg-white transition-all duration-400 ease-out ${
                        isMobile ? "w-12" : "w-0 group-hover:w-12"
                      }`}
                    />
                  </div>
                </div>

                {/* Shine effect on hover - Desktop only */}
                {!isMobile && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:shine-effect" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarqueeSlider;
