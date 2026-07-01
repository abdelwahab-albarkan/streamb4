"use client";

import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  postSlug: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${postSlug}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name, email, content }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Comments Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-[24px]"
        style={{
          background: "rgba(15,15,15,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h4 className="text-white font-black text-lg mb-6 uppercase tracking-wider">Leave a Comment</h4>

        {submitted ? (
          <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 text-center text-xs font-semibold text-orange-400">
            ✓ Your comment has been submitted and is pending moderation.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Your Name *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
              />
              <input
                placeholder="Email (not published)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
              />
            </div>
            <textarea
              placeholder="Write your comment..."
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none bg-white/[0.04] border border-white/[0.08]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-black text-black text-sm uppercase tracking-wider cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-wide">
              Comments are moderated before publishing.
            </p>
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="font-anton text-xl text-white uppercase tracking-wider">
          Discussion ({comments.length})
        </h4>

        {comments.length === 0 ? (
          <p className="text-gray-600 text-xs font-semibold">No comments yet. Be the first to join the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-5 rounded-[20px]"
              style={{
                background: "rgba(15,15,15,0.95)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-black text-sm uppercase"
                style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
              >
                {comment.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-bold text-sm">{comment.name}</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase">{comment.createdAt}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
