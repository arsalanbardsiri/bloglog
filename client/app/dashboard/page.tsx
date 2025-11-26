"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { StickyNote } from "@/components/StickyNote";
import { PaperModal } from "@/components/PaperModal";

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
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [notePositions, setNotePositions] = useState<Record<string, { x: number; y: number }>>({});

    useEffect(() => {
        const saved = localStorage.getItem("notePositions");
        if (saved) {
            setNotePositions(JSON.parse(saved));
        }
    }, []);

    const handleDragEnd = (id: string, info: { offset: { x: number; y: number } }) => {
        const current = notePositions[id] || { x: 0, y: 0 };
        const newPos = {
            x: current.x + info.offset.x,
            y: current.y + info.offset.y
        };

        const updated = { ...notePositions, [id]: newPos };
        setNotePositions(updated);
        localStorage.setItem("notePositions", JSON.stringify(updated));
    };

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
                                        defaultPosition={notePositions[post.id]}
                                        draggable={true}
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
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 z-10 pointer-events-none opacity-90 rotate-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/assets/origami/plane.png"
                                alt="Origami Plane"
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
                        <p className="text-lg leading-relaxed text-stone-800 whitespace-pre-wrap">
                            {selectedPost.content}
                        </p>
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
