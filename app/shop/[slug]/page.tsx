"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
import ProductTabs from "@/components/static/ProductTabs";
import RelatedProducts from "@/components/static/RelatedProducts";

interface Product {
  id: number;
  slug: string;
  page_title: string;
  meta_tag: string | null;
  seo_description: string;
  fa_name: string;
  en_name: string;
  store_stock: number;
  brandMain: string | null;
  main_image_id: number | null;
  category_id?: number;
  description?: string;
  price?: number;
  discount_price?: number;
  images?: { id: number; url: string }[];
  specifications?: { key: string; value: string }[];
}

export default function ProductPage() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2]; // This will extract the slug from /shop/[slug]

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/shop/${slug}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        // Make sure we're accessing the correct property based on your API response
        setProduct(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center ">
        <h3 className="text-xl font-medium text-red-600 mt-36">
          {error || "Product not found"}
        </h3>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  // Prepare images for gallery
  const productImages = product.images || [];
  const primaryImage = product.main_image_id
    ? `/api/image/${product.main_image_id}`
    : productImages[0]?.url || "/assets/images/fashion/6.avif";

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-36">
        {/* Product Gallery */}
        <ProductGallery
          primaryImage={primaryImage}
          secondaryImage={primaryImage}
          productName={product.fa_name}
        />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Product Comments */}
      {/* <ProductComments productId={product.id} /> */}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
