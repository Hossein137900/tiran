"use client";
import DynamicHero from "@/components/global/dynamicHero";
import ExampleImageGrid from "@/components/global/ExampleImageGrid";
import HeroSection from "@/components/global/herosection";
import ProductSlider from "@/components/global/productSlide";
import HomeBlogs from "@/components/global/showBlogs";
import { products } from "@/lib/product";

export default function Home() {
  const heroSlides = [
    {
      id: 1,
      image: "/assets/images/fashion/1.avif",
      title: "Welcome to Tiran",
      description:
        "Discover our innovative solutions designed to transform your business",
      ctaText: "Explore Now",
      ctaLink: "/services",
    },
    {
      id: 2,
      image: "/assets/images/fashion/2.avif",
      title: "Cutting-Edge Technology",
      description:
        "Leveraging the latest advancements to deliver exceptional results",
      ctaText: "Learn More",
      ctaLink: "/technology",
      // Optional video background
      // videoBackground: '/videos/tech-background.mp4',
    },
    {
      id: 3,
      image: "/assets/images/fashion/3.avif",
      title: "Expert Team",
      description:
        "Our professionals bring years of experience to every project",
      ctaText: "Meet Our Team",
      ctaLink: "/about",
    },
  ];

  return (
    <main>
      <HeroSection
        slides={heroSlides}
        autoPlayInterval={6000}
        height="100vh"
        showMuteControl={false} // Set to true if using video backgrounds
      />
      <ExampleImageGrid />
      <DynamicHero
        title="تحول در تجربه دیجیتال شما"
        description="در تیران، ما راهکارهای نوآورانه‌ای ایجاد می‌کنیم که برند شما را ارتقا داده و مخاطبان شما را جذب می‌کند. کشف کنید چگونه تخصص ما می‌تواند به شما در دستیابی به اهدافتان کمک کند."
        backgroundImage="/assets/images/contact.jpg"
        buttonText="شروع کنید"
        buttonLink="/contact"
        alignment="right"
      />
      <ProductSlider products={products} autoPlayInterval={4000}  />

      <HomeBlogs />

      {/* Rest of your page content */}
    </main>
  );
}
