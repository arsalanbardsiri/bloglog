"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsLoading(false);
        router.push("/");
    };

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl"
            >
                <h1 className="mb-2 text-2xl font-bold text-white">Create an account</h1>
                <p className="mb-6 text-zinc-400">Join the community of senior engineers.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full rounded-lg bg-white py-2 font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-50",
                            isLoading && "cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Creating account...
                            </span>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
