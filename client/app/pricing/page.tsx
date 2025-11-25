"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    "Access to all premium system design articles",
    "Weekly deep-dive newsletters",
    "Source code access for all projects",
    "Priority support & community access",
];

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            // Generate a random idempotency key for this attempt
            const idempotencyKey = crypto.randomUUID();

            const res = await fetch("http://localhost:4000/api/stripe/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": idempotencyKey,
                },
                body: JSON.stringify({ priceId: "price_premium" }),
            });

            const data = await res.json();

            if (data.id) {
                // Redirect to Stripe Checkout
                // In a real app, you'd use stripe.redirectToCheckout({ sessionId: data.id })
                // For this demo, we'll just log it as we don't have a real frontend Stripe key setup yet
                console.log("Redirecting to session:", data.id);
                alert(`Redirecting to Stripe Session: ${data.id}`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to start checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-xl"
            >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-3xl font-bold text-white">Premium Access</h2>
                    <p className="text-zinc-400">Unlock the full potential of System Design</p>
                </div>

                <div className="mb-8 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-white">$10</span>
                    <span className="text-zinc-400">/month</span>
                </div>

                <ul className="mb-8 space-y-4">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-zinc-300">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                                <Check className="h-4 w-4" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className={cn(
                        "w-full rounded-xl bg-white py-4 font-semibold text-black transition-all hover:bg-zinc-200 disabled:opacity-50",
                        isLoading && "cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        "Subscribe Now"
                    )}
                </button>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    Secure payment powered by Stripe. Cancel anytime.
                </p>
            </motion.div>
        </div>
    );
}
