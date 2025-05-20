"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
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
  const [isFavorite, setIsFavorite] = useState(false);
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
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Details */}
        <div dir="rtl" className="flex flex-col">
          {/* Product Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              {product.fa_name}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {product.seo_description}
            </p>
          </div>

          {/* Price and Stock */}
          <div className="mb-8">
            <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
              {formattedPrice}
            </div>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                (selectedVariety?.store_stock ?? 0) > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {(selectedVariety?.store_stock ?? 0) > 0
                ? "موجود در انبار"
                : "ناموجود"}
            </span>
          </div>

          {/* Properties Selection */}
          {Object.entries(propertiesByType).map(
            ([propertyType, options]) =>
              options.length > 0 && (
                <div key={propertyType} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {propertyType}:
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handlePropertyChange(
                            option.title,
                            option.id,
                            option.propertyId
                          )
                        }
                        className={`px-5 py-2.5 text-sm border-2 rounded-lg transition-all duration-200 ${
                          selectedSize === option.title
                            ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {option.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
          )}

          {/* Color Display */}
          {color && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">رنگ</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.code || "#000000" }}
                />
                <span className="text-base">{color.fa_name}</span>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">تعداد</h3>
            <div className="flex items-center w-fit border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={decrementQuantity}
                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-lg"
                aria-label="کاهش تعداد"
              >
                -
              </button>
              <div className="w-16 h-12 flex items-center justify-center bg-white text-center font-medium">
                {quantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-lg"
                aria-label="افزایش تعداد"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-10">
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
              className={`flex-1 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-medium text-base transition-all ${
                (selectedVariety?.store_stock ?? 0) > 0 && !checkoutLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isAddingToCart ? (
                <>
                  <Check size={20} />
                  <span>اضافه شد</span>
                </>
              ) : checkoutLoading ? (
                <span>در حال پردازش...</span>
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
              className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label={
                isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"
              }
            >
              <Heart
                size={24}
                className={
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }
              />
            </motion.button>
          </div>

          {/* Additional Product Info */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold mb-5">مشخصات محصول</h3>
            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
                دسته‌بندی:{" "}
                <span className="font-medium">
                  {selectedVariety?.category?.cat_name || "نامشخص"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
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
                  <span className="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>
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
