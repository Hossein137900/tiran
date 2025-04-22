import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaHistory, FaShoppingCart } from "react-icons/fa";

interface CartItem {
  productId: string;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  password: string;
  role: string;
}
interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  categoryId: string;
  categoryChildren: string;
  properties: Record<string, string>;
  colors: Record<string, string>;
  videoes: string[];
  thumbnails: string[];
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  path: string;
  image: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  products: Product[];
}

const DashboardReport: React.FC = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartData = async () => {
    const token = localStorage.getItem("token") || "";
    if (token) {
      try {
        const response = await fetch("api/cart/id", {
          headers: {
            token: token,
          },
        });
        if (!response.ok) {
          console.log(response.body);
          console.log("Failed to fetch cart data");
          setIsLoading(false);
        }
        const data = await response.json();
        setCarts(data.carts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);
  // Fake report data which could later be fetched from an API
  const getDashboardMetrics = () => {
    // Only calculate metrics when we have cart data
    const orderCount = carts?.length || 0;
    const totalPayments =
      carts?.reduce((sum, cart) => sum + cart.totalPrice, 0) || 0;

    return [
      {
        id: 1,
        title: "تعداد سفارشات",
        value: orderCount,
        icon: <FaShoppingCart size={24} />,
      },
      {
        id: 2,
        title: "کل پرداختی ها",
        value: `${totalPayments.toLocaleString("fa-IR")}تومان`,
        icon: <FaHistory size={24} />,
      },
    ];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-semibold text-white my-6">گزارش کلی</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          // Loading skeleton
          <div className="fixed inset-0 bg-black/5 z-50">
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent" />
              <p className="text-gray-50 animate-pulse">
                در حال بارگذاری سفارشات...
              </p>
            </div>
          </div>
        ) : (
          getDashboardMetrics().map((metric) => (
            <motion.div
              key={metric.id}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white/20 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:bg-white/25"
            >
              <div className="mb-3 text-yellow-50 bg-yellow-500/20 p-3 rounded-full">
                {metric.icon}
              </div>
              <h3 className="text-lg text-slate-100 font-medium text-center">
                {metric.title}
              </h3>
              <p className="text-3xl text-yellow-300 font-bold mt-3">
                {metric.value.toLocaleString("fa-IR")}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DashboardReport;
