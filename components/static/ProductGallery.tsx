"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { ProductGalleryProps } from "@/types/type";

export default function ProductGallery({
  primaryImage,
  secondaryImage,
  additionalImages,
  productName,
  layout,
  activeImageIndex = 0,
  onThumbnailClick,
}: // onImageChange,
ProductGalleryProps) {
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

  console.log(canScrollDown, canScrollUp);

  // Combine all images
  const allImages = [primaryImage, secondaryImage, ...additionalImages].filter(
    Boolean
  );
  // Smooth scroll to active image in main gallery
  useEffect(() => {
    if (layout === "desktop" && mainImagesRef.current) {
      const targetImage = mainImagesRef.current.children[
        activeImageIndex
      ] as HTMLElement;
      if (targetImage) {
        targetImage.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [activeImageIndex, layout]);

  // click on Thumbnails to scroll to main images
  const handleThumbnailClick = (index: number) => {
    if (onThumbnailClick) {
      onThumbnailClick(index);
    }
  };

  // naviagtion buttons in mobile
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
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

  // Effect: Scroll to active thumbnail when image changes or layout switches to thumbnails
  useEffect(() => {
    if (layout === "thumbnails") {
      checkScrollPosition();
      scrollToActiveThumbnail(currentImageIndex);
    }
  }, [currentImageIndex, layout]);

  // Effect: Set up scroll event listener for thumbnail navigation buttons
  useEffect(() => {
    if (layout === "thumbnails") {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", checkScrollPosition);
        checkScrollPosition();

        // Cleanup: Remove scroll event listener on component unmount
        return () =>
          container.removeEventListener("scroll", checkScrollPosition);
      }
    }
  }, [layout]);

  // Touch handler: Capture initial touch position for swipe gesture detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  // Touch handler: Track finger movement during swipe gesture

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Touch handler: Process swipe gesture and navigate images based on swipe direction
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Swipe left: next image
    const isRightSwipe = distance < -50; // Swipe right: previous image

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  // Function: Open zoom modal with selected image for detailed view
  const handleZoom = (imageSrc: string) => {
    setZoomedImageSrc(imageSrc);
    setIsZoomed(true);
  };

  // Desktop Layout - All Images in Column
  if (layout === "desktop") {
    return (
      <div className="relative h-full w-full">
        <div
          ref={mainImagesRef}
          className="h-full overflow-y-auto px-4 py-8 space-y-6 scrollbar-hide"
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
                  src={image || ""}
                  alt={`${productName} - تصویر ${index + 1}`}
                  width={500}
                  height={700}
                  className="w-full h-auto object-contain"
                  priority={index === 0}
                />

                {/* Zoom Button */}
                <button
                  onClick={() => image && handleZoom(image)}
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ZoomIn size={18} />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/70 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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

  // Thumbnails Layout - Right Sidebar
  if (layout === "thumbnails") {
    return (
      <div className="h-full flex flex-col">
        <div
          ref={scrollContainerRef}
          className="flex-1 flex flex-col gap-3 p-3 overflow-y-auto scrollbar-thin"
        >
          {allImages.map((image, index) => (
            <div
              key={index}
              className={`relative cursor-pointer transition-all duration-300 overflow-hidden ${
                activeImageIndex === index
                  ? "ring-2 ring-gray-400 opacity-100 shadow-md"
                  : "opacity-50 hover:opacity-80"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="">
                <Image
                  src={image || ''}
                  width={1000}
                  height={1000}
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Active indicator */}
              {activeImageIndex === index && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll to Top Button */}
        <div className="flex justify-center p-3">
          <button
            onClick={() => {
              // Select first thumbnail
              handleThumbnailClick(0);
              // Scroll to top
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 shadow-sm"
            aria-label="Go to first image and scroll to top"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
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
          className="relative w-full h-80 flex items-center justify-center p-4"
        >
          <Image
            src={allImages[currentImageIndex] || ""}
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
        onClick={() =>
          allImages[currentImageIndex] &&
          handleZoom(allImages[currentImageIndex])
        }
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
            className="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex items-center justify-center"
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
                className="absolute top-4 right-4 p-2 bg-white/80 text-black rounded-full hover:bg-white/30 transition-colors"
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
