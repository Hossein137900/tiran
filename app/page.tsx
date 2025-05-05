"use client";
import DynamicHero from "@/components/global/dynamicHero";
import ExampleImageGrid from "@/components/global/ExampleImageGrid";
import HeroSection from "@/components/global/herosection";
import ImageGrow from "@/components/global/imageGrow";
import ProductSlider from "@/components/global/productSlide";
import ProductCarousel from "@/components/global/productSlider";
import HomeBlogs from "@/components/global/showBlogs";
import SewingAnimation from "@/components/static/sewingAnimation";
import { Product } from "@/types/type";
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
  const heroSlides = [
    {
      id: 1,
      image: "/assets/images/fashion/1.avif",
      title: "به تیران خوش آمدید",
      description:
        "راهکارهای نوآورانه ما را کشف کنید که برای تحول کسب و کار شما طراحی شده‌اند",
      ctaText: "اکنون کاوش کنید",
      ctaLink: "/services",
    },
    {
      id: 2,
      image: "/assets/images/fashion/2.avif",
      title: "فناوری پیشرفته",
      description: "بهره‌گیری از آخرین پیشرفت‌ها برای ارائه نتایج استثنایی",
      ctaText: "بیشتر بدانید",
      ctaLink: "/technology",
    },
    {
      id: 3,
      image: "/assets/images/fashion/3.avif",
      title: "تیم متخصص",
      description: "متخصصان ما سال‌ها تجربه را به هر پروژه می‌آورند",
      ctaText: "با تیم ما آشنا شوید",
      ctaLink: "/about",
    },
  ];

  return (
    <main>
      <div className="h-screen bg-white"></div>
      <SewingAnimation />


      <ImageGrow
        imageSrc="/assets/images/imagegrow.avif"
        title="Experience Luxury"
        description="Discover our exclusive collection designed for those who appreciate the extraordinary."
        buttonText="Explore Collection"
        buttonLink="/collection"
        overlayColor="rgba(0, 0, 0, 0.3)"
        height="100vh"
      />
      <ExampleImageGrid />
      <ImageGrow
        imageSrc="/assets/images/imagegrow.avif"
        title="Experience Luxury"
        description="Discover our exclusive collection designed for those who appreciate the extraordinary."
        buttonText="Explore Collection"
        buttonLink="/collection"
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
        {/* <ProductSlider products={products} autoPlayInterval={4000} /> */}
        <ProductCarousel products={products} />
        <HomeBlogs />
      </div>
    </main>
  );
}
