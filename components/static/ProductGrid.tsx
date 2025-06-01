"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { CartProvider } from "@/context/cartContext";
import { Product, ProductGridProps } from "@/types/type";
import Link from "next/link";

export default function ProductGrid({ categoryFilter }: ProductGridProps) {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(allProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = "/api/shop"; // Your products API endpoint

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        console.log(data, "Fetched products data");

        // Store all products
        const allProductsData = data.data?.items || data.items || [];
        setAllProducts(allProductsData);

        // Filter products based on category if provided
        let filteredProducts = allProductsData;

        if (categoryFilter) {
          filteredProducts = allProductsData.filter((product: Product) => {
            // Check if product has variety and category structure
            if (product.variety && product.variety.category) {
              const category = product.variety.category;

              // Check if current category matches
              if (category.cat_name === categoryFilter) {
                return true;
              }

              // Check if parent category matches
              if (
                category.parent &&
                category.parent.cat_name === categoryFilter
              ) {
                return true;
              }
            }
            return false;
          });
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.log("Error fetching products:", error);
        setProducts([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]); // Re-fetch when filter changes

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="mt-12">
        {categoryFilter && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                {products.length} محصول در دسته‌بندی {categoryFilter} یافت شد
              </p>
              <Link
                href="/shop"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  {categoryFilter
                    ? `محصولی در دسته‌بندی "${categoryFilter}" یافت نشد`
                    : "محصولی یافت نشد"}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  ممکن است محصولات این دسته‌بندی به زودی اضافه شوند
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  مشاهده همه محصولات
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </CartProvider>
  );
}
