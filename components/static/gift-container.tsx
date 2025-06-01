"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGift, FaClock, FaCreditCard } from "react-icons/fa";

const giftCards = [
  {
    id: 1,
    name: "کارت هدیه 500 هزارتومانی",
    price: "500,000 تومان",
    image: "/assets/images/giftcart/500.webp",
  },
  {
    id: 2,
    name: "کارت هدیه 1 میلیون تومانی",
    price: "1,000,000 تومان",
    image: "/assets/images/giftcart/1mil.webp",
  },
  {
    id: 3,
    name: "کارت هدیه 2 میلیون تومانی",
    price: "2,000,000 تومان",
    image: "/assets/images/giftcart/2mil.webp",
  },
  {
    id: 4,
    name: "کارت هدیه 5 میلیون تومانی",
    price: "5,000,000 تومان",
    image: "/assets/images/giftcart/5mil.webp",
  },
  {
    id: 5,
    name: "کارت هدیه 10 میلیون تومانی",
    price: "10,000,000 تومان",
    image: "/assets/images/giftcart/10mil.webp",
  },
  {
    id: 6,
    name: "کارت هدیه 20 میلیون تومانی",
    price: "20,000,000 تومان",
    image: "/assets/images/giftcart/20mil.webp",
  },
];
const giftFeatures = [
  {
    id: 1,
    icon: FaCreditCard,
    title: "هزینه‌های متنوع",
    description:
      "گیفت کارت‌ها در مبالغ مختلف موجود هستند تا شما بتوانید بهترین انتخاب را داشته باشید.",
  },
  {
    id: 2,
    icon: FaGift,
    title: "کاربرد آسان",
    description:
      "با استفاده از کد اختصاصی بر روی کارت، خرید از سایت به سادگی انجام می‌شود.",
  },
  {
    id: 3,
    icon: FaClock,
    title: "بدون تاریخ انقضا",
    description:
      "عزیزان شما هر زمان که بخواهند می‌توانند از گیفت کارت خود استفاده کنند.",
  },
];

const GiftCardsContainer = () => {
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
        staggerChildren: 0.2,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen py-16" dir="rtl">
      <div className="">
        {/* Hero Section */}
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="relative h-[420px] w-full  mb-12"
            variants={fadeIn}
          >
            <Image
              src="/assets/images/dcca15.jpg"
              alt="هدایای سازمانی تیران استایل"
              width={4000}
              height={4000}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold px-4 text-center">
                گیفت کارت‌های تیران استایل
              </h2>
            </div>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            variants={fadeIn}
          >
            گیفت کارت
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8"
            variants={fadeIn}
          >
            گیفت کارت‌های تیران استایل انتخابی بی‌نظیر برای کسانی است که به
            دنبال هدیه‌ای خاص و ارزشمند برای عزیزان خود هستند. این کارت‌ها نه
            تنها آزادی انتخاب از محصولات خاص با کیفیت برند ما را فراهم می‌کنند،
            بلکه تجربه‌ای فراتر از یک خرید معمولی داشته باشید؛ تجربه‌ای که به
            شما این حس را می‌دهد که زندگی را جور دیگر تجربه کنید.
          </motion.p>

          <motion.p
            className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed"
            variants={fadeIn}
          >
            با گیفت کارت‌های تیران استایل، شما می‌توانید به عزیزانتان این فرصت
            را بدهید که خودشان بهترین هدیه را انتخاب کنند. این کارت‌ها برای
            مناسبت‌های مختلف از جمله تولد، سالگرد، یا حتی به عنوان یک تشکر خاص،
            ایده‌آل هستند.
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h3
            className="text-2xl font-bold text-gray-800 my-8 text-center"
            variants={fadeIn}
          >
            ویژگی‌ها:
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-8"
            variants={staggerContainer}
          >
            {giftFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
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

          <motion.p
            className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed mt-12 text-center font-semibold"
            variants={fadeIn}
          >
            بهترین هدیه‌ای که می‌توانید به عزیزانتان بدهید، انتخابی است که به
            آنها آزادی و لذت انتخاب محصولات خاص و شیک را می‌دهد.
          </motion.p>
        </motion.div>

        {/* Gift Cards Grid */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h3
            className="text-3xl font-bold text-gray-800 mb-10 text-center"
            variants={fadeIn}
          >
            انتخاب گیفت کارت
          </motion.h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={staggerContainer}
          >
            {giftCards.map((card) => (
              <motion.div
                key={card.id}
                className="bg-white shadow-lg overflow-hidden"
                variants={cardAnimation}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={card.image} // These would be your gift card images
                    alt={card.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {card.name}
                  </h4>
                  <p className="text-gray-400 font-bold text-lg mb-4">
                    {card.price}
                  </p>
                  <motion.button
                    className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    افزودن به سبد خرید
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="bg-black text-white p-8  text-center max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h3 className="text-2xl font-bold mb-4">
            هدیه‌ای خاص برای افراد خاص
          </h3>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            با گیفت کارت‌های تیران استایل، لبخند را به چهره عزیزانتان هدیه دهید.
          </p>
          <motion.button
            className="bg-white text-gray-600 font-bold py-3 px-8 rounded-full text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            مشاهده همه گیفت کارت‌ها
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default GiftCardsContainer;
