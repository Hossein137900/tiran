"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
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

  // ProductTabs states

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

  // ProductTabs configuration


  return (
    <div
      className={`${
        layout === "desktop"
          ? "h-full max-w-none flex flex-col px-6 py-8"
          : "container mx-auto px-4 sm:px-6"
      } ${layout === "desktop" ? "" : "mt-20 sm:pb-8"}`}
    >
      {/* Product Header */}
      <div className="space-y-2">
        {/* Header Section */}
        <div className="flex items-center justify-center">
           <h1
            className={`font-light tracking-wide text-gray-900 mb-3 ${
              layout === "desktop" ? "text-2xl lg:text-3xl" : "text-2xl"
            }`}
          >
            {product.fa_name}
          </h1>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-center">
          <div
            className={`font-medium text-gray-900 ${
              layout === "desktop" ? "text-lg" : "text-xl"
            }`}
          >
            {formattedPrice}
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
              (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 1 } : {}
            }
            whileTap={
              (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 0.99 } : {}
            }
            className={`w-full py-3 flex items-center justify-center gap-3 border border-dashed cursor-pointer font-medium duration-300 transition-all ${
              (selectedVariety?.store_stock ?? 0) > 0 && !checkoutLoading
                ? " text-black hover:border-gray-300"
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
        <div className="pt-4">
          <div className="border-b border-gray-200 border-dashed pb-2 mb-1">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2">
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

              <div className="mt-6 space-y-6">
                {/* Product Options */}
                <div className="space-y-5">
                  {/* Size Selection Dropdown */}
                  {Object.entries(propertiesByType).map(
                    ([propertyType, options]) =>
                      options.length > 0 && (
                        <div key={propertyType} className="space-y-3">
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
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
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
                    <div className="space-y-3">
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
                        <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
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
                <div className="pt-5 border-t border-gray-100 border-dashed">
                  <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex justify-between py-2">
                      <span>دسته‌بندی:</span>
                      <span className="font-medium">
                        {selectedVariety?.category?.cat_name || "نامشخص"}
                      </span>
                    </div>
                    {selectedVariety?.show_unit && (
                      <div className="flex justify-between py-2">
                        <span>واحد:</span>
                        <span className="font-medium">
                          {selectedVariety.show_unit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Integrated ProductTabs Section - Dropdown Style */}
        <div className="">
          {/* Description Tab */}
          <div className="border-b border-gray-200 border-dashed pb-3 mb-1">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer pt-2">
                <h3 className="text-sm font-medium text-gray-900">
                  توضیحات محصول
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

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5"
              >
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed text-sm font-light">
                    {product.seo_description || "توضیحات محصول در دسترس نیست."}
                  </div>
                </div>
              </motion.div>
            </details>
          </div>

          {/* Details Tab */}
          <div className="border-b border-gray-200 border-dashed pb-2 mb-1">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer pt-2 pb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  مشخصات تفصیلی
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

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5"
              >
                <div className="space-y-6">
                  {/* Product Specifications */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm">
                      مشخصات محصول
                    </h4>
                    {selectedVariety && (
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 text-xs text-gray-600">
                          <span>دسته بندی:</span>
                          <span className="font-medium">
                            {selectedVariety.category.cat_name}
                          </span>
                        </div>

                        {selectedVariety.getColor && (
                          <div className="flex justify-between py-2 text-xs text-gray-600">
                            <span>رنگ:</span>
                            <span className="font-medium">
                              {selectedVariety.getColor.fa_name}
                            </span>
                          </div>
                        )}

                        {selectedVariety.showProperties &&
                          selectedVariety.showProperties.length > 0 && (
                            <div className="flex justify-between py-2 text-xs text-gray-600">
                              <span>سایز:</span>
                              <span className="font-medium">
                                {selectedVariety.showProperties[0].child.title}
                              </span>
                            </div>
                          )}

                        {selectedVariety.show_unit && (
                          <div className="flex justify-between py-2 text-xs text-gray-600">
                            <span>واحد:</span>
                            <span className="font-medium">
                              {selectedVariety.show_unit}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between py-2 text-xs text-gray-600">
                          <span>موجودی:</span>
                          <span
                            className={`font-medium ${
                              selectedVariety.store_stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedVariety.store_stock > 0
                              ? `${selectedVariety.store_stock} عدد موجود`
                              : "ناموجود"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Size Guide */}
                  <div className="pt-5 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 text-sm mb-4">
                      راهنمای سایز
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">سایز کوچک:</span>
                          <span className="font-medium">36-38</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">سایز متوسط:</span>
                          <span className="font-medium">40-42</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">سایز بزرگ:</span>
                          <span className="font-medium">44-46</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </details>
          </div>

          {/* Shipping Tab */}
          <div className="border-b border-gray-200 border-dashed pb-3 mb-1">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2">
                <h3 className="text-sm font-medium text-gray-900">
                  حمل و نقل و برگشت
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

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5"
              >
                <div className="space-y-6">
                  {/* Shipping Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 text-sm">
                      اطلاعات ارسال
                    </h4>
                    <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                      <p>
                        ما به سراسر کشور از طریق شرکای مطمئن خود ارسال می‌کنیم.
                        ارسال استاندارد بین ۳ تا ۷ روز کاری بسته به موقعیت شما
                        طول می‌کشد.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-3 text-gray-900">
                          هزینه ارسال:
                        </h5>
                        <ul className="space-y-2">
                          <li>
                            • ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان
                          </li>
                          <li>• ارسال عادی: ۳۰,۰۰۰ تومان</li>
                          <li>• ارسال اکسپرس: ۵۰,۰۰۰ تومان</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </details>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="space-y-4 pt-6">
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
