import ProductGrid from "@/components/static/ProductGrid";

export default function ShopPage() {
  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="my-28 text-center">
        <h1 className="text-4xl font-bold mb-3">فروشگاه</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          محصولات ما را که با دقت طراحی شده اند برای کیفیت و طراحی کشف کنید سبک
          ماوس را روی تصاویر نگه دارید تا محصولات را از زوایای مختلف ببینید.
        </p>
      </div>

      <ProductGrid />
    </main>
  );
}
