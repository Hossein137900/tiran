import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {post.readTime} min read
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
