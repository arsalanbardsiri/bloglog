"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Home, Compass, CreditCard, Info, LogIn, User, LogOut } from "lucide-react";

interface NotebookLayoutProps {
    children: React.ReactNode;
}

const tabs = [
    { name: "Home", href: "/", icon: Home, color: "bg-red-400" },
    { name: "Explore", href: "/explore", icon: Compass, color: "bg-blue-400" },
    { name: "Pricing", href: "/pricing", icon: CreditCard, color: "bg-green-400" },
    { name: "About", href: "/about", icon: Info, color: "bg-yellow-400" },
];

export function NotebookLayout({ children }: NotebookLayoutProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-stone-900 p-0 md:p-8 flex items-center justify-center overflow-hidden">
            {/* Notebook Container */}
            <div className="relative w-full max-w-7xl h-screen md:h-[90vh] flex flex-col md:flex-row shadow-2xl md:rounded-r-3xl overflow-hidden bg-stone-800">

                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden h-14 bg-stone-800 flex items-center justify-between px-4 border-b border-white/10 z-50">
                    <span className="text-white font-handwriting text-xl">
                        {tabs.find(t => t.href === pathname)?.name || "Notebook"}
                    </span>
                    {user && (
                        <button onClick={logout} className="text-stone-400">
                            <LogOut className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Left Cover / Spine Area (Desktop Only) */}
                <div className="hidden md:flex w-16 md:w-24 flex-col items-center py-8 z-20 border-r border-stone-950/50 relative">
                    {/* Binder Rings */}
                    <div className="space-y-12 w-full flex flex-col items-center">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-full h-4 relative">
                                <div className="absolute left-0 w-full h-full bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-inner rounded-r-sm" />
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-800 rounded-full shadow-inner" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area (Paper) */}
                <div className="flex-1 relative z-10 flex flex-col md:flex-row items-center md:p-4 overflow-hidden">

                    {/* Desktop Tabs (Right Side) */}
                    <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-3 z-10 pr-2">
                        {tabs.map((tab, index) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link key={tab.href} href={tab.href} className="relative group">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            x: isActive ? -10 : 0,
                                            scale: isActive ? 1.05 : 1
                                        }}
                                        className={cn(
                                            "h-20 w-12 rounded-r-md flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all border border-l-0 border-white/20 relative overflow-hidden",
                                            tab.color,
                                            isActive ? "brightness-110 z-20" : "brightness-75 hover:brightness-100 z-10"
                                        )}
                                    >
                                        {/* Plastic Highlight */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/10 pointer-events-none" />

                                        {/* Label */}
                                        <div className="flex flex-col items-center gap-1 h-full justify-center py-2">
                                            <tab.icon className="w-4 h-4 text-white/90" />
                                            <span
                                                className="text-[8px] font-bold text-white/90 tracking-widest uppercase font-typewriter"
                                                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                                            >
                                                {tab.name}
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}

                        {/* Auth Tab Desktop */}
                        <div className="mt-4">
                            {user ? (
                                <Link href="/dashboard" className="relative group">
                                    <motion.div
                                        animate={{ x: pathname.startsWith("/dashboard") ? -10 : 0 }}
                                        className="h-20 w-12 rounded-r-md bg-purple-600 flex flex-col items-center justify-center shadow-lg cursor-pointer brightness-75 hover:brightness-100 overflow-hidden relative border border-l-0 border-white/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/10 pointer-events-none" />
                                        <div className="flex flex-col items-center gap-1 h-full justify-center py-2">
                                            <User className="w-4 h-4 text-white/90" />
                                            <span className="text-[8px] font-bold text-white/90 tracking-widest uppercase font-typewriter" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Dash</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            ) : (
                                <Link href="/login" className="relative group">
                                    <motion.div
                                        animate={{ x: pathname === "/login" ? -10 : 0 }}
                                        className="h-20 w-12 rounded-r-md bg-indigo-600 flex flex-col items-center justify-center shadow-lg cursor-pointer brightness-75 hover:brightness-100 overflow-hidden relative border border-l-0 border-white/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-black/10 pointer-events-none" />
                                        <div className="flex flex-col items-center gap-1 h-full justify-center py-2">
                                            <LogIn className="w-4 h-4 text-white/90" />
                                            <span className="text-[8px] font-bold text-white/90 tracking-widest uppercase font-typewriter" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Login</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Paper Area */}
                    <div className="flex-1 w-full h-full bg-[#fdfbf7] relative z-20 md:rounded-r-lg shadow-2xl overflow-hidden flex flex-col md:mr-12">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                        />

                        {/* Blue Lines Pattern */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px)",
                                backgroundSize: "100% 2rem",
                                marginTop: "3rem"
                            }}
                        />

                        {/* Red Margin Line */}
                        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-red-200 pointer-events-none" />

                        {/* Content Area */}
                        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar pb-20 md:pb-0">
                            {/* Desktop Header */}
                            <div className="hidden md:flex h-16 items-center justify-between px-8 md:px-16 border-b border-transparent">
                                <h1 className="text-2xl font-handwriting text-stone-800 opacity-80">
                                    {tabs.find(t => t.href === pathname)?.name || "Notebook"}
                                </h1>

                                {user && (
                                    <button onClick={logout} className="text-stone-400 hover:text-red-400 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Page Content */}
                            <div className="p-4 pl-10 md:p-16 min-h-full">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={pathname}
                                        initial={{ opacity: 0, rotateY: 90, transformOrigin: "left" }}
                                        animate={{ opacity: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, rotateY: -90, transition: { duration: 0.2 } }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className="h-full"
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-stone-900 border-t border-white/10 flex items-center justify-around z-50 px-2 pb-safe">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1 p-2">
                                <div className={cn("p-1.5 rounded-full transition-colors", isActive ? tab.color.replace('bg-', 'text-') : "text-stone-400")}>
                                    <tab.icon className="w-5 h-5" />
                                </div>
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-white" : "text-stone-500")}>
                                    {tab.name}
                                </span>
                            </Link>
                        );
                    })}
                    {/* Mobile Auth Link */}
                    {user ? (
                        <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2">
                            <div className={cn("p-1.5 rounded-full transition-colors", pathname.startsWith("/dashboard") ? "text-purple-400" : "text-stone-400")}>
                                <User className="w-5 h-5" />
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", pathname.startsWith("/dashboard") ? "text-white" : "text-stone-500")}>
                                Dash
                            </span>
                        </Link>
                    ) : (
                        <Link href="/login" className="flex flex-col items-center gap-1 p-2">
                            <div className={cn("p-1.5 rounded-full transition-colors", pathname === "/login" ? "text-indigo-400" : "text-stone-400")}>
                                <LogIn className="w-5 h-5" />
                            </div>
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", pathname === "/login" ? "text-white" : "text-stone-500")}>
                                Login
                            </span>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}
