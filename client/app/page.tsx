"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-black [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl space-y-8"
      >
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
          <span className="mr-2 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            New
          </span>
          System Design Architecture v2.0
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          The Future of <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Distributed Content
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Experience a high-scale blogging platform built with modern engineering principles.
          Featuring Redis caching, rate limiting, and a distributed microservices architecture.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/explore"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-black transition-all hover:bg-zinc-200"
          >
            Start Reading
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            View System Design
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
