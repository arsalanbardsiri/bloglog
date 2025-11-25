"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { StickyNote } from "@/components/StickyNote";
import { PaperModal } from "@/components/PaperModal";
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

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row"
            >
                <div>
                    <h1 className="text-4xl font-handwriting font-bold text-stone-800">Explore Ideas</h1>
                    <p className="text-stone-500 font-serif italic">Pinned thoughts from the community.</p>
                </div>

                <div className="flex gap-2 bg-stone-200/50 p-1 rounded-lg">
                    <button
                        onClick={() => setSortBy("new")}
                        className={cn(
                            "rounded-md px-4 py-2 text-sm font-medium transition-colors font-handwriting",
                            sortBy === "new" ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"
                        )}
                    >
                        Newest
                    </button>
                    <button
                        onClick={() => setSortBy("top")}
                        className={cn(
                            "rounded-md px-4 py-2 text-sm font-medium transition-colors font-handwriting",
                            sortBy === "top" ? "bg-white shadow-sm text-stone-800" : "text-stone-500 hover:text-stone-700"
                        )}
                    >
                        Top Rated
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-400 border-t-transparent" />
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={post.id} className="flex justify-center">
                                <StickyNote
                                    title={post.title}
                                    content={post.content}
                                    author={post.author.username}
                                    date={new Date(post.createdAt).toLocaleDateString()}
                                    color={["yellow", "blue", "green", "pink"][index % 4] as any}
                                    rotation={Math.random() * 6 - 3} // Random rotation between -3 and 3
                                    onClick={() => setSelectedPost(post)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-stone-500 font-handwriting text-xl">
                            No notes pinned yet. Be the first!
                        </div>
                    )}
                </div>
            )}

            {/* Paper Modal for Reading */}
            <PaperModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title={selectedPost?.title || ""}
            >
                {selectedPost && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm text-stone-500 border-b border-stone-200 pb-4">
                            <span>By <span className="font-bold text-stone-700">{selectedPost.author.username}</span></span>
                            <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-lg leading-relaxed text-stone-800 whitespace-pre-wrap">
                            {selectedPost.content}
                        </p>

                        {/* Vote & Comments Section (Simplified for Modal) */}
                        <div className="mt-8 pt-8 border-t border-stone-200">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 shadow-inner">
                                    <button onClick={() => handleVote(selectedPost.id, 1)} className={cn("p-1 hover:text-orange-500 transition-colors", selectedPost.userVote === 1 && "text-orange-500")}>
                                        <ArrowBigUp className={cn("w-6 h-6", selectedPost.userVote === 1 && "fill-current")} />
                                    </button>
                                    <span className="font-bold text-stone-700 min-w-[20px] text-center">{selectedPost.score}</span>
                                    <button onClick={() => handleVote(selectedPost.id, -1)} className={cn("p-1 hover:text-indigo-500 transition-colors", selectedPost.userVote === -1 && "text-indigo-500")}>
                                        <ArrowBigDown className={cn("w-6 h-6", selectedPost.userVote === -1 && "fill-current")} />
                                    </button>
                                </div>
                                <div className="text-stone-500 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    <span>{selectedPost.commentCount} Comments</span>
                                </div>
                            </div>

                            {/* Comments Logic (Inline for now) */}
                            <div className="bg-stone-50 p-6 rounded-lg shadow-inner">
                                <h3 className="font-handwriting text-xl mb-4 text-stone-700">Comments</h3>

                                {/* Input */}
                                {token && (
                                    <div className="flex gap-2 mb-6">
                                        <input
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a thought..."
                                            className="flex-1 bg-white border border-stone-300 rounded-md px-4 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment(selectedPost.id)}
                                        />
                                        <button onClick={() => handlePostComment(selectedPost.id)} className="bg-stone-800 text-white px-4 py-2 rounded-md hover:bg-stone-700">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Load Comments Button */}
                                {!comments[selectedPost.id] && (
                                    <button
                                        onClick={() => toggleComments(selectedPost.id)}
                                        className="text-stone-500 underline hover:text-stone-800 text-sm"
                                    >
                                        Load Comments
                                    </button>
                                )}

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {comments[selectedPost.id]?.map(comment => (
                                        <div key={comment.id} className="border-b border-stone-200 pb-2 last:border-0">
                                            <div className="flex justify-between text-xs text-stone-500 mb-1">
                                                <span className="font-bold text-stone-700">{comment.author.username}</span>
                                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-stone-800 text-sm">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </PaperModal>
        </div>
    );
}
