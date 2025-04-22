"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { toast } from "react-toastify";

interface Product {
  _id: string;
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

interface Category {
  _id: string;
  title: string;
  children: string[];
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentProperty, setCurrentProperty] = useState({
    key: "",
    value: "",
  });
  const [currentColor, setCurrentColor] = useState({ name: "", code: "" });
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete);
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const addProperty = () => {
    if (!editingProduct || !currentProperty.key || !currentProperty.value)
      return;
    setEditingProduct({
      ...editingProduct,
      properties: {
        ...editingProduct.properties,
        [currentProperty.key]: currentProperty.value,
      },
    });
    setCurrentProperty({ key: "", value: "" });
  };

  const addColor = () => {
    if (!editingProduct || !currentColor.name || !currentColor.code) return;
    setEditingProduct({
      ...editingProduct,
      colors: {
        ...editingProduct.colors,
        [currentColor.name]: currentColor.code,
      },
    });
    setCurrentColor({ name: "", code: "" });
  };

  const addVideo = () => {
    if (!editingProduct || !currentVideo) return;
    setEditingProduct({
      ...editingProduct,
      videoes: [...editingProduct.videoes, currentVideo],
    });
    setCurrentVideo("");
  };

  const addThumbnail = () => {
    if (!editingProduct || !currentThumbnail) return;
    setEditingProduct({
      ...editingProduct,
      thumbnails: [...editingProduct.thumbnails, currentThumbnail],
    });
    setCurrentThumbnail("");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/id`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          id: editingProduct._id,
        },
        body: JSON.stringify({
          title: editingProduct.title,
          price: editingProduct.price,
          description: editingProduct.description,
          image: editingProduct.image,
          categoryId: editingProduct.categoryId,
          categoryChildren: editingProduct.categoryChildren,
          properties: editingProduct.properties,
          colors: editingProduct.colors,
          videoes: editingProduct.videoes,
          thumbnails: editingProduct.thumbnails,
        }),
      });

      if (response.ok) {
        toast.success("محصول با موفقیت ویرایش شد");
        fetchProducts();
        setEditingProduct(null);
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/id`, {
        method: "DELETE",
        headers: {
          id: productId,
        },
      });

      if (response.ok) {
        toast.success("محصول با موفقیت حذف شد");

        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-2xl font-bold text-black my-6">مدیریت محصولات</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow">
            <Image
              src={"/assets/images/products/prod10.jpg"}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
              width={300}
              height={200}
            />
            <h3 className="text-xl font-semibold text-white">
              {product.title}
            </h3>
            <p className="text-gray-300">
              {Number(product.price).toLocaleString("fa-IR")} تومان
            </p>

            <div className="mt-4 flex gap-2">
              <button
                aria-label="edit-product"
                onClick={() => handleEdit(product)}
                className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                ویرایش
              </button>
              <>
                <button
                  aria-label="delete-product"
                  onClick={() => handleDeleteClick(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  حذف
                </button>

                <DeleteConfirmationModal
                  isOpen={isDeleteModalOpen}
                  onClose={() => setIsDeleteModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                />
              </>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[60vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-black">ویرایش محصول</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-500">
                    عنوان محصول
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingProduct.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-500">قیمت</label>
                  <input
                    type="text"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-500">تصویر اصلی</label>
                  <input
                    type="text"
                    name="image"
                    value={editingProduct.image}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-500">دسته‌بندی</label>
                  <select
                    value={editingProduct.categoryId}
                    name="categoryId"
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  >
                    <option value="">انتخاب دسته‌بندی اصلی</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>

                  {editingProduct.categoryId && (
                    <select
                      value={editingProduct.categoryChildren}
                      name="categoryChildren"
                      onChange={handleInputChange}
                      className="w-full p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                      required
                    >
                      <option value="">انتخاب زیر دسته</option>
                      {categories
                        .find((cat) => cat._id === editingProduct.categoryId)
                        ?.children.map((child, index) => (
                          <option key={index} value={child}>
                            {child}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-500">توضیحات</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-500">ویژگی‌ها</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="نام ویژگی"
                    value={currentProperty.key}
                    onChange={(e) =>
                      setCurrentProperty({
                        ...currentProperty,
                        key: e.target.value,
                      })
                    }
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
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
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                  <button
                    type="button"
                    onClick={addProperty}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                  >
                    افزودن ویژگی
                  </button>
                </div>
                <div className="mt-2">
                  {Object.entries(editingProduct.properties).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="inline-block bg-[#4ade80]/10 text-[#000]/80 rounded px-3 py-1 m-1"
                      >
                        {key}: {value}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-500">رنگ‌ها</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="نام رنگ"
                    value={currentColor.name}
                    onChange={(e) =>
                      setCurrentColor({ ...currentColor, name: e.target.value })
                    }
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                  <input
                    type="text"
                    placeholder="کد رنگ"
                    value={currentColor.code}
                    onChange={(e) =>
                      setCurrentColor({ ...currentColor, code: e.target.value })
                    }
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                  >
                    افزودن رنگ
                  </button>
                </div>
                <div className="mt-2">
                  {Object.entries(editingProduct.colors).map(([name, code]) => (
                    <div
                      key={name}
                      className="inline-block bg-[#4ade80]/10 text-[#000]/80 rounded px-3 py-1 m-1"
                    >
                      {name}: {code}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-500">ویدیوها</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="لینک ویدیو"
                    value={currentVideo}
                    onChange={(e) => setCurrentVideo(e.target.value)}
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                  <button
                    type="button"
                    onClick={addVideo}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                  >
                    افزودن ویدیو
                  </button>
                </div>
                <div className="mt-2">
                  {editingProduct.videoes.map((video, index) => (
                    <div
                      key={index}
                      className="inline-block bg-[#4ade80]/10 text-[#000]/80 rounded px-3 py-1 m-1"
                    >
                      {video}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-500">
                  تصاویر بندانگشتی
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="لینک تصویر"
                    value={currentThumbnail}
                    onChange={(e) => setCurrentThumbnail(e.target.value)}
                    className="p-2 border border-[#a37462]/30 rounded text-black bg-white/50 focus:outline-none focus:border-[#a37462]"
                  />
                  <button
                    type="button"
                    onClick={addThumbnail}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
                  >
                    افزودن تصویر
                  </button>
                </div>
                <div className="mt-2">
                  {editingProduct.thumbnails.map((thumbnail, index) => (
                    <div
                      key={index}
                      className="inline-block bg-[#4ade80]/10 text-[#000]/80 rounded px-3 py-1 m-1"
                    >
                      {thumbnail}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 items-end flex-row-reverse justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  ذخیره تغییرات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
