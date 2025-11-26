"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pin } from "lucide-react";
import { useRef } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface StickyNoteProps {
    title: string;
    content: string;
    author?: string;
    date?: string;
    color?: "yellow" | "blue" | "green" | "pink";
    rotation?: number;
    onClick?: () => void;
    onDragEnd?: (e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => void;
    defaultPosition?: { x: number; y: number };
    draggable?: boolean;
    dragConstraintsRef?: any;
    commentCount?: number;
    tags?: string[];
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
    onClick,
    onDragEnd,
    defaultPosition = { x: 0, y: 0 },
    draggable = false,
    dragConstraintsRef,
    commentCount = 0,
    tags = []
}: StickyNoteProps) {
    const isDragging = useRef(false);

    const handleDragStart = () => {
        isDragging.current = true;
    };

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
        if (onDragEnd) {
            onDragEnd(e, info);
        }
        // Small delay to prevent click from firing immediately after drag
        setTimeout(() => {
            isDragging.current = false;
        }, 200);
    };

    const handleClick = () => {
        if (!isDragging.current && onClick) {
            onClick();
        }
    };

    return (
        <motion.div
            drag={draggable}
            dragConstraints={dragConstraintsRef || (draggable ? { left: -500, right: 500, top: -500, bottom: 500 } : undefined)}
            dragElastic={0.1}
            dragMomentum={false}
            whileHover={{ scale: 1.05, zIndex: 50, cursor: draggable ? "grab" : "pointer" }}
            whileDrag={{ scale: 1.1, zIndex: 100, cursor: "grabbing" }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: rotation, x: defaultPosition.x, y: defaultPosition.y }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            className={cn(
                "relative w-64 h-64 p-6 shadow-lg flex flex-col justify-between transition-shadow hover:shadow-xl",
                colors[color],
                "font-handwriting"
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
                <div className="text-sm opacity-80 line-clamp-5">
                    <MarkdownRenderer content={content} />
                </div>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 text-black/60 font-mono">
                            #{tag}
                        </span>
                    ))}
                    {tags.length > 3 && <span className="text-[10px] text-black/40">+{tags.length - 3}</span>}
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto flex justify-between items-end pt-2">
                <div className="text-xs text-stone-600 font-serif italic">
                    {date && <span>{date}</span>}
                    {author && <span className="block font-bold not-italic">@{author}</span>}
                </div>
                {commentCount > 0 && (
                    <div className="text-xs font-bold text-stone-500 flex items-center gap-1">
                        <span>{commentCount}</span>
                        <span className="text-[10px] uppercase tracking-wider">notes</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
