"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/lib/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price with discount if available
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const discountedPrice = product.discount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price * (1 - product.discount / 100))
    : null;

  return (
    <div
      dir="rtl"
      className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {" "}
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
      {/* Discount badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </div>
      )}
      {/* Product image with hover effect */}
      <Link href={`/shop/product/${product.id}`}>
        <div
          className="relative h-64 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={isHovering ? product.secondaryImage : product.primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 transform group-hover:scale-105"
            priority={false}
          />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      {/* Product details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/shop/product/${product.id}`} className="block">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description.slice(0, 40)}...
        </p>

        <div className="flex justify-between items-center">
          <div>
            {discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{discountedPrice}</span>
                <span className="text-gray-500 text-sm line-through">
                  {formattedPrice}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg">{formattedPrice}</span>
            )}
          </div>

          <button
            disabled={!product.inStock}
            className={`p-2 rounded-full ${
              product.inStock
                ? "bg-black text-white hover:bg-blue-600 transition-colors"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Color options */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-3">
            <div className="flex gap-1 mt-1">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: color.toLowerCase(),
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
