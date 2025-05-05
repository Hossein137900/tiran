"use client";
import { useState, useEffect } from "react";
import ProductGrid from "@/components/static/ProductGrid";
import { AnimatePresence } from "framer-motion";
import ShopIntro from "@/components/static/shopIntro";

export default function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);

  useEffect(() => {
    // Check if user has visited the shop page before in this session
    const hasVisited = localStorage.getItem("hasVisitedShop");
    if (hasVisited) {
      setShowIntro(true);
      setHasVisitedBefore(true);
    } else {
      // Set flag in session storage
      localStorage.setItem("hasVisitedShop", "true");
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && !hasVisitedBefore && (
          <ShopIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-12" dir="rtl">
        <div className="my-28 text-center">
          <h1 className="text-4xl font-bold mb-3">فروشگاه</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            محصولات ما را که با دقت طراحی شده اند برای کیفیت و طراحی کشف کنید
            سبک ماوس را روی تصاویر نگه دارید تا محصولات را از زوایای مختلف
            ببینید.
          </p>
        </div>

        <ProductGrid />
      </main>
    </>
  );
}
