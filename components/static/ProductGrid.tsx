"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { CartProvider } from "@/context/cartContext";
import { Category, Product } from "@/types/type";
import Link from "next/link";

export default function ProductGrid() {
  const [filter, setFilter] = useState("همه");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoryResponse = await fetch("/api/category");

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoryData = await categoryResponse.json();

        if (!categoryData.success || !categoryData.data) {
          throw new Error("Invalid category data format");
        }

        setCategories(categoryData.data);

        // Fetch products
        const productResponse = await fetch("api/shop");

        if (!productResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const productData = await productResponse.json();

        if (productData.success && productData.data.items) {
          setProducts(productData.data.items);
          console.log(productData.data, "productData.data.items");
        } else {
          throw new Error("Invalid product data format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts =
    filter === "همه"
      ? products
      : products.filter((product) => {
          // Check if the product's variety has a matching category or parent category
          return (
            product.variety &&
            product.variety.category &&
            // Match direct category name
            (product.variety.category.cat_name === filter ||
              // Match parent category name
              (product.variety.category.parent &&
                product.variety.category.parent.cat_name === filter))
          );
        });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-red-600">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <CartProvider>
      <div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            key="همه"
            onClick={() => setFilter("همه")}
            className={`px-4 py-2 mt-12 rounded-full transition-all ${
              filter === "همه"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            همه
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.cat_name)}
              className={`px-4 py-2 mt-12 rounded-full transition-all ${
                filter === category.cat_name
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.cat_name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center flex flex-col justify-center items-center py-12 col-span-full">
              <h3 className="text-xl font-medium">
                متاسفانه محصولی با این ویژگی پیدا نشد
              </h3>
              <p className="text-gray-500 mt-2">
                لطفا فیلترها را تغییر دهید یا به صفحه اصلی برگردید.
              </p>
              <Link
                href="/"
                className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          )}
        </div>
      </div>
    </CartProvider>
  );
}
