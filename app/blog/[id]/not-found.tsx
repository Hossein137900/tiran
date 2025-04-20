import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl mt-36 font-bold mb-4">بلاگ شما پیدا نشد</h1>
      <p className="text-gray-600 mb-8">
        با عرض پوزش، پست وبلاگی که به دنبال آن هستید وجود ندارد یا وجود داشته
        است حذف شده است.
      </p>
      <Link
        href="/blog"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        بازگشت به وبلاگ
      </Link>
    </div>
  );
}
