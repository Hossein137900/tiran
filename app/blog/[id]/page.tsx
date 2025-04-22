import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { blogPosts } from "@/lib/blog";
import BlogComments from "@/components/static/BlogComments";
import RelatedPosts from "@/components/static/RelatedPosts";

type Props = {
  params: { slug: string };
};



export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Find related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="container mx-auto px-4 py-12" dir="rtl">
      <div className="max-w-4xl mt-28 mx-auto">
        {/* Back to blog link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-black mb-8"
        >
          
          بازگشت به وبلاگ
          <ArrowLeft size={16} className="mr-2" />
        </Link>

        {/* Post header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {post.readTime} زمان مطالعه
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{post.author.name}</span>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-1">اشتراک:</span>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Facebook size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Twitter size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Linkedin size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Featured image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        {/* Post content */}
        <article className="prose prose-lg max-w-none mb-16">
         {post.content}
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-medium mb-3">تگ:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author bio */}
        <div className="bg-gray-50 rounded-lg p-6 mb-16">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">
                درباره {post.author.name}
              </h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                vitae eros quis nisl aliquam consectetur. Praesent euismod, nisi
                vel consectetur interdum, nisl nunc egestas nisi, euismod
                aliquam nisl nunc egestas nisi.
              </p>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <BlogComments
        //  postId={post.id} 
         />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-20">
          <RelatedPosts posts={relatedPosts} />
        </div>
      )}
    </main>
  );
}
