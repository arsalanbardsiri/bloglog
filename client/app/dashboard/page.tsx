"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { Plus, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { StickyNote } from "@/components/StickyNote";
import { PaperModal } from "@/components/PaperModal";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    score: number;
    tags?: string[];
    commentCount?: number;
}

export default function DashboardPage() {
    const { user, token, isLoading, logout } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    // Use state for initial render, ref for tracking updates without re-renders
    const [initialPositions, setInitialPositions] = useState<Record<string, { x: number; y: number }>>({});
    const notePositionsRef = useRef<Record<string, { x: number; y: number }>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("notePositions");
        if (saved) {
            const parsed = JSON.parse(saved);
            const clamped: Record<string, { x: number; y: number }> = {};

            // Clamp positions to be within viewport
            const maxX = window.innerWidth - 280; // Note width + padding
            const maxY = window.innerHeight - 200; // Rough height limit

            Object.entries(parsed).forEach(([id, pos]) => {
                const p = pos as { x: number; y: number };
                clamped[id] = {
                    x: Math.min(Math.max(p.x, -50), maxX > 0 ? maxX : 0),
                    y: Math.min(Math.max(p.y, -50), maxY > 0 ? maxY : 0)
                };
            });

            setInitialPositions(clamped);
            notePositionsRef.current = clamped;
        }
    }, []);

    const handleDragEnd = (id: string, info: { offset: { x: number; y: number } }) => {
        const current = notePositionsRef.current[id] || { x: 0, y: 0 };
        const newPos = {
            x: current.x + info.offset.x,
            y: current.y + info.offset.y
        };

        const updated = { ...notePositionsRef.current, [id]: newPos };
        notePositionsRef.current = updated;
        localStorage.setItem("notePositions", JSON.stringify(updated));
    };

    useEffect(() => {
        if (!isLoading && !token) {
            router.push("/login");
        }
    }, [isLoading, token, router]);

    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMyPosts = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/me?page=${page}&limit=6`, {
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
    }, [token, page]);

    const handleDelete = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete post");

            // Optimistic update
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete post");
        }
    };

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12" ref={containerRef}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-handwriting font-bold text-stone-800">Dashboard</h1>
                    <p className="text-stone-500 font-serif italic">Welcome back, {user.username}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                    <Link
                        href="/dashboard/new"
                        className="flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 shadow-md transition-all hover:shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Create Post
                    </Link>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="col-span-2 space-y-6">
                    <h2 className="text-xl font-handwriting font-bold text-stone-700">Your Collection</h2>

                    {loadingPosts ? (
                        <div className="flex justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-400 border-t-transparent" />
                        </div>
                    ) : posts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post, index) => (
                                <div key={post.id} className="flex justify-center relative z-10">
                                    <StickyNote
                                        title={post.title}
                                        content={post.content}
                                        date={new Date(post.createdAt).toLocaleDateString()}
                                        color={["yellow", "blue", "green", "pink"][index % 4] as "yellow" | "blue" | "green" | "pink"}
                                        rotation={Math.random() * 4 - 2}
                                        onClick={() => setSelectedPost(post)}
                                        onDragEnd={(_, info) => handleDragEnd(post.id, info)}
                                        defaultPosition={initialPositions[post.id]}
                                        draggable={true}
                                        dragConstraintsRef={containerRef}
                                        commentCount={post.commentCount}
                                        tags={post.tags}
                                        onDelete={() => handleDelete(post.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-stone-200 bg-white/50 p-8 text-center backdrop-blur-sm">
                            <FileText className="mx-auto mb-4 h-12 w-12 text-stone-400" />
                            <h3 className="mb-2 text-lg font-medium text-stone-700">No notes yet</h3>
                            <p className="mb-6 text-stone-500">
                                Start your collection of thoughts.
                            </p>
                            <Link
                                href="/dashboard/new"
                                className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
                            >
                                Write a note
                            </Link>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {!loadingPosts && (posts.length > 0 || page > 1) && (
                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 rounded-lg bg-white/50 border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors font-typewriter text-xs"
                            >
                                Previous
                            </button>
                            <span className="flex items-center px-2 font-typewriter text-stone-500 text-xs">
                                Page {page}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={posts.length < 6}
                                className="px-3 py-1 rounded-lg bg-white/50 border border-stone-200 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors font-typewriter text-xs"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-stone-200 bg-white/50 p-6 backdrop-blur-sm shadow-sm">
                        <h2 className="mb-4 text-lg font-handwriting font-bold text-stone-800">Identity Card</h2>
                        <div className="space-y-4 font-serif">
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Username</label>
                                <p className="text-stone-800 font-bold text-lg">{user.username}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Email</label>
                                <p className="text-stone-800">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Member ID</label>
                                <p className="font-mono text-xs text-stone-400">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Origami Decoration */}
                    <div className="relative h-0">
                        <div className="absolute -right-8 -bottom-24 w-32 h-32 z-10 pointer-events-none opacity-90 rotate-6">
                            <NextImage
                                src="/assets/origami/plane.png"
                                alt="Origami Plane"
                                width={128}
                                height={128}
                                className="w-full h-full object-contain drop-shadow-md mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <PaperModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title={selectedPost?.title || ""}
            >
                {selectedPost && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm text-stone-500 border-b border-stone-200 pb-4">
                            <span>By <span className="font-bold text-stone-700">Me</span></span>
                            <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Tags in Modal */}
                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedPost.tags.map((tag, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-mono border border-stone-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="text-lg leading-relaxed text-stone-800">
                            <MarkdownRenderer content={selectedPost.content} />
                        </div>
                        <div className="mt-8 pt-8 border-t border-stone-200 flex justify-end">
                            <span className={cn("text-sm font-bold px-3 py-1 rounded-full bg-stone-100", (selectedPost.score || 0) > 0 ? "text-orange-500" : "text-stone-500")}>
                                {selectedPost.score || 0} Points
                            </span>
                        </div>
                    </div>
                )}
            </PaperModal>
        </div >
    );
}
