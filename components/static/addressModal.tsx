"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LocationSelector from "../static/LocationSelector";
import { getCheckoutInfo } from "@/middleware/checkout";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ValidationError {
  field: string;
  message: string;
}

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
  const router = useRouter();
  const [formData, setFormData] = useState({
    address_type: "2",
    province_id: "",
    city_id: "",
    zipcode: "",
    receiver_name: "",
    receiver_number: "",
    adress: "",
  });

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

    setFormData({
      ...formData,
      province_id: provinceId,
      city_id: cityId,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.province_id) errors.push("استان را انتخاب کنید");
    if (!formData.city_id) errors.push("شهر را انتخاب کنید");
    if (!formData.receiver_name.trim()) errors.push("نام گیرنده الزامی است");
    if (!formData.receiver_number.trim()) errors.push("شماره تماس الزامی است");
    if (!formData.zipcode.trim()) errors.push("کد پستی الزامی است");
    if (!formData.adress.trim()) errors.push("آدرس کامل الزامی است");

    // Validate phone number format
    if (
      formData.receiver_number &&
      !/^09[0-9]{9}$/.test(formData.receiver_number)
    ) {
      errors.push("شماره تماس باید با 09 شروع شده و 11 رقم باشد");
    }

    // Validate zipcode format
    if (formData.zipcode && !/^[0-9]{10}$/.test(formData.zipcode)) {
      errors.push("کد پستی باید 10 رقم باشد");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setLoading(false);
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        toast.error("لطفا وارد حساب کاربری خود شوید");
        throw new Error("لطفا وارد حساب کاربری خود شوید");
      }

      console.log("Submitting form data:", formData);

      const response = await fetch("/api/address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          // Ensure numeric fields are properly formatted
          address_type: parseInt(formData.address_type),
          province_id: parseInt(formData.province_id),
          city_id: parseInt(formData.city_id),
        }),
      });

      const result = await response.json();
      console.log("Address API response:", result);

      if (!response.ok) {
        console.error("Address API error:", response.status, result);

        if (result.data && Array.isArray(result.data)) {
          // Handle validation errors
          const errorMessages = result.data
            .map((err: ValidationError) => `${err.field}: ${err.message}`)
            .join(", ");
          throw new Error(errorMessages || "خطا در ثبت آدرس");
        } else {
          throw new Error(
            result.message || `خطا در ثبت آدرس (${response.status})`
          );
        }
      }

      if (!result.success) {
        throw new Error(result.message || "خطا در ثبت آدرس");
      }

      // Ensure we have a valid address ID
      if (!result.data || !result.data.id) {
        throw new Error("آدرس ثبت شد اما شناسه دریافت نشد");
      }

      // Save address_id to localStorage
      localStorage.setItem("address_id", result.data.id.toString());
      console.log(result.data.id, "adreeeeeeeeeeeeeeeassssssssssssssssss");

      toast.success("آدرس با موفقیت ثبت شد");

      // Try to get checkout info to verify the address works
      try {
        await getCheckoutInfo(result.data.id);
        console.log("Checkout info verified successfully");
      } catch (checkoutError) {
        console.error("Error getting checkout info:", checkoutError);
        // Continue anyway, as the address was created successfully
        toast.caller("آدرس ثبت شد اما مشکلی در بررسی اطلاعات ارسال وجود دارد");
      }

      // Call the callback with the new address ID
      onAddressCreated(result.data.id);

      // Close the modal
      onClose();

      // Reset form
      setFormData({
        address_type: "2",
        province_id: "",
        city_id: "",
        zipcode: "",
        receiver_name: "",
        receiver_number: "",
        adress: "",
      });
    } catch (err: unknown) {
      console.error("Address submission error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "خطا در ثبت آدرس";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
          dir="rtl"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">ثبت آدرس جدید</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <LocationSelector
                  onLocationSelected={handleLocationSelected}
                  className="mb-4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام گیرنده *
                  </label>
                  <input
                    type="text"
                    name="receiver_name"
                    value={formData.receiver_name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تماس *
                  </label>
                  <input
                    type="tel"
                    name="receiver_number"
                    value={formData.receiver_number}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    pattern="09[0-9]{9}"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد پستی *
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="کد پستی 10 رقمی"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس کامل *
                </label>
                <textarea
                  name="adress"
                  value={formData.adress}
                  onChange={(e) => handleInputChange(e)}
                  required
                  disabled={loading}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                  placeholder="آدرس دقیق محل سکونت"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ثبت...
                    </>
                  ) : (
                    "ثبت آدرس"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
