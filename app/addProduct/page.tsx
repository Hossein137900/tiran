"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiUploadCloud, FiPlusCircle, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

export interface Category {
  _id: string;
  title: string;
  children: string[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
}

// interface UploadedFile {
//   name: string;
//   url: string;
//   type: string;
//   _id: string;
//   __v: number;
//   createdAt: string;
//   updatedAt: string;
// }

interface ProductFormData {
  title: string;
  price: string;
  description: string;
  image: string;
  imageAlt: string;
  categoryId: string;
  categoryChildren: string;
  properties: Record<string, string>;
  colors: Record<string, string>;
  videoes: string[];
  thumbnails: string[];
  thumbnailAlts: string[];
}

export default function AddProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    price: "",
    description: "",
    image: "",
    imageAlt: "",
    categoryId: "",
    categoryChildren: "",
    properties: {},
    colors: {},
    videoes: [],
    thumbnails: [],
    thumbnailAlts: [],
  });

  const [currentProperty, setCurrentProperty] = useState({
    key: "",
    value: "",
  });
  const [currentColor, setCurrentColor] = useState({ name: "", code: "" });
  const [currentVideo, setCurrentVideo] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [showFileUploader, setShowFileUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"main" | "thumbnail">("main");

  const addProperty = () => {
    if (currentProperty.key && currentProperty.value) {
      setFormData((prev) => ({
        ...prev,
        properties: {
          ...prev.properties,
          [currentProperty.key]: currentProperty.value,
        },
      }));
      setCurrentProperty({ key: "", value: "" });
    }
  };

  const addColor = () => {
    if (currentColor.name && currentColor.code) {
      setFormData((prev) => ({
        ...prev,
        colors: {
          ...prev.colors,
          [currentColor.name]: currentColor.code,
        },
      }));
      setCurrentColor({ name: "", code: "" });
    }
  };

  const addVideo = () => {
    if (currentVideo) {
      setFormData((prev) => ({
        ...prev,
        videoes: [...prev.videoes, currentVideo],
      }));
      setCurrentVideo("");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFileUploadComplete = (files: UploadedFile[]) => {
  //   if (files.length > 0) {
  //     if (uploadType === "main") {
  //       // Use the first uploaded file for the main product image
  //       setFormData((prev) => ({
  //         ...prev,
  //         image: files[0].url,
  //         imageAlt: files[0].name,
  //       }));
  //     } else if (uploadType === "thumbnail") {
  //       // Add all uploaded files as thumbnails
  //       const newThumbnails = files.map((file) => file.url);
  //       const newThumbnailAlts = files.map((file) => file.name);

  //       setFormData((prev) => ({
  //         ...prev,
  //         thumbnails: [...prev.thumbnails, ...newThumbnails],
  //         thumbnailAlts: [...prev.thumbnailAlts, ...newThumbnailAlts],
  //       }));
  //     }

  //     setShowFileUploader(false);
  //     toast.success("تصاویر با موفقیت آپلود شدند");
  //   }
  // };

  const removeThumbnail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      thumbnails: prev.thumbnails.filter((_, i) => i !== index),
      thumbnailAlts: prev.thumbnailAlts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    // if (!formData.image) {
    //   toast.error("لطفا تصویر اصلی محصول را انتخاب کنید");
    //   return;
    // }

    const submitFormData = new FormData();

    // Add all required fields from the model
    submitFormData.append("title", formData.title);
    submitFormData.append("price", formData.price);
    submitFormData.append("description", formData.description);
    submitFormData.append("image", formData.image);
    submitFormData.append("categoryId", formData.categoryId);
    submitFormData.append("categoryChildren", formData.categoryChildren);

    // Convert complex objects to JSON strings as expected by the endpoint
    submitFormData.append("properties", JSON.stringify(formData.properties));
    submitFormData.append("colors", JSON.stringify(formData.colors));
    submitFormData.append("videoes", JSON.stringify(formData.videoes));
    submitFormData.append("thumbnails", JSON.stringify(formData.thumbnails));

    console.log("Submitting product with image URL:", formData.image);
    console.log("Thumbnails:", formData.thumbnails);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("محصول با موفقیت ایجاد شد");
        console.log("Product created successfully:", result);

        // Reset form after successful submission
        setFormData({
          title: "",
          price: "",
          description: "",
          image: "",
          imageAlt: "",
          categoryId: "",
          categoryChildren: "",
          properties: {},
          colors: {},
          videoes: [],
          thumbnails: [],
          thumbnailAlts: [],
        });
      } else {
        toast.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("خطا در ایجاد محصول");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("api/category");
      const data = await response.json();

      if (data) {
        setCategories(data.categories);
        console.log(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openFileUploader = (type: "main" | "thumbnail") => {
    setUploadType(type);
    setShowFileUploader(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div
      className="max-w-4xl mx-auto mt-24 mb-16 p-8 rounded-2xl shadow-xl  backdrop-filter backdrop-blur-lg border border-black/60"
      dir="rtl"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl border-b pb-3 font-bold mb-8 text-emerald-400 text-center w-full  gap-2"
      >
        <span>افزودن محصول جدید</span>
      </motion.h1>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-2">
            <label className="block text-base font-medium mb-2 text-black">
              عنوان محصول
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-medium mb-2 text-black">
              قیمت
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-base font-medium mb-2 text-black">
              تصویر اصلی
            </label>
            {formData.image ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-3 p-3 bg-white/10 rounded-lg border border-black/40"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="relative overflow-hidden rounded-lg w-24 h-24">
                    <Image
                      src={formData.image}
                      alt={formData.imageAlt}
                      className="object-cover w-full h-full"
                      width={200}
                      height={80}
                    />
                  </div>
                  <div className="text-sm">
                    <p className="text-black font-medium">
                      {formData.imageAlt}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: "",
                          imageAlt: "",
                        }))
                      }
                      className="text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      حذف
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : null}

            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openFileUploader("main")}
              type="button"
              className="bg-white/80 text-gray-800 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 rtl:space-x-reverse w-full font-medium transition-all duration-200 shadow-sm"
            >
              <FiUploadCloud className="text-gray-700" size={20} />
              <span>آپلود تصویر اصلی</span>
            </motion.button>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-medium mb-2 text-black">
              دسته‌بندی
            </label>

            <select
              value={formData.categoryId}
              name="categoryId"
              onChange={handleInputChange}
              className="w-full p-3 mb-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            >
              <option value="">انتخاب دسته‌بندی اصلی</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>

            {formData.categoryId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <select
                  value={formData.categoryChildren}
                  name="categoryChildren"
                  onChange={handleInputChange}
                  className="w-full p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">انتخاب زیر دسته</option>
                  {categories
                    .find((cat) => cat._id === formData.categoryId)
                    ?.children.map((child, index) => (
                      <option key={index} value={child}>
                        {child}
                      </option>
                    ))}
                </select>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-2"
        >
          <label className="block text-base font-medium mb-2 text-black">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-5 bg-white/5 rounded-xl border border-white/10"
        >
          <label className="block text-base font-medium mb-3 text-black">
            ویژگی‌ها
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              placeholder="نام ویژگی"
              value={currentProperty.key}
              onChange={(e) =>
                setCurrentProperty({ ...currentProperty, key: e.target.value })
              }
              className="flex-1 p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="مقدار ویژگی"
              value={currentProperty.value}
              onChange={(e) =>
                setCurrentProperty({
                  ...currentProperty,
                  value: e.target.value,
                })
              }
              className="flex-1 p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addProperty}
              className="px-4 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              افزودن ویژگی
            </motion.button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(formData.properties).map(([key, value]) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={key}
                className="inline-flex items-center bg-green-500/20 text-black rounded-lg px-3 py-2"
              >
                <span>
                  {key}: {value}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => {
                      const newProperties = { ...prev.properties };
                      delete newProperties[key];
                      return { ...prev, properties: newProperties };
                    });
                  }}
                  className="ml-2 text-red-300 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-5 bg-white/5 rounded-xl border border-white/10"
        >
          <label className="block text-base font-medium mb-3 text-black">
            رنگ‌ها
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              placeholder="نام رنگ"
              value={currentColor.name}
              onChange={(e) =>
                setCurrentColor({ ...currentColor, name: e.target.value })
              }
              className="flex-1 p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <input
              type="text"
              placeholder="کد رنگ"
              value={currentColor.code}
              onChange={(e) =>
                setCurrentColor({ ...currentColor, code: e.target.value })
              }
              className="flex-1 p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addColor}
              className="px-4 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              افزودن رنگ
            </motion.button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(formData.colors).map(([name, code]) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={name}
                className="inline-flex items-center bg-white/10 text-black rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: code }}
                  ></div>
                  <span>
                    {name}: {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => {
                      const newColors = { ...prev.colors };
                      delete newColors[name];
                      return { ...prev, colors: newColors };
                    });
                  }}
                  className="ml-2 text-red-300 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="p-5 bg-white/5 rounded-xl border border-white/10"
        >
          <label className="block text-base font-medium mb-3 text-black">
            ویدیوها
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            <input
              type="text"
              placeholder="لینک ویدیو"
              value={currentVideo}
              onChange={(e) => setCurrentVideo(e.target.value)}
              className="flex-1 p-3 border border-black/40 rounded-lg text-black bg-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addVideo}
              className="px-4 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              افزودن ویدیو
            </motion.button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.videoes.map((video, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={index}
                className="inline-flex items-center bg-blue-500/20 text-black rounded-lg px-3 py-2"
              >
                <span className="truncate max-w-xs">{video}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      videoes: prev.videoes.filter((_, i) => i !== index),
                    }));
                  }}
                  className="ml-2 text-red-300 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-3"
        >
          <label className="block text-base font-medium mb-2 text-black">
            تصاویر بندانگشتی
          </label>
          <div className="mb-4">
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openFileUploader("thumbnail")}
              type="button"
              className="bg-white/80 text-gray-800 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 rtl:space-x-reverse w-full font-medium transition-all duration-200 shadow-sm"
            >
              <FiPlusCircle className="text-gray-700" size={20} />
              <span>افزودن تصاویر بندانگشتی</span>
            </motion.button>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.thumbnails.map((thumbnail, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={index}
                className="relative group rounded-lg overflow-hidden bg-white/10 p-2 border border-white/10"
              >
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src={thumbnail}
                    alt={formData.thumbnailAlts[index] || `thumbnail-${index}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => removeThumbnail(index)}
                    className="bg-red-500 text-black rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <FiX />
                  </motion.button>
                </div>
                <p className="text-xs text-black mt-2 truncate text-center">
                  {formData.thumbnailAlts[index] || `تصویر ${index + 1}`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 mt-6 bg-white/10 text-black border border-black/40 rounded-lg hover:bg-white/15 transition-all duration-300 shadow-md font-medium text-lg flex items-center justify-center gap-2"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg> */}
          ثبت محصول
        </motion.button>
      </motion.form>

      {/* File Upload Modal */}
      {showFileUploader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/90 backdrop-blur-md p-6 rounded-xl w-full max-w-2xl shadow-2xl border border-black/40"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {uploadType === "main"
                  ? "آپلود تصویر اصلی"
                  : "آپلود تصاویر بندانگشتی"}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFileUploader(false)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFileUploader(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                بستن
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
