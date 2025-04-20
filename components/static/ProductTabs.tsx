"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/product";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "توضیحات" },
    { id: "details", label: "جزئیات" },
    { id: "shipping", label: "حمل و نقل و برگشت" },
  ];

  return (
    <div className="my-16">
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 relative ${
                activeTab === tab.id
                  ? "text-black font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p>{product.description}</p>
               
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  جزئیات محصول انتخابی
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">دسته بندی</span>
                    <span className="font-medium">{product.category}</span>
                  </li>
                  {product.colors && (
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">رنگ های موجود </span>
                      <span className="font-medium">
                        {product.colors.join(", ")}
                      </span>
                    </li>
                  )}
                  {product.sizes && (
                    <li className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">سایزهای موجود </span>
                      <span className="font-medium">
                        {product.sizes.join(", ")}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">امتیاز</span>
                    <span className="font-medium">{product.rating} / 5</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <p className="text-gray-600">
                    We ship to over 100 countries worldwide through our trusted
                    delivery partners. Standard shipping takes 3-7 business days
                    depending on your location.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Return Policy</h3>
                  <p className="text-gray-600">
                    If you're not completely satisfied with your purchase, you
                    can return it within 30 days for a full refund. The item
                    must be unused and in the same condition that you received
                    it.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
