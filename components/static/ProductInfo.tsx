"use client";

import { useState } from "react";
// import Image from "next/image";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product } from "@/types/type";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  // Format price with discount if available
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product?.variety?.price_main ?? 0);

  // Get available sizes and colors from product properties
  const sizes =
    product?.variety?.Properties?.filter(
      (prop) => prop.property.title === "سایز"
    ) || [];

  const colors =
    product?.variety?.Properties?.filter(
      (prop) => prop.property.title === "رنگ"
    ) || [];

  const handleAddToCart = () => {
    if (!product.store_stock) return;

    // Show adding animation
    setIsAddingToCart(true);

    // Add item to cart
    addItem({
      id: product.id.toString(),
      name: product.fa_name,
      price: product.variety?.price_main ?? 0,
      quantity: quantity,
      image: product?.main_image_id || null,
    });

    // Reset button after animation
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1500);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Details */}
        <div dir="rtl" className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">
            {product.fa_name ? product.fa_name : "efe"}
          </h1>
          <p className="text-gray-600 mb-4">{product.seo_description}</p>

          <div className="text-2xl font-bold mb-6">{formattedPrice}</div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">سایز</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.title)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size.title
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    {size.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">رنگ</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.title)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.title
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.code || "#000000" }}
                    title={color.title}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">تعداد</h3>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center"
              >
                -
              </button>
              <div className="w-16 h-10 flex items-center justify-center border-t border-b">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <motion.button
              disabled={!product.store_stock}
              onClick={handleAddToCart}
              whileHover={product.store_stock ? { scale: 1.05 } : {}}
              whileTap={product.store_stock ? { scale: 0.95 } : {}}
              className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center gap-2 ${
                product.store_stock
                  ? "bg-black text-white hover:bg-blue-600 transition-colors"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <Check size={20} />
                  <span>اضافه شد</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>افزودن به سبد خرید</span>
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsFavorite(!isFavorite)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-md border border-gray-300"
            >
              <Heart
                size={20}
                className={
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }
              />
            </motion.button>
          </div>

          {/* Additional Product Info */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-2">مشخصات محصول</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>
                دسته‌بندی: {product.variety?.category?.cat_name || "نامشخص"}
              </li>
              <li>موجودی: {product.store_stock > 0 ? "موجود" : "ناموجود"}</li>
              {product.variety?.show_unit && (
                <li>واحد: {product.variety.show_unit}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
