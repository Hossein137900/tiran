"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  navItems,
  categoryItemVariants,
  categoryVariants,
  itemVariants,
  logoVariants,
  mobileMenuVariants,
} from "../../lib/navbarData";

import {
  RiShoppingBag3Line,
  RiUser3Line,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightSLine,
  RiDashboardLine,
  RiLoginCircleLine,
} from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { Category, UserProfile } from "@/types/type";
import Breadcrumbs from "../global/breadcrumbs";

const Navbar = () => {
  const { totalItems } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [expandedCategory, setExpandedCategory] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const prevScrollY = useRef(0);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // Set isMounted to true after component mounts to ensure client-side rendering
  useEffect(() => {
    setIsMounted(true);
    setActiveItem(pathname);
  }, [pathname]);

  const fetchCategories = async () => {
    const data = await fetch("/api/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.ok) {
      console.error("Failed to fetch categories data");
      return;
    }
    const categoriesData = await data.json();
    setCategories(categoriesData.data);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (window.scrollY > 10) {
        navbar?.classList.add("shadow-md");
      } else {
        navbar?.classList.remove("shadow-md");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (
        (prevScrollY.current > currentScrollY || currentScrollY < 100,
        isNavbarVisible)
      ) {
        setIsNavbarVisible(true);
      }
      // Hide navbar when scrolling down significantly
      else if (
        currentScrollY > 100 &&
        currentScrollY - prevScrollY.current > 10
      ) {
        setIsNavbarVisible(false);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        // Verify token by making a request to the user API
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success && data.data) {
          setIsLoggedIn(true);
          setUserProfile(data.data);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (pathname === "/admin" || pathname === "/auth") {
    return null;
  }

  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 bg-white transition-all duration-500 flex flex-col  text-black`}
      dir="rtl"
    >
      <div className="max-w-screen">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-2">
          {" "}
          {/* Right side - Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative px-1"
              >
                <Link href={item.href}>
                  <motion.span
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                      activeItem === item.href
                        ? "text-black font-bold"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    {activeItem === item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-lg"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    )}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="flex items-center justify-center"
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={70}
                  height={70}
                  className="h-8 w-auto"
                />
              </motion.div>
            </Link>
          </div>
          {/* Left side - Cart and Login */}
          <div className="flex gap-3 items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hidden md:block rounded-full hover:bg-gray-100 transition-colors duration-300"
                >
                  <RiShoppingBag3Line className="h-6 w-6" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/auth">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hidden md:block hover:bg-gray-100 transition-colors duration-300"
                >
                  <RiUser3Line className="h-6 w-6" />
                </motion.div>
              </Link>
            </motion.div>
            <div className="relative group">
              {isLoggedIn ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" hidden md:flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <span className="ml-1 text-sm font-medium">
                      {userProfile?.user.username}
                    </span>
                  </motion.button>

                  {/* Dropdown menu */}
                  <div className="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link href="/dashboard">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-right"
                      >
                        <RiDashboardLine className="ml-2" />
                        داشبورد کاربری
                      </motion.button>
                    </Link>
                  </div>
                </>
              ) : (
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden  md:flex  items-center  text-gray-700 hover:text-gray-900"
                  >
                    <RiLoginCircleLine className="ml-1" />
                    <span className="text-sm font-medium">ورود / ثبت‌نام</span>
                  </motion.button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-300"
                aria-expanded="false"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiCloseLine
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RiMenuLine
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Row - Desktop */}
      <motion.div
        className="hidden md:block relative bg-white"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-center space-x-1 space-x-reverse py-2"
            variants={desktopCategoryRowVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index: number) => (
              <motion.div
                key={category.id}
                variants={desktopCategoryItemVariants}
                whileTap={{ scale: 0.95 }}
                className="px-1 flex-shrink-0 relative group"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(
                    category.cat_name
                  )}`}
                >
                  <span
                    className={`block px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 border-b-2 ${
                      hoveredCategory === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    {category.cat_name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div> */}

        {/* Mega Menu Component */}
        {/* <MegaMenu
          categories={categories}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        /> */}
        <Breadcrumbs />
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-white/80 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-5 space-y-1">
              {/* Categories section in mobile menu */}
              <motion.div variants={itemVariants} className="mb-2">
                <motion.button
                  onClick={() => setExpandedCategory(!expandedCategory)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-black hover:bg-gray-50"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>دسته‌بندی‌ها</span>
                  <motion.div
                    animate={{ rotate: expandedCategory ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RiArrowRightSLine className="h-5 -rotate-90 w-5" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedCategory && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={categoryVariants}
                      className="overflow-hidden bg-gray-50/20 rounded-lg mt-1 mr-4 border-r-2 border-gray-200"
                    >
                      <div className="py-1">
                        {categories.map((category, index) => (
                          <div key={category.id}>
                            <motion.div
                              variants={categoryItemVariants}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between"
                            >
                              <Link
                                href={`/shop?category=${encodeURIComponent(
                                  category.cat_name
                                )}`}
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                <span className="block px-4 py-2 text-sm font-medium text-black hover:text-black">
                                  {category.cat_name}
                                </span>
                              </Link>
                              {category.children &&
                                category.children.length > 0 && (
                                  <motion.button
                                    onClick={() => {
                                      if (hoveredCategory === index) {
                                        setHoveredCategory(null);
                                      } else {
                                        setHoveredCategory(index);
                                      }
                                    }}
                                    className="px-4 py-2"
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <motion.div
                                      animate={{
                                        rotate:
                                          hoveredCategory === index ? 270 : 90,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <RiArrowRightSLine className="h-4 text-black w-4" />
                                    </motion.div>
                                  </motion.button>
                                )}
                            </motion.div>

                            <AnimatePresence>
                              {hoveredCategory === index &&
                                category.children &&
                                category.children.length > 0 && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden bg-gray-50/10 mr-6 border-r border-gray-200"
                                  >
                                    {category.children.map((subcategory) => (
                                      <motion.div
                                        key={subcategory.id}
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <Link
                                          href={`/category/${subcategory.slug}`}
                                        >
                                          <span className="block px-4 py-1.5 text-xs font-medium text-gray-800 hover:text-black">
                                            {subcategory.cat_name}
                                          </span>
                                        </Link>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Regular nav items in mobile menu */}
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="block"
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(!isOpen)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        activeItem === item.href
                          ? "text-black font-bold bg-gray-50"
                          : "text-black"
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200"
              >
                <Link href="/auth" onClick={() => setIsOpen(!isOpen)}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-black"
                  >
                    <RiUser3Line className="ml-2 h-5 w-5" />
                    {/* ورود / ثبت نام */}
                  </motion.div>
                </Link>

                <Link href="/cart" onClick={() => setIsOpen(!isOpen)}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-black"
                  >
                    <RiShoppingBag3Line className="ml-2 h-5 w-5" />
                    سبد خرید
                    <span className="mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </nav>
  );
};
export default Navbar;
