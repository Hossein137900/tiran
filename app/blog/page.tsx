import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
  // Get featured post (most recent)
  const featuredPost = blogPosts[0];
  // Get rest of the posts
  const remainingPosts = blogPosts.slice(1);

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="text-center mt-28 mb-12">
        <h1 className="text-4xl font-bold mb-4">وبلاگ</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          آخرین روندها، بینش ها و الهامات تیم ما را کشف کنید
        </p>
      </div>

      {/* Featured Post */}
      <div className="mb-16">
        <Link href={`/blog/${featuredPost.id}`} className="group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {featuredPost.category}
                </span>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(featuredPost.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {featuredPost.readTime} زمان مطالعه
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>

              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{featuredPost.author.name}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Remaining Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {remainingPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
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

            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {post.readTime} زمان مطالعه
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
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
    </main>
  );
}
