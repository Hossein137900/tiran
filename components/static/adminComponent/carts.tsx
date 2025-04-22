"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";

interface CartItem {
  productId: {
    title: string;
    image: string;
  };
  image: string;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: {
    username: string;
  };
  status: "pending" | "accepte" | "denied";
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  image: string;
}

const ItemsModal = ({
  isOpen,
  onClose,
  items,
  status,
  cartId,
  onStatusChange,
  cartImage,
}: // cartImage
{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  status: string;
  cartId: string;
  cartImage: string;
  onStatusChange: (cartId: string, status: string) => void;
}) => {
  const [newStatus, setNewStatus] = useState(status);

  const handleSubmit = () => {
    onStatusChange(cartId, newStatus);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            className="fixed top-[100px] md:right-1/4 right-0 lg:right-1/3 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl z-50 w-full max-w-md "
          >
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg flex items-center gap-4"
                >
                  <Image
                    src={item.image}
                    alt={item.productId.title}
                    width={70}
                    height={60}
                    className="w-20 h-15 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-white font-medium">
                      {item.productId.title}
                    </h4>
                    <p className="text-gray-300">تعداد: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-1 space-y-2">
              <div className="flex items-center gap-4">
                <label className="text-white">وضعیت سفارش:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                >
                  <option value="pending">در انتظار</option>
                  <option value="accepte">تایید شده</option>
                  <option value="denied">رد شده</option>
                </select>
              </div>
              <Image
                src={cartImage}
                alt="Cart Image"
                width={50}
                height={50}
                className="w-full max-h-[350px] object-cover rounded"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                ثبت تغییرات
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const Carts = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCarts = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();
      setCarts(data.carts);
      setLoading(false);
    } catch (error) {
      console.error("خطا در دریافت سفارشات", error);
      toast.error("خطا در دریافت سفارشات");
      setLoading(false);
    }
  };

  const handleStatusChange = async (cartId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cart/id`, {
        method: "PATCH",
        headers: {
          id: cartId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("وضعیت سفارش با موفقیت بروزرسانی شد");
        fetchCarts();
      }
    } catch (error) {
      console.error("خطا در بروزرسانی وضعیت سفارش", error);
      toast.error("خطا در بروزرسانی وضعیت سفارش");
    }
  };

  const handleShowItems = (cart: Cart) => {
    setSelectedCart(cart);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-2xl font-bold my-6 text-stone-50">مدیریت سفارشات</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white/10 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white/70">
            <tr>
              <th className="px-6 py-3 text-right">کاربر</th>
              <th className="px-6 py-3 text-right">مبلغ کل</th>
              <th className="px-6 py-3 text-right">تاریخ</th>
              <th className="px-6 py-3 text-right">وضعیت</th>
              <th className="px-6 py-3 text-right">اقلام</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <motion.tr
                key={cart._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-700 hover:bg-white/5"
              >
                <td className="px-6 py-4 text-white">{cart.userId.username}</td>
                <td className="px-6 py-4 text-white">
                  {new Intl.NumberFormat("fa-IR").format(cart.totalPrice)} تومان
                </td>
                <td className="px-6 py-4 text-white">
                  {new Date(cart.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-6 py-4">
                  <span>
                    {cart.status === "pending" && (
                      <span className="text-blue-400">در انتظار</span>
                    )}
                    {cart.status === "accepte" && (
                      <span className="text-green-500">تایید شده</span>
                    )}
                    {cart.status === "denied" && (
                      <span className="text-red-500">رد شده</span>
                    )}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => handleShowItems(cart)}
                    className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    <FaShoppingCart />
                    نمایش اقلام
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedCart && (
        <ItemsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          items={selectedCart.items}
          status={selectedCart.status}
          cartId={selectedCart._id}
          onStatusChange={handleStatusChange}
          cartImage={selectedCart.image}
        />
      )}
    </div>
  );
};
