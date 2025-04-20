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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Login failed');
      }
  
      localStorage.setItem("token", data.token);
      return {
        token: data.token,
        user: {
          id: data.userId,
          name: formData.name // You may want to get this from the response
        }
      };
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  const handleSignup = async (name: string, phoneNumber: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phoneNumber, password }),
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        toast.error(data.message || 'Signup failed');
      }
  
      localStorage.setItem("token", data.token);
      return {
        token: data.token,
        user: {
          name: data.name
        }
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

  return (
    <div className=" flex items-center justify-center p-5  " dir="rtl">
      <motion.div className="bg-gray-200/50 backdrop-blur-lg shadow rounded-3xl p-8 w-full max-w-md my-32 md:my-36">
        <AnimatePresence mode="wait">
          <motion.div key={isLogin ? "login" : "signup"}>
            <h2 className="text-3xl font-bold text-black text-center flex items-center justify-center gap-2">
              {isLogin ? "ورود" : "ثبت نام"}
              {/* {isLogin ? (
                <BiLogIn className="text-yellow-400" size={30} />
              ) : (
                <BiUserPlus className="text-yellow-400" size={30} />
              )} */}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {!isLogin && (
                <div className="relative">
                  <BiUser
                    className="absolute right-3 top-3.5 text-black"
                    size={20}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 text-black rounded-xl bg-white/5 border border-black/10  focus:outline-none focus:border-black"
                    placeholder="نام و نام خانوادگی"
                  />
                  {errors.name && (
                    <span className="text-red-400 text-sm block mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>
              )}

              <div className="relative">
                <BiPhone
                  className="absolute right-3 top-3.5 "
                  size={20}
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 text-black rounded-xl bg-white/5 border border-black/10  focus:outline-none focus:border-black"
                  placeholder="شماره موبایل"
                />
                {errors.phone && (
                  <span className="text-red-400 text-sm block mt-1">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="relative">
                <BiLock
                  className="absolute right-3 top-3.5 text-black  "
                  size={20}
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-white/5 border border-black/10 text-black focus:outline-none focus:border-black"
                  placeholder="رمز عبور"
                />
                {errors.password && (
                  <span className="text-red-400 text-sm block mt-1">
                    {errors.password}
                  </span>
                )}
              </div>

              {!isLogin && (
                <div className="relative">
                  <BiLockAlt
                    className="absolute right-3 top-3.5 text-black"
                    size={20}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 text-black rounded-xl bg-white/5 border border-black/10  focus:outline-none focus:border-black"
                    placeholder="تکرار رمز عبور"
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-400 text-sm block mt-1">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-slate-300 text-black font-bold hover:bg-slate-300/70 transition-colors flex items-center justify-center gap-2"
                type="submit"
              >
                {isLogin ? <BiLogIn size={20} /> : <BiUserPlus size={20} />}
                {isLogin ? "ورود" : "ثبت نام"}
              </motion.button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-black hover:text-black/50 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isLogin ? "ثبت نام نکرده‌اید؟" : "قبلاً ثبت نام کرده‌اید؟"}
                {isLogin ? <BiUserPlus size={20} /> : <BiLogIn size={20} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
