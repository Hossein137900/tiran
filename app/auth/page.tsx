"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BiUser,
  BiPhone,
  BiLock,
  BiLockAlt,
  BiLogIn,
  BiUserPlus,
} from "react-icons/bi";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isLogin && formData.name.length < 3) {
      newErrors.name = "نام باید حداقل ۳ حرف باشد";
    }

    if (formData.phone.length !== 11) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم باشد";
    }

    if (formData.password.length < 6) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور مطابقت ندارد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (phoneNumber: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      return {
        token: data.token,
        user: {
          id: data.userId,
          name: formData.name, // You may want to get this from the response
        },
      };
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  const handleSignup = async (
    name: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phoneNumber, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      return {
        token: data.token,
        user: {
          name: data.name,
        },
      };
    } catch (error) {
      console.log(error);
      toast.error("خطا در ثبت نام");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isLogin) {
          const userData = await handleLogin(formData.phone, formData.password);
          if (userData) {
            toast.success(`خوش آمدید ${userData.user.name}`, {
              style: {
                background: "#333",
                color: "#fff",
              },
            });
          }
          window.location.href = "/";
        } else {
          const userData = await handleSignup(
            formData.name,
            formData.phone,
            formData.password
          );
          if (userData) {
            toast.success(`ثبت نام ${userData.user.name} موفقیت انجام شد`, {
              style: {
                background: "#333",
                color: "#fff",
              },
            });
          }

          window.location.href = "/";
        }
      } catch (error) {
        console.log("Authentication error:", error);

        toast.error("خطا در ورود به سیستم", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });

        console.log("Authentication error:", error);
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
            key={isLogin ? "login" : "signup"}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-2"
            >
              {isLogin ? "ورود" : "ثبت نام"}
              {isLogin ? (
                <BiLogIn className="text-gray-800" size={28} />
              ) : (
                <BiUserPlus className="text-gray-800" size={28} />
              )}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div variants={itemVariants} className="relative">
                  <BiUser
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="نام و نام خانوادگی"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.name}
                    </span>
                  )}
                </motion.div>
              )}

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
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.phone}
                  </span>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <BiLock
                  className="absolute right-3 top-3.5 text-gray-500"
                  size={20}
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                  placeholder="رمز عبور"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm block mt-1">
                    {errors.password}
                  </span>
                )}
              </motion.div>

              {!isLogin && (
                <motion.div variants={itemVariants} className="relative">
                  <BiLockAlt
                    className="absolute right-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
                    placeholder="تکرار رمز عبور"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-sm block mt-1">
                      {errors.confirmPassword}
                    </span>
                  )}
                </motion.div>
              )}

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 mt-6 rounded-xl bg-gray-100 border text-black font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                type="submit"
              >
                {isLogin ? <BiLogIn size={20} /> : <BiUserPlus size={20} />}
                {isLogin ? "ورود" : "ثبت نام"}
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto font-medium"
              >
                {isLogin ? "ثبت نام نکرده‌اید؟" : "قبلاً ثبت نام کرده‌اید؟"}
                {isLogin ? <BiUserPlus size={20} /> : <BiLogIn size={20} />}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
