"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LocationSelector from "../static/LocationSelector";
import { getCheckoutInfo } from "@/middleware/checkout";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressCreated: (addressId: number) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  onAddressCreated,
}: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    address_type: "2",
    province_id: "",
    city_id: "",
    zipcode: "",
    receiver_name: "",
    receiver_number: "",
    adress: "",
  });

  // Update this function to accept all four parameters from LocationSelector
  const handleLocationSelected = (
    provinceId: string,
    provinceName: string,
    cityId: string,
    cityName: string
  ) => {
    console.log("Selected location:", {
      provinceId,
      provinceName,
      cityId,
      cityName,
    });

    // Make sure we're using the IDs, not the names
    setFormData({
      ...formData,
      province_id: provinceId,
      city_id: cityId,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لطفا وارد حساب کاربری خود شوید");
      }
      console.log(formData, "formData");

      const response = await fetch("/api/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result, "result");

      if (!result.success) {
        if (result.data && Array.isArray(result.data)) {
          // Handle validation errors
          const errorMessages = result.data
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          throw new Error(errorMessages || "خطا در ثبت آدرس");
        } else {
          throw new Error(result.message || "خطا در ثبت آدرس");
        }
      }

      // Save address_id to localStorage
      localStorage.setItem("address_id", result.data.id.toString());

      // Try to get checkout info to verify the address works
      try {
        await getCheckoutInfo(result.data.id);
      } catch (checkoutError) {
        console.error("Error getting checkout info:", checkoutError);
        // Continue anyway, as the address was created successfully
      }

      // Call the callback with the new address ID
      onAddressCreated(result.data.id);

      // Close the modal
      onClose();
    } catch (err: any) {
      setError(err.message || "خطا در ثبت آدرس");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
          dir="rtl"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">ثبت آدرس جدید</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <LocationSelector
                  onLocationSelected={handleLocationSelected}
                  className="mb-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام گیرنده
                  </label>
                  <input
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    name="receiver_number"
                    value={formData.receiver_number}
                    onChange={handleInputChange}
                    required
                    pattern="09[0-9]{9}"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کد پستی
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="کد پستی 10 رقمی"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس کامل
                </label>
                <input
                  type="text"
                  name="adress"
                  value={formData.adress}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="آدرس دقیق محل سکونت"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  disabled={loading}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {loading ? "در حال ثبت..." : "ثبت آدرس"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
