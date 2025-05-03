"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product } from "@/types/type";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  // Format price with discount if available
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product?.variety?.price_main ?? 0);

  const discountedPrice =
    product?.variety?.price_main && product.discount
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.variety.price_main * (1 - product.discount / 100))
      : null;

  const handleAddToCart = () => {
    if (!product.store_stock) return;

    // Show adding animation
    setIsAddingToCart(true);

    // Add item to cart
    addItem({
      id: product.id.toString(),
      name: product.fa_name,
      price: product.variety?.price_main ?? 0,
      quantity: 1,
      image: product.main_image_id,
    });

    // Reset button after animation
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1500);
  };

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
      {/* {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </div>
      )} */}
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
            alt={product.fa_name}
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

          {/* <div className="flex items-center">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div> */}
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.seo_description}...
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

          <motion.button
            disabled={!product.store_stock}
            onClick={handleAddToCart}
            whileHover={product.store_stock ? { scale: 1.1 } : {}}
            whileTap={product.store_stock ? { scale: 0.9 } : {}}
            className={`p-2 rounded-full ${
              product.store_stock
                ? "bg-black text-white hover:bg-blue-600 transition-colors"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAddingToCart ? (
              <Check size={20} className="text-green-500" />
            ) : (
              <ShoppingCart size={20} />
            )}
          </motion.button>
        </div>

        {/* Color options */}
        {product.variety?.color && product.variety?.color > 0 && (
          <div className="mt-3">
            <div className="flex gap-1 mt-1">{product.variety.color}</div>
          </div>
        )}
      </div>
    </div>
  );
}
