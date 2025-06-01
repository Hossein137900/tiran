"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Check, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product, ProductInfoProps } from "@/types/type";
import { toast } from "react-toastify";
import AddressModal from "./addressModal";
import {
  addToCart,
  completeCheckout,
  getCheckoutInfo,
} from "@/middleware/checkout";

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
      }  mt-20  sm:pb-8`}
    >
      {" "}
      {/* Product Header */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1
              className={`font-light tracking-wide text-gray-900 ${
                layout === "desktop" ? "text-xl" : "text-2xl"
              }`}
            >
              {product.fa_name}
            </h1>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Share2 size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div
            className={`font-medium text-gray-900 ${
              layout === "desktop" ? "text-lg" : "text-xl"
            }`}
          >
            {formattedPrice}
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                (selectedVariety?.store_stock ?? 0) > 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                (selectedVariety?.store_stock ?? 0) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(selectedVariety?.store_stock ?? 0) > 0 ? "موجود" : "ناموجود"}
            </span>
          </div>
        </div>
        {/* Quantity Selection */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 text-sm">تعداد</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.95 }}
                onClick={decrementQuantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-light">−</span>
              </motion.button>

              <div className="w-12 h-10 flex items-center justify-center border-x border-gray-200 font-medium text-sm">
                {quantity}
              </div>

              <motion.button
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementQuantity}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-light">+</span>
              </motion.button>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500">
                {(selectedVariety?.store_stock ?? 0) > 0
                  ? `${selectedVariety?.store_stock} عدد موجود`
                  : "ناموجود"}
              </span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-4">
          <motion.button
            disabled={
              !selectedVariety ||
              selectedVariety.store_stock <= 0 ||
              checkoutLoading
            }
            onClick={handleAddToCart}
            whileHover={
              (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 1.01 } : {}
            }
            whileTap={
              (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 0.99 } : {}
            }
            className={`w-full py-4 flex items-center justify-center gap-3 font-medium rounded-lg transition-all ${
              (selectedVariety?.store_stock ?? 0) > 0 && !checkoutLoading
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } ${layout === "desktop" ? "text-sm" : "text-base"}`}
          >
            {isAddingToCart ? (
              <>
                <Check size={18} />
                <span>اضافه شد</span>
              </>
            ) : checkoutLoading ? (
              <span>در حال پردازش...</span>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>افزودن به سبد خرید</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Product Details with Options */}
        <div className="pt-6 border-t border-gray-100">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer">
              <h3 className="text-sm font-medium text-gray-900">
                جزئیات و تنظیمات محصول
              </h3>
              <svg
                className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <div className="mt-4 space-y-6">
              {/* Product Options */}
              <div className="space-y-4">
                {/* Size Selection Dropdown */}
                {Object.entries(propertiesByType).map(
                  ([propertyType, options]) =>
                    options.length > 0 && (
                      <div key={propertyType} className="space-y-2">
                        <details className="group/size">
                          <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <span className="font-medium text-gray-900 text-sm">
                              {propertyType}: {selectedSize || "انتخاب کنید"}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-500 transition-transform group-open/size:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </summary>
                          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
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
                                  className={`py-2 px-3 text-sm border rounded-md transition-all ${
                                    selectedSize === option.title
                                      ? "border-gray-900 bg-gray-900 text-white"
                                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                                  }`}
                                >
                                  {option.title}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </details>
                      </div>
                    )
                )}

                {/* Color Selection Dropdown */}
                {color && (
                  <div className="space-y-2">
                    <details className="group/color">
                      <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-900 text-sm">
                          رنگ: {selectedColor || "انتخاب کنید"}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-500 transition-transform group-open/color:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
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
                              className={`py-2 px-3 text-sm border rounded-md transition-all ${
                                selectedColor === colorName
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700"
                              }`}
                            >
                              {colorName}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between py-1">
                    <span>دسته‌بندی:</span>
                    <span>
                      {selectedVariety?.category?.cat_name || "نامشخص"}
                    </span>
                  </div>
                  {selectedVariety?.show_unit && (
                    <div className="flex justify-between py-1">
                      <span>واحد:</span>
                      <span>{selectedVariety.show_unit}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressCreated={handleAddressCreated}
      />
    </div>
  );
}
