"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
import ProductComments from "@/components/static/ProductComments";
import ProductTabs from "@/components/static/ProductTabs";
import RelatedProducts from "@/components/static/RelatedProducts";
import { Product } from "@/types/type";

export default function ProductPage() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/shop/product`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            slug: slug,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        const productData: Product = {
          ...data.data,
          images: data.data.images || [],
          varieties: data.data.varieties || [],
        };

        setProduct(productData);

        if (data.data.relatedProducts) {
          setRelatedProducts(data.data.relatedProducts);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(" خطا در بارگذاری محصول");
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
      <div className="container mx-auto px-4 py-12 text-center">
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
  const primaryImage =
    productImages.length > 0
      ? productImages[0].src
      : "/assets/images/fashion/6.avif";
  const secondaryImage =
    productImages.length > 1 ? productImages[1].src : primaryImage;
  const additionalImages =
    productImages.length > 2
      ? productImages.slice(2).map((img) => img.src)
      : [];

  // Desktop Layout
  if (isDesktop) {
    return (
      <main className="min-h-screen bg-white" dir="rtl">
        {/* Product Gallery Section - Fixed Height */}
        <div className="h-screen flex">
          {/* Thumbnails Sidebar - Right */}
          <div className="w-20 border-l border-gray-200 bg-gray-50">
            <ProductGallery
              primaryImage={primaryImage}
              secondaryImage={secondaryImage}
              additionalImages={additionalImages}
              productName={product.fa_name}
              layout="thumbnails"
            />
          </div>

          {/* Main Images - Center */}
          <div className="flex-1 bg-white">
            <ProductGallery
              primaryImage={primaryImage}
              secondaryImage={secondaryImage}
              additionalImages={additionalImages}
              productName={product.fa_name}
              layout="desktop"
            />
          </div>

          {/* Product Info Sidebar - Left */}
          <div className="w-180 border-r border-gray-200 bg-white">
            <div className="h-full overflow-y-auto p-6 scrollbar-hide">
              <ProductInfo product={product} layout="desktop" />
            </div>
          </div>
        </div>

        {/* Full Width Sections Below - Normal Flow */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            {/* Product Details Tabs */}
            <ProductTabs product={product} />

            {/* Product Comments */}
            <ProductComments
              productSlug={product.slug}
              productId={product.id}
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <RelatedProducts products={relatedProducts} />
            )}
          </div>
        </div>
      </main>
    );
  }

  // Mobile Layout
  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:mt-36 mt-0">
        {/* Product Gallery */}
        <ProductGallery
          primaryImage={primaryImage}
          secondaryImage={secondaryImage}
          additionalImages={additionalImages}
          productName={product.fa_name}
          layout="mobile"
        />

        {/* Product Information */}
        <ProductInfo product={product} layout="mobile" />
      </div>

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Product Comments */}
      <ProductComments productSlug={product.slug} productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
