"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PaperModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function PaperModal({ isOpen, onClose, title, children }: PaperModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Paper Sheet */}
                    <motion.div
                        initial={{ y: "100%", rotate: 5 }}
                        animate={{ y: 0, rotate: 0 }}
                        exit={{ y: "100%", rotate: 5 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-[#fdfbf7] shadow-2xl rounded-sm overflow-hidden flex flex-col"
                    >
                        {/* Paper Texture & Lines */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />
                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)",
                                backgroundSize: "100% 2rem",
                                marginTop: "4rem"
                            }}
                        />
                        <div className="absolute left-12 top-0 bottom-0 w-px bg-red-200 pointer-events-none" />

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between p-6 border-b border-transparent">
                            <h2 className="text-2xl font-handwriting text-stone-800 pl-8">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6 pl-14 pr-8">
                            <div className="prose prose-stone max-w-none font-serif">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
