import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/product";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="group"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
              <Image
                src={product.primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% تخفیف
                </div>
              )}
            </div>

            <h3 className="font-medium group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <div className="text-sm">
              {product.discount ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold">{product.price.toFixed(2)}تومان </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
