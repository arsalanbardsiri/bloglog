"use client";

import { motion } from "framer-motion";
import { Server, Database, Shield, Zap } from "lucide-react";

const features = [
    {
        icon: <Server className="h-6 w-6 text-indigo-400" />,
        title: "Microservices Architecture",
        description: "Built with Docker containers orchestrating Node.js backend, Next.js frontend, and Redis cache.",
    },
    {
        icon: <Database className="h-6 w-6 text-purple-400" />,
        title: "PostgreSQL + Prisma",
        description: "Robust relational data modeling with Type-safe ORM for reliable data integrity.",
    },
    {
        icon: <Zap className="h-6 w-6 text-yellow-400" />,
        title: "Redis Caching",
        description: "Implemented Cache-Aside pattern to reduce database load and serve content instantly.",
    },
    {
        icon: <Shield className="h-6 w-6 text-green-400" />,
        title: "Rate Limiting",
        description: "Custom middleware protecting the API from DDoS attacks using Redis-based counters.",
    },
];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl text-center"
            >
                <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                    System Design <span className="text-indigo-500">Architecture</span>
                </h1>
                <p className="mb-16 text-lg text-zinc-400">
                    This project is not just a blog. It is a demonstration of scalable system design principles
                    required for modern, high-performance web applications.
                </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                            {feature.icon}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-zinc-400">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
