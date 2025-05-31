"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product } from "@/types/type";
import { toast } from "react-toastify";
import AddressModal from "./addressModal";
import {
  addToCart,
  completeCheckout,
  getCheckoutInfo,
} from "@/middleware/checkout";

interface ProductInfoProps {
  product: Product;
  layout?: "desktop" | "mobile";
}

export default function ProductInfo({
  product,
  layout = "mobile",
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<
    NonNullable<Product["varieties"]>[number] | null
  >(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  // Initialize with the first variety if available
  useEffect(() => {
    if (product?.varieties && product.varieties.length > 0) {
      setSelectedVariety(product.varieties[0]);

      // Set initial size if available
      if (
        product.varieties[0].showProperties &&
        product.varieties[0].showProperties.length > 0
      ) {
        const sizeProperty = product.varieties[0].showProperties.find(
          (prop) => prop.title === "سایز"
        );
        if (sizeProperty) {
          setSelectedSize(sizeProperty.child.title);
        }
      }

      // Set initial color if available
      if (product.varieties[0].getColor) {
        setSelectedColor(product.varieties[0].getColor.fa_name);
      }
    }
  }, [product]);

  // Format price with discount if available
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(selectedVariety?.price_main ?? 0);

  // Extract all available properties from varieties
  const propertiesByType: Record<
    string,
    Array<{ id: number; title: string; propertyId: number }>
  > = {};

  // Collect all properties from all varieties
  product?.varieties?.forEach((variety) => {
    variety.showProperties?.forEach((prop) => {
      if (!propertiesByType[prop.title]) {
        propertiesByType[prop.title] = [];
      }

      // Add property if not already in the array
      const existingProp = propertiesByType[prop.title].find(
        (p) => p.id === prop.child.id
      );
      if (!existingProp) {
        propertiesByType[prop.title].push({
          id: prop.child.id,
          title: prop.child.title,
          propertyId: prop.id,
        });
      }
    });
  });

  // Get color information
  const color = selectedVariety?.getColor || null;

  const handlePropertyChange = (
    propertyTitle: string,
    propertyId: number,
    propertyTypeId: number
  ) => {
    console.log(propertyTypeId);
    // Update the selected property
    setSelectedSize(propertyTitle);

    // Find variety that matches this property
    const matchingVariety = product?.varieties?.find((variety) =>
      variety.showProperties?.some((prop) => prop.child.id === propertyId)
    );

    if (matchingVariety) {
      setSelectedVariety(matchingVariety);

      // Update color if the new variety has a different color
      if (matchingVariety.getColor) {
        setSelectedColor(matchingVariety.getColor.fa_name);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariety || selectedVariety.store_stock <= 0) {
      toast.error("این محصول در انبار موجود نیست", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Show adding animation
    setIsAddingToCart(true);

    try {
      // Check if address exists in localStorage
      const addressId = localStorage.getItem("address_id");

      if (!addressId) {
        // If no address, show the address modal
        setShowAddressModal(true);
        return;
      }

      // If address exists, proceed with adding to cart
      await processAddToCart(parseInt(addressId));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "خطا در افزودن به سبد خرید",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      // Reset button after animation
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1500);
    }
  };

  const processAddToCart = async (addressId: number) => {
    setCheckoutLoading(true);

    try {
      if (!selectedVariety) return;

      // 1. Add item to local cart context
      addItem({
        id: selectedVariety.id.toString(),
        name: product.fa_name,
        price: selectedVariety.price_main,
        quantity: quantity,
        image: product?.main_image_id || null,
        size: selectedSize,
        color: selectedColor,
      });

      // 2. Add item to server cart
      await addToCart(selectedVariety.id, quantity);

      // 3. Get checkout information
      const checkoutInfo = await getCheckoutInfo(addressId);

      if (!checkoutInfo.sendMethods || checkoutInfo.sendMethods.length === 0) {
        throw new Error("روش ارسال در دسترس نیست");
      }
      // 4. Use the first send method and pay method
      const sendMethod = checkoutInfo.sendMethods[0];
      const payMethod = checkoutInfo.payMethods[0];

      // Get the first available receive date
      let receiveDate = "";
      if (sendMethod.receives && sendMethod.receives.length > 0) {
        receiveDate = sendMethod.receives[0].date;
      } else {
        // Default to a date if none available
        receiveDate = "1404/02/22";
      }

      // 5. Complete the checkout process
      await completeCheckout(
        addressId,
        sendMethod.id,
        payMethod.id,
        receiveDate
      );

      toast.success("سفارش شما با موفقیت ثبت شد", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "خطا در تکمیل سفارش",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleAddressCreated = (addressId: number) => {
    // After address is created, continue with the cart process
    processAddToCart(addressId);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.fa_name,
        text: product.seo_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("لینک کپی شد", { position: "top-center" });
    }
  };

  return (
    <div
      className={`${
        layout === "desktop"
          ? "h-full flex flex-col"
          : "container mx-auto px-4 sm:px-6"
      } pb-6 sm:pb-8`}
    >
      {" "}
      {/* Product Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1
              className={`font-light tracking-wide ${
                layout === "desktop" ? "text-lg" : "text-2xl"
              }`}
            >
              {product.fa_name}
            </h1>
            <p
              className={`text-gray-600 mt-2 leading-relaxed ${
                layout === "desktop" ? "text-sm" : "text-base"
              }`}
            >
              {product.seo_description}
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 mr-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={layout === "desktop" ? 18 : 20}
                className={
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2
                size={layout === "desktop" ? 18 : 20}
                className="text-gray-600"
              />
            </motion.button>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between  pb-4">
          <div
            className={`font-light ${
              layout === "desktop" ? "text-lg" : "text-xl"
            }`}
          >
            {formattedPrice}
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              (selectedVariety?.store_stock ?? 0) > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {(selectedVariety?.store_stock ?? 0) > 0 ? "موجود" : "ناموجود"}
          </span>
        </div>
      </div>
      {/* Product Options */}
      <div className="flex  flex-roe items-center justify-center gap-12">
        {/* Size Selection */}
        {Object.entries(propertiesByType).map(
          ([propertyType, options]) =>
            options.length > 0 && (
              <div key={propertyType} className="space-y-3">
                <h3
                  className={`font-medium text-gray-900 ${
                    layout === "desktop" ? "text-sm" : "text-base"
                  }`}
                >
                  {propertyType}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {options.map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handlePropertyChange(
                          option.title,
                          option.id,
                          option.propertyId
                        );
                      }}
                      className={`py-3 px-4 text-center  transition-all ${
                        selectedSize === option.title
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-400"
                      } ${layout === "desktop" ? "text-xs" : "text-sm"}`}
                    >
                      {option.title}
                    </motion.button>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Color Selection */}
        {color && (
          <div className="space-y-3">
            <h3
              className={`font-medium text-gray-900 ${
                layout === "desktop" ? "text-sm" : "text-base"
              }`}
            >
              رنگ
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(
                  product?.varieties
                    ?.filter((v) => v.getColor)
                    ?.map((v) => v.getColor!.fa_name)
                )
              ).map((colorName) => (
                <motion.button
                  key={colorName}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedColor(colorName);
                    const match = product?.varieties?.find(
                      (v) => v.getColor?.fa_name === colorName
                    );
                    if (match) setSelectedVariety(match);
                  }}
                  className={`py-2 px-4  transition-all ${
                    selectedColor === colorName
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  } ${layout === "desktop" ? "text-xs" : "text-sm"}`}
                >
                  {colorName}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <h3
            className={`font-medium text-gray-900 ${
              layout === "desktop" ? "text-sm" : "text-base"
            }`}
          >
            تعداد
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300">
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.95 }}
                onClick={decrementQuantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
              >
                <span className="text-lg">−</span>
              </motion.button>

              <div className="w-12 h-10 flex items-center justify-center border-x border-gray-300 font-medium">
                {quantity}
              </div>

              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementQuantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
              >
                <span className="text-lg">+</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  (selectedVariety?.store_stock ?? 0) > 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span
                className={`text-xs ${
                  (selectedVariety?.store_stock ?? 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(selectedVariety?.store_stock ?? 0) > 0
                  ? `${selectedVariety?.store_stock} عدد`
                  : "ناموجود"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Add to Cart Button */}
      <div className="space-y-4 pt-2">
        <motion.button
          disabled={
            !selectedVariety ||
            selectedVariety.store_stock <= 0 ||
            checkoutLoading
          }
          onClick={handleAddToCart}
          whileHover={
            (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 1.02 } : {}
          }
          whileTap={
            (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 0.98 } : {}
          }
          className={`w-full py-4 flex items-center justify-center gap-3 font-medium transition-all ${
            (selectedVariety?.store_stock ?? 0) > 0 && !checkoutLoading
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          } ${layout === "desktop" ? "text-sm" : "text-base"}`}
        >
          {isAddingToCart ? (
            <>
              <Check size={layout === "desktop" ? 16 : 18} />
              <span>اضافه شد</span>
            </>
          ) : checkoutLoading ? (
            <span>در حال پردازش...</span>
          ) : (
            <>
              <ShoppingCart size={layout === "desktop" ? 16 : 18} />
              <span>افزودن به سبد خرید</span>
            </>
          )}
        </motion.button>
      </div>
      {/* Product Details */}
      {layout === "desktop" && (
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium">جزئیات محصول</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>دسته‌بندی:</span>
              <span>{selectedVariety?.category?.cat_name || "نامشخص"}</span>
            </div>
            {selectedVariety?.show_unit && (
              <div className="flex justify-between">
                <span>واحد:</span>
                <span>{selectedVariety.show_unit}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressCreated={handleAddressCreated}
      />
    </div>
  );
}
