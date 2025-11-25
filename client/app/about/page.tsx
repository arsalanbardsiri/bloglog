"use client";

import { motion } from "framer-motion";
import { Server, Database, Shield, Zap } from "lucide-react";

const features = [
    {
        icon: <Server className="h-6 w-6 text-indigo-600" />,
        title: "Microservices Architecture",
        description: "Built with Docker containers orchestrating Node.js backend, Next.js frontend, and Redis cache.",
    },
    {
        icon: <Database className="h-6 w-6 text-purple-600" />,
        title: "PostgreSQL + Prisma",
        description: "Robust relational data modeling with Type-safe ORM for reliable data integrity.",
    },
    {
        icon: <Zap className="h-6 w-6 text-yellow-600" />,
        title: "Redis Caching",
        description: "Implemented Cache-Aside pattern to reduce database load and serve content instantly.",
    },
    {
        icon: <Shield className="h-6 w-6 text-green-600" />,
        title: "Rate Limiting",
        description: "Custom middleware protecting the API from DDoS attacks using Redis-based counters.",
    },
];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl text-center"
            >
                <h1 className="mb-6 text-4xl font-bold text-stone-800 sm:text-5xl font-handwriting opacity-90">
                    System Design <span className="text-indigo-600 decoration-wavy underline decoration-2 underline-offset-4">Architecture</span>
                </h1>
                <p className="mb-16 text-lg text-stone-600 font-typewriter leading-relaxed">
                    This project is not just a blog. It is a demonstration of scalable system design principles
                    required for modern, high-performance web applications.
                </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-sm border-2 border-stone-800 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(28,25,23,0.1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,0.1)]"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 border border-stone-200">
                            {feature.icon}
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-stone-800 font-handwriting">{feature.title}</h3>
                        <p className="text-sm text-stone-600 font-typewriter leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
