"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiFileList3Line,
  RiMapPinLine,
  RiTruckLine,
  RiCalendarLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  items: OrderItem[];
  totalPrice: number;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  address: {
    recipient: string;
    fullAddress: string;
    phone: string;
  };
  trackingCode?: string;
  deliveryDate?: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await fetch(`/api/orders/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || "خطا در دریافت جزئیات سفارش");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, let's create some mock data
    const mockOrder: OrderDetail = {
      id: parseInt(params.id),
      orderNumber: `TRN-1004${params.id}`,
      date: "1402/09/10",
      status: "در حال پردازش",
      items: [
        {
          id: 1,
          name: "پیراهن مردانه طرح چهارخانه",
          image: "/assets/images/fashion/5.avif",
          price: 450000,
          quantity: 1,
        },
        {
          id: 2,
          name: "شلوار جین مردانه",
          image: "/assets/images/fashion/6.avif",
          price: 650000,
          quantity: 2,
        },
      ],
      totalPrice: 1750000,
      shippingMethod: "پست پیشتاز",
      shippingCost: 0, // Free shipping
      paymentMethod: "پرداخت آنلاین",
      address: {
        recipient: "حسین محمدی",
        fullAddress:
          "تهران، خیابان ولیعصر، بالاتر از میدان ونک، کوچه نگار، پلاک ۱۲، واحد ۳",
        phone: "09123456789",
      },
      trackingCode: "TRK98765432",
      deliveryDate: "1402/09/15",
    };

    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
    fetchOrderDetail()
  }, [params.id, router]);

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "تحویل شده":
        return "bg-green-100 text-green-800";
      case "در حال پردازش":
        return "bg-blue-100 text-blue-800";
      case "در انتظار پرداخت":
        return "bg-yellow-100 text-yellow-800";
      case "لغو شده":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "سفارش مورد نظر یافت نشد"}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button and order number */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center text-gray-700 hover:text-gray-900 mb-4 sm:mb-0"
              >
                <RiArrowRightLine className="ml-1" />
                بازگشت به داشبورد
              </motion.button>
            </Link>
            <div className="flex items-center">
              <RiFileList3Line className="w-5 h-5 ml-2 text-gray-700" />
              <h1 className="text-xl font-bold text-gray-900">
                سفارش #{order.orderNumber}
              </h1>
            </div>
          </div>

          {/* Order status and date */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <span className="text-gray-600 ml-2">وضعیت سفارش:</span>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center">
                <RiCalendarLine className="ml-1 text-gray-600" />
                <span className="text-gray-600">تاریخ سفارش: {order.date}</span>
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                اقلام سفارش
              </h2>
              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 mr-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(item.price)} تومان × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">جمع کل:</span>
                <span className="text-gray-900">
                  {formatPrice(order.totalPrice)} تومان
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">هزینه ارسال:</span>
                <span className="text-green-600">
                  {order.shippingCost === 0
                    ? "رایگان"
                    : `${formatPrice(order.shippingCost)} تومان`}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                  مبلغ قابل پرداخت:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(order.totalPrice + order.shippingCost)} تومان
                </span>
              </div>
            </div>
          </div>

          {/* Shipping and payment info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <RiTruckLine className="w-5 h-5 ml-2 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  اطلاعات ارسال
                </h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium ml-1">روش ارسال:</span>
                  {order.shippingMethod}
                </p>
                {order.trackingCode && (
                  <p className="text-gray-700">
                    <span className="font-medium ml-1">کد رهگیری:</span>
                    {order.trackingCode}
                  </p>
                )}
                {order.deliveryDate && (
                  <p className="text-gray-700">
                    <span className="font-medium ml-1">تاریخ تحویل:</span>
                    {order.deliveryDate}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <RiMoneyDollarCircleLine className="w-5 h-5 ml-2 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-800">
                  اطلاعات پرداخت
                </h2>
              </div>
              <p className="text-gray-700 mb-3">
                <span className="font-medium ml-1">روش پرداخت:</span>
                {order.paymentMethod}
              </p>
              <p
                className={`text-sm ${
                  order.status === "تحویل شده"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {order.status === "تحویل شده"
                  ? "پرداخت با موفقیت انجام شده است"
                  : "وضعیت پرداخت در انتظار تایید"}
              </p>
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <RiMapPinLine className="w-5 h-5 ml-2 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-800">
                آدرس تحویل
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                <span className="font-medium ml-1">گیرنده:</span>
                {order.address.recipient}
              </p>
              <p className="text-gray-700">
                <span className="font-medium ml-1">آدرس:</span>
                {order.address.fullAddress}
              </p>
              <p className="text-gray-700">
                <span className="font-medium ml-1">شماره تماس:</span>
                {order.address.phone}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
