"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
}

export default function ExplorePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/posts");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="mb-4 text-4xl font-bold text-white">Explore Content</h1>
                <p className="text-zinc-400">Discover the latest articles from our community.</p>
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
                                className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-zinc-900/80"
                            >
                                <h2 className="mb-2 text-xl font-semibold text-white">{post.title}</h2>
                                <p className="mb-4 text-sm text-zinc-400">By {post.author?.username || 'Unknown'}</p>
                                <p className="text-zinc-300 line-clamp-3">{post.content}</p>
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
