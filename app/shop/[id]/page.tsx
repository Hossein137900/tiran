import { notFound } from "next/navigation";
import { products } from "@/lib/product";
import ProductGallery from "@/components/static/ProductGallery";
import ProductInfo from "@/components/static/ProductInfo";
import ProductTabs from "@/components/static/ProductTabs";
import ProductComments from "@/components/static/ProductComments";
import RelatedProducts from "@/components/static/RelatedProducts";

type Props = {
  params: { id: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Gallery */}
        <ProductGallery
          primaryImage={product.primaryImage}
          secondaryImage={product.secondaryImage}
          productName={product.name}
        />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Product Comments */}
      <ProductComments productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </main>
  );
}
