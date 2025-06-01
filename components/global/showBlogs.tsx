"use client";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { blogPosts } from "@/lib/blog";

export default function HomeBlogs() {
  // Get the first 3 blog posts to display
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <main className="container w-full mx-auto px-4 py-12" dir="rtl">
      {/* Featured Blogs Section */}
      <div className="flex flex-row justify-between items-center my-7 ">
        <div>
          <h2 className="md:text-3xl font-bold">آخرین مقالات</h2>
        </div>

        <div className="flex justify-center">
          <Link href="/blog">
            <button className="bg-transparent text-nowrap text-sm text-black border-b  px-1 py-1 md:px-8 md:py-3 md:text-lg font-medium transition-all duration-300 flex items-center gap-2 group">
              مشاهده همه مقالات
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featuredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group  overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar size={14} className="ml-1" />
                  {new Date(post.publishedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="ml-1" />
                  {post.readTime} زمان مطالعه
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {post.excerpt}
              </p>

              <div className="flex items-center mt-auto">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ml-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
    </main>
  );
}
