import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: "",
    phoneNumber: "",
    id: "",
    password: "", // Initialize all fields
  });

  const fetchUser = async () => {
    const response = await fetch(`/api/auth/id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")!,
      },
    });
    if (!response.ok) {
      toast.error("Failed to fetch user data");
    }
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/id`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token")!,
        },
        body: JSON.stringify({
          username: user.username,
          phoneNumber: user.phoneNumber,
          password: user.password, // Add this
        }),
      });
      response.json();
      toast.success("پروفایل با موفقیت بروزرسانی شد");
      setUser({ ...user, password: "" }); // Clear password after update
    } catch (error) {
      toast.error("خطا در بروزرسانی پروفایل");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/5 z-50">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent" />
          <p className="text-gray-50 animate-pulse">
            در حال بارگذاری پروفایل...
          </p>
        </div>
      </div>
    );
  }
  if (!loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl text-white font-semibold my-6">
          بروزرسانی پروفایل
        </h2>
        <form
          onSubmit={handleSubmit}
          className="md:mx-24 bg-white p-6 shadow rounded"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, username: e.target.value })
              }
              className="w-full border px-3 py-2 text-black/70 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">
              شماره تلفن
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={user.phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black/70 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              رمز عبور جدید
            </label>
            <input
              type="password"
              id="password"
              value={user.password || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, password: e.target.value })
              }
              className="w-full border px-3 py-2 rounded text-black/70 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            بروزرسانی
          </button>
        </form>
      </div>
    );
  }
};

export default Profile;
