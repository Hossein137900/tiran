"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiShoppingBag3Line,
  RiUser3Line,
  RiMenuLine,
  RiCloseLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");
  const [expandedCategory, setExpandedCategory] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const prevScrollY = useRef(0);
  const notVisible = usePathname()
  console.log(setActiveItem)
  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (window.scrollY > 10) {
        navbar?.classList.add("shadow-lg");
      } else {
        navbar?.classList.remove("shadow-lg");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      if (prevScrollY.current > currentScrollY || currentScrollY < 100) {
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

  // Add this useEffect for hero section detection
  useEffect(() => {
    const handleScrollPastHero = () => {
      // Assuming hero section is roughly 600px tall
      const heroHeight = 600;
      if (window.scrollY > heroHeight) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };

    window.addEventListener("scroll", handleScrollPastHero);
    return () => window.removeEventListener("scroll", handleScrollPastHero);
  }, []);
  // Add this useEffect after your existing scroll effect

  // Add this useEffect for scroll progress
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScrollProgress);
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  // Navigation items
  const navItems = [
    { name: "فروشگاه", href: "/shop" },
    { name: "راهنما", href: "/help" },
    { name: "بلاگ", href: "/blog" },
    { name: "درباره", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ];

  // Categories with subcategories
  const categories = [
    {
      name: "لباس مردانه",
      href: "/category/mens-clothing",
      subcategories: [
        { name: "پیراهن", href: "/category/mens-clothing/shirts" },
        { name: "شلوار", href: "/category/mens-clothing/pants" },
        { name: "کت و کاپشن", href: "/category/mens-clothing/jackets" },
        { name: "کفش", href: "/category/mens-clothing/shoes" },
      ],
    },
    {
      name: "لباس زنانه",
      href: "/category/womens-clothing",
      subcategories: [
        { name: "بلوز و تاپ", href: "/category/womens-clothing/tops" },
        { name: "دامن", href: "/category/womens-clothing/skirts" },
        { name: "شلوار", href: "/category/womens-clothing/pants" },
        { name: "مانتو", href: "/category/womens-clothing/coats" },
      ],
    },
    {
      name: "لوازم الکترونیکی",
      href: "/category/electronics",
      subcategories: [
        { name: "موبایل", href: "/category/electronics/mobile" },
        { name: "لپ تاپ", href: "/category/electronics/laptops" },
        { name: "تبلت", href: "/category/electronics/tablets" },
        { name: "هدفون", href: "/category/electronics/headphones" },
      ],
    },
    {
      name: "جواهرات",
      href: "/category/jewelry",
      subcategories: [
        { name: "گردنبند", href: "/category/jewelry/necklaces" },
        { name: "انگشتر", href: "/category/jewelry/rings" },
        { name: "دستبند", href: "/category/jewelry/bracelets" },
        { name: "گوشواره", href: "/category/jewelry/earrings" },
      ],
    },
    {
      name: "لوازم خانگی",
      href: "/category/home-appliances",
      subcategories: [
        { name: "آشپزخانه", href: "/category/home-appliances/kitchen" },
        { name: "دکوراسیون", href: "/category/home-appliances/decor" },
        { name: "لوازم برقی", href: "/category/home-appliances/electronics" },
        { name: "حمام", href: "/category/home-appliances/bathroom" },
      ],
    },
    {
      name: "کتاب",
      href: "/category/books",
      subcategories: [
        { name: "رمان", href: "/category/books/fiction" },
        { name: "علمی", href: "/category/books/science" },
        { name: "تاریخی", href: "/category/books/history" },
        { name: "کودک", href: "/category/books/children" },
      ],
    },
    {
      name: "ورزشی",
      href: "/category/sports",
      subcategories: [
        { name: "لباس ورزشی", href: "/category/sports/clothing" },
        { name: "کفش ورزشی", href: "/category/sports/shoes" },
        { name: "تجهیزات", href: "/category/sports/equipment" },
        { name: "مکمل‌ها", href: "/category/sports/supplements" },
      ],
    },
  ];

  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const categoryVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const categoryItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        yoyo: Infinity,
      },
    },
  };

  const desktopCategoryRowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const desktopCategoryItemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      color: "#000",
      transition: { duration: 0.2 },
    },
  };

  if (notVisible === "/admin"){
    return null
  }

  return (
    <header
      id="navbar"
      className={`fixed w-full z-50 transition-all duration-500 flex flex-col ${
        scrolledPastHero
          ? "bg-white/90 backdrop-blur-sm text-black shadow-md"
          : "md:bg-white/60 bg-white/10 backdrop-blur-sm text-black"
      }`}
      style={{
        transform: isNavbarVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}
      dir="rtl"
    >
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          {/* Right side - Navigation Items (Desktop) */}
          <div className="hidden md:flex items-center space-x-1 space-x-reverse">
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
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      activeItem === item.href
                        ? "text-black font-bold"
                        : "text-gray-700  hover:text-black"
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
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
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
                  width={140}
                  height={50}
                  className="h-12 w-auto"
                />
              </motion.div>
            </Link>
          </div>

          {/* Left side - Cart and Login */}
          <div className="flex items-center space-x-4 space-x-reverse">
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
                    0
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex  items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors duration-300"
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
        className="hidden md:block"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-center space-x-1 space-x-reverse py-2 "
            variants={desktopCategoryRowVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={desktopCategoryItemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="px-1 flex-shrink-0 relative group"
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link href={category.href}>
                  <span className="block px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black rounded-md hover:bg-gray-50 transition-colors duration-200">
                    {category.name}
                  </span>
                </Link>

                {/* Dropdown for subcategories */}
                <AnimatePresence>
                  {hoveredCategory === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="py-2">
                        {category.subcategories.map((subcategory) => (
                          <motion.div
                            key={subcategory.name}
                            whileHover={{
                              x: 5,
                              backgroundColor: "rgba(0,0,0,0.05)",
                            }}
                            className="block"
                          >
                            <Link href={subcategory.href}>
                              <span className="block px-4 py-2 text-sm text-gray-700 hover:text-black">
                                {subcategory.name}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-5 space-y-1">
              {/* Categories section in mobile menu */}
              {/* Inside the mobile menu, update the categories section */}
              <motion.div variants={itemVariants} className="mb-2">
                <motion.button
                  onClick={() => setExpandedCategory(!expandedCategory)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-gray-50 hover:bg-gray-50"
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
                          <div key={category.name}>
                            <motion.div
                              variants={categoryItemVariants}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center justify-between"
                            >
                              <Link href={category.href}>
                                <span className="block px-4 py-2 text-sm font-medium text-gray-50 hover:text-black">
                                  {category.name}
                                </span>
                              </Link>
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
                                  <RiArrowRightSLine className="h-4 text-gray-50 w-4" />
                                </motion.div>
                              </motion.button>
                            </motion.div>

                            <AnimatePresence>
                              {hoveredCategory === index && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden bg-gray-50/10 mr-6 border-r border-gray-200"
                                >
                                  {category.subcategories.map((subcategory) => (
                                    <motion.div
                                      key={subcategory.name}
                                      whileHover={{ x: 5 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <Link href={subcategory.href}>
                                        <span className="block px-4 py-1.5 text-xs font-medium text-gray-800 hover:text-black">
                                          {subcategory.name}
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
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        activeItem === item.href
                          ? "text-black font-bold bg-gray-50"
                          : "text-gray-50"
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
                <Link href="/auth">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-200"
                  >
                    <RiUser3Line className="ml-2 h-5 w-5" />
                    ورود / ثبت نام
                  </motion.div>
                </Link>

                <Link href="/cart">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-200"
                  >
                    <RiShoppingBag3Line className="ml-2 h-5 w-5" />
                    سبد خرید
                    <span className="mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
