"use client";

import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { blogPosts } from "@/lib/blog";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BlogPostPage() {
  const pathname = usePathname();
  const id = pathname.split("/")[2]; // This will extract the id from /blog/[id]

  const post = blogPosts.find((post) => post.id === id);

  if (!post) {
    return null;
  }

  // Find related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <article className="max-w-4xl mx-auto mt-36">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft size={16} className="ml-2" />
          بازگشت به وبلاگ
        </Link>
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-center text-nowrap gap-2 md:gap-6 text-gray-500 mb-6">
            <div className="flex text-xs items-center">
              <Calendar size={18} className="md:ml-2" />
              {new Date(post.publishedAt).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex text-nowrap text-xs items-center">
              <Clock size={18} className="md:ml-2" />
              {post.readTime} زمان مطالعه
            </div>
            <div className="flex text-xs items-center">
              <User size={18} className="md:ml-2" />
              {post.author.name}
            </div>
          </div>

          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </header>

        {/* Content */}
        <div className="p-2">
          {/* This would be your actual blog content */}
          <p className="text-gray-700 leading-relaxed mb-6">{post.excerpt}</p>

          {/* Placeholder content - replace with actual content from your CMS */}
          <div
            className="text-gray-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author info */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg flex items-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="mr-2">
            <h3 className="font-bold text-lg">{post.author.name}</h3>
            <p className="text-gray-600">
              {post.author.name || "نویسنده و محتوا ساز در تیران"}
            </p>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">مطالب مرتبط</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
