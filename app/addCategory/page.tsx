"use client";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddCategory() {
  const [title, setTitle] = useState("");
  const [children, setChildren] = useState<string[]>([]);
  const [currentChild, setCurrentChild] = useState("");

  const handleAddChild = () => {
    if (currentChild.trim()) {
      setChildren([...children, currentChild.trim()]);
      setCurrentChild("");
    }
  };

  const handleRemoveChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          children,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("دسته‌بندی با موفقیت افزوده شد");
        setTitle("");
        setChildren([]);
      } else {
        toast.error(data.message || "خطا در افزودن دسته‌بندی");
      }
    } catch (error) {
      console.log(error);

      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="min-h-screen py-12  px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md mx-auto mt-12 md:mt-24 bg-[#a37462]/5 rounded-xl shadow-lg p-8 border border-[#a37462]/30">
        <h2 className="text-2xl font-bold text-center text-[#fff] mb-8">
          افزودن دسته‌بندی جدید
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#fff]"
            >
              عنوان دسته‌بندی
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 py-2 block border w-full rounded-md border-[#fff]/60 focus:outline-none shadow-sm px-2 focus:border-[#a37462] focus:ring-[#a37462] bg-white/30 text-[#fff]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="children"
              className="block text-sm font-medium text-[#fff]"
            >
              زیر دسته‌ها
            </label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                id="children"
                value={currentChild}
                onChange={(e) => setCurrentChild(e.target.value)}
                className="block w-full border focus:outline-none rounded-md border-[#fff]/60 shadow-sm px-2 focus:border-[#a37462] focus:ring-[#a37462] bg-white/30 text-[#fff]"
              />
              <button
                type="button"
                onClick={handleAddChild}
                className="px-4 py-2 bg-gray-400 text-xl font-bold text-[#fff] rounded-md hover:bg-gray-600 hover:text-white transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {children.map((child, index) => (
              <div
                key={index}
                className="flex items-center bg-[#a37462]/30 rounded-full px-3 py-1"
              >
                <span className="text-[#fff]">{child}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChild(index)}
                  className="mr-2 text-gray-900 text-lg hover:text-[#a37462]/70"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 text-white hover:text-white hover:bg-gray-700 px-4 border  rounded-md shadow-sm text-sm font-medium text-[#e5d8d0]transition-colors duration-200"
          >
            ثبت دسته‌بندی
          </button>
        </form>
      </div>
    </div>
  );
}
