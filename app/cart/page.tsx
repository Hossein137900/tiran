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
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/type";
import moment from "moment";
import jMoment from "moment-jalaali";
import PersianDatePicker from "@/components/static/jalaliDatePicker";
// import PersianDatePicker from "@/components/static/jalaliDatePicker";
// Initialize jMoment
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [loading, setLoading] = useState(true);

  // User data - in a real app, you'd fetch this from your auth system
  const [userAccount, setUserAccount] = useState<UserProfile | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true); // Shipping method options
  console.log(userDataLoading);

  const [shippingMethods] = useState([
    { id: 1, name: "پست پیشتاز", price: 30000 },
    { id: 2, name: "پیک موتوری", price: 25000 },
  ]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(1);

  const [selectedDate, setSelectedDate] = useState("1404/03/01");
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(
    moment().add(1, "day").format("jYYYY/jMM/jDD")
  );

  console.log(setSelectedDeliveryDate);
  // Payment method options
  const [paymentMethods] = useState([
    { id: 1, name: "پرداخت آنلاین", value: "online" },
    { id: 2, name: "پرداخت در محل", value: "cash" },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");

  // Description and credit deduction
  const [description, setDescription] = useState("");
  const [useCreditDeduction, setUseCreditDeduction] = useState(false);

  // Checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
    }

    try {
      setUserDataLoading(true);
      const response = await fetch("/api/user", {
        headers: {
          method: "GET",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setUserAccount(data.data);
      } else {
        console.error("No account data found:", data);
        // Set a fallback ID if needed
      }
    } catch (error) {
      console.error("Error fetching user account:", error);
      // Set a fallback ID if needed
    } finally {
      setUserDataLoading(false);
    }
  };

  // Call the fetch function when the component mounts
  useEffect(() => {
    fetchUserAccount();
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Handle shipping method change
  const handleShippingMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedShippingMethod(Number(e.target.value));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("سبد خرید شما خالی است");
      return;
    }

    if (!userAccount?.user?.id) {
      setError("اطلاعات کاربر در دسترس نیست. لطفا دوباره تلاش کنید.");
      return;
    }
    if (!selectedDeliveryDate) {
      setError("لطفا تاریخ تحویل را انتخاب کنید.");
      return;
    }

    setCheckoutLoading(true);
    setError("");

    try {
      // Get payment method ID from the selected value
      const payMethodId =
        paymentMethods.find((method) => method.value === selectedPaymentMethod)
          ?.id || 1;

      // Prepare checkout data
      const checkoutData = {
        address_id: userAccount?.user?.id, // Using the fetched user ID
        send_method_id: selectedShippingMethod,
        send_method_receive_id: selectedShippingMethod,
        pay_method_id: payMethodId,
        callback_url: window.location.origin + "/", // Redirect to home page
        receive_date: selectedDeliveryDate,
        description: description || undefined, // Only include if not empty
        credit_deduction: useCreditDeduction ? 1 : 0,
      };

      // Send checkout request
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });
      console.log(checkoutData);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در پردازش سفارش");
      }

      // If payment is online and we have a redirect URL
      if (selectedPaymentMethod === "online" && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        // For cash payment or if no redirect URL
        router.push("/checkout/success");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "خطا در پردازش سفارش");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculate min and max dates
  // const minDate = new Date(Date.now() + 86400000); // Tomorrow
  // const maxDate = new Date(Date.now() + 30 * 86400000); // 30 days from now

  return (
    <div className="min-h-screen pt-36 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8 gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            سبد خرید {userAccount?.user?.first_name}
          </h1>
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
                      {/* Item details - same as before */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <Image
                          src={String(
                            item.image || "/assets/images/fashion/5.avif"
                          )}
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
            </motion.div>

            {/* Shipping Method Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">روش ارسال</h2>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedShippingMethod}
                onChange={handleShippingMethodChange}
              >
                {shippingMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} - {formatPrice(method.price)} تومان
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Delivery Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">تاریخ تحویل</h2>
              <PersianDatePicker
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                className="w-full"
              />
              {selectedDeliveryDate && (
                <p className="mt-2 text-sm text-gray-600">
                  تاریخ انتخاب شده: {selectedDeliveryDate}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                تاریخ تحویل باید بین فردا تا ۳۰ روز آینده باشد.
              </p>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">روش‌های پرداخت</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center">
                    <input
                      type="radio"
                      id={method.value}
                      name="payment"
                      value={method.value}
                      checked={selectedPaymentMethod === method.value}
                      onChange={handlePaymentMethodChange}
                      className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                    />
                    <label
                      htmlFor={method.value}
                      className="mr-2 block text-sm text-gray-700"
                    >
                      {method.name}
                    </label>
                  </div>
                ))}
              </div>

              {/* Payment method information */}
              {selectedPaymentMethod === "online" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-gray-700">
                  پس از تکمیل سفارش، به درگاه پرداخت آنلاین هدایت خواهید شد.
                </div>
              )}
              {selectedPaymentMethod === "cash" && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm text-gray-700">
                  مبلغ سفارش در زمان تحویل کالا دریافت خواهد شد.
                </div>
              )}
            </motion.div>

            {/* Credit Deduction Option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useCredit"
                  checked={useCreditDeduction}
                  onChange={(e) => setUseCreditDeduction(e.target.checked)}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 rounded"
                />
                <label
                  htmlFor="useCredit"
                  className="mr-2 block text-sm text-gray-700"
                >
                  استفاده از اعتبار حساب
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 mr-6">
                با فعال کردن این گزینه، مبلغ سفارش از اعتبار حساب شما کسر خواهد
                شد.
              </p>
            </motion.div>

            {/* Order Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-lg font-semibold mb-4">توضیحات سفارش</h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                placeholder="توضیحات خود را وارد کنید... (اختیاری)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </motion.div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    در حال پردازش...
                  </span>
                ) : (
                  "تکمیل سفارش و پرداخت"
                )}
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
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
