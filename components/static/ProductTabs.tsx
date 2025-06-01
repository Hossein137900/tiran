"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductTabsProps } from "@/types/type";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "details", label: "جزئیات" },
    { id: "shipping", label: "حمل و نقل و برگشت" },
  ];

  // Get the first variety for display
  const selectedVariety =
    product.varieties && product.varieties.length > 0
      ? product.varieties[0]
      : null;

  return (
    <div className="py-16">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex justify-center">
          <div className="flex gap-7">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 relative text-nowrap text-sm md:text-lg font-light tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-black"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[200px]"
          >
            {activeTab === "description" && (
              <div className="prose max-w-none text-center">
                <div className="text-gray-700 leading-relaxed text-lg font-light">
                  {product.seo_description}
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-6">مشخصات محصول</h3>
                    {selectedVariety && (
                      <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-gray-600 font-light">
                            دسته بندی
                          </span>
                          <span className="font-medium">
                            {selectedVariety.category.cat_name}
                          </span>
                        </div>

                        {selectedVariety.getColor && (
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-light">
                              رنگ
                            </span>
                            <span className="font-medium">
                              {selectedVariety.getColor.fa_name}
                            </span>
                          </div>
                        )}

                        {selectedVariety.showProperties &&
                          selectedVariety.showProperties.length > 0 && (
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-gray-600 font-light">
                                سایز
                              </span>
                              <span className="font-medium">
                                {selectedVariety.showProperties[0].child.title}
                              </span>
                            </div>
                          )}

                        {selectedVariety.show_unit && (
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600 font-light">
                              واحد
                            </span>
                            <span className="font-medium">
                              {selectedVariety.show_unit}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-gray-600 font-light">
                            موجودی
                          </span>
                          <span
                            className={`font-medium ${
                              selectedVariety.store_stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedVariety.store_stock > 0
                              ? `${selectedVariety.store_stock} عدد موجود`
                              : "ناموجود"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg mb-6">راهنمای سایز</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>سایز کوچک</span>
                          <span>36-38</span>
                        </div>
                        <div className="flex justify-between">
                          <span>سایز متوسط</span>
                          <span>40-42</span>
                        </div>
                        <div className="flex justify-between">
                          <span>سایز بزرگ</span>
                          <span>44-46</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">
                        اطلاعات ارسال
                      </h3>
                      <div className="space-y-3 text-gray-700 font-light leading-relaxed">
                        <p>
                          ما به سراسر کشور از طریق شرکای مطمئن خود ارسال
                          می‌کنیم. ارسال استاندارد بین ۳ تا ۷ روز کاری بسته به
                          موقعیت شما طول می‌کشد.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">هزینه ارسال:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>
                              • ارسال رایگان برای خریدهای بالای ۵۰۰,۰۰۰ تومان
                            </li>
                            <li>• ارسال عادی: ۳۰,۰۰۰ تومان</li>
                            <li>• ارسال اکسپرس: ۵۰,۰۰۰ تومان</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">سیاست برگشت</h3>
                      <div className="space-y-3 text-gray-700 font-light leading-relaxed">
                        <p>
                          اگر از خرید خود کاملاً راضی نیستید، می‌توانید ظرف ۳۰
                          روز آن را برای بازپرداخت کامل برگردانید.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">شرایط برگشت:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• محصول باید استفاده نشده باشد</li>
                            <li>• برچسب‌ها و بسته‌بندی اصلی موجود باشد</li>
                            <li>• رسید خرید ارائه شود</li>
                            <li>• هزینه ارسال برگشت بر عهده خریدار</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                  <h3 className="font-medium text-lg mb-4">سوالی دارید؟</h3>
                  <p className="text-gray-600 mb-6">
                    تیم پشتیبانی ما آماده پاسخگویی به سوالات شما است
                  </p>
                  <div className="flex justify-center gap-6">
                    <button className="px-6 py-2 border border-gray-300 hover:border-gray-400 transition-colors">
                      تماس با ما
                    </button>
                    <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors">
                      چت آنلاین
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
