import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";
import { ArrowLeft } from "lucide-react";

interface ProductSliderProps {
  products: Product[];
}

const ProductCarousel = ({ products }: ProductSliderProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) {
    return (
      <div className="p-4 text-black text-center">
        محصولاتی برای نمایش وجود ندارد
      </div>
    );
  }

  // Get the last 6 products from the array
  const lastSixProducts =
    products.length <= 6 ? products : products.slice(products.length - 6);

  return (
    <div className="my-8 relative mx-4 sm:mx-0" dir="rtl">
      <div className="flex flex-row justify-between items-center my-7">
        <div>
          <h2 className="md:text-3xl font-bold">آخرین محصولات</h2>
        </div>

        <div className="flex justify-center">
          <Link href="/shop">
            <button className="bg-transparent text-nowrap border-b text-sm text-black py-1 md:px-8 md:py-3 md:text-lg font-medium transition-all duration-300 flex items-center gap-2 group">
              مشاهده همه محصولات
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </Link>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollContainer}
        className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-4">
          {lastSixProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="min-w-[250px] md:min-w-[300px] hover:shadow-lg  flex-shrink-0 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Link href={`/shop/${product.slug}`}>
                <motion.div
                  className="bg-white overflow-hidden h-full flex flex-col  transition-all duration-300"
                  whileHover={{
                    y: -5,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-96 w-[350px] bg-gray-100 overflow-hidden">
                    {product.images ? (
                      <motion.div transition={{ duration: 0.3 }}>
                        <Image
                          src={product.images[0].src}
                          alt={product.page_title}
                          fill
                          className="object-cover aspect-[9/9]"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">عکس موجود نیست</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2">
                      {product.fa_name}
                    </h3>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm">
                        {product.store_stock > 0 ? (
                          <span className="text-green-600">موجود</span>
                        ) : (
                          <span className="text-red-600">ناموجود</span>
                        )}
                      </span>
                      <span className="text-sm text-black font-bold">
                        {product.variety &&
                        typeof product.variety.price_main === "number"
                          ? product.variety.price_main.toLocaleString("fa-IR") +
                            " تومان"
                          : "قیمت نامشخص"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
