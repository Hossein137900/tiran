"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface DynamicHeroProps {
  title?: string;
  description?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayColor?: string;
  textColor?: string;
  height?: string;
  alignment?: "left" | "center" | "right";
}

const DynamicHero = ({
  title = "به تیران خوش آمدید",
  description = "راه‌حل‌های نوآورانه‌ای را کشف کنید که تجربه دیجیتال شما را متحول می‌کند. ما آینده را می‌سازیم، یک پیکسل در هر زمان.",
  backgroundImage = "/images/hero-bg.jpg",
  buttonText = "اکنون کاوش کنید",
  buttonLink = "/services",
  overlayColor = "rgba(0, 0, 0, 0.5)",
  textColor = "white",
  height = "90vh",
  alignment = "right",
}: DynamicHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    //
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setParallaxOffset(scrollPosition * 0.4);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // alignwntment classes
  const alignmentClasses = {
    left: "items-end text-left",
    center: "items-center text-center",
    right: "items-start text-right",
  };

  return (
    <div
      className="relative mt-40 w-full overflow-hidden"
      style={{ height }}
      dir="rtl"
    >
      {/* background*/}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transition: "transform 0.1s ease-out",
          transform: `(${parallaxOffset})`,
        }}
      >
        <Image
          src={backgroundImage}
          alt="تصویر پس‌زمینه قهرمان"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      </div>

      {/* main*/}
      <div
        className={`relative z-10 flex flex-col justify-center h-full w-full px-6 md:px-12 lg:px-24 ${alignmentClasses[alignment]}`}
      >
        <div className="max-w-3xl flex flex-col" dir="rtl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: textColor }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl mr-auto ml-auto mb-8 "
            style={{ color: textColor }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href={buttonLink}>
              <button className="group relative overflow-hidden rounded-lg bg-transparent border px-8 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="relative z-10 font-medium">{buttonText}</span>
                <span className="absolute inset-0 bg-gray-50/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DynamicHero;
