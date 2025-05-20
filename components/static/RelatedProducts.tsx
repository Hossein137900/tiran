import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/type";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const firstVariety =
            product.varieties && product.varieties.length > 0
              ? product.varieties[0]
              : null;

          return (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.fa_name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                {firstVariety && firstVariety.priceOff > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(
                      (firstVariety.priceOff / firstVariety.price_main) * 100
                    )}
                    % تخفیف
                  </div>
                )}
              </div>

              <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                {product.fa_name}
              </h3>

              <div className="text-sm">
                {firstVariety && firstVariety.store_stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {firstVariety.price_main.toLocaleString()} تومان
                    </span>
                  </div>
                ) : (
                  <span className="font-bold">ناموجود</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
