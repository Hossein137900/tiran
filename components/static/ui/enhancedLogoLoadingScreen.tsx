"use client";
import React, { useState, useEffect, useRef } from "react";

const EnhancedLogoLoadingScreen = () => {
  const [animationStage, setAnimationStage] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: "0px 0px -10% 0px", // Adjust this to fine-tune when animation starts
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const stages = [
      { delay: 500, stage: 1 }, // Lines start growing towards logo
      { delay: 200, stage: 2 }, // logo
      { delay: 1700, stage: 3 }, // Decorative elements
    ];

    stages.forEach(({ delay, stage }) => {
      setTimeout(() => {
        setAnimationStage(stage);
      }, delay);
    });
  }, [isInView]);

  return (
    <div
      ref={componentRef}
      className="min-h-screen bg-white flex relative items-center justify-center overflow-hidden"
    >
      {/* Animated Background Pattern */}

      {/* Top Line - from center top TO logo */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div
          className={`w-0.5 bg-gradient-to-b from-gray-800 via-gray-600 to-gray-800 transition-all duration-1200 ease-out ${
            animationStage >= 1 ? "h-[calc(50vh-60px)]" : "h-0"
          }`}
          style={{
            transformOrigin: "top",
          }}
        />
      </div>

      {/* Bottom Line - from center bottom TO logo */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center">
        <div
          className={`w-0.5 bg-gradient-to-t from-gray-800 via-gray-600 to-gray-800 transition-all duration-1200 ease-out ${
            animationStage >= 1 ? "h-[calc(50vh-60px)]" : "h-0"
          }`}
          style={{
            transformOrigin: "bottom",
          }}
        />
      </div>

      {/* Logo Container with 20px spacing */}
      <div
        className={`relative z-10 transition-all duration-1000 ease-out ${
          animationStage >= 2
            ? "opacity-100 scale-100"
            : "opacity-100 scale-100"
        }`}
        style={{ margin: "20px" }}
      >
        {/* Logo Background with shadow */}

        {/* Logo Content */}
        <div className="relative z-20 flex items-center justify-center w-110 h-110 p-5">
          {/* Replace with your actual logo */}

          {/* For image logo: */}
          <img
            src="/assets/images/logo.png"
            alt="Tiran Logo"
            width={160}
            height={160}
            className="w-full h-full object-contain p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogoLoadingScreen;
