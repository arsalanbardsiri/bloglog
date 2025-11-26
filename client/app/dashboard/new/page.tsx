"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, PenTool } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CreatePostPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoading && !token) {
            router.push("/login");
        }
    }, [isLoading, token, router]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const tagsString = formData.get("tags") as string;
        const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

        try {
            const res = await fetch("http://localhost:4000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, tags }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create post");
            }

            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <Link
                href="/dashboard"
                className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors font-typewriter uppercase tracking-wider"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Desk
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                {/* Writing Pad Container */}
                <div className="bg-[#fdfbf7] p-8 md:p-12 shadow-xl relative overflow-hidden border border-stone-200 rotate-1">

                    {/* Paper Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Header */}
                    <div className="mb-8 flex items-center gap-4 border-b-2 border-stone-800 pb-4">
                        <PenTool className="h-8 w-8 text-stone-800" />
                        <h1 className="text-3xl font-bold text-stone-800 font-handwriting">New Entry</h1>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 p-4 border-l-4 border-red-400 text-sm text-red-600 font-typewriter">
                            Error: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider font-typewriter">Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="w-full bg-transparent border-b-2 border-stone-300 px-2 py-2 text-2xl font-handwriting text-stone-800 focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-stone-300"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider font-typewriter">Tags (Optional)</label>
                            <input
                                name="tags"
                                type="text"
                                className="w-full bg-transparent border-b-2 border-stone-300 px-2 py-2 text-sm font-mono text-stone-600 focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-stone-300"
                                placeholder="e.g. react, bug, idea (comma separated)"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider font-typewriter">Content</label>
                            <div className="relative">
                                {/* Lined Paper Background for Textarea */}
                                <div className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: "linear-gradient(transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
                                        backgroundSize: "100% 32px",
                                        marginTop: "8px"
                                    }}
                                />
                                <textarea
                                    name="content"
                                    required
                                    rows={12}
                                    className="w-full bg-transparent px-2 py-2 text-lg font-serif text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-sm caret-indigo-600 resize-none leading-[32px] custom-scrollbar min-h-[400px]"
                                    placeholder="Start writing..."
                                    style={{ lineHeight: "32px" }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "group relative overflow-hidden rounded-sm border-2 border-stone-800 bg-stone-800 px-8 py-3 text-white transition-all hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                    isSubmitting && "opacity-80"
                                )}
                            >
                                <span className={cn(
                                    "relative z-10 flex items-center justify-center gap-2 font-bold tracking-widest uppercase font-typewriter",
                                    isSubmitting ? "opacity-0" : "opacity-100"
                                )}>
                                    Stamp & Publish
                                </span>
                                {isSubmitting && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Origami Decorations */}
                <div className="absolute -top-8 -right-8 w-24 h-24 z-20 pointer-events-none opacity-90 rotate-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/origami/plane.png"
                        alt="Origami Plane"
                        className="w-full h-full object-contain drop-shadow-md mix-blend-multiply"
                    />
                </div>
            </motion.div>
        </div>
    );
}
