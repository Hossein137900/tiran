"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiHome } from "react-icons/hi";

// Persian translations for common routes
const routeTranslations: Record<string, string> = {
  "": "صفحه اصلی",
  shop: "فروشگاه",
  products: "محصولات",
  blog: "وبلاگ",
  about: "درباره ما",
  contact: "تماس با ما",
  cart: "سبد خرید",
  checkout: "تسویه حساب",
  account: "حساب کاربری",
  login: "ورود",
  register: "ثبت نام",
  admin: "مدیریت",
  help: "راهنما",
  faq: "سوالات متداول",
  search: "جستجو",
  categories: "دسته‌بندی‌ها",
  "mens-shirts": "پیراهن مردانه",
  jeans: "شلوار جین",
  suits: "کت و شلوار",
  sportswear: "لباس ورزشی",
  footwear: "کفش و کتانی",
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip rendering breadcrumbs on homepage or admin page
  if (!mounted || pathname === "/" || pathname === "/admin") return null;

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items with Persian translations
  const breadcrumbItems = [
    { path: "/", label: "صفحه اصلی", isHome: true },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const label = routeTranslations[segment] || segment;
      return { path, label, isHome: false };
    }),
  ];

  return (
    <div className="container mx-auto px-4">
      {" "}
      {/* Increased top margin to account for navbar height */}
      <motion.nav
        className="bg-white py-3 px-6 rounded-xl  relative overflow-hidden z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        dir="rtl"
      >
       

        <ol className="flex flex-wrap items-center text-sm relative z-10">
          <AnimatePresence>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <motion.li
                  key={item.path}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  {!isLast ? (
                    <>
                      <Link
                        href={item.path}
                        className="text-gray-600 hover:text-black transition-colors flex items-center group"
                      >
                        {item.isHome ? (
                          <motion.div
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="ml-1 bg-gray-100 p-1.5 rounded-md group-hover:bg-gray-200 transition-colors"
                          >
                            <HiHome className="text-lg" />
                          </motion.div>
                        ) : (
                          <motion.span
                            className="relative px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0 }}
                          >
                            {item.label}
                            <motion.span
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full"
                              initial={{ scaleX: 0, originX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.span>
                        )}
                      </Link>
                      <motion.div
                        className="mx-2 text-gray-300"
                        animate={{
                          x: [0, 2, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "mirror",
                        }}
                      >
                        <HiChevronLeft />
                      </motion.div>
                    </>
                  ) : (
                    <motion.span
                      className="font-medium text-black bg-gray-100 px-3 py-1 rounded-md"
                      whileHover={{ scale: 1.03 }}
                      initial={{ backgroundColor: "rgb(243 244 246)" }}
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(0,0,0,0)",
                          "0 0 5px rgba(0,0,0,0.1)",
                          "0 0 0 rgba(0,0,0,0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        {/* Animated line at the bottom */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-l from-transparent via-gray-400 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.nav>
    </div>
  );
};

export default Breadcrumbs;
