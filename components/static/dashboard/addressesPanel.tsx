import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiMapPinLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

interface Address {
  id: number;
  title: string;
  recipient: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface CustomerData {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
  addresses: Address[];
  numbers: Array<{
    id: number;
    tell: string;
    is_main: boolean;
    is_verified: boolean;
  }>;
  total_balance: number;
  coins: number;
}

const AddressesPanel = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  console.log(customerData);


  const [formData, setFormData] = useState<Omit<Address, "id">>({
    title: "",
    recipient: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("لطفا وارد حساب کاربری خود شوید");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setCustomerData(result.data);
          // Map the addresses from the API to our expected format
          if (result.data.addresses && Array.isArray(result.data.addresses)) {
            const formattedAddresses = result.data.addresses.map(
              (addr: Address) => ({
                id: addr.id,
                title: addr.title || "آدرس",
                recipient: addr.recipient || "",
                province: addr.province || "",
                city: addr.city || "",
                address: addr.address || "",
                postalCode: addr.postalCode || "",
                phone: addr.phone || "",
                isDefault: addr.isDefault || false,
              })
            );
            setAddresses(formattedAddresses);
          }
        } else {
          setError(result.message || "خطا در دریافت اطلاعات کاربر");
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      recipient: "",
      province: "",
      city: "",
      address: "",
      postalCode: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleAddAddress = () => {
    setShowAddForm(true);
    setEditingAddressId(null);
    resetForm();
  };

  const handleEditAddress = (address: Address) => {
    setShowAddForm(true);
    setEditingAddressId(address.id);
    setFormData({
      title: address.title,
      recipient: address.recipient,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("آیا از حذف این آدرس اطمینان دارید؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(addresses.filter((address) => address.id !== id));
        setSuccess("آدرس با موفقیت حذف شد");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "خطا در حذف آدرس");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setError("خطا در ارتباط با سرور");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.recipient ||
      !formData.address ||
      !formData.phone
    ) {
      setError("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const url = editingAddressId
        ? `/api/user/addresses/${editingAddressId}`
        : "/api/user/addresses";

      const method = editingAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        if (editingAddressId) {
          setAddresses(
            addresses.map((address) =>
              address.id === editingAddressId
                ? { ...formData, id: editingAddressId }
                : address
            )
          );
          setSuccess("آدرس با موفقیت بروزرسانی شد");
        } else {
          // Assume the API returns the new address with an ID
          setAddresses([...addresses, { ...formData, id: data.address.id }]);
          setSuccess("آدرس جدید با موفقیت اضافه شد");
        }

        setShowAddForm(false);
        resetForm();
        setEditingAddressId(null);
      } else {
        setError(data.message || "خطا در ذخیره آدرس");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <RiMapPinLine className="w-6 h-6 ml-2 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">آدرس‌های من</h2>
        </div>

        {!showAddForm && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddAddress}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <RiAddLine className="ml-1" />
            افزودن آدرس جدید
          </motion.button>
        )}
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center"
        >
          <RiCheckLine className="w-5 h-5 ml-2" />
          {success}
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

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {editingAddressId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان آدرس*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثال: منزل، محل کار"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام گیرنده*
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="نام و نام خانوادگی گیرنده"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    استان*
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="استان"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شهر*
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="شهر"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس کامل*
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="آدرس دقیق شامل خیابان، کوچه، پلاک و واحد"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent h-24 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کد پستی*
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="کد پستی ۱۰ رقمی"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شماره تماس*
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="شماره موبایل گیرنده"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="h-4 w-4 text-gray-800 focus:ring-gray-500 rounded"
                    />
                    <label
                      htmlFor="isDefault"
                      className="mr-2 block text-sm text-gray-700"
                    >
                      تنظیم به عنوان آدرس پیش‌فرض
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-70"
                >
                  {loading
                    ? "در حال ذخیره..."
                    : editingAddressId
                    ? "بروزرسانی آدرس"
                    : "ثبت آدرس"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddressId(null);
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  انصراف
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <RiMapPinLine className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            هنوز آدرسی ثبت نکرده‌اید
          </h3>
          <p className="text-gray-500 mb-6">
            برای ثبت سفارش نیاز به حداقل یک آدرس دارید.
          </p>
          {!showAddForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddAddress}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              افزودن آدرس جدید
            </motion.button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-5 rounded-lg border ${
                address.isDefault
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    {address.title}
                  </h3>
                  {address.isDefault && (
                    <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditAddress(address)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <RiEditLine className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <RiDeleteBin6Line className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <p className="text-gray-700 mb-2">
                <span className="font-medium">گیرنده:</span> {address.recipient}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">آدرس:</span> {address.province}،{" "}
                {address.city}، {address.address}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">کد پستی:</span>{" "}
                {address.postalCode}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">شماره تماس:</span> {address.phone}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPanel;
