import Link from "next/link";
import {  GiHanger } from "react-icons/gi";
import {  TbShirt } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center  justify-center px-4">
      <div className="max-w-3xl  w-full text-center mt-36">
        <div className="mb-8 mx-auto flex flex-col items-center">
          {/* Fashion icon */}
          <div className="relative w-52 h-52 flex items-center justify-center">
            <GiHanger className="w-full h-full text-gray-300 absolute" />
            <TbShirt className="w-3/4 h-3/4 text-gray-800 absolute" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-white bg-gray-800 px-4 py-2 rounded-lg">
                404
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 font-vazir">
          ! صفحه مورد نظر شما یافت نشد
        </h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto font-vazir">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری .
          منتقل شده است
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition duration-200 font-vazir"
          >
            بازگشت به صفحه اصلی
          </Link>

          <div className="mt-8">
            <p className="text-gray-500 font-vazir">
              : شاید این دسته‌بندی‌ها به شما کمک کند
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Link
                href="/shop/mens-shirts"
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 font-vazir"
              >
                پیراهن مردانه
              </Link>
              <Link
                href="/shop/jeans"
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 font-vazir"
              >
                شلوار جین
              </Link>
              <Link
                href="/shop/suits"
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 font-vazir"
              >
                کت و شلوار
              </Link>
              <Link
                href="/shop/sportswear"
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 font-vazir"
              >
                لباس ورزشی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
