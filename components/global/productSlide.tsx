"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/type";
// import { Product } from "@/lib/product";

interface ProductSliderProps {
  products: Product[];
  autoPlayInterval?: number;
}

export default function ProductSlider({
  products,
  autoPlayInterval = 2000,
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Auto play functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlayInterval, currentIndex]);

  // Variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  return (
    <div className="container mx-auto px-4 py-12" dir="rtl">
      <h2 className="text-3xl font-bold mb-8 text-center">محصولات ویژه</h2>

      <div className="relative overflow-hidden max-w-4xl mx-auto">
        <div className="aspect-square md:aspect-[16/9] relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              //   exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-auto w-full max-w-3xl mx-auto transform transition-all duration-500 hover:shadow-black/60">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/2 aspect-square">
                    <Image
                      src={ "/assets/images/fashion/1.avif"}
                      alt={products[currentIndex].page_title || "ef"}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-4 right-4 bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
                      {products[currentIndex].brandMain}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-3">
                        {products[currentIndex].en_name}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {products[currentIndex].seo_description}
                      </p>

                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm mr-2">
                          (۴.۸)
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-black">
                          {products[currentIndex].store_stock.toLocaleString()} تومان
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/shop/${products[currentIndex].id}`}
                        className="flex-1 bg-black text-white py-3 rounded-lg font-medium text-center hover:bg-blue-500 transition-colors"
                      >
                        مشاهده محصول
                      </Link>
                      <button className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
          aria-label="Previous product"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
          aria-label="Next product"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-blue-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
