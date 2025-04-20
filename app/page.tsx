"use client";
import HeroSection from "@/components/global/herosection";

export default function Home() {
  const heroSlides = [
    {
      id: 1,
      image: "/assets/images/fashion/1.avif",
      title: "Welcome to Tiran",
      description:
        "Discover our innovative solutions designed to transform your business",
      ctaText: "Explore Now",
      ctaLink: "/services",
    },
    {
      id: 2,
      image: "/assets/images/fashion/2.avif",
      title: "Cutting-Edge Technology",
      description:
        "Leveraging the latest advancements to deliver exceptional results",
      ctaText: "Learn More",
      ctaLink: "/technology",
      // Optional video background
      // videoBackground: '/videos/tech-background.mp4',
    },
    {
      id: 3,
      image: "/assets/images/fashion/3.avif",
      title: "Expert Team",
      description:
        "Our professionals bring years of experience to every project",
      ctaText: "Meet Our Team",
      ctaLink: "/about",
    },
  ];

  return (
    <main>
      <HeroSection
        slides={heroSlides}
        autoPlayInterval={6000}
        height="100vh"
        showMuteControl={false} // Set to true if using video backgrounds
      />

      {/* Rest of your page content */}
    </main>
  );
}
