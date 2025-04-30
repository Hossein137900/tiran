// lib/blog.ts
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  publishedAt: string; // ISO date string
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
};

export const blogPosts: BlogPost[] = [
  {
    id: "renault-parts-guide",
    title: "راهنمای کامل خرید لوازم یدکی رنو",
    excerpt: "در این مقاله با نکات مهم خرید قطعات یدکی رنو آشنا می‌شوید...",
    content: `
      <p>اگر شما هم مالک یکی از خودروهای رنو هستید، حتماً با چالش‌های خرید قطعات یدکی اصل مواجه شدید. در این مقاله به بررسی انواع قطعات، قیمت‌ها و نحوه تشخیص قطعه اصل از تقلبی می‌پردازیم.</p>
      <h2>چرا قطعات اصل مهم هستند؟</h2>
      <p>قطعات غیراصل ممکن است عمر کمتری داشته باشند و به سیستم خودروی شما آسیب بزنند...</p>
    `,
    category: "خودرو",
    coverImage: "/images/blog/renault-cover.jpg",
    publishedAt: "2024-12-01T10:00:00Z",
    readTime: "5 دقیقه",
    author: {
      name: "محمد رضایی",
      avatar: "/images/authors/mohammad.jpg",
    },
  },
  {
    id: "seo-tips-2025",
    title: "۵ نکته طلایی برای سئوی سایت در سال ۲۰۲۵",
    excerpt:
      "سئو در سال ۲۰۲۵ تغییرات زیادی داشته؛ با این نکات سایتت رو جلو بنداز!",
    content: `
      <p>سئو همیشه در حال تغییره، ولی تو سال ۲۰۲۵ باید تمرکز رو بذاری روی تجربه کاربر، ساختار معنایی محتوا، و سرعت بالا.</p>
      <ul>
        <li>استفاده از داده‌های ساختاریافته (Structured Data)</li>
        <li>افزایش سرعت سایت با بهینه‌سازی تصاویر</li>
        <li>تولید محتوای یونیک و مفید</li>
      </ul>
    `,
    category: "دیجیتال مارکتینگ",
    coverImage: "/images/blog/seo-2025.jpg",
    publishedAt: "2025-02-10T09:30:00Z",
    readTime: "7 دقیقه",
    author: {
      name: "زهرا احمدی",
      avatar: "/images/authors/zahra.jpg",
    },
  },

  // 👇 پست‌های بیشتر می‌تونی به همین ساختار اضافه کنی
];
