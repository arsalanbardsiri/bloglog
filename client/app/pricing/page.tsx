"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";

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

            if (data.url) {
                window.location.href = data.url;
            } else if (data.id) {
                // Fallback for older implementation if needed, but we prefer URL
                const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
                if (!stripe) throw new Error("Stripe failed to load");

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (stripe as any).redirectToCheckout({ sessionId: data.id });
                if (error) throw error;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to start checkout. Please ensure API keys are set.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-white p-8 shadow-xl transform rotate-1 border-t-8 border-stone-800"
                style={{
                    backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                }}
            >
                {/* Receipt Header */}
                <div className="mb-8 text-center border-b-2 border-dashed border-stone-300 pb-6">
                    <h2 className="mb-2 text-3xl font-handwriting font-bold text-stone-800">INVOICE</h2>
                    <p className="text-stone-500 font-mono text-sm">RECEIPT #001-PREMIUM</p>
                </div>

                <div className="mb-8 flex items-baseline justify-center gap-1 font-mono">
                    <span className="text-5xl font-bold text-stone-800">$10</span>
                    <span className="text-stone-500">/month</span>
                </div>

                <ul className="mb-8 space-y-4 font-serif">
                    {features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-stone-700">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-stone-800 text-stone-800">
                                <Check className="h-3 w-3" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <div className="border-t-2 border-dashed border-stone-300 pt-6">
                    <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className={cn(
                            "w-full rounded-sm bg-stone-800 py-4 font-bold text-white transition-all hover:bg-stone-700 disabled:opacity-50 shadow-lg",
                            isLoading && "cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            "PAY NOW"
                        )}
                    </button>
                </div>

                <p className="mt-6 text-center text-[10px] font-mono text-stone-400 uppercase">
                    Secure payment powered by Stripe.<br />Thank you for your business.
                </p>
            </motion.div>
        </div>
    );
}
