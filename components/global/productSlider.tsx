import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/type";
import { ArrowLeft } from "lucide-react";

interface ProductSliderProps {
  products: Product[];
}

const ProductCarousel = ({ products }: ProductSliderProps) => {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [products]);

  if (!products || products.length === 0) {
    return (
      <div className="p-4 text-center">محصولاتی برای نمایش وجود ندارد</div>
    );
  }

  console.log(products, "products in carousel");

  return (
    <div className="my-8" dir="rtl">
      <div className="flex flex-row justify-between items-center my-7 ">
        <div>
          <h2 className="md:text-3xl font-bold">آخرین محصولات</h2>
        </div>

        <div className="flex justify-center">
          <Link href="/shop">
            <button className="bg-transparent text-nowrap text-sm text-black border border-gray-500 px-1 py-1 md:px-8 md:py-3 rounded-lg md:text-lg font-medium transition-all duration-300 flex items-center gap-2 group">
              مشاهده همه محصولات
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
      <motion.div
        ref={carousel}
        className="overflow-hidden cursor-grab"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="min-w-[250px] md:min-w-[300px] p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/shop/${product.slug}`}>
                <div className="bg-white rounded-sm overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100">
                    {!product.main_image_id ? (
                      <Image
                        src={"/assets/images/fashion/4.avif"}
                        alt={product.page_title || "ef"}
                        fill
                        className="object-cover"
                      />
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
                    {/* <p className="text-sm text-gray-600 mb-2">
                      {product.en_name}
                    </p> */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-auto">
                      {product.seo_description}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm">
                        {product.store_stock > 0 ? (
                          <span className="text-green-600">موجود</span>
                        ) : (
                          <span className="text-red-600">ناموجود</span>
                        )}
                      </span>
                      <span className="text-sm text-black font-bold">
                        {product.variety?.price_final || 5555000} تومان
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductCarousel;
