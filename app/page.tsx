"use client";
import { useEffect, useState } from "react";
import DynamicHero from "@/components/global/dynamicHero";
import ExampleImageGrid from "@/components/global/ExampleImageGrid";
import ImageGrow from "@/components/global/imageGrow";
import ProductCarousel from "@/components/global/productSlider";
import HomeBlogs from "@/components/global/showBlogs";
import SewingAnimation from "@/components/static/sewingAnimation";
import ScrollMediaShowcase from "@/components/static/ui/scrollMediaShowcase";
import { Product } from "@/types/type";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showPostShowcase, setShowPostShowcase] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/shop", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setProducts(data.data.items);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for showcase completion

  return (
    <main className="relative my-20">
      {/* Hero Section */}
      {/* <div className="flex items-center justify-center flex-row-reverse h-screen">
        <div className="md:w-1/3 px-8">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.5,
            }}
            className="text-center md:text-left border-b-2 border-dotted"
          >
            <motion.h2
              className="text-xl md:text-4xl text-nowrap font-bold text-black mb-4 text-right"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              تیران استایل{" "}
            </motion.h2>
            <motion.p
              className="text-xs md:text-lg text-nowrap text-gray-700 mb-6 text-right mt-2 "
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              لذت دائمی استفاده از یک محصول
            </motion.p>
          </motion.div>
        </div>
        <SewingAnimation />
      </div> */}

      <ImageGrow
        imageSrc="/assets/images/imagegrow.avif"
        title="تجربه خوب بودن با تیران"
        description=" اولین نفری باش که تو اطرافت به خودش اهمیت میده "
        buttonText="فروشگاه"
        buttonLink="/shop"
        overlayColor="rgba(0, 0, 0, 0.3)"
        height="100vh"
      />

      <ExampleImageGrid />

      <ImageGrow
        imageSrc="/assets/images/imagegrr.webp"
        title="تجربه لاکچری تیران"
        description=" با محصولات تیران به جمع شیک پوشان و شیک دوستان اضافه شو "
        buttonText="مشاهده فروشگاه"
        buttonLink="/shop"
        overlayColor="rgba(0, 0, 0, 0.3)"
        height="100vh"
      />

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <DynamicHero
          title="تحول در تجربه دیجیتال شما"
          description="در تیران، ما راهکارهای نوآورانه‌ای ایجاد می‌کنیم که برند شما را ارتقا داده و مخاطبان شما را جذب می‌کند. کشف کنید چگونه تخصص ما می‌تواند به شما در دستیابی به اهدافتان کمک کند."
          backgroundImage="/assets/images/contact.jpg"
          buttonText="شروع کنید"
          buttonLink="/contact"
          alignment="right"
        />
        <ProductCarousel products={products} />
        <HomeBlogs />
      </div>
    </main>
  );
}
