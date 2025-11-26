"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Send } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        username: string;
    };
}

interface CommentsSectionProps {
    postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const { token, user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !token) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const comment = await res.json();
                setComments(prev => [comment, ...prev]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-stone-200">
            <h3 className="text-xl font-handwriting font-bold text-stone-800 mb-6">Comments</h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a note..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-sm p-4 pr-12 font-serif text-stone-800 focus:outline-none focus:border-stone-400 resize-none h-24"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="absolute bottom-4 right-4 p-2 text-stone-400 hover:text-stone-800 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-stone-50 border border-stone-200 text-center text-stone-500 font-serif italic text-sm">
                    Please login to leave a note.
                </div>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-500 font-bold text-xs uppercase">
                                {comment.author.username[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="font-bold text-stone-700 text-sm">@{comment.author.username}</span>
                                    <span className="text-xs text-stone-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-stone-600 font-serif text-sm leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-stone-400 font-serif italic">No notes yet. Be the first!</p>
            )}
        </div>
    );
}
