"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/static/ProductGrid";
import { AnimatePresence } from "framer-motion";
import ShopIntro from "@/components/static/shopIntro";

export default function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get category parameter from URL
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setShowIntro(false); // Skip intro if coming from category filter
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    // Update URL without filter parameters
    window.history.pushState({}, "", "/shop");
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && !selectedCategory && (
          <ShopIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-12 mb-12" dir="rtl">
        <div className="mt-36 text-center">
          {(!showIntro || selectedCategory) && (
            <>
              <h1 className="text-4xl font-bold mb-3">
                {selectedCategory ? `فروشگاه - ${selectedCategory}` : "فروشگاه"}
              </h1>
              <p className="text-gray-600 max-w-4xl mx-auto">
                {selectedCategory
                  ? `محصولات دسته‌بندی ${selectedCategory} را مشاهده کنید`
                  : "محصولات ما را که با دقت طراحی شده اند برای کیفیت و طراحی کشف کنید سبک ماوس را روی تصاویر نگه دارید تا محصولات را از زوایای مختلف ببینید."}
              </p>

              {/* Filter indicator and clear button */}
              {selectedCategory && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    فیلتر: {selectedCategory}
                  </div>
                  <button
                    onClick={clearFilter}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    حذف فیلتر
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ProductGrid categoryFilter={selectedCategory} />
      </main>
    </>
  );
}
