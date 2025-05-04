"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product } from "@/types/type";
import { toast } from "react-toastify";

// Define missing types
interface PropertyChild {
  id: number;
  title: string;
}

interface PropertyShow {
  id: number;
  title: string;
  child: PropertyChild;
}

interface Color {
  id?: number;
  fa_name: string;
  code?: string;
}

interface Category {
  id: number;
  cat_name: string;
}

interface Variety {
  id: number;
  price_main: number;
  store_stock: number;
  showProperties?: PropertyShow[];
  getColor?: Color;
  category?: Category;
  show_unit?: string;
}

// Extend Product interface to include varieties
interface ExtendedProduct extends Product {
  varieties: Variety[];
}

interface ProductInfoProps {
  product: ExtendedProduct;
}

interface SizeOption {
  id: number;
  title: string;
  propertyId: number;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<Variety | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  console.log(product , "product");

  // Initialize with the first variety if available
  useEffect(() => {
    if (product?.varieties && product.varieties.length > 0) {
      setSelectedVariety(product.varieties[0]);

      // Set initial size if available
      if (product.varieties[0].showProperties) {
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
  const propertiesByType: Record<string, SizeOption[]> = {};

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

  // Create a flat array of all properties for backward compatibility
  // const allProperties: SizeOption[] = Object.values(propertiesByType).flat();


  // Get color information
  const color = selectedVariety?.getColor || null;

  const handlePropertyChange = (
    propertyTitle: string,
    propertyId: number,
    propertyTypeId: number
  ) => {
    // Update the selected property
    setSelectedSize(propertyTitle); // You might want to rename this state variable

    // Find variety that matches this property
    const matchingVariety = product.varieties.find((variety) =>
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

  const handleAddToCart = () => {
    if (!selectedVariety || selectedVariety.store_stock <= 0) {
      toast.error("این محصول در انبار موجود نیست", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Show adding animation
    setIsAddingToCart(true);

    // Add item to cart
    addItem({
      id: selectedVariety.id.toString(),
      name: product.fa_name,
      price: selectedVariety.price_main,
      quantity: quantity,
      image: product?.main_image_id || null,
      size: selectedSize,
      color: selectedColor,
    });

    toast.info("محصول به سبد خرید اضافه شد", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
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
          <h1 className="text-3xl font-bold mb-2">{product.fa_name}</h1>
          <p className="text-gray-600 mb-4">{product.seo_description}</p>

          <div className="text-2xl font-bold mb-6">{formattedPrice}</div>

          {/* Size Selection */}
          {/* Properties Selection */}
          {Object.entries(propertiesByType).map(
            ([propertyType, options]) =>
              options.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 justify-start items-center" key={propertyType}>
                  <h3 className="text-lg font-medium">{propertyType} : </h3>
                  <div className="">
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
                        className={`px-4 py-2  rounded-md ${
                          selectedSize === option.title
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
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
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">رنگ</h3>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.code || "#000000" }}
                />
                <span>{color.fa_name}</span>
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

          {/* Stock Status */}
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
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

          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <motion.button
              disabled={!selectedVariety || selectedVariety.store_stock <= 0}
              onClick={handleAddToCart}
              whileHover={
                (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 1.05 } : {}
              }
              whileTap={
                (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 0.95 } : {}
              }
              className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center gap-2 ${
                (selectedVariety?.store_stock ?? 0) > 0
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
                دسته‌بندی: {selectedVariety?.category?.cat_name || "نامشخص"}
              </li>
              <li>
                موجودی:{" "}
                {(selectedVariety?.store_stock ?? 0) > 0 ? "موجود" : "ناموجود"}
              </li>
              {selectedVariety?.show_unit && (
                <li>واحد: {selectedVariety.show_unit}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
