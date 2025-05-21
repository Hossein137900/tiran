import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface SignatureProps {
  logoWidth?: number;
  logoHeight?: number;
  textColor?: string;
  showYear?: boolean;
  className?: string;
  spinDuration?: number;
  isSpinning?: boolean;
}

const Signature: React.FC<SignatureProps> = ({
  logoWidth,
  logoHeight,
  textColor = "#333",
  showYear = true,
  className = "",
  spinDuration = 3,
  isSpinning = true,
}) => {
  const currentYear = new Date().getFullYear();

  // Define the spin animation CSS
  const spinAnimationStyle = isSpinning
    ? {
        animation: `spin ${spinDuration}s linear infinite`,
        filter: "drop-shadow(0 0 2px rgba(0,0,0,0.1))",
      }
    : {
        filter: "drop-shadow(0 0 2px rgba(0,0,0,0.1))",
      };

  return (
    <motion.div
      className={`flex items-center bg-black justify-center gap-2 py-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href="https://www.tomakdigitalagency.ir/"
        target="_blank"
        aria-flowto="https://www.tomakdigitalagency.ir/"
        className="flex items-center gap-2 group"
      >
        <div className="relative">
          <style jsx global>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .logo-container:hover .spinning-logo {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex flex-col">
            <div
              className="flex items-center text-xs opacity-80"
              style={{ color: textColor }}
            >
              {showYear && <span className="text-white">© {currentYear}</span>}
              <span className="mx-1 text-white ">|</span>
              <span className="text-white">created by tomaks engineers</span>
            </div>
          </div>
        </div>
        <div className="logo-container">
          <Image
            src="/assets/toomakLogo.png"
            alt="Tiran Logo"
            width={logoWidth}
            height={logoHeight}
            className={`object-cover transition-all ${
              isSpinning ? "spinning-logo" : ""
            } group-hover:animate-none`}
            style={spinAnimationStyle}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default Signature;
