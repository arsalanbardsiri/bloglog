"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F0] px-4 text-center relative overflow-hidden">

      {/* The Board */}
      <div className="relative z-10 p-8 md:p-12 wood-frame chalkboard max-w-5xl w-full mx-auto transform rotate-1 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Chalk Title */}
          <h1 className="mb-8 text-6xl md:text-8xl font-bold chalk-text tracking-tight">
            Blog Lounge
          </h1>

          {/* Typewriter Subtitle */}
          <div className="mb-12 h-24 text-2xl md:text-4xl chalk-text flex flex-col items-center justify-center">
            <span className="mb-2 opacity-80">Where developers come to</span>
            <span className="font-bold underline decoration-stone-400 decoration-wavy underline-offset-8">
              <Typewriter
                phrases={[
                  "share knowledge.",
                  "debug together.",
                  "write their legacy.",
                  "learn and grow."
                ]}
              />
            </span>
          </div>

          {/* Call to Action - Eraser/Chalk Style */}
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center mt-4">
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm bg-stone-100 px-8 py-4 text-xl font-bold text-stone-800 transition-transform hover:scale-105 hover:-rotate-1 shadow-lg"
              style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.3)" }}
            >
              <BookOpen className="h-6 w-6" />
              <span>Enter Classroom</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-200 to-stone-100 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors font-handwriting text-2xl underline decoration-stone-600 underline-offset-4 hover:decoration-stone-400 chalk-dust"
            >
              Just looking around <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        {/* Chalk Dust / Eraser Marks */}
        <div className="absolute bottom-10 left-10 opacity-30 rotate-12 pointer-events-none">
          <div className="w-48 h-12 bg-white rounded-full blur-xl opacity-20" />
        </div>
      </div>

      <footer className="absolute bottom-6 text-stone-600 font-serif text-sm">
        © 2025 Blog Lounge. Class is in session.
      </footer>
    </main>
  );
}
