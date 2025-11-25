"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
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

        try {
            const res = await fetch("http://localhost:4000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create post");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <Link
                href="/dashboard"
                className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="mb-8 text-3xl font-bold text-white">Create New Post</h1>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="Enter post title"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Content</label>
                        <textarea
                            name="content"
                            required
                            rows={8}
                            className="w-full rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="Write your content here..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50",
                                isSubmitting && "cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Publishing...
                                </span>
                            ) : (
                                "Publish Post"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
