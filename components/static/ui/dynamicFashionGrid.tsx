"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicFashionGridProps {
  onComplete?: (centerImage: string) => void;
}

const DynamicFashionGrid = ({ onComplete }: DynamicFashionGridProps) => {
  // Sample fashion images
  const fashionImages = [
    "/assets/images/newImages/IMG_2652.webp",
    "/assets/images/newImages/IMG_2653.webp",
    "/assets/images/newImages/IMG_2654.webp",
    "/assets/images/newImages/IMG_2669.webp",
    "/assets/images/newImages/IMG_2658.webp",
    "/assets/images/newImages/IMG_2662.webp",
    "/assets/images/newImages/IMG_2663.webp",
    "/assets/images/newImages/IMG_2664.webp",
    "/assets/images/newImages/IMG_2665.webp",
  ];

  // Sample video data (you can replace with your actual video data)
  const videoData = [
    {
      src: "/assets/videos/fashion1.mp4",
      title: "مجموعه بهاری",
      description: "طراحی‌های منحصر به فرد برای فصل بهار",
    },
    {
      src: "/assets/videos/fashion2.mp4",
      title: "کلکسیون پاییزی",
      description: "رنگ‌های گرم و طرح‌های کلاسیک",
    },
    {
      src: "/assets/videos/fashion3.mp4",
      title: "مد تابستانی",
      description: "سبک و راحت برای روزهای گرم",
    },
  ];

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
  const [isAnimating] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedLeftText, setDisplayedLeftText] = useState("");
  const [displayedRightText, setDisplayedRightText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [centerImage, setCenterImage] = useState("");

  // Animation states
  const [isRapidChanging, setIsRapidChanging] = useState(false);
  const [showBlockHide, setShowBlockHide] = useState(false);
  const [showCenterScale, setShowCenterScale] = useState(false);
  const [showCenterOpacity, setShowCenterOpacity] = useState(false);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [blockImages, setBlockImages] = useState<string[][]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [finalCenterImage, setFinalCenterImage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Slide variants for video transition
  const slideVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  console.log(onComplete);

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

  // Generate random images for each block
  const generateBlockImages = () => {
    const blocks: string[][] = [];
    for (let i = 0; i < 9; i++) {
      const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
      blocks.push(shuffled.slice(0, 4));
    }
    return blocks;
  };

  // Initialize random images
  useEffect(() => {
    const getRandomImages = () => {
      const shuffled = [...fashionImages].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 9);
    };
    const initialImages = getRandomImages();
    setCurrentImages(initialImages);
    setCenterImage(initialImages[4]);
    setBlockImages(generateBlockImages());
  }, []);

  // Handle text typing animation
  useEffect(() => {
    const typeTexts = async () => {
      setIsTyping(true);
      setDisplayedLeftText("");
      setDisplayedRightText("");

      await typeWriter(
        persianTexts.left[currentTextIndex],
        setDisplayedLeftText,
        60
      );
      await typeWriter(
        persianTexts.right[currentTextIndex],
        setDisplayedRightText,
        60
      );

      setIsTyping(false);
    };

    typeTexts();
  }, [currentTextIndex]);

  // Enhanced animation sequence
  useEffect(() => {
    const startAnimationSequence = async () => {
      // Reset all states
      setShowVideoTransition(false);
      setShowCenterOpacity(false);
      setShowCenterScale(false);
      setShowBlockHide(false);

      // Step 1: Start rapid image changing for 3 seconds
      setIsRapidChanging(true);
      setBlockImages(generateBlockImages());

      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Step 2: Stop rapid changing and start individual block hide animations
      setIsRapidChanging(false);
      setShowBlockHide(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: Scale up center image
      setShowCenterScale(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Center image opacity animation
      setShowCenterOpacity(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // NEW: Hold center image for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFinalCenterImage(centerImage);

      // NEW: Start transition to next component
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call completion callback
      if (onComplete) {
        onComplete(finalCenterImage);
      }

      // Step 5: Transition to video showcase
      setShowVideoTransition(true);
      setCurrentVideoIndex((prev) => (prev + 1) % videoData.length);

      // Update text
      setCurrentTextIndex((prev) => (prev + 1) % persianTexts.left.length);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    };

    const interval = setInterval(() => {
      startAnimationSequence();
    }, 10000); // Total cycle: 10 seconds

    startAnimationSequence();

    return () => clearInterval(interval);
  }, []);

  // Rapid image changing effect
  useEffect(() => {
    if (!isRapidChanging) return;

    const rapidInterval = setInterval(() => {
      setCurrentImages((prevImages) => {
        const newImages = [...prevImages];
        for (let i = 0; i < 9; i++) {
          if (blockImages[i] && blockImages[i].length > 0) {
            const randomIndex = Math.floor(
              Math.random() * blockImages[i].length
            );
            newImages[i] = blockImages[i][randomIndex];
          }
        }
        setCenterImage(newImages[4]);
        return newImages;
      });
    }, 200);

    return () => clearInterval(rapidInterval);
  }, [isRapidChanging, blockImages]);

  // Individual block hide animations
  const getBlockHideStyle = (index: number) => {
    if (!showBlockHide || index === 4) return {};

    const hideAnimations = [
      { transform: "translateY(-100px) rotate(-15deg)", opacity: 0 }, // top-left
      { transform: "translateY(-120px)", opacity: 0 }, // top-center
      { transform: "translateY(-100px) rotate(15deg)", opacity: 0 }, // top-right
      { transform: "translateX(-100px) rotate(-10deg)", opacity: 0 }, // middle-left
      {}, // center - no animation
      { transform: "translateX(100px) rotate(10deg)", opacity: 0 }, // middle-right
      { transform: "translateY(100px) rotate(15deg)", opacity: 0 }, // bottom-left
      { transform: "translateY(120px)", opacity: 0 }, // bottom-center
      { transform: "translateY(100px) rotate(-15deg)", opacity: 0 }, // bottom-right
    ];

    return hideAnimations[index];
  };

  const centerVideo = videoData[currentVideoIndex];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: isTransitioning ? 0 : 1,
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 h-full z-100000000 bg-black"
      dir="rtl"
    >
      {" "}
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

            {/* Center Content */}
            <div className="flex-shrink-0">
              <div className="relative">
                {!showVideoTransition ? (
                  // Image Grid Phase
                  <div className="grid grid-cols-3 gap-3 p-6 backdrop-blur-lg rounded-3xl ">
                    {currentImages.map((image, index) => (
                      <div
                        key={`${image}-${index}-${currentTextIndex}`}
                        className={`relative overflow-hidden transform transition-all duration-700 ease-out ${
                          index === 4
                            ? showCenterScale
                              ? showCenterOpacity
                                ? "w-40 h-40 scale-125 z-10 ring-4 ring-white/50 rounded-lg opacity-30"
                                : "w-40 h-40 scale-125 z-10 ring-4 ring-white/50 rounded-lg opacity-100"
                              : "w-32 h-32 ring-2 ring-white/30 opacity-100"
                            : isRapidChanging
                            ? "w-32 h-32 scale-95 opacity-80"
                            : "w-32 h-32 scale-100 opacity-100 hover:scale-105"
                        }`}
                        style={{
                          ...getBlockHideStyle(index),
                          transitionDuration: showBlockHide ? "700ms" : "200ms",
                          transitionTimingFunction: showBlockHide
                            ? "ease-in-out"
                            : "ease-out",
                        }}
                      >
                        <img
                          src={image}
                          alt={`Fashion ${index + 1}`}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            showCenterScale && index === 4 ? "rounded-lg" : ""
                          }`}
                        />

                        {isRapidChanging && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Video Showcase Phase
                  <div className="relative z-20">
                    <div className="w-96 h-[520px] overflow-hidden shadow-2xl relative">
                      <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                          key={`center-${currentVideoIndex}`}
                          custom={1}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            duration: 0.1,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.1,
                          }}
                          className="absolute inset-0"
                        >
                          <video
                            src={centerVideo.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                          {/* Content */}
                          <div className="absolute bottom-8 left-6 right-6 text-center">
                            <motion.h2
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.4 }}
                              className="text-3xl font-bold text-white mb-3"
                            >
                              {centerVideo.title}
                            </motion.h2>
                            <motion.p
                              initial={{ y: 30, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.4 }}
                              className="text-gray-200 text-lg"
                            >
                              {centerVideo.description}
                            </motion.p>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Glow Effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10"
                      />
                    </div>
                  </div>
                )}

                {/* Center image highlight effect during scaling */}
                {showCenterScale && !showVideoTransition && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full animate-ping" />
                  </div>
                )}

                {/* Transition overlay effect */}
                {showCenterOpacity && !showVideoTransition && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse" />
                  </div>
                )}
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
      {/* Additional transition effects */}
      {showVideoTransition && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
};

export default DynamicFashionGrid;
