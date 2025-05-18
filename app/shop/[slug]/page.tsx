"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
// import ProductTabs from "@/components/static/ProductTabs";
// import RelatedProducts from "@/components/static/RelatedProducts";
// import ProductComments from "@/components/static/ProductComments";

interface Variety {
  id: number;
  price_main: number;
  price_final: number | string;
  is_coworker_price: boolean;
  for_sale: number;
  product_alert: string;
  Properties: Array<{
    id: number;
    title: string;
    property_id: number | string;
    property: {
      id: number | string;
      title: string;
    };
    code?: string; // For color properties
  }>;
  storage_image_ids: string | string[];
  full_name: string;
  category: {
    id: number;
    cat_name: string;
    cat_en_name: string;
    slug: string;
    src: string;
    icon: string;
    page_title: string;
    meta_tag: string;
    seo_des: string;
    selected: number;
    parent: {
      id: number;
      cat_name: string;
      cat_en_name: string;
      slug: string;
      src: string;
      icon: string;
      page_title: string;
      meta_tag: string;
      seo_des: string;
      selected: number;
      parent: string | null;
    } | null;
  };
  is_main: boolean;
  show_unit: string;
  units: Array<{
    id: number;
    title: string;
    short_title: string | null;
    step: string;
    ratio: number;
    is_main: number;
    can_buy: number;
    main_title: string;
  }>;
  fa_name: string;
  seo_description: string;
  slug: string;
  product_id: number;
  getWarranty: string | null;
  sepidar_code: string | null;
  b_code: string | null;
  mainTitle: string;
  store_stock: number;
  color: number;
}


export interface Product {
  id: number;
  slug: string;
  page_title: string;
  meta_tag: string | null;
  seo_description: string;
  fa_name: string;
  en_name: string;
  store_stock: number;
  images: Array<{
    id: number;
    src: string;
  }>;
  brandMain: string | null;
  main_image_id: number | null;
  varieties: Variety[];
  variety: Variety;
}

export default function ProductPage() {
  const pathname = usePathname();
  const slug = pathname.split("/")[2]; // This will extract the slug from /shop/[slug]

  const [product, setProduct] = useState<Product | null>(null);
  // const [relatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/shop/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "slug": slug // Pass the slug in the headers
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();

      // Make sure we're accessing the correct property based on your API response
      // and ensure all required properties exist
      const productData = {
        ...data.data,
        images: data.data.images || [],
        varieties: data.data.varieties || [],
        variety: data.data.variety || (data.data.varieties && data.data.varieties.length > 0 ? data.data.varieties[0] : {
          id: 0,
          price_main: 0,
          store_stock: 0
        })
      };
      
      setProduct(productData);
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

  // Get primary image - either from the first image in the array or use default
  const primaryImage =
    productImages.length > 0
      ? productImages[0].src
      : "/assets/images/fashion/6.avif";

  console.log(primaryImage, ".........");

  // Get secondary image - either from the second image or reuse the primary image
  const secondaryImage =
    productImages.length > 1 ? productImages[1].src : primaryImage;

  // Get additional images (excluding the first two that we already used)
  const additionalImages =
    productImages.length > 2
      ? productImages.slice(2).map((img) => img.src)
      : [];

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-36">
        {/* Product Gallery */}
        <ProductGallery
          primaryImage={primaryImage}
          secondaryImage={secondaryImage}
          additionalImages={additionalImages}
          productName={product.fa_name}
        />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Product Details Tabs */}
      {/* <ProductTabs product={product} /> */}

      {/* Product Comments */}
      {/* <ProductComments productSlug={product.slug} productId={product.id} /> */}

      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )} */}
    </main>
  );
}
