"use client";
import DynamicHero from "@/components/global/dynamicHero";
import ExampleImageGrid from "@/components/global/ExampleImageGrid";
import ImageGrow from "@/components/global/imageGrow";
import ProductCarousel from "@/components/global/productSlider";
import HomeBlogs from "@/components/global/showBlogs";
import SewingAnimation from "@/components/static/sewingAnimation";
import { Product } from "@/types/type";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

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
  // const heroSlides = [
  //   {
  //     id: 1,
  //     image: "/assets/images/fashion/1.avif",
  //     title: "به تیران خوش آمدید",
  //     description:
  //       "راهکارهای نوآورانه ما را کشف کنید که برای تحول کسب و کار شما طراحی شده‌اند",
  //     ctaText: "اکنون کاوش کنید",
  //     ctaLink: "/services",
  //   },
  //   {
  //     id: 2,
  //     image: "/assets/images/fashion/2.avif",
  //     title: "فناوری پیشرفته",
  //     description: "بهره‌گیری از آخرین پیشرفت‌ها برای ارائه نتایج استثنایی",
  //     ctaText: "بیشتر بدانید",
  //     ctaLink: "/technology",
  //   },
  //   {
  //     id: 3,
  //     image: "/assets/images/fashion/3.avif",
  //     title: "تیم متخصص",
  //     description: "متخصصان ما سال‌ها تجربه را به هر پروژه می‌آورند",
  //     ctaText: "با تیم ما آشنا شوید",
  //     ctaLink: "/about",
  //   },
  // ];

  return (
    <main>
      {/* <div className="pt-64"></div> */}
      <div className="flex items-center justify-center flex-row-reverse h-screen">
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
            {/* <motion.button
              className="px-6 py-3 bg-black text-white rounded-full item-start ml-auto shadow-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
            </motion.button> */}
          </motion.div>
        </div>
        <SewingAnimation />
      </div>

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

      {/* <HeroSection
        slides={heroSlides}
        autoPlayInterval={6000}
        height="80vh"
        showMuteControl={false}
      /> */}
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
