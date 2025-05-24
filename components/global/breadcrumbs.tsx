"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiHome } from "react-icons/hi";

// Persian translations for common routes
const routeTranslations: Record<string, string> = {
  "/": "صفحه اصلی",
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
  auth: "ورود و ثبت نام",
  admin: "مدیریت",
  corporateGifts: "هدایای سازمانی",
  giftCart: "کارت هدیه",
  help: "راهنما",
  categories: "دسته‌بندی‌ها",
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

  if (pathname === "/admin" || pathname === "/auth") {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      {" "}
      {/* Increased top margin to account for navbar height */}
      <motion.nav
        className="bg-white py-3 px-6 relative overflow-hidden z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        dir="rtl"
      >
        <ol className="flex flex-wrap mt-20 sm:mt-0 items-center text-sm relative z-10">
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
                            className="ml-1  p-1.5 transition-colors"
                          >
                            <HiHome className="text-lg" />
                          </motion.div>
                        ) : (
                          <motion.span
                            className="relative px-2 py-1 transition-colors"
                            whileHover={{ y: -1 }}
                            whileTap={{ y: 0 }}
                          >
                            {item.label}
                            <motion.span
                              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                              initial={{ scaleX: 0, originX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.span>
                        )}
                      </Link>
                      <motion.div className="mx-2 text-gray-300">
                        <HiChevronLeft />
                      </motion.div>
                    </>
                  ) : (
                    <motion.span
                      className="font-medium text-black px-3 py-1"
                      whileHover={{ scale: 1.03 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </motion.nav>
    </div>
  );
};

export default Breadcrumbs;
