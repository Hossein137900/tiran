"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types/type";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(product.variety?.price_main ?? 0);

  // Get color information
  const colorProperty = product.variety?.Properties?.find(
    (prop) => prop.property.title === "رنگ"
  );

  return (
    <div
      dir="rtl"
      className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Favorite button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 bg-white/80 p-1.5 rounded-full"
      >
        <Heart
          size={20}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>

      {/* Product image with hover effect */}
      <Link href={`/shop/${product.slug}`} className="group">
        <div
          className="relative h-64 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={
              product.main_image_id
                ? `/api/images/${product.main_image_id}`
                : "/assets/images/fashion/5.avif"
            }
            alt={product.fa_name || "محصول"}
            fill
            className="object-cover transition-all duration-500 transform group-hover:scale-105"
            priority={false}
          />

          {/* Out of stock overlay */}
          {!product.store_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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

        {/* Category */}
        <div className="text-xs text-gray-500 mb-2">
          دسته‌بندی: {product.variety?.category?.cat_name || "نامشخص"}
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.seo_description}...
        </p>

        {/* Price */}
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-lg">{formattedPrice}</span>
          </div>
        </div>

        {/* Color indicator */}
        {colorProperty && (
          <div className="mt-3">
            <div className="flex gap-1 mt-1">
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: colorProperty.code || "#000000" }}
                title={colorProperty.title}
              />
              <span className="text-xs text-gray-500">
                {colorProperty.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
