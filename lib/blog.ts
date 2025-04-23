export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number; // in minutes
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Sustainable Fashion",
    slug: "ultimate-guide-sustainable-fashion",
    excerpt:
      "Discover how to build a sustainable wardrobe without compromising on style or breaking the bank.",
    content: `
      # The Ultimate Guide to Sustainable Fashion

      In recent years, the fashion industry has faced increasing scrutiny for its environmental impact. From water pollution to textile waste, the way we produce and consume clothing has significant consequences for our planet.

      ## What is Sustainable Fashion?

      Sustainable fashion refers to clothing that is designed, manufactured, distributed, and used in ways that are environmentally friendly and socially responsible. It encompasses:

      - **Eco-friendly materials**: Organic cotton, hemp, bamboo, and recycled fabrics
      - **Ethical production**: Fair wages and safe working conditions
      - **Longevity**: Durable, timeless pieces that won't quickly go out of style
      - **Circular economy**: Recycling, upcycling, and biodegradable materials

      ## Building a Sustainable Wardrobe

      ### 1. Quality Over Quantity

      Invest in well-made pieces that will last for years rather than cheap, trendy items that will fall apart after a few wears. This might mean spending more upfront, but you'll save money in the long run.

      ### 2. Research Brands

      Look for brands that are transparent about their supply chains and manufacturing processes. Many sustainable brands proudly share information about where and how their products are made.

      ### 3. Choose Natural Fibers

      Natural fibers like organic cotton, linen, and wool are generally more sustainable than synthetic materials like polyester, which is derived from petroleum and releases microplastics when washed.

      ### 4. Embrace Secondhand Shopping

      Thrift stores, vintage shops, and online marketplaces offer unique pieces at lower prices while giving existing clothing a second life.

      ## Conclusion

      Sustainable fashion isn't about perfection—it's about making better choices when you can. By being more mindful about what you buy and how you care for your clothes, you can reduce your environmental footprint while still expressing your personal style.
    `,
    coverImage: "/assets/images/fashion/6.avif",
    author: {
      name: "Emma Rodriguez",
      avatar: "/assets/images/fashion/1.avif",
    },
    category: "Fashion",
    tags: ["sustainability", "fashion", "eco-friendly", "ethical"],
    publishedAt: "2023-10-15",
    readTime: 8,
  },
  {
    id: "2",
    title: "Tech Accessories That Complement Your Style",
    slug: "tech-accessories-complement-style",
    excerpt:
      "How to choose tech gadgets and accessories that not only perform well but also enhance your personal aesthetic.",
    content: `
      # Tech Accessories That Complement Your Style

      In today's connected world, our devices are constant companions. From smartphones to smartwatches, technology has become an extension of ourselves—and by extension, our personal style.

      ## Merging Technology and Fashion

      The days of clunky, purely utilitarian tech are behind us. Today's gadgets are designed with aesthetics in mind, offering consumers the chance to express themselves through their tech choices just as they do through their clothing and accessories.

      ## Smartwatches: The New Statement Piece

      Smartwatches have evolved from simple fitness trackers to sophisticated wearables that can complement any outfit. With customizable faces, interchangeable bands, and sleek designs, a smartwatch can be as much a fashion statement as a traditional timepiece.

      ### Choosing the Right Smartwatch

      - Consider your typical style: minimalist, classic, sporty, or bold
      - Look for customization options that fit different occasions
      - Don't sacrifice functionality for form—find a balance

      ## Phone Cases: Protection with Personality

      Your phone case is perhaps the most visible tech accessory you own. It's also an opportunity to showcase your personality while protecting your investment.

      ### Trending Phone Case Styles

      - **Minimalist**: Clean lines and subtle colors for the understated look
      - **Artistic**: Prints and patterns that showcase your creative side
      - **Luxury**: Premium materials like leather or metal for a sophisticated touch
      - **Functional**: Wallet cases or those with kickstands for the practically-minded

      ## Headphones as Fashion Statements

      From colorful earbuds to statement over-ear headphones, audio equipment has become a key part of many outfits.

      ### Styling with Headphones

      - Over-ear headphones can serve as an accessory similar to a hat or jewelry
      - Wireless earbuds offer a sleek, minimalist option
      - Consider color coordination with your usual outfits

      ## Conclusion

      The best tech accessories are those that seamlessly blend into your existing style while offering the functionality you need. By thoughtfully selecting devices and accessories that align with your aesthetic preferences, you can ensure your tech enhances rather than detracts from your personal style.
    `,
    coverImage: "/assets/images/fashion/6.avif",
    author: {
      name: "Marcus Chen",
      avatar: "/assets/images/fashion/6.avif",
    },
    category: "Technology",
    tags: ["tech", "accessories", "style", "gadgets"],
    publishedAt: "2023-09-28",
    readTime: 6,
  },
  {
    id: "3",
    title: "Minimalist Home Decor: Less is More",
    slug: "minimalist-home-decor",
    excerpt:
      "Explore the principles of minimalist interior design and how to create a serene, clutter-free living space.",
    content: `
      # Minimalist Home Decor: Less is More

      In a world of constant stimulation and accumulation, minimalist home decor offers a refreshing alternative—a chance to create spaces that feel open, calm, and intentional.

      ## The Philosophy of Minimalism

      At its core, minimalism isn't about having nothing—it's about being surrounded only by things that serve a purpose or bring joy. It's quality over quantity, thoughtfulness over impulse.

      ## Key Principles of Minimalist Decor

      ### 1. Declutter First

      Before you can create a minimalist space, you need to clear away the excess. This doesn't mean getting rid of everything, but rather being selective about what deserves a place in your home.

      ### 2. Neutral Color Palette

      Minimalist spaces typically feature a restrained color palette—whites, beiges, grays, and blacks create a sense of calm and cohesion. Occasional pops of color can add interest without overwhelming the space.

      ### 3. Focus on Functionality

      Every item should earn its keep, either through utility or significant aesthetic value. Multi-functional furniture is particularly valuable in minimalist homes.

      ### 4. Embrace Negative Space

      Don't feel the need to fill every corner. Empty space is a feature, not something to be fixed. It gives the eye a place to rest and makes a room feel larger and more peaceful.

      ## Room-by-Room Minimalist Approach

      ### Living Room

      - Choose a sofa with clean lines
      - Limit decorative objects to a carefully curated few
      - Consider hidden storage to maintain clean surfaces

      ### Bedroom

      - Keep the bed simple with high-quality, neutral bedding
      - Remove technology for better sleep and cleaner aesthetics
      - Store out-of-season clothing elsewhere to minimize closet clutter

      ### Kitchen

      - Clear countertops of appliances that aren't used daily
      - Opt for open shelving with a limited display of beautiful essentials
      - Choose quality cookware that can go from stove to table

      ## Conclusion

      Minimalist decor isn't about creating a sterile, impersonal space—it's about intentionally designing an environment that supports your well-being and reflects what truly matters to you. By embracing "less is more," you can create a home that feels both sophisticated and deeply personal.
    `,
    coverImage: "/assets/images/fashion/2.avif",
    author: {
      name: "Sofia Patel",
      avatar: "/assets/images/fashion/6.avif",
    },
    category: "Home",
    tags: ["minimalism", "interior design", "home decor", "lifestyle"],
    publishedAt: "2023-08-12",
    readTime: 7,
  },
  {
    id: "4",
    title: "The Psychology of Color in Product Design",
    slug: "psychology-color-product-design",
    excerpt:
      "How color choices influence consumer perception and behavior when it comes to product selection.",
    content: `
      # The Psychology of Color in Product Design

      Color is one of the most powerful tools in a designer's arsenal. It can attract attention, convey meaning, and influence decisions—often on a subconscious level.

      ## How Color Affects Perception

      Studies have shown that people make subconscious judgments about products within 90 seconds of initial viewing, and up to 90% of that assessment is based on color alone.

      ## The Emotional Impact of Common Colors

      ### Red

      Red stimulates excitement and urgency. It's often used for clearance sales, fast food restaurants, and products that want to convey passion or energy.

      ### Blue

      Blue evokes feelings of trust, security, and reliability. It's no coincidence that many banks, healthcare providers, and tech companies use blue in their branding.

      ### Green

      Green represents growth, health, and tranquility. It's the color of choice for products positioning themselves as natural, organic, or environmentally friendly.

      ### Black

      Black communicates sophistication, luxury, and authority. Premium products often feature black packaging to signal their high-end status.

      ### White

      White suggests simplicity, purity, and cleanliness. It's frequently used in minimalist product design and healthcare products.

      ## Cultural Considerations

      It's important to note that color associations can vary significantly across cultures. For example:

      - White is associated with purity in Western cultures but can symbolize mourning in some Eastern cultures
      - Red signifies luck and prosperity in Chinese culture but can represent danger in Western contexts
      - Purple has royal associations in many Western countries but can have different connotations elsewhere

      ## Color in Product Categories

      ### Fashion

      In clothing and accessories, color trends shift seasonally, but certain colors maintain consistent associations—black for sophistication, pastels for softness and youth, bold colors for confidence.

      ### Technology

      Tech products often use blue (trust), silver/gray (sleekness), or black (premium quality) as their primary colors, with accent colors to differentiate brands.

      ### Food and Beverage

      Food packaging frequently uses colors associated with the product's flavor or key ingredients—green for mint or lime, red for spicy or berry flavors, brown for chocolate or coffee.

      ## Conclusion

      When designing products, color should never be an afterthought. Strategic color choices can communicate your product's value proposition, target the right audience, and create emotional connections that drive purchasing decisions. Understanding the psychology of color gives designers and marketers a powerful tool for influencing consumer perception.
    `,
    coverImage: "/assets/images/fashion/3.avif",
    author: {
      name: "David Kim",
      avatar: "/assets/images/fashion/6.avif",
    },
    category: "Design",
    tags: ["psychology", "color theory", "product design", "marketing"],
    publishedAt: "2023-07-20",
    readTime: 9,
  },
  {
    id: "5",
    title: "Caring for Your Leather Goods: A Complete Guide",
    slug: "caring-leather-goods-guide",
    excerpt:
      "Learn how to maintain and extend the life of your leather bags, shoes, and accessories with these expert tips.",
    content: `
      # Caring for Your Leather Goods: A Complete Guide

      Quality leather items are investments that can last for decades—if properly maintained. This guide will walk you through everything you need to know about caring for your leather goods.

      ## Understanding Leather Types

      Different types of leather require different care approaches:

      ### Full-Grain Leather

      The highest quality leather that includes the entire grain surface. It develops a beautiful patina over time but needs regular conditioning.

      ### Top-Grain Leather

      The second-highest quality, with the outermost layer sanded and refinished. More stain-resistant than full-grain but still requires proper care.

      ### Genuine Leather

      Lower quality than the above, made from the layers of hide remaining after the top is split off. Less durable but still benefits from basic leather care.

      ### Suede and Nubuck

      These require special care as they have a napped surface that can be easily damaged by water and oils.

      ## Essential Leather Care Products

      ### Leather Cleaner

      Removes dirt and grime without damaging the leather. Always use products specifically designed for leather.

      ### Leather Conditioner

      Replenishes natural oils to prevent drying and cracking. Apply every 3-6 months depending on use and climate.

      ### Waterproofing Spray

      Creates a protective barrier against moisture. Particularly important for leather footwear.

      ### Leather Brush

      Helps remove surface dirt and restore nap on suede and nubuck.

      ## Routine Maintenance

      ### Weekly Care

      - Wipe down leather items with a soft, dry cloth to remove dust
      - For frequently used items like bags or shoes, inspect for dirt or stains

      ### Monthly Care

      - Clean with a leather-specific cleaner
      - Check for scuffs or damage that needs addressing

      ### Seasonal Care

      - Apply conditioner at the beginning of dry seasons (winter, summer)
      - Apply waterproofing before wet seasons
      - Store seasonal items properly when not in use

      ## Dealing with Common Issues

      ### Water Spots

      Allow to dry naturally (no heat), then condition the entire surface evenly.

      ### Scratches

      Minor scratches can often be buffed out with a soft cloth and a small amount of conditioner.

      ### Oil Stains

      Blot (don't rub) immediately, then apply a small amount of cornstarch or talcum powder to absorb the oil.

      ### Mold

      Clean with a mixture of diluted alcohol and water, then allow to dry completely before conditioning.

      ## Storage Tips

      - Store leather items in a cool, dry place away from direct sunlight
      - Use dust bags for leather bags and shoes
      - Stuff bags with acid-free tissue paper to maintain their shape
      - Use shoe trees for leather footwear

      ## Conclusion

      With proper care, your leather goods can remain beautiful and functional for many years. The small investment of time in regular maintenance pays off in the extended life of these items, making them not just purchases but true investments in your wardrobe.
    `,
    coverImage: "/assets/images/fashion/5.avif",
    author: {
      name: "Isabella Martinez",
      avatar: "/assets/images/fashion/1.avif",
    },
    category: "Lifestyle",
    tags: ["leather", "maintenance", "accessories", "fashion"],
    publishedAt: "2023-06-05",
    readTime: 10,
  },
];
