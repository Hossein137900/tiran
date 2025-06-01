"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGift, FaAward, FaCrown, FaRegHandshake } from "react-icons/fa";
import Link from "next/link";

const corporateFeatures = [
  {
    id: 1,
    icon: FaGift,
    title: "شخصی‌سازی",
    description:
      "امکان درج لوگو یا پیام شخصی شما بر روی محصولات، برای ایجاد هدایایی منحصربه‌فرد.",
  },
  {
    id: 2,
    icon: FaCrown,
    title: "کیفیت برتر",
    description:
      "تمامی محصولات ما از بهترین مواد و با دقت بالا ساخته شده‌اند تا ارزش واقعی هدیه را نشان دهند.",
  },
  {
    id: 3,
    icon: FaAward,
    title: "مجموعه‌ای متنوع",
    description:
      "از اکسسوری‌های مد روز تا محصولات لوکس، ما گزینه‌های متنوعی را برای نیازهای مختلف سازمانی ارائه می‌دهیم.",
  },
];

const CorporateGiftsContainer = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Split text for letter animation

  return (
    <div className="min-h-screen  py-16 px-4 sm:px-6 lg:px-8 " dir="rtl">
      <div className="max-w-7xl mt-10 mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h2
            className="text-xl md:text-3xl font-bold text-gray-800 mb-2"
            variants={fadeIn}
          >
            هدایای سازمانی
          </motion.h2>

          <motion.div
            className="flex justify-center space-x-1 mb-8 text-4xl md:text-6xl font-extrabold text-indigo-600"
            variants={staggerContainer}
          >
            تیـــــران استایل
          </motion.div>

          <motion.div
            className="relative h-96 w-full overflow-hidden mb-12"
            variants={fadeIn}
          >
            <Image
              src="/assets/images/fashion/4.avif"
              alt="هدایای سازمانی تیران استایل"
              width={4000}
              height={4000}
              objectFit="cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h1 className="text-white text-4xl md:text-6xl font-bold px-4 text-center">
                هدایای سازمانی تیران استایل
              </h1>
            </div>
          </motion.div>

          <motion.p
            className="text-lg text-gray-700 text-center"
            variants={fadeIn}
          >
            هدایای سازمانی یکی از بهترین راه‌ها برای تقویت روابط با کارکنان،
            شرکا و مشتریان است. در تیران استایل، ما مجموعه‌ای از هدایای خاص و
            منحصر به فرد را برای سازمان‌ها فراهم کرده‌ایم تا به شما کمک کنیم
            قدردانی خود را با بهترین کیفیت و سبک به نمایش بگذارید.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.p
            className="text-lg text-gray-700 mb-8 leading-relaxed"
            variants={fadeIn}
          >
            هدایای سازمانی ما با طراحی‌های شیک و جذاب، نمادی از احترام و توجه
            شما به جزئیات هستند. چه برای تقدیر از کارکنان برتر، چه به عنوان
            هدایای تبلیغاتی برای مشتریان ویژه، محصولات ما می‌توانند تاثیرگذاری
            طولانی‌مدت داشته باشند.
          </motion.p>

          <motion.h3
            className="text-2xl font-bold text-gray-800 mb-6 text-center"
            variants={fadeIn}
          >
            مزایای هدایای سازمانی تیران استایل:
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {corporateFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  className="bg-white p-6 shadow-md flex flex-col items-center text-center"
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <IconComponent className="text-5xl text-gray-600 mb-4" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="bg-black text-white p-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <FaRegHandshake className="text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">با ما در ارتباط باشید</h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            برای کسب اطلاعات بیشتر و سفارش هدایای سازمانی اختصاصی، با تیم ما
            تماس بگیرید. اجازه دهید تا با هدایای تیران استایل، نام شما در ذهن‌ها
            ماندگار شود.
          </p>
          <Link
            className="bg-white text-gray-600 font-bold py-3 px-8 rounded-full text-lg"
            href="/contact"
            passHref
          >
            تماس با ما
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CorporateGiftsContainer;
