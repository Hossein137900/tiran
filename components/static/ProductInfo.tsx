"use client";

import { useState } from "react";
import { Star, ShoppingCart, Heart, Check, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/lib/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const handleAddToCart = () => {
    // Here you would add the product to cart with the selected options
    // For now, we'll just show a success animation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
        </div>

        <span className="text-sm text-gray-500">
          {product.inStock ? (
            <span className="text-green-600 flex items-center">
              <Check size={16} className="mr-1" /> In Stock
            </span>
          ) : (
            "Out of Stock"
          )}
        </span>
      </div>

      <div className="text-xl font-bold">
        {discountedPrice ? (
          <div className="flex items-center gap-2">
            <span className="text-red-600">{discountedPrice}</span>
            <span className="text-gray-500 text-lg line-through">
              {formattedPrice}
            </span>
            <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">
              {product.discount}% OFF
            </span>
          </div>
        ) : (
          <span>{formattedPrice}</span>
        )}
      </div>

      <p className="text-gray-600">{product.description}</p>

      {/* Color selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-black"
                    : "ring-1 ring-gray-300"
                }`}
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

      {/* Size selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Size: {selectedSize}</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[3rem] h-10 px-3 rounded border transition-all ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      <div>
        <h3 className="text-sm font-medium mb-2">Quantity</h3>
        <div className="flex items-center border border-gray-300 rounded w-fit">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 text-gray-500 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="px-4 py-2 text-center w-12">{quantity}</span>
          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-2 text-gray-500 hover:bg-gray-100"
            disabled={!product.inStock}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
            product.inStock
              ? "bg-black text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={20} />
          {addedToCart ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              به سبد خرید شما اضافه شد!
            </motion.span>
          ) : (
            "اضافه کردن به سبد خرید"
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex items-center justify-center p-3 rounded-lg border border-gray-300 hover:border-gray-400"
        >
          <Heart
            size={20}
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
          />
        </motion.button>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
