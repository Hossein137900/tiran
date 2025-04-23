"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTwitter, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { usePathname } from "next/navigation";
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

const categories = [
  { name: "صفحه اصلی", href: "/" },
  { name: "محصولات", href: "/products" },
  { name: "راهنما", href: "/help" },
  { name: "درباره ما", href: "/about" },
  { name: "وبلاگ", href: "/blog" },
  { name: "تماس با ما", href: "/contact" },
];

const services = [
  { name: "طراحی وب سایت", href: "/services/web-development" },
  { name: "اپلیکیشن موبایل", href: "/services/mobile-apps" },
  { name: "طراحی رابط کاربری", href: "/services/design" },
  { name: "مشاوره فنی", href: "/services/consulting" },
  { name: "خدمات ابری", href: "/services/cloud" },
];

const Footer = () => {
  const notVisible = usePathname();

  if (notVisible === "/admin") {
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
              دسته‌بندی‌ها
              <motion.span
                className="absolute -bottom-1 right-0 w-12 h-1 bg-gray-200"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            </h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
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

          {/* Services */}
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
              {services.map((service, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={service.href}
                    className="text-gray-500 hover:text-gray-400 transition-colors flex items-center"
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: 15 }}
                      className="inline-block h-0.5 bg-amber-500 ml-2"
                    />
                    {service.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
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
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-start space-x-reverse space-x-3"
              >
                <HiLocationMarker
                  className="text-black mt-1 flex-shrink-0"
                  size={18}
                />
                <span className="text-gray-400 mr-2 text-sm">
                  تهران، خیابان ولیعصر، برج نوآوری، طبقه ۵
                </span>
              </motion.li>
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-center space-x-reverse space-x-3"
              >
                <HiPhone className="text-black flex-shrink-0" size={18} />
                <span className="text-gray-400 mr-2 text-sm">۰۲۱-۸۸۷۷۶۶۵۵</span>
              </motion.li>
              <motion.li
                whileHover={{ x: -5 }}
                className="flex items-center space-x-reverse space-x-3"
              >
                <HiMail className="text-black flex-shrink-0" size={18} />
                <span className="text-gray-400 mr-2 text-sm">
                  info@tiran.ir
                </span>
              </motion.li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">عضویت در خبرنامه</h4>
              <div className="flex flex-row">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="bg-gray-500/50 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-4 py-2 rounded-l-md"
                >
                  عضویت
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-indigo-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} تیران. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-2 text-sm text-gray-400">
            <motion.a
              href="/privacy"
              className="hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              حریم خصوصی
            </motion.a>
            <motion.a
              href="/terms"
              className="hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              قوانین استفاده
            </motion.a>
            <motion.a
              href="/cookies"
              className="hover:text-white transition-colors"
              whileHover={{ y: -2 }}
            >
              سیاست کوکی‌ها
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute w-96 h-96 -bottom-12 -right-12 bg-gray-900 rounded-full filter blur-2xl"></div>
        <div className="absolute w-96 h-96 -bottom-12 -left-12 bg-slate-800 rounded-full filter blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;
