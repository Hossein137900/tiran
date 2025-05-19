"use client";
import { useState } from "react";
import ProductGrid from "@/components/static/ProductGrid";
import { AnimatePresence } from "framer-motion";
import ShopIntro from "@/components/static/shopIntro";

export default function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <ShopIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 pt-12 mb-12" dir="rtl">
        <div className="mt-36 text-center">
          {!showIntro && (
            <>
              <h1 className="text-4xl font-bold mb-3">فروشگاه</h1>
              <p className="text-gray-600 max-w-4xl mx-auto">
                محصولات ما را که با دقت طراحی شده اند برای کیفیت و طراحی کشف کنید
                سبک ماوس را روی تصاویر نگه دارید تا محصولات را از زوایای مختلف
                ببینید.
              </p>
            </>
          )}
        
        </div>

        <ProductGrid />
      </main>
    </>
  );
}
