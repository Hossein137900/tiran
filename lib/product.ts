export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  primaryImage: string;
  secondaryImage: string; // Image shown on hover
  description: string;
  rating: number;
  inStock: boolean;
  discount?: number; // Optional discount percentage
  tags: string[];
  colors?: string[]; // Available colors
  sizes?: string[]; // Available sizes
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    category: "Clothing",
    primaryImage: "/assets/images/fashion/5.avif",
    secondaryImage: "/assets/images/fashion/3.avif",
    description: "Ultra-soft premium cotton t-shirt with a comfortable fit.",
    rating: 4.8,
    inStock: true,
    discount: 10,
    tags: ["cotton", "casual", "summer"],
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Leather Crossbody Bag",
    price: 89.99,
    category: "Accessories",
    primaryImage: "/assets/images/fashion/1.avif",
    secondaryImage: "/assets/images/fashion/2.avif",
    description: "Elegant leather crossbody bag with multiple compartments.",
    rating: 4.7,
    inStock: true,
    tags: ["leather", "accessory", "casual"],
    colors: ["Brown", "Black", "Tan"],
  },
  {
    id: "3",
    name: "Wireless Noise-Cancelling Headphones",
    price: 199.99,
    category: "Electronics",
    primaryImage: "/assets/images/fashion/3.avif",
    secondaryImage: "/assets/images/fashion/4.avif",
    description: "Premium wireless headphones with active noise cancellation.",
    rating: 4.9,
    inStock: true,
    discount: 15,
    tags: ["electronics", "audio", "wireless"],
    colors: ["Black", "Silver", "Rose Gold"],
  },
  {
    id: "4",
    name: "Slim Fit Denim Jeans",
    price: 59.99,
    category: "Clothing",
    primaryImage: "/assets/images/fashion/5.avif",
    secondaryImage: "/assets/images/fashion/2.avif",
    description: "Classic slim fit denim jeans with stretch comfort.",
    rating: 4.5,
    inStock: true,
    tags: ["denim", "casual", "everyday"],
    colors: ["Blue", "Black", "Gray"],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "5",
    name: "Minimalist Watch",
    price: 129.99,
    category: "Accessories",
    primaryImage: "/assets/images/fashion/4.avif",
    secondaryImage: "/assets/images/fashion/3.avif",
    description: "Elegant minimalist watch with leather strap.",
    rating: 4.6,
    inStock: true,
    tags: ["accessory", "timepiece", "formal"],
    colors: ["Black/Silver", "Brown/Gold"],
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug Set",
    price: 34.99,
    category: "Home",
    primaryImage: "/assets/images/fashion/4.avif",
    secondaryImage: "/assets/images/fashion/6.avif",
    description: "Set of 4 ceramic coffee mugs in assorted colors.",
    rating: 4.4,
    inStock: true,
    discount: 20,
    tags: ["kitchen", "ceramic", "coffee"],
    colors: ["Assorted"],
  },
  {
    id: "7",
    name: "Fitness Tracker",
    price: 79.99,
    category: "Electronics",
    primaryImage: "/assets/images/fashion/6.avif",
    secondaryImage: "/assets/images/fashion/2.avif",
    description: "Water-resistant fitness tracker with heart rate monitoring.",
    rating: 4.3,
    inStock: false,
    tags: ["electronics", "fitness", "health"],
    colors: ["Black", "Blue", "Pink"],
  },
  {
    id: "8",
    name: "Wool Blend Sweater",
    price: 69.99,
    category: "Clothing",
    primaryImage: "/assets/images/fashion/1.avif",
    secondaryImage: "/assets/images/fashion/5.avif",
    description: "Warm wool blend sweater perfect for cold weather.",
    rating: 4.7,
    inStock: true,
    tags: ["wool", "winter", "warm"],
    colors: ["Cream", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL"],
  },
];
