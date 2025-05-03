"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDeleteBin6Line,
  RiAddLine,
  RiSubtractLine,
  RiArrowLeftLine,
  RiShoppingCartLine,
} from "react-icons/ri";
import { useCart } from "@/context/cartContext";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className="min-h-screen pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8 gap-2">
          <h1 className="text-3xl font-bold text-gray-900">سبد خرید</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <RiShoppingCartLine className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-500 mb-6">
              محصولات مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                مشاهده محصولات
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center"
                    >
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 sm:mr-6 text-center sm:text-right">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-gray-500">
                          {formatPrice(item.price)} تومان
                        </p>
                      </div>

                      <div className="flex items-center mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <motion.button
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2"
                          >
                            <RiSubtractLine className="h-5 w-5 text-gray-600" />
                          </motion.button>

                          <span className="px-4 py-1 text-gray-900">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2"
                          >
                            <RiAddLine className="h-5 w-5 text-gray-600" />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1, color: "#f43f5e" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="mr-4 p-2 text-gray-500 hover:text-red-500"
                        >
                          <RiDeleteBin6Line className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">جمع کل:</span>
                <span className="text-lg font-semibold">
                  {formatPrice(totalPrice)} تومان
                </span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-600">هزینه ارسال:</span>
                <span className="text-green-600">رایگان</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(totalPrice)} تومان
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors"
                >
                  ادامه فرآیند خرید
                </motion.button>

                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 bg-white text-gray-800 py-3 px-4 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center justify-center">
                      <RiArrowLeftLine className="ml-2" />
                      ادامه خرید
                    </span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">کد تخفیف</h2>
              <div className="flex">
                <input
                  type="text"
                  placeholder="کد تخفیف خود را وارد کنید"
                  className="flex-1 border border-gray-300 rounded-r-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button className="bg-gray-800 text-white px-4 py-2 rounded-l-md hover:bg-gray-700 transition-colors">
                  اعمال
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">روش‌های پرداخت</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="online"
                    className="mr-2 block text-sm text-gray-700"
                  >
                    پرداخت آنلاین
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                  />
                  <label
                    htmlFor="cash"
                    className="mr-2 block text-sm text-gray-700"
                  >
                    پرداخت در محل
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
