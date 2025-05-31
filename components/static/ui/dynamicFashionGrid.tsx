"use client";
import { useState, useEffect } from "react";

interface DynamicFashionGridProps {
  onComplete?: (centerImage: string) => void;
}

const DynamicFashionGrid = ({ onComplete }: DynamicFashionGridProps) => {
  // Sample fashion images
  const fashionImages = [
    "/assets/images/fashion/1.avif",
    "/assets/images/fashion/2.avif",
    "/assets/images/fashion/3.avif",
    "/assets/images/fashion/4.avif",
    "/assets/images/fashion/5.avif",
    "/assets/images/fashion/6.avif",
    "/assets/images/fashion/3.avif",
    "/assets/images/fashion/2.avif",
    "/assets/images/fashion/1.avif",
    "/assets/images/fashion/5.avif",
  ];
  console.log(onComplete);

  // Persian texts for left and right sides
  const persianTexts = {
    left: [
      "مد و پوشاک ایرانی با تاریخی کهن و غنی",
      "هنر نساجی و طراحی در فرهنگ ایران",
      "ترکیب سنت و مدرنیته در پوشاک معاصر",
      "زیبایی و اصالت در هر تار و پود",
      "میراث فرهنگی ایران در جهان مد",
    ],
    right: [
      "نوآوری در طراحی و دوخت لباس",
      "کیفیت بالا و دوام در تولیدات ایرانی",
      "الهام از طبیعت و معماری کهن ایران",
      "تنوع رنگ‌ها و طرح‌های منحصر به فرد",
      "پیشرو در صنعت مد خاورمیانه",
    ],
  };

  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedLeftText, setDisplayedLeftText] = useState("");
  const [displayedRightText, setDisplayedRightText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [centerImage, setCenterImage] = useState("");

  // Typewriter effect function
  const typeWriter = (
    text: string,
    setter: (text: string) => void,
    delay = 50
  ) => {
    return new Promise<void>((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setter(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  };

  // Initialize random images
  useEffect(() => {
    const getRandomImages = () => {
      const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 9);
    };
    const initialImages = getRandomImages();
    setCurrentImages(initialImages);
    setCenterImage(initialImages[4]); // Center image is index 4 in 3x3 grid
  }, []);

  // Handle text typing animation
  useEffect(() => {
    const typeTexts = async () => {
      setIsTyping(true);
      setDisplayedLeftText("");
      setDisplayedRightText("");

      // Type left text
      await typeWriter(
        persianTexts.left[currentTextIndex],
        setDisplayedLeftText,
        60
      );
      // Type right text
      await typeWriter(
        persianTexts.right[currentTextIndex],
        setDisplayedRightText,
        60
      );

      setIsTyping(false);
    };

    typeTexts();
  }, [currentTextIndex]);

  // Change images and text every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        const getRandomImages = () => {
          const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 9);
        };

        const newImages = getRandomImages();
        setCurrentImages(newImages);
        setCenterImage(newImages[4]);
        setCurrentTextIndex((prev) => (prev + 1) % persianTexts.left.length);
        setIsAnimating(false);
      }, 200);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 h-full z-100000000 bg-black" dir="rtl">
      <div className="min-h-screen p-8">
        <div className="min-w-full">
          <div className="flex items-center justify-between gap-8 h-screen">
            {/* Left Text Box */}
            <div className="flex-1 max-w-md">
              <div className="backdrop-blur-lg rounded-2xl p-8">
                <div className="text-white text-xl leading-relaxed font-medium min-h-[120px] flex items-center">
                  <p
                    className={`transition-opacity duration-500 ${
                      isAnimating ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {displayedLeftText}
                    {isTyping && displayedRightText === "" && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Center Image Grid */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="grid grid-cols-3 gap-3 p-6 backdrop-blur-lg rounded-3xl border border-white/10">
                  {currentImages.map((image, index) => (
                    <div
                      key={`${image}-${index}-${currentTextIndex}`}
                      className={`relative w-32 h-32 overflow-hidden transform transition-all duration-500 ${
                        isAnimating
                          ? "scale-90 opacity-60"
                          : "scale-100 opacity-100 hover:scale-105"
                      } ${index === 4 ? "ring-2 ring-white/30" : ""}`}
                    >
                      <img
                        src={image}
                        alt={`Fashion ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Text Box */}
            <div className="flex-1 max-w-md">
              <div className="backdrop-blur-lg rounded-2xl p-8">
                <div className="text-white text-xl leading-relaxed font-medium min-h-[120px] flex items-center">
                  <p
                    className={`transition-opacity duration-500 ${
                      isAnimating ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {displayedRightText}
                    {isTyping &&
                      displayedLeftText !== "" &&
                      displayedRightText !==
                        persianTexts.right[currentTextIndex] && (
                        <span className="animate-pulse">|</span>
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFashionGrid;
