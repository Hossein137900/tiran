"use client";

import VideoShowcase from "@/components/static/ui/videoShowcase";
import React from "react";

const Page = () => {
  // Sample video data - replace with your actual video data
  const videoData = [
    {
      id: "1",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/assets/images/newImages/IMG_2654.webp",
      title: "Spring Collection 2024",
      description:
        "Discover our latest spring collection featuring minimalist designs and sustainable materials that represent the future of conscious fashion.\n\nEach piece is carefully crafted to embody modern elegance while maintaining comfort and functionality. Our spring line represents a perfect balance between contemporary fashion and timeless style, drawing inspiration from nature's awakening and the fresh energy of renewal.\n\nThe collection features premium organic cotton, recycled polyester, and innovative bio-based materials that reduce environmental impact without compromising on quality or aesthetic appeal. Every garment undergoes rigorous testing to ensure durability and longevity.\n\nOur design philosophy centers around versatility and adaptability. These pieces are designed to transition seamlessly from casual daywear to sophisticated evening attire, making them perfect for the modern lifestyle where flexibility is key.\n\nThe color palette draws from natural earth tones, soft pastels, and crisp neutrals that complement any skin tone and personal style. Each shade is carefully selected to work harmoniously with other pieces in the collection.\n\nSustainability isn't just a buzzword for us – it's a commitment that extends to every aspect of our production process, from sourcing materials to packaging and shipping. We partner with certified suppliers who share our values and maintain the highest standards of ethical manufacturing.",
      category: "Collection",
    },
    {
      id: "2",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/assets/images/newImages/IMG_2666.webp",
      title: "Urban Essentials",
      description:
        "Essential pieces for the modern urban lifestyle that seamlessly blend functionality with contemporary design aesthetics.\n\nDesigned for versatility and durability, these pieces transition seamlessly from day to night, work to weekend, gym to dinner. Quality fabrics meet innovative design in this carefully curated selection that addresses the needs of today's dynamic urban dweller.\n\nThe urban environment demands clothing that can keep up with a fast-paced lifestyle while maintaining style and comfort. Our Urban Essentials line features moisture-wicking technology, wrinkle-resistant fabrics, and strategic ventilation zones.\n\nEach piece incorporates thoughtful details like hidden pockets for devices, reinforced stress points for durability, and adjustable elements for customizable fit and style. The modular design approach allows for endless mixing and matching possibilities.\n\nThe collection includes performance basics, elevated loungewear, and sophisticated outerwear that can handle whatever the city throws at you. From early morning commutes to late-night social events, these pieces adapt to your schedule.\n\nWe've collaborated with urban athletes, commuters, and professionals to understand the real needs of city living. Their feedback has been instrumental in creating pieces that truly serve the urban lifestyle.\n\nTechnical innovation meets street style in this collection that proves you don't have to sacrifice performance for aesthetics. Every piece is designed to look as good as it performs.",
      category: "Lifestyle",
    },
    {
      id: "3",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "/assets/images/newImages/IMG_2653.webp",
      title: "Sustainable Fashion",
      description:
        "Fashion that cares for our planet while setting new standards for style, quality, and ethical production practices.\n\nOur commitment to sustainability drives every decision we make, from the initial design concept to the final packaging. We believe that beautiful fashion and environmental responsibility are not mutually exclusive but rather complementary forces.\n\nWe source materials from certified organic farms and recycled content suppliers who meet our strict environmental and social standards. Our supply chain is fully transparent, allowing customers to trace their garments from fiber to finished product.\n\nInnovative eco-friendly materials include Tencel from sustainably managed forests, recycled ocean plastic transformed into high-performance fibers, and organic hemp that requires minimal water and no pesticides to grow.\n\nOur zero-waste design philosophy ensures that fabric scraps are repurposed into accessories or donated to textile recycling programs. We've eliminated single-use plastics from our packaging and use only biodegradable or recyclable materials.\n\nThe dyeing process uses low-impact, OEKO-TEX certified dyes that are safe for both the environment and the people who wear our clothes. Water usage is minimized through advanced recycling systems in our partner facilities.\n\nWe're proud members of the Better Cotton Initiative and the Sustainable Apparel Coalition, working collectively with other brands to drive positive change across the industry.\n\nEvery purchase supports reforestation projects and clean water initiatives in the communities where our materials are sourced, creating a positive impact that extends far beyond fashion.",
      category: "Sustainability",
    },
    {
      id: "4",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/assets/images/newImages/IMG_2652.webp",
      title: "Minimalist Approach",
      description:
        "Less is more in our minimalist collection that celebrates the beauty of simplicity and the power of thoughtful design.\n\nClean lines, neutral tones, and thoughtful details define this collection. Each piece is designed to be a foundation for your wardrobe, offering endless styling possibilities while maintaining a cohesive aesthetic that transcends trends.\n\nThe minimalist philosophy extends beyond visual aesthetics to encompass functionality and versatility. Every element serves a purpose, and unnecessary details are eliminated in favor of perfect proportions and impeccable construction.\n\nOur color palette focuses on timeless neutrals: crisp whites, warm creams, sophisticated grays, and deep blacks. These shades work harmoniously together and serve as the perfect backdrop for personal expression through accessories and styling.\n\nThe silhouettes are carefully considered to flatter a wide range of body types while maintaining the clean, uncluttered aesthetic that defines minimalism. Fit is paramount – each piece is pattern-tested extensively to achieve the perfect balance of comfort and structure.\n\nFabrics are selected for their quality, drape, and longevity. We favor natural fibers like organic cotton, linen, and wool that age beautifully and develop character over time. The focus is on investment pieces that will remain relevant for years to come.\n\nConstruction techniques emphasize precision and durability. French seams, reinforced stress points, and hand-finished details ensure that these pieces will maintain their beauty through countless wears and washes.\n\nThis collection is for those who appreciate the art of restraint and understand that true luxury lies in quality, not quantity. It's about building a wardrobe that works effortlessly together.",
      category: "Minimalism",
    },
    {
      id: "5",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/assets/images/newImages/IMG_2670.webp",
      title: "Artisan Craftsmanship",
      description:
        "Handcrafted excellence in every detail, celebrating traditional techniques and the skilled artisans who bring our designs to life.\n\nOur artisans bring decades of experience to every piece, ensuring the highest quality and attention to detail. Traditional techniques meet modern design in this exclusive collection that honors the heritage of fine craftsmanship.\n\nEach garment tells a story of skilled hands and patient dedication. From hand-sewn buttonholes to intricate embroidery work, every detail reflects the mastery that comes only through years of practice and passion for the craft.\n\nWe partner with family-owned workshops and cooperatives around the world, preserving traditional techniques that have been passed down through generations. These partnerships ensure fair wages and working conditions while supporting local communities.\n\nThe embellishment techniques include hand-beading, traditional block printing, natural indigo dyeing, and intricate lacework. Each method requires specialized skills and considerable time, making every piece truly unique and valuable.\n\nOur commitment to artisan craftsmanship extends to supporting educational programs that teach these traditional skills to new generations. We believe in preserving cultural heritage while creating opportunities for economic empowerment.\n\nThe production process is deliberately slow and thoughtful. Rush orders and mass production have no place in this collection. Each piece is created with the time and care it deserves, resulting in heirloom-quality garments.\n\nCustomization options allow customers to work directly with artisans to create truly personal pieces. From selecting specific embroidery patterns to choosing unique color combinations, the possibilities for personalization are endless.\n\nThis collection represents our belief that in an increasingly automated world, there is immense value in the human touch and the irreplaceable quality that comes from skilled craftsmanship.",
      category: "Craftsmanship",
    },
    {
      id: "6",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/assets/images/newImages/IMG_2664.webp",
      title: "Future Forward",
      description:
        "Innovation meets style in our forward-thinking designs that push the boundaries of what fashion can be and do.\n\nExploring new materials, technologies, and design philosophies, this collection represents our vision for the future of fashion. Bold, innovative, and unapologetically modern, these pieces challenge conventional thinking about clothing.\n\nSmart textiles integrate seamlessly into everyday wear, featuring temperature-regulating fibers, moisture-management systems, and even conductive threads that can interface with mobile devices. The future of fashion is interactive and responsive.\n\nBiofabricated materials grown in laboratories offer exciting possibilities for sustainable production. We're experimenting with lab-grown leather alternatives, mushroom-based textiles, and fibers created from agricultural waste.\n\nAdvanced manufacturing techniques like 3D knitting and laser cutting allow for precision and customization that was previously impossible. These technologies reduce waste while enabling complex designs and perfect fit.\n\nThe design process itself has been revolutionized through virtual reality prototyping and AI-assisted pattern making. We can now test and refine designs in digital space before creating physical samples, dramatically reducing development time and material waste.\n\nWearable technology integration goes beyond simple fitness tracking. Our pieces can monitor posture, provide gentle heating or cooling, and even change color based on environmental conditions or personal preference.\n\nCollaborations with tech companies and research institutions keep us at the forefront of innovation. We're constantly exploring new possibilities and pushing the boundaries of what clothing can do.\n\nThis collection is for early adopters and innovation enthusiasts who want to be part of fashion's future. It's about embracing change and seeing clothing as a platform for technological advancement and creative expression.",
      category: "Innovation",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <VideoShowcase videos={videoData} />
    </div>
  );
};

export default Page;
