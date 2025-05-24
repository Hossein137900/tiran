"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiPhone, BiLock, BiLogIn } from "react-icons/bi";
import Image from "next/image";

const AuthPage = () => {
  const [step, setStep] = useState(1); // Step 1: Phone number, Step 2: SMS code
  const [formData, setFormData] = useState({
    phone: "",
    smsCode: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.phone.length !== 11) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSmsForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.smsCode.length < 4) {
      newErrors.smsCode = "کد تایید را به درستی وارد کنید";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendPhoneNumber = async () => {
    try {
      setIsLoading(true);
      const username = formData.phone;
      const sent_sms = true;
      const application = 0;

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, sent_sms, application }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "خطا در ارسال کد تایید");
        return false;
      }

      toast.success("کد تایید به شماره موبایل شما ارسال شد", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });

      return true;
    } catch (error) {
      console.log(error);
      toast.error("خطا در ارسال کد تایید");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySmsCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.phone,
          sms_code: formData.smsCode,
          application: 1,
        }),
      });

      const data = await response.json();
      console.log(data, "fronnnt");

      if (!response.ok) {
        toast.error(data.message || "کد تایید نامعتبر است");
        return false;
      }

      // Save token to localStorage
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

      toast.success("ورود با موفقیت انجام شد", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });

      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

      return true;
    } catch (error) {
      console.log(error);
      toast.error("خطا در تایید کد");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (step === 1) {
      if (validatePhoneForm()) {
        const success = await handleSendPhoneNumber();
        if (success) {
          setStep(2);
        }
      }
    } else {
      if (validateSmsForm()) {
        await handleVerifySmsCode();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row pb-10 sm:pb-0 overflow-y-auto"
      dir="rtl"
    >
      {/* Right side - Form */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Logo/Brand */}
              <motion.div
                variants={itemVariants}
                className="text-center mb-8 border-b border-dashed border-gray-400 pb-2"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-2">تیران</h1>
                <p className="text-gray-600">به حساب کاربری خود وارد شوید</p>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 text-center mb-8"
              >
                {step === 1 ? "ورود با شماره موبایل" : "تایید کد پیامک"}
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 ? (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <BiPhone
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-4 pr-12 placeholder:text-gray-300 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                        placeholder="09123456789"
                        disabled={isLoading}
                        type="tel"
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-red-500 text-sm block mt-2">
                        {errors.phone}
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      variants={itemVariants}
                      className="text-center mb-6 p-4 bg-blue-50 rounded-lg"
                    >
                      <p className="text-gray-700">
                        کد تایید به شماره{" "}
                        <span className="font-semibold text-blue-600">
                          {formData.phone}
                        </span>{" "}
                        ارسال شد
                      </p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کد تایید
                      </label>
                      <div className="relative">
                        <BiLock
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          name="smsCode"
                          value={formData.smsCode}
                          onChange={handleChange}
                          className="w-full px-4 py-4 pr-12 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="کد 4 رقمی را وارد کنید"
                          disabled={isLoading}
                          type="text"
                          maxLength={6}
                        />
                      </div>
                      {errors.smsCode && (
                        <span className="text-red-500 text-sm block mt-2">
                          {errors.smsCode}
                        </span>
                      )}
                    </motion.div>
                  </>
                )}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 mt-8 rounded-lg bg-black text-white font-semibold hover:bg-black/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <BiLogIn size={20} />
                  )}
                  {isLoading
                    ? "در حال پردازش..."
                    : step === 1
                    ? "دریافت کد تایید"
                    : "ورود به حساب کاربری"}
                </motion.button>
              </form>

              {step === 2 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setStep(1);
                      setFormData((prev) => ({ ...prev, smsCode: "" }));
                      setErrors({});
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium underline"
                    disabled={isLoading}
                  >
                    تغییر شماره موبایل
                  </motion.button>
                </motion.div>
              )}

              {/* Additional info */}
              <motion.div variants={itemVariants} className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  با ورود به سایت، شما{" "}
                  <a
                    href="#"
                    className="text-gray-900 font-bold hover:underline"
                  >
                    قوانین و مقررات
                  </a>{" "}
                  را می‌پذیرید
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Left side - Image */}

      <div className="w-full lg:w-1/2 h-82 lg:h-auto relative bg-gradient-to-br from-blue-600 to-purple-700 order-1 lg:order-2">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-black bg-opacity-20"
        />

        {/* Background Image */}
        <Image
          src="/assets/images/contact.jpg"
          alt="Auth background"
          fill
          priority
          className="object-cover"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default AuthPage;
