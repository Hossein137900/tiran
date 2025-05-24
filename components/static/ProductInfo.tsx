"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
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
}

export default function ProductInfo({ product }: ProductInfoProps) {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 lg:gap-12">
        {/* Product Details */}
        <div dir="rtl" className="flex flex-col">
          {/* Product Header */}
          <div className="">
            <h1
              id="Heading1"
              role="heading"
              className="text-xl sm:text-2xl font-bold mb-2"
            >
              {product.fa_name}
            </h1>
            <p className="text-gray-600 border-b border-dashed pb-2 border-gray-400 text-sm leading-relaxed">
              {product.seo_description}
            </p>
          </div>

          {/* Price and Stock */}
          <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between border-l border-gray-400 border-dashed ">
            <div className="text-xl sm:text-2xl font-bold text-blue-900 my-2">
              {formattedPrice}
            </div>
            <span
              className={`inline-block  px-3 py-1  text-xs font-medium ${
                (selectedVariety?.store_stock ?? 0) > 0
                  ? " text-green-500"
                  : " text-red-500"
              }`}
            >
              {(selectedVariety?.store_stock ?? 0) > 0
                ? "موجود در انبار"
                : "ناموجود"}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-5 gap-y-2 border-t pr-2 border-r border-gray-400 border-dashed pt-4">
          {/* --- Dynamic Properties --- */}
          {Object.entries(propertiesByType).map(
            ([propertyType, options]) =>
              options.length > 0 && (
                <div
                  key={propertyType}
                  className="flex flex-col lg:flex-row lg:items-center lg:gap-6 w-full lg:w-[48%]"
                >
                  {/* Property Label */}
                  <div className="min-w-[12px] mb-2 lg:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {propertyType}
                    </h3>
                  </div>

                  {/* Property Dropdown */}
                  <div className="flex-1">
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => {
                          const selectedOption = options.find(
                            (opt) => opt.title === e.target.value
                          );
                          if (selectedOption) {
                            handlePropertyChange(
                              selectedOption.title,
                              selectedOption.id,
                              selectedOption.propertyId
                            );
                          }
                        }}
                        className="w-full px-4 py-3 bg-white border-dashed border border-gray-400 text-gray-700 font-medium focus:outline-none focus:border focus:border-dashed focus:border-gray-500 transition-all duration-200 appearance-none hover:border-gray-300"
                      >
                        <option value="">انتخاب {propertyType}</option>
                        {options.map((option) => (
                          <option key={option.id} value={option.title}>
                            {option.title}
                          </option>
                        ))}
                      </select>

                      {/* Dropdown Arrow */}
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}

          {/* --- Color Picker --- */}
          {color && (
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 w-full lg:w-[57%]">
              <div className="min-w-[30px] mb-2 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">رنگ</h3>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      const match = product?.varieties?.find(
                        (v) => v.getColor?.fa_name === e.target.value
                      );
                      if (match) setSelectedVariety(match);
                    }}
                    className="w-full px-4 py-3 bg-white border-dashed border border-gray-400 text-gray-700 font-medium focus:outline-none focus:border focus:border-dashed focus:border-gray-500 transition-all duration-200 appearance-none hover:border-gray-300"
                  >
                    <option value="">انتخاب رنگ</option>
                    {Array.from(
                      new Set(
                        product?.varieties
                          ?.filter((v) => v.getColor)
                          ?.map((v) => v.getColor!.fa_name)
                      )
                    ).map((colorName) => (
                      <option key={colorName} value={colorName}>
                        {colorName}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Arrow */}
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Quantity Controller --- */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 w-full lg:w-[48%]">
            <div className="min-w-[12px] mb-2 lg:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">تعداد</h3>
            </div>
            <div className="">
              <div className="flex items-center gap-4">
                {/* Buttons */}
                <div className="flex items-center bg-gray-50 border border-dashed border-gray-400  overflow-hidden">
                  <motion.button
                    onClick={decrementQuantity}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </motion.button>

                  <div className="w-16 h-12 flex items-center justify-center bg-white border-x-2 border-gray-200 font-semibold text-gray-800">
                    {quantity}
                  </div>

                  <motion.button
                    onClick={incrementQuantity}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 text-nowrap text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      (selectedVariety?.store_stock ?? 0) > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      (selectedVariety?.store_stock ?? 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(selectedVariety?.store_stock ?? 0) > 0
                      ? `${selectedVariety?.store_stock} عدد موجود`
                      : "ناموجود"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* button add to Cart */}

        <div className="mb-6">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
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
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium text-sm transition-all ${
                (selectedVariety?.store_stock ?? 0) > 0 && !checkoutLoading
                  ? "bg-black text-white hover:bg-black/80 shadow-sm"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <Check size={16} />
                  <span>اضافه شد</span>
                </>
              ) : checkoutLoading ? (
                <span>در حال پردازش...</span>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>افزودن به سبد خرید</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Additional Product Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-3">مشخصات محصول</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                دسته‌بندی:{" "}
                <span className="font-medium">
                  {selectedVariety?.category?.cat_name || "نامشخص"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                موجودی:{" "}
                <span
                  className={`font-medium ${
                    (selectedVariety?.store_stock ?? 0) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(selectedVariety?.store_stock ?? 0) > 0
                    ? "موجود"
                    : "ناموجود"}
                </span>
              </li>
              {selectedVariety?.show_unit && (
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                  واحد:{" "}
                  <span className="font-medium">
                    {selectedVariety.show_unit}
                  </span>
                </li>
              )}
            </ul>
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
