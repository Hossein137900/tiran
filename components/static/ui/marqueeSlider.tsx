"use client";
import React from "react";

interface MarqueeSliderProps {
  images: string[];
  speed?: number; // Duration in seconds for one complete cycle
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

const MarqueeSlider: React.FC<MarqueeSliderProps> = ({
  images,
  speed,
  direction,
  pauseOnHover = true,
}) => {
  // Create enough copies to ensure seamless infinite scroll
  const infiniteImages = [
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
    ...images,
  ];

  return (
    <div className="w-full overflow-hidden py-12">
      <div
        className={`flex items-center gap-8 ${
          pauseOnHover ? "hover:pause" : ""
        }`}
        style={{
          animation: `infiniteMarquee${
            direction === "right" ? "Right" : ""
          } ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {infiniteImages.map((image, index) => (
          <div key={`infinite-${index}`} className="flex-shrink-0 h-70">
            <img
              src={image}
              alt={`Slide ${(index % images.length) + 1}`}
              className="h-full object-cover"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes infiniteMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-${100 / 6}%);
          }
        }

        @keyframes infiniteMarqueeRight {
          0% {
            transform: translateX(-${100 / 6}%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarqueeSlider;
