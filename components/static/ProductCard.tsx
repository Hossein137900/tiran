"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCardProps } from "@/types/type";

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format price
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(product.variety?.price_main ?? 0);

  // Handle image navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const currentImage =
    product.images.length > 0
      ? product.images[currentImageIndex].src
      : "/assets/images/fashion/5.avif";

  return (
    <div
      dir="rtl"
      className="group relative bg-white overflow-hidden transition-all duration-300"
    >
      {/* Product image with hover effect and slider */}
      <Link href={`/shop/${product.slug}`} className="group">
        <div
          className="relative h-96 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={currentImage}
            alt={product.fa_name || "محصول"}
            fill
            className="object-cover transition-all duration-500 transform"
            priority={false}
          />

          {/* Navigation arrows - only show when hovering and multiple images exist */}
          {isHovering && product.images.length > 1 && (
            <>
              {/* Right arrow (previous in RTL) */}
              <button
                onClick={handlePrevImage}
                className="absolute right-2 top-1/2 -translate-y-1/2  text-black  transition-all duration-200 z-10"
                aria-label="تصویر قبلی"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Left arrow (next in RTL) */}
              <button
                onClick={handleNextImage}
                className="absolute left-2 top-1/2 -translate-y-1/2  text-black  transition-all duration-200 z-10"
                aria-label="تصویر بعدی"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`تصویر ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.store_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <span className="text-white font-medium text-lg">ناموجود</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.fa_name}
          </h3>
        </div>

        {/* Price */}
        <div className="flex justify-start items-center">
          <div>
            <span className="font-light text-sm">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
