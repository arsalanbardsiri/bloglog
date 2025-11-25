"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    score: number;
}

export default function DashboardPage() {
    const { user, token, isLoading, logout } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        if (!isLoading && !token) {
            router.push("/login");
        }
    }, [isLoading, token, router]);

    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!token) return;
            try {
                const res = await fetch("http://localhost:4000/api/posts/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchMyPosts();
    }, [token]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-zinc-400">Welcome back, {user.username}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                    <Link
                        href="/dashboard/new"
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        Create Post
                    </Link>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white">Your Posts</h2>

                    {loadingPosts ? (
                        <div className="flex justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:bg-zinc-900/80"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                                    <span className={cn(
                                        "text-sm font-bold px-2 py-1 rounded bg-white/5",
                                        (post.score || 0) > 0 ? "text-orange-500" : "text-zinc-400"
                                    )}>
                                        {post.score || 0} pts
                                    </span>
                                </div>
                                <p className="mb-4 text-zinc-400 line-clamp-2">{post.content}</p>
                                <p className="text-xs text-zinc-500">
                                    Published on {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center backdrop-blur-sm">
                            <FileText className="mx-auto mb-4 h-12 w-12 text-zinc-600" />
                            <h3 className="mb-2 text-lg font-medium text-white">No posts yet</h3>
                            <p className="mb-6 text-zinc-400">
                                Share your thoughts with the community.
                            </p>
                            <Link
                                href="/dashboard/new"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                            >
                                Write your first post
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
                        <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-zinc-500">Username</label>
                                <p className="text-white">{user.username}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-500">Email</label>
                                <p className="text-white">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-500">User ID</label>
                                <p className="font-mono text-xs text-zinc-400">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
