"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Pin } from "lucide-react";
import { StickyNote } from "@/components/StickyNote";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { PaperModal } from "@/components/PaperModal";
import { CommentsSection } from "@/components/CommentsSection";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    score: number;
    tags?: string[];
    author: {
        username: string;
    };
    userVote?: number; // 1, -1, or 0
    commentCount?: number;
}

export default function ExplorePage() {
    const { token } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"new" | "top">("new");

    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const headers: HeadersInit = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?sort=${sortBy}&page=${page}&limit=9`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [token, sortBy, page]);

    const handleVote = async (value: 1 | -1) => {
        if (!selectedPost || !token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${selectedPost.id}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ value })
            });

            if (res.ok) {
                // Update local state
                setPosts(prev => prev.map(p => {
                    if (p.id === selectedPost.id) {
                        const oldVote = p.userVote || 0;
                        let newVote: number = value;
                        let newScore = p.score;

                        if (oldVote === value) {
                            // Toggle off
                            newVote = 0;
                            newScore = p.score - value;
                        } else {
                            // Change vote (or new vote)
                            // If switching from -1 to 1, we add 2. If 0 to 1, add 1.
                            newScore = p.score - oldVote + value;
                        }

                        return { ...p, score: newScore, userVote: newVote };
                    }
                    return p;
                }));

                // Update selected post as well
                setSelectedPost(prev => {
                    if (!prev) return null;
                    const oldVote = prev.userVote || 0;
                    let newVote: number = value;
                    let newScore = prev.score;

                    if (oldVote === value) {
                        newVote = 0;
                        newScore = prev.score - value;
                    } else {
                        newScore = prev.score - oldVote + value;
                    }

                    return { ...prev, score: newScore, userVote: newVote };
                });
            }
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-handwriting font-bold text-stone-800 mb-4">Community Board</h1>
                <p className="text-stone-500 font-serif italic max-w-2xl mx-auto">
                    Explore thoughts, ideas, and notes from other engineers. Pin your favorites.
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-md mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/50 backdrop-blur-sm border-b-2 border-stone-300 px-4 py-2 pl-10 text-stone-800 font-typewriter focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-stone-400"
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                </div>

                {/* Sort Tabs */}
                <div className="mt-6 flex justify-center gap-4 font-typewriter text-sm">
                    <button
                        onClick={() => setSortBy("new")}
                        className={cn(
                            "px-4 py-1 rounded-full transition-all",
                            sortBy === "new" ? "bg-stone-800 text-white shadow-md" : "text-stone-500 hover:bg-stone-200"
                        )}
                    >
                        Newest
                    </button>
                    <button
                        onClick={() => setSortBy("top")}
                        className={cn(
                            "px-4 py-1 rounded-full transition-all",
                            sortBy === "top" ? "bg-stone-800 text-white shadow-md" : "text-stone-500 hover:bg-stone-200"
                        )}
                    >
                        Top Rated
                    </button>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
                    {filteredPosts.map((post, index) => (
                        <StickyNote
                            key={post.id}
                            title={post.title}
                            content={post.content}
                            author={post.author.username}
                            date={new Date(post.createdAt).toLocaleDateString()}
                            color={["yellow", "blue", "green", "pink"][index % 4] as "yellow" | "blue" | "green" | "pink"}
                            rotation={Math.random() * 6 - 3}
                            onClick={() => setSelectedPost(post)}
                            commentCount={post.commentCount}
                        />
                    ))}
                </div>
            )}

            {!isLoading && filteredPosts.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Pin className="h-12 w-12 mx-auto mb-4 text-stone-300" />
                    <p className="font-handwriting text-xl text-stone-400">No notes found...</p>
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && (posts.length > 0 || page > 1) && (
                <div className="mt-12 flex justify-center gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors font-typewriter text-sm"
                    >
                        Previous Page
                    </button>
                    <span className="flex items-center px-4 font-typewriter text-stone-400 text-sm">
                        Page {page}
                    </span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={posts.length < 9}
                        className="px-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors font-typewriter text-sm"
                    >
                        Next Page
                    </button>
                </div>
            )}

            <PaperModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title={selectedPost?.title || ""}
            >
                {selectedPost && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm text-stone-500 border-b border-stone-200 pb-4">
                            <span>By <span className="font-bold text-stone-700">@{selectedPost.author.username}</span></span>
                            <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Tags in Modal */}
                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedPost.tags.map((tag: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-mono border border-stone-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="text-lg leading-relaxed text-stone-800">
                            <MarkdownRenderer content={selectedPost.content} />
                        </div>

                        <div className="mt-8 pt-8 border-t border-stone-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleVote(1)}
                                    disabled={!token}
                                    className={cn(
                                        "p-2 rounded-full transition-colors hover:bg-stone-100",
                                        selectedPost.userVote === 1 ? "text-orange-500 bg-orange-50" : "text-stone-400"
                                    )}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                </button>
                                <span className="font-bold text-stone-700 font-mono text-lg">{selectedPost.score}</span>
                                <button
                                    onClick={() => handleVote(-1)}
                                    disabled={!token}
                                    className={cn(
                                        "p-2 rounded-full transition-colors hover:bg-stone-100",
                                        selectedPost.userVote === -1 ? "text-indigo-500 bg-indigo-50" : "text-stone-400"
                                    )}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                            </div>

                            {!token && (
                                <span className="text-xs text-stone-400 italic">Login to vote</span>
                            )}
                        </div>

                        <CommentsSection postId={selectedPost.id} />
                    </div>
                )}
            </PaperModal>
        </div>
    );
}
