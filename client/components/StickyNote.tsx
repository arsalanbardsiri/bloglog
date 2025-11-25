"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";

interface StickyNoteProps {
    title: string;
    content: string;
    author?: string;
    date?: string;
    color?: "yellow" | "blue" | "green" | "pink";
    rotation?: number;
    onClick?: () => void;
}

const colors = {
    yellow: "bg-yellow-200 text-yellow-900",
    blue: "bg-blue-200 text-blue-900",
    green: "bg-green-200 text-green-900",
    pink: "bg-pink-200 text-pink-900",
};

export function StickyNote({
    title,
    content,
    author,
    date,
    color = "yellow",
    rotation = 0,
    onClick
}: StickyNoteProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: rotation }}
            onClick={onClick}
            className={cn(
                "relative w-64 h-64 p-6 shadow-lg cursor-pointer flex flex-col justify-between transition-shadow hover:shadow-xl",
                colors[color],
                "font-handwriting" // Using our custom font class
            )}
            style={{
                boxShadow: "5px 5px 15px rgba(0,0,0,0.15)"
            }}
        >
            {/* Pin Visual */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-sm z-20 border border-red-600/20" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-700 opacity-50">
                <Pin className="w-4 h-4 fill-red-700" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
                <p className="text-sm opacity-80 line-clamp-6">{content}</p>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-end text-xs opacity-60 font-sans">
                <span>{author}</span>
                <span>{date}</span>
            </div>
        </motion.div>
    );
}
