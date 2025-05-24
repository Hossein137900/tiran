"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  console.log(isHovering);
  // Format price
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(product.variety?.price_main ?? 0);

  // Get color information

  return (
    <div
      dir="rtl"
      className="group relative border border-dashed border-gray-400 bg-white rounded-sm overflow-hidden  hover:shadow-xl transition-all duration-300"
    >
      {/* Product image with hover effect */}
      <Link href={`/shop/${product.slug}`} className="group">
        <div
          className="relative h-64 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={
              product.images.length > 0
                ? product.images[0].src
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

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.seo_description.slice(0, 50)}...
        </p>

        {/* Price */}
        <div className="flex justify-end items-center">
          <div>
            <span className="font-bold text-lg">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
