"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

interface ProductGalleryProps {
  primaryImage: string;
  secondaryImage: string;
  additionalImages: string[];
  productName: string;
  layout?: "desktop" | "thumbnails" | "mobile";
}

export default function ProductGallery({
  primaryImage,
  secondaryImage,
  additionalImages,
  productName,
  layout = "mobile",
}: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImageSrc, setZoomedImageSrc] = useState("");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainImagesRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Combine all images
  const allImages = [primaryImage, secondaryImage, ...additionalImages];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  // Scroll to specific image in desktop layout
  const scrollToImage = (index: number) => {
    setCurrentImageIndex(index);

    if (layout === "desktop" && imageRefs.current[index]) {
      imageRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  // Check scroll position for thumbnail navigation
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  // Scroll thumbnails
  const scrollThumbnails = (direction: "up" | "down") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollTop =
        direction === "up"
          ? scrollContainerRef.current.scrollTop - scrollAmount
          : scrollContainerRef.current.scrollTop + scrollAmount;

      scrollContainerRef.current.scrollTo({
        top: newScrollTop,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to active thumbnail
  const scrollToActiveThumbnail = (index: number) => {
    if (scrollContainerRef.current) {
      const thumbnailHeight = 120;
      const containerHeight = scrollContainerRef.current.clientHeight;
      const targetScrollTop =
        index * thumbnailHeight - containerHeight / 2 + thumbnailHeight / 2;

      scrollContainerRef.current.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (layout === "thumbnails") {
      checkScrollPosition();
      scrollToActiveThumbnail(currentImageIndex);
    }
  }, [currentImageIndex, layout]);

  useEffect(() => {
    if (layout === "thumbnails") {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition();

        return () =>
          container.removeEventListener("scroll", checkScrollPosition);
      }
    }
  }, [layout]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  // Handle zoom functionality
  const handleZoom = (imageSrc: string) => {
    setZoomedImageSrc(imageSrc);
    setIsZoomed(true);
  };

  // Desktop Layout - All Images in Column
  if (layout === "desktop") {
    return (
      <div className="relative w-180 h-full mt-20">
        <div
          ref={mainImagesRef}
          className="h-full overflow-y-auto p-8 space-y-8 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {allImages.map((image, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              id={`image-${index}`}
            >
              <div className="relative bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <Image
                  src={image}
                  alt={`${productName} - تصویر ${index + 1}`}
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                  priority={index === 0}
                />

                {/* Zoom Button */}
                <button
                  onClick={() => handleZoom(image)}
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ZoomIn size={20} />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1} / {allImages.length}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setIsZoomed(false)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={zoomedImageSrc}
                  alt={`${productName} - تصویر بزرگ`}
                  width={1200}
                  height={1600}
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                />

                {/* Close button */}
                <button
                  onClick={() => setIsZoomed(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Thumbnails Layout - Enhanced Right Sidebar
  if (layout === "thumbnails") {
    return (
      <div className="h-full bg-white relative flex flex-col mt-20">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="text-center">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              تصاویر محصول
            </span>
            <div className="text-xs text-gray-400 mt-1">
              {currentImageIndex + 1} از {allImages.length}
            </div>
          </div>
        </div>

        {/* Scroll Up Button */}
        {canScrollUp && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scrollThumbnails("up")}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-10 p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <ChevronUp size={16} className="text-gray-600" />
          </motion.button>
        )}

        {/* Thumbnails Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="space-y-3">
            {allImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <motion.button
                  onClick={() => scrollToImage(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full aspect-square overflow-hidden transition-all duration-300 ${
                    currentImageIndex === index
                      ? "ring-2 ring-black ring-offset-2 shadow-lg"
                      : "ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${productName} - thumbnail ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-300 ${
                      currentImageIndex === index
                        ? "scale-100"
                        : "scale-95 group-hover:scale-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, 200px"
                  />

                  {/* Active Indicator */}
                  {currentImageIndex === index && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-black/10"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 ${
                      currentImageIndex === index ? "bg-black/0" : ""
                    }`}
                  />

                  {/* Image Number */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1}
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Down Button */}
        {canScrollDown && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scrollThumbnails("down")}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <ChevronDown size={16} className="text-gray-600" />
          </motion.button>
        )}

        {/* Quick Navigation */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
              disabled={currentImageIndex === 0}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronUp size={14} className="text-gray-600" />
            </button>
            <button
              onClick={() =>
                scrollToImage(
                  Math.min(allImages.length - 1, currentImageIndex + 1)
                )
              }
              disabled={currentImageIndex === allImages.length - 1}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronDown size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout - Swipeable Slider
  return (
    <div className="relative h-full">
      <div
        className="h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center p-4"
        >
          <Image
            src={allImages[currentImageIndex]}
            alt={`${productName} - تصویر ${currentImageIndex + 1}`}
            width={400}
            height={600}
            className="w-full h-auto object-contain max-h-full"
            priority={currentImageIndex === 0}
          />
        </motion.div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentImageIndex === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Mobile Navigation Arrows */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Zoom functionality for mobile */}
      <button
        onClick={() => handleZoom(allImages[currentImageIndex])}
        className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-md"
      >
        <ZoomIn size={18} />
      </button>

      {/* Mobile Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={zoomedImageSrc}
                alt={`${productName} - تصویر بزرگ`}
                width={800}
                height={1200}
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />

              {/* Close button for mobile zoom */}
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
