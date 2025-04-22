import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We couldnt find the product youre looking for. It might have been
        removed or the URL might be incorrect.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Return to Shop
      </Link>
    </div>
  );
}
