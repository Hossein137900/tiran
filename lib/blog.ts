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
    id: "summer-fashion-guide",
    title: "راهنمای کامل مد تابستانی ۱۴۰۳",
    excerpt:
      "در این مقاله با ترندهای جدید لباس تابستانی و نکات ست کردن آشنا می‌شوید...",
    content: `
      <p>تابستان امسال با ترندهای جدید و هیجان‌انگیزی همراه است. در این راهنما، بهترین انتخاب‌های لباس تابستانی را به شما معرفی می‌کنیم که هم شیک باشند و هم در گرمای تابستان راحت.</p>
      <h2>چرا انتخاب پارچه مناسب مهم است؟</h2>
      <p>پارچه‌های نامناسب در تابستان می‌توانند باعث ناراحتی و عرق کردن بیش از حد شوند. پارچه‌های نخی و کتان بهترین گزینه برای فصل گرما هستند...</p>
    `,
    category: "مد و لباس",
    coverImage: "/assets/images/fashion/1.avif",
    publishedAt: "2024-06-01T10:00:00Z",
    readTime: "5 دقیقه",
    author: {
      name: "سارا محمدی",
      avatar: "/assets/images/fashion/2.avif",
    },
  },
  {
    id: "sustainable-fashion-tips",
    title: "۵ نکته طلایی برای خرید لباس پایدار و دوستدار محیط زیست",
    excerpt:
      "چطور لباس‌هایی انتخاب کنیم که هم شیک باشند و هم به محیط زیست آسیب نزنند؟",
    content: `
      <p>مد پایدار یکی از مهم‌ترین جنبش‌های صنعت مد در سال‌های اخیر بوده است. با این نکات می‌توانید انتخاب‌های آگاهانه‌تری داشته باشید.</p>
      <ul>
        <li>به برچسب‌های لباس و مواد تشکیل‌دهنده آن‌ها توجه کنید</li>
        <li>از برندهای محلی و اخلاق‌مدار خرید کنید</li>
        <li>به جای خرید زیاد، لباس‌های باکیفیت و چندکاره بخرید</li>
      </ul>
    `,
    category: "مد پایدار",
    coverImage: "/assets/images/fashion/6.avif",
    publishedAt: "2024-05-10T09:30:00Z",
    readTime: "7 دقیقه",
    author: {
      name: "نیلوفر احمدی",
      avatar: "/assets/images/fashion/6.avif",
    },
  },
];
