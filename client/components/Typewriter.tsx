"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export function Typewriter({
    phrases,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
}: TypewriterProps) {
    const [text, setText] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];

        const timer = setTimeout(() => {
            if (isDeleting) {
                setText(currentPhrase.substring(0, text.length - 1));
            } else {
                setText(currentPhrase.substring(0, text.length + 1));
            }

            // Determine next state
            if (!isDeleting && text === currentPhrase) {
                // Finished typing, wait before deleting
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && text === "") {
                // Finished deleting, move to next phrase
                setIsDeleting(false);
                setPhraseIndex((prev) => (prev + 1) % phrases.length);
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className="inline-block relative">
            {text}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute -right-1 top-0 h-full w-[2px] bg-stone-200 ml-1"
            />
        </span>
    );
}
