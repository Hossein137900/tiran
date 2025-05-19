"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ShopIntroProps {
  onComplete: () => void;
}

const ShopIntro: React.FC<ShopIntroProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Show logo after background animation completes
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 1000);

    // Complete the intro after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animation - white overlay coming from bottom */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth animation
        }}
      />

      {/* Logo animation */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="relative z-10"
          >
            <div className="flex flex-col items-center">
              <Image
                src="/assets/images/logo.png"
                alt="Tiran Logo"
                width={150}
                height={150}
                className="mb-4"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 0.5,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="h-0.5 bg-gray-800 rounded-full w-40"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-4 text-gray-600 text-lg font-medium"
              >
                فروشگاه تیران
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopIntro;
