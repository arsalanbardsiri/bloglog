"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        username: string;
    };
}

interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
    score: number;
    userVote?: number; // 1, -1, or undefined
    createdAt: string;
    commentCount: number;
}

export default function ExplorePage() {
    const { token } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"new" | "top">("new");

    // Comments State
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<string, Comment[]>>({});
    const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
    const [newComment, setNewComment] = useState("");

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const headers: HeadersInit = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch("http://localhost:4000/api/posts", { headers });
            const data = await res.json();
            if (Array.isArray(data)) {
                let sortedData = [...data];
                if (sortBy === "top") {
                    sortedData.sort((a, b) => b.score - a.score);
                } else {
                    sortedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }
                setPosts(sortedData);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [token, sortBy]);

    const handleVote = async (postId: string, value: number) => {
        if (!token) return; // Or show login modal

        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    const oldVote = post.userVote || 0;
                    let newScore = post.score - oldVote + value;
                    if (oldVote === value) {
                        // Toggle off if clicking same vote? For now, just keep as is or maybe allow unvote (0)
                        // Let's keep simple switch behavior
                    }
                    return { ...post, score: newScore, userVote: value };
                }
                return post;
            })
        );

        try {
            await fetch(`http://localhost:4000/api/posts/${postId}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ value }),
            });
        } catch (error) {
            fetchPosts();
        }
    };

    const toggleComments = async (postId: string) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null);
            return;
        }

        setExpandedPostId(postId);

        if (!comments[postId]) {
            setLoadingComments(prev => ({ ...prev, [postId]: true }));
            try {
                const res = await fetch(`http://localhost:4000/api/posts/${postId}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(prev => ({ ...prev, [postId]: data }));
                }
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setLoadingComments(prev => ({ ...prev, [postId]: false }));
            }
        }
    };

    const handlePostComment = async (postId: string) => {
        if (!token || !newComment.trim()) return;

        try {
            const res = await fetch(`http://localhost:4000/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                const comment = await res.json();
                setComments(prev => ({
                    ...prev,
                    [postId]: [comment, ...(prev[postId] || [])]
                }));
                // Update local post comment count
                setPosts(prev => prev.map(p =>
                    p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ));
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
            >
                <div>
                    <h1 className="text-4xl font-bold text-white">Explore Content</h1>
                    <p className="text-zinc-400">Discover the latest articles from our community.</p>
                </div>

                <div className="flex gap-2 rounded-lg bg-zinc-900 p-1">
                    <button
                        onClick={() => setSortBy("new")}
                        className={cn(
                            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            sortBy === "new" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        Newest
                    </button>
                    <button
                        onClick={() => setSortBy("top")}
                        className={cn(
                            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            sortBy === "top" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        Top Rated
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-zinc-900/80"
                            >
                                <div className="flex gap-4">
                                    {/* Vote Column */}
                                    <div className="flex flex-col items-center gap-1">
                                        <button
                                            onClick={() => handleVote(post.id, 1)}
                                            className={cn(
                                                "rounded p-1 transition-colors hover:bg-zinc-800",
                                                post.userVote === 1 ? "text-orange-500" : "text-zinc-500"
                                            )}
                                        >
                                            <ArrowBigUp className={cn("h-8 w-8", post.userVote === 1 && "fill-current")} />
                                        </button>
                                        <span className={cn(
                                            "text-sm font-bold",
                                            post.userVote === 1 ? "text-orange-500" :
                                                post.userVote === -1 ? "text-indigo-500" : "text-zinc-300"
                                        )}>
                                            {post.score}
                                        </span>
                                        <button
                                            onClick={() => handleVote(post.id, -1)}
                                            className={cn(
                                                "rounded p-1 transition-colors hover:bg-zinc-800",
                                                post.userVote === -1 ? "text-indigo-500" : "text-zinc-500"
                                            )}
                                        >
                                            <ArrowBigDown className={cn("h-8 w-8", post.userVote === -1 && "fill-current")} />
                                        </button>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1">
                                        <h2 className="mb-2 text-xl font-semibold text-white">{post.title}</h2>
                                        <p className="mb-4 text-sm text-zinc-400">
                                            Posted by <span className="text-indigo-400">{post.author?.username || 'Unknown'}</span>
                                        </p>
                                        <p className="mb-6 text-zinc-300 line-clamp-3">{post.content}</p>

                                        <div className="mt-auto flex items-center gap-4 text-sm text-zinc-500">
                                            <button
                                                onClick={() => toggleComments(post.id)}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors hover:text-zinc-300",
                                                    expandedPostId === post.id ? "text-indigo-400" : "text-zinc-500"
                                                )}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                {post.commentCount || 0} Comments
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {expandedPostId === post.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 border-t border-white/10 pt-4">
                                                {/* Comment Input */}
                                                {token ? (
                                                    <div className="mb-4 flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            placeholder="Write a comment..."
                                                            className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handlePostComment(post.id);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handlePostComment(post.id)}
                                                            disabled={!newComment.trim()}
                                                            className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50"
                                                        >
                                                            <Send className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="mb-4 text-center text-sm text-zinc-500">
                                                        Please log in to comment.
                                                    </p>
                                                )}

                                                {/* Comments List */}
                                                {loadingComments[post.id] ? (
                                                    <div className="flex justify-center py-4">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                                                    </div>
                                                ) : comments[post.id]?.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {comments[post.id].map((comment) => (
                                                            <div key={comment.id} className="rounded-lg bg-white/5 p-3">
                                                                <div className="mb-1 flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-indigo-400">
                                                                        {comment.author.username}
                                                                    </span>
                                                                    <span className="text-[10px] text-zinc-500">
                                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-zinc-300">{comment.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-center text-sm text-zinc-500">No comments yet.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-zinc-500">
                            No posts found. Be the first to write one!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
