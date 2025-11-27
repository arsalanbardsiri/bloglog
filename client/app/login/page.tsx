"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const { login, token, user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token && user) {
            router.push("/dashboard");
        }
    }, [token, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            login(data.token, data.user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                className="w-full max-w-md relative"
            >
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm rotate-1 shadow-sm z-20 border-l border-r border-white/20" />

                {/* Index Card Container */}
                <div className="bg-[#fdfbf7] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] rotate-2 relative overflow-hidden border border-stone-200">

                    {/* Paper Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <h1 className="text-4xl font-bold text-stone-800 font-handwriting mb-2 opacity-90">Access Pass</h1>
                        <div className="h-px w-24 mx-auto bg-stone-300" />
                        <p className="mt-2 text-stone-500 font-typewriter text-xs tracking-widest uppercase">Authorized Personnel Only</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 p-3 border-l-4 border-red-400 text-sm text-red-600 font-typewriter">
                            Error: {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider font-typewriter">Identity (Email)</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-transparent border-b-2 border-stone-300 px-2 py-2 text-stone-800 font-typewriter focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-stone-300"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider font-typewriter">Secret Code (Password)</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-transparent border-b-2 border-stone-300 px-2 py-2 text-stone-800 font-typewriter focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-stone-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full group relative overflow-hidden rounded-sm border-2 border-stone-800 bg-stone-800 px-4 py-3 text-white transition-all hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                    isLoading && "opacity-80"
                                )}
                            >
                                <span className={cn(
                                    "relative z-10 flex items-center justify-center gap-2 font-bold tracking-widest uppercase font-typewriter",
                                    isLoading ? "opacity-0" : "opacity-100"
                                )}>
                                    Stamp to Enter
                                </span>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center relative z-10">
                        <p className="text-xs text-stone-400 font-typewriter">
                            No pass?{" "}
                            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 underline decoration-wavy underline-offset-2">
                                Apply here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Origami Decorations */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 z-30 pointer-events-none opacity-90 rotate-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/origami/boat.png"
                        alt="Origami Boat"
                        className="w-full h-full object-contain drop-shadow-md mix-blend-multiply"
                    />
                </div>
                <div className="absolute -top-16 -left-16 w-40 h-40 z-0 pointer-events-none opacity-80 -rotate-12">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/assets/origami/crane.png"
                        alt="Origami Crane"
                        className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply"
                    />
                </div>
            </motion.div>
        </div>
    );
}
