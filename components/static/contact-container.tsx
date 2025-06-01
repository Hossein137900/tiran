"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import FaqItem from "@/components/static/faq";
import { FormState, FormStatus } from "@/types/type";

// Form state type

const ContactContainer = () => {
  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("error");
      setErrorMessage("لطفاً تمام فیلدهای ضروری را پر کنید");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus("error");
      setErrorMessage("لطفاً یک آدرس ایمیل معتبر وارد کنید");
      return;
    }

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setFormStatus("success");

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } catch (error) {
      console.log(error);
      setFormStatus("error");
      setErrorMessage("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
    }
  };

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
        damping: 12,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3,
      },
    },
  };

  const infoVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.5,
      },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const statusVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Hero Section */}
      <motion.div
        className="relative h-[40vh] md:h-[70vh] bg-black overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/contact.jpg" // Add your image to public/images/
            alt="تماس با ما"
            fill
            priority
            className="object-cover grayscale"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-20"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, `${Math.random() * 100}%`],
                opacity: [0.2, 0.5, 0.2],
                scale: [null, Math.random() * 0.8],
              }}
              transition={{
                duration: 10 + (i % 10),
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            تماس با ما
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            ما مشتاق شنیدن نظرات شما هستیم. تیم ما همیشه آماده پاسخگویی به
            سوالات و درخواست‌های شماست.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            variants={formVariants}
          >
            <motion.h2
              className="text-3xl font-bold mb-6 text-gray-900"
              variants={itemVariants}
            >
              ارسال پیام
            </motion.h2>

            {/* Form status messages */}
            {formStatus === "success" && (
              <motion.div
                className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-center text-gray-900"
                variants={statusVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CheckCircle className="w-5 h-5 ml-2" />
                <span>
                  پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهیم گرفت.
                </span>
              </motion.div>
            )}

            {formStatus === "error" && (
              <motion.div
                className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg flex items-center text-gray-900"
                variants={statusVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AlertCircle className="w-5 h-5 ml-2" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    نام شما *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-colors duration-200"
                    placeholder="علی محمدی"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    آدرس ایمیل *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-colors duration-200"
                    placeholder="example@gmail.com"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    موضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-colors duration-200"
                    placeholder="چگونه می‌توانیم به شما کمک کنیم؟"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    پیام شما *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 transition-colors duration-200"
                    placeholder="لطفاً درخواست خود را به طور کامل شرح دهید..."
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        ارسال پیام <Send className="mr-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="flex flex-col space-y-8"
            variants={infoVariants}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                اطلاعات تماس
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-black">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      آدرس ما
                    </h3>
                    <p className="mt-1 text-gray-600">
                      خیابان ولیعصر، بالاتر از میدان ونک
                      <br />
                      تهران، ایران
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-black">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      شماره تماس
                    </h3>
                    <p className="mt-1 text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p className="mt-1 text-gray-600">
                      شنبه تا چهارشنبه از ساعت ۹ صبح تا ۶ عصر
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-black">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      آدرس ایمیل
                    </h3>
                    <p className="mt-1 text-gray-600">info@tirancompany.com</p>
                    <p className="mt-1 text-gray-600">
                      support@tirancompany.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            {/* Map */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 h-[300px] md:h-[400px] relative overflow-hidden border border-gray-200"
              variants={itemVariants}
            >
              {/* Google Maps iframe */}
              <div className="absolute inset-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.0377988467997!2d51.41005491525882!3d35.7583332801752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0a2e3a546a29%3A0x868a474e0a8f6c91!2sVanak%20Square%2C%20Tehran%2C%20Iran!5e0!3m2!1sen!2s!4v1651234567890!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "0.5rem" }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="موقعیت ما روی نقشه"
                  className="rounded-lg"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            سوالات متداول
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            پاسخ سوالات رایج درباره خدمات و پشتیبانی ما را در اینجا بیابید.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <FaqItem
            question="چقدر سریع می‌توانم انتظار پاسخ به درخواست خود را داشته باشم؟"
            answer="ما تلاش می‌کنیم به تمام درخواست‌ها در طول روزهای کاری ظرف ۲۴ ساعت پاسخ دهیم. برای موارد فوری، لطفاً با خط پشتیبانی مشتریان ما تماس بگیرید."
          />
          <FaqItem
            question="آیا برای محصولات خود ارسال بین‌المللی ارائه می‌دهید؟"
            answer="بله، ما ارسال بین‌المللی به اکثر کشورها را ارائه می‌دهیم. نرخ‌های ارسال و زمان تحویل بسته به مقصد متفاوت است. می‌توانید هزینه‌های ارسال را در هنگام تسویه حساب محاسبه کنید."
          />
          <FaqItem
            question="چه روش‌های پرداختی را می‌پذیرید؟"
            answer="ما تمام کارت‌های اعتباری اصلی، پی‌پال، انتقال بانکی و روش‌های پرداخت محلی مختلف را بسته به منطقه شما می‌پذیریم. تمام پرداخت‌ها به صورت امن پردازش می‌شوند."
          />
          <FaqItem
            question="چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟"
            answer="پس از ارسال سفارش شما، یک ایمیل تأیید با اطلاعات پیگیری دریافت خواهید کرد. همچنین می‌توانید با ورود به حساب کاربری خود در وب‌سایت ما، وضعیت سفارش خود را به صورت آنی پیگیری کنید."
          />
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="bg-black py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            آماده شروع هستید؟
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            به هزاران مشتری راضی بپیوندید که به محصولات و خدمات ما اعتماد دارند.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="px-8 py-4 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              رزرو مشاوره
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactContainer;
