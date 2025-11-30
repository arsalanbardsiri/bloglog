"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Simple confetti effect using CSS or just a state trigger for animation
        setShowConfetti(true);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4 font-mono overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                backgroundSize: "20px 20px"
            }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative w-full max-w-md bg-white p-8 shadow-2xl border-2 border-stone-800 rotate-1"
            >
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/80 rotate-1 shadow-sm border border-yellow-200/50"></div>

                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-800 text-green-800"
                    >
                        <Heart className="w-10 h-10 fill-current" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-stone-800 mb-2 font-handwriting">Thank You!</h1>
                    <p className="text-stone-600">Your contribution has been received.</p>
                </div>

                <div className="bg-stone-50 p-6 rounded border border-stone-200 mb-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-stone-500 text-sm">Amount</span>
                        <span className="font-bold text-stone-800">$1.00</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-stone-500 text-sm">Status</span>
                        <span className="text-green-600 font-bold flex items-center gap-1 text-sm">
                            <Check className="w-3 h-3" /> Successful
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-stone-500 text-sm">Reference</span>
                        <span className="text-stone-400 text-xs font-mono">
                            {sessionId ? `${sessionId.slice(0, 8)}...` : "N/A"}
                        </span>
                    </div>

                    {/* Stamp Effect */}
                    <motion.div
                        initial={{ opacity: 0, scale: 2, rotate: -20 }}
                        animate={{ opacity: 0.1, scale: 1, rotate: -12 }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-stone-900 p-2 rounded-full"
                    >
                        <span className="text-4xl font-black uppercase tracking-widest text-stone-900">PAID</span>
                    </motion.div>
                </div>

                <div className="space-y-3">
                    <Link href="/dashboard" className="block w-full">
                        <button className="w-full bg-stone-800 text-white py-3 px-4 rounded font-bold hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
                            Return to Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                    <Link href="/explore" className="block w-full text-center">
                        <span className="text-stone-500 hover:text-stone-800 text-sm underline decoration-stone-300 underline-offset-4">
                            Continue Exploring
                        </span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
