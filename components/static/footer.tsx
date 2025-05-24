"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaTwitter, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Signature from "../global/signature";
import { Category } from "@/types/type";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const MainLink = [
  { name: "صفحه اصلی", href: "/" },
  { name: "محصولات", href: "/shop" },
  { name: "راهنما", href: "/help" },
  { name: "درباره ما", href: "/about" },
  { name: "وبلاگ", href: "/blog" },
  { name: "تماس با ما", href: "/contact" },
];

// Add this function to fetch categories (adjust the API endpoint as needed)

const Footer = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const footerEndRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category"); // Adjust your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Handle different possible data structures
        let categoriesArray: Category[] = [];

        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else if (data && typeof data === "object") {
          // If data is an object, try to find an array property
          const arrayProperty = Object.values(data).find((value) =>
            Array.isArray(value)
          );
          if (arrayProperty) {
            categoriesArray = arrayProperty as Category[];
          }
        }

        // Filter categories that have children
        const categoriesWithChildren = categoriesArray.filter(
          (category: Category) =>
            category.children && category.children.length > 0
        );

        setCategories(categoriesWithChildren);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const { scrollYProgress } = useScroll({
    target: footerEndRef,
    offset: ["start end", "end end"],
  });

  // Transform values for parallax effects
  const logoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  if (pathname === "/admin" || pathname === "/auth") {
    return null;
  }

  return (
    <footer dir="rtl" className="bg-white text-white relative">
      {/* Wave SVG Divider */}
      <div className="relative h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            fill="#000"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></motion.path>
        </svg>
      </div>
      <motion.div
        className="container mx-auto px-6 pt-10 pb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and About */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/images/logo.png"
                  alt="Tiran Logo"
                  width={140}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </motion.div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              ارائه راهکارهای نوین فناوری برای کسب و کارها با هدف رشد و نوآوری
              در دنیای دیجیتال
            </p>
            <div className="flex gap-6">
              <motion.a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#0088cc" }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTelegram size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#E1306C" }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#0077B5" }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, color: "#1DA1F2" }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg text-black font-semibold relative">
              خدمات
              <motion.span
                className="absolute -bottom-1 right-0 w-12 h-1 bg-gray-200"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </h3>
            <ul className="space-y-3">
              {MainLink.map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={category.href}
                    className="text-gray-500 hover:text-gray-400 transition-colors flex items-center"
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: 15 }}
                      className="inline-block h-0.5 bg-amber-500 ml-2"
                    />
                    {category.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}

          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg text-black font-semibold relative">
              دسته‌بندی‌ها
              <motion.span
                className="absolute -bottom-1 right-0 w-12 h-1 bg-gray-200"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.slice(0, 5).map((category) => (
                  <motion.li
                    key={category.id}
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(
                        category.cat_name
                      )}`}
                      className="text-gray-500 hover:text-gray-400 transition-colors flex items-center group"
                    >
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 15 }}
                        className="inline-block h-0.5 bg-amber-500 ml-2 transition-all duration-200"
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {category.cat_name}
                      </span>
                      {category.children && category.children.length > 0 && (
                        <span className="text-xs text-gray-400 mr-1">
                          ({category.children.length})
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}

                {categories.length > 6 && (
                  <motion.li
                    whileHover={{ x: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href="/categories"
                      className="text-amber-500 hover:text-amber-400 transition-colors flex items-center font-medium"
                    >
                      <motion.span
                        initial={{ width: 0 }}
                        whileHover={{ width: 15 }}
                        className="inline-block h-0.5 bg-amber-500 ml-2"
                      />
                      مشاهده همه دسته‌بندی‌ها
                    </Link>
                  </motion.li>
                )}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">دسته‌بندی‌ای یافت نشد</p>
            )}
          </motion.div>

          {/* Contact */}

          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg text-black font-semibold relative">
              تماس با ما
              <motion.span
                className="absolute -bottom-1 right-0 w-12 h-1 bg-gray-200"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </h3>
            <ul className="space-y-4">
              {/* Address with Google Maps link */}
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-start space-x-reverse space-x-3 group"
              >
                <HiLocationMarker
                  className="text-black mt-1 flex-shrink-0 group-hover:text-gray-600 transition-colors duration-200"
                  size={18}
                />
                <Link
                  href="https://maps.google.com/?q=تهران، خیابان ولیعصر، برج نوآوری، طبقه ۵"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-600 mr-2 text-sm transition-colors duration-200 cursor-pointer"
                  title="مشاهده در نقشه"
                >
                  تهران، خیابان ولیعصر، برج نوآوری، طبقه ۵
                </Link>
              </motion.li>

              {/* Phone with tel link */}
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-center space-x-reverse space-x-3 group"
              >
                <HiPhone
                  className="text-black flex-shrink-0 group-hover:text-gray-600 transition-colors duration-200"
                  size={18}
                />
                <Link
                  href="tel:+982188776655"
                  className="text-gray-400 hover:text-gray-600 mr-2 text-sm transition-colors duration-200 cursor-pointer"
                  title="تماس تلفنی"
                >
                  ۰۲۱-۸۸۷۷۶۶۵۵
                </Link>
              </motion.li>

              {/* Email with mailto link */}
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-center space-x-reverse space-x-3 group"
              >
                <HiMail
                  className="text-black flex-shrink-0 group-hover:text-gray-600 transition-colors duration-200"
                  size={18}
                />
                <Link
                  href="mailto:info@tiran.ir"
                  className="text-gray-400 hover:text-gray-600 mr-2 text-sm transition-colors duration-200 cursor-pointer"
                  title="ارسال ایمیل"
                >
                  info@tiran.ir
                </Link>
              </motion.li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">عضویت در خبرنامه</h4>
              <div className="flex flex-row">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="bg-gray-500/10 border border-dashed border-gray-400 text-black px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-full transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-l-md transition-colors duration-200 flex items-center gap-2"
                >
                  <span>عضویت</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}

        <motion.div
          className="border-t border-dashed border-gray-400 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} تیران. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-2 text-sm text-gray-400">
            <motion.a
              href="/privacy"
              className="hover:text-black transition-colors"
              whileHover={{ y: -2 }}
            >
              حریم خصوصی
            </motion.a>
            <motion.a
              href="/terms"
              className="hover:text-black transition-colors"
              whileHover={{ y: -2 }}
            >
              قوانین استفاده
            </motion.a>
            <motion.a
              href="/cookies"
              className="hover:text-black transition-colors"
              whileHover={{ y: -2 }}
            >
              سیاست کوکی‌ها
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
      {/* Full-screen black section with centered logo - TiranStyle-like */}
      <div ref={footerEndRef} className="relative h-screen bg-black z-9999 ">
        {/* Centered logo and content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Logo with scale animation */}
          <motion.div
            className="relative"
            style={{
              scale: logoScale,
              opacity: logoOpacity,
            }}
          >
            <Image
              src="/assets/images/whitelogo.png"
              alt="Tiran Logo"
              width={4000}
              height={4000}
              className="md:h-20 h-10 w-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
      {/* Animated Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0 opacity-15 pointer-events-none">
        <div className="absolute w-96 h-96 -bottom-12 -right-12 bg-gray-900 rounded-full filter blur-2xl"></div>
        <div className="absolute w-96 h-96 -bottom-12 -left-12 bg-gray-800 rounded-full filter blur-2xl"></div>
      </div>
      <Signature
        spinDuration={5} // Faster spin (5 seconds per rotation)
        isSpinning={true} // Enable spinning
        textColor="#0f172a"
        logoWidth={20}
        logoHeight={20}
      />{" "}
    </footer>
  );
};

export default Footer;
