"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/images/avatars/avatar-1.jpg",
    rating: 5,
    date: "2023-10-15",
    text: "Absolutely love this product! The quality is exceptional and it exceeded my expectations. Would definitely recommend to anyone looking for something reliable and stylish.",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "/images/avatars/avatar-2.jpg",
    rating: 4,
    date: "2023-09-28",
    text: "Great product overall. The only reason I",
  },
];

interface ProductCommentsProps {
  productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      name: "You", // In a real app, this would be the user's name
      avatar: "/images/avatars/avatar-user.jpg", // In a real app, this would be the user's avatar
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
      text: newComment.trim(),
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-6">
        نظرات مشتریان
      </h2>

      {/* Add a review form */}
      <form
        onSubmit={handleSubmitComment}
        className="mb-10 bg-gray-50 p-6 rounded-lg"
      >
        <h3 className="text-lg font-medium mb-4">
          نظرات خود را با ما به اشتراک بگذارید
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            امتیاز شما
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(rating)}
                className="p-1"
              >
                <Star
                  size={24}
                  className={`${
                    (hoverRating || newRating) >= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            نظر شما
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر شما در مورد این محصول"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          
          ثبت نظر
          <Send size={18} />
        </button>
      </form>

      {/* Reviews list */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="object-cover"
                    onError={(e) => {
                      // Fallback for missing avatars
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/40";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-medium">{comment.name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < comment.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  <p className="text-gray-700">{comment.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </div>
  );
}
