import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiEyeLine, RiFileList3Line } from "react-icons/ri";

interface Order {
  id: number;
  order_number: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || "خطا در دریافت سفارش‌ها");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, let's create some mock data
    const mockOrders: Order[] = [
      {
        id: 1,
        order_number: "TRN-10045",
        date: "1402/08/15",
        status: "تحویل شده",
        total: 1250000,
        items: 3,
      },
      {
        id: 2,
        order_number: "TRN-10046",
        date: "1402/09/02",
        status: "در حال پردازش",
        total: 850000,
        items: 2,
      },
      {
        id: 3,
        order_number: "TRN-10047",
        date: "1402/09/10",
        status: "در انتظار پرداخت",
        total: 1750000,
        items: 4,
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
    fetchOrders()
  }, []);

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <RiFileList3Line className="w-6 h-6 ml-2 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">سفارش‌های من</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <RiFileList3Line className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            هنوز سفارشی ثبت نکرده‌اید
          </h3>
          <p className="text-gray-500">
            سفارش‌های شما پس از خرید در این قسمت نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  شماره سفارش
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  تاریخ
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  وضعیت
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  مبلغ کل
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  تعداد اقلام
                </th>
                <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                  جزئیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {order.order_number}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {order.date}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {formatPrice(order.total)} تومان
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {order.items} کالا
                  </td>
                  <td className="py-4 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      onClick={() =>
                        (window.location.href = `/dashboard/orders/${order.id}`)
                      }
                    >
                      <RiEyeLine className="w-5 h-5" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
