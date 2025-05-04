import { useState } from "react";
import { motion } from "framer-motion";
import { RiUser3Line, RiCheckLine, RiCloseLine } from "react-icons/ri";
import { UserProfile } from "@/types/type";

interface ProfilePanelProps {
  userProfile: UserProfile | null;
}

const ProfilePanel = ({ userProfile }: ProfilePanelProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: userProfile?.user?.first_name || "",
    lastName: userProfile?.user?.last_name || "",
    email: userProfile?.user?.email || "",
    job: userProfile?.user?.job || "",
    nationalID: userProfile?.nationalID || "",
    birthday: userProfile?.birthday || "",
    sex: userProfile?.user?.sex?.key || 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          job: formData.job,
          nationalID: formData.nationalID,
          birthday: formData.birthday,
          sex: formData.sex,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setIsEditing(false);
        // In a real app, you would update the userProfile state here
      } else {
        setError(data.message || "خطا در بروزرسانی اطلاعات");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }

    // For demo purposes, simulate success
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <RiUser3Line className="w-6 h-6 ml-2 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">اطلاعات شخصی</h2>
        </div>

        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ویرایش اطلاعات
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              انصراف
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-70"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </motion.button>
          </div>
        )}
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center"
        >
          <RiCheckLine className="w-5 h-5 ml-2" />
          اطلاعات شما با موفقیت بروزرسانی شد.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.user?.first_name || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.user?.last_name || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.user?.email || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شغل
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.user?.job || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کد ملی
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nationalID"
                  value={formData.nationalID}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.nationalID || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاریخ تولد
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  placeholder="1370/01/01"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.birthday || "تعیین نشده"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                جنسیت
              </label>
              {isEditing ? (
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                >
                  <option value={1}>مرد</option>
                  <option value={2}>زن</option>
                </select>
              ) : (
                <p className="p-3 bg-gray-50 rounded-md">
                  {userProfile?.user?.sex?.value || "تعیین نشده"}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePanel;
