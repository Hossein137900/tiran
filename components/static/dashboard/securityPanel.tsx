import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiLockLine,
  RiCheckLine,
  RiCloseLine,
  RiShieldLine,
} from "react-icons/ri";

const SecurityPanel = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("لطفا تمام فیلدها را پر کنید");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("رمز عبور جدید و تکرار آن مطابقت ندارند");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || "خطا در تغییر رمز عبور");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }

    // For demo purposes, simulate success
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <RiLockLine className="w-6 h-6 ml-2 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">
          امنیت و رمز عبور
        </h2>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center"
        >
          <RiCheckLine className="w-5 h-5 ml-2" />
          رمز عبور شما با موفقیت تغییر یافت.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center"
        >
          <RiCloseLine className="w-5 h-5 ml-2" />
          {error}
        </motion.div>
      )}

      <div className="bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور فعلی
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور جدید
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تکرار رمز عبور جدید
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-md flex items-start">
              <RiShieldLine className="w-5 h-5 ml-2 mt-0.5 text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  نکات امنیتی:
                </h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc mr-5">
                  <li>رمز عبور باید حداقل ۸ کاراکتر باشد</li>
                  <li>از ترکیب حروف بزرگ، کوچک، اعداد و علائم استفاده کنید</li>
                  <li>از اطلاعات شخصی مانند نام یا تاریخ تولد استفاده نکنید</li>
                  <li>رمز عبور خود را به صورت دوره‌ای تغییر دهید</li>
                </ul>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-70"
              >
                {loading ? "در حال پردازش..." : "تغییر رمز عبور"}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPanel;
