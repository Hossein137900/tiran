"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiPhone, BiLock, BiLogIn } from "react-icons/bi";

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
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg border border-gray-100 mt-12 md:mt-32"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-2"
            >
              {step === 1 ? "ورود به حساب کاربری" : "تایید کد پیامک"}
              <BiLogIn className="text-gray-800" size={28} />
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                <motion.div variants={itemVariants} className="relative">
                  <BiPhone
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="شماره موبایل"
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.phone}
                    </span>
                  )}
                </motion.div>
              ) : (
                <>
                  <motion.div
                    variants={itemVariants}
                    className="text-center mb-4"
                  >
                    <p className="text-gray-600">
                      کد تایید به شماره {formData.phone} ارسال شد
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="relative">
                    <BiLock
                      className="absolute right-3 top-3.5 text-gray-500"
                      size={20}
                    />
                    <input
                      name="smsCode"
                      value={formData.smsCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                      placeholder="کد تایید"
                      disabled={isLoading}
                    />
                    {errors.smsCode && (
                      <span className="text-red-500 text-sm block mt-1">
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
                className={`w-full py-3.5 mt-6 rounded-xl bg-gray-100 border text-black font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isLoading}
              >
                <BiLogIn size={20} />
                {isLoading
                  ? "در حال پردازش..."
                  : step === 1
                  ? "دریافت کد تایید"
                  : "ورود"}
              </motion.button>
            </form>

            {step === 2 && (
              <motion.div variants={itemVariants} className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setStep(1);
                    setFormData((prev) => ({ ...prev, smsCode: "" }));
                    setErrors({});
                  }}
                  className="text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto font-medium"
                  disabled={isLoading}
                >
                  تغییر شماره موبایل
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
