"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 text-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl space-y-8"
      >
        {/* Stamp / Badge */}
        <div className="inline-flex items-center rounded-sm border-2 border-stone-800 bg-stone-100 px-3 py-1 text-sm font-bold text-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transform -rotate-2">
          <span className="mr-2 bg-red-500 text-white px-2 py-0.5 text-[10px] uppercase tracking-wider font-sans">
            New
          </span>
          <span className="font-handwriting">System Design v2.0</span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-stone-800 sm:text-7xl font-handwriting">
          The Future of <br />
          <span className="text-indigo-600 underline decoration-wavy decoration-2 underline-offset-4">
            Distributed Content
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-stone-600 sm:text-xl font-typewriter leading-relaxed">
          "Experience a high-scale blogging platform built with modern engineering principles.
          Featuring Redis caching, rate limiting, and a distributed microservices architecture."
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-8">
          <Link
            href="/explore"
            className="group flex items-center gap-2 rounded-sm border-2 border-stone-800 bg-stone-800 px-8 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Start Reading
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="rounded-sm border-2 border-stone-800 bg-white px-8 py-3 font-bold text-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            View System Design
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
