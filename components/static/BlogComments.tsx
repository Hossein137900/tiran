"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  avatar: string;
  date: string;
  text: string;
  replies?: Comment[];
}

// Mock comments data
const initialComments: Comment[] = [
  {
    id: "1",
    name: "Michael Thompson",
    avatar: "/images/avatars/comment-1.jpg",
    date: "2023-10-18",
    text: "This article was incredibly insightful! I Thanks for sharing your expertise.",
    replies: [
      {
        id: "1-1",
        name: "Blog Author",
        avatar: "/images/avatars/author-1.jpg",
        date: "2023-10-19",
        text: "Thank you for your kind words, Michael! Im glad you found the article helpful. Feel free to reach out if you have any questions.",
      },
    ],
  },
  {
    id: "2",
    name: "Jessica Lee",
    avatar: "/images/avatars/comment-2.jpg",
    date: "2023-10-15",
    text: "I have a different perspective on this. While I appreciate the points made, I think there are some important considerations that werent addressed, particularly regarding the environmental impact. Would love to see a follow-up article diving deeper into that aspect.",
  },
];

// interface BlogCommentsProps {
//   postId: string;
// }

export default function BlogComments() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      name: "You", // In a real app, this would be the user's name
      avatar: "/images/avatars/user.jpg", // In a real app, this would be the user's avatar
      date: new Date().toISOString().split("T")[0],
      text: newComment.trim(),
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6">نظرات ({comments.length})</h2>

      {/* Add comment form */}
      <form onSubmit={handleSubmitComment} className="mb-10">
        <div className="flex gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src="/images/avatars/user.jpg"
              alt="Your avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              required
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                ثبت نظر
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={comment.avatar}
                  alt={comment.name}
                  className="object-cover"
                  width={40}
                  height={40}
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

                <p className="text-gray-700 mb-4">{comment.text}</p>

                {/* Reply button */}
                <button className="text-sm text-gray-500 hover:text-black">
                  پاسخ
                </button>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 ml-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={reply.avatar}
                              alt={reply.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-medium">{reply.name}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(reply.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>

                            <p className="text-gray-700">{reply.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>هنوز نظری ثبت نشده است.</p>
            <p className="mt-2">شما اولین نفر باشید که نظر میدهید!</p>
          </div>
        )}
      </div>
    </div>
  );
}
