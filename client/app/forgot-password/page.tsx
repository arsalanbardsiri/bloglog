'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect to server');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] p-4 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-sm relative"
            >
                {/* Index Card Lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <div className="absolute top-8 left-0 w-full h-px bg-blue-200"></div>

                <div className="mb-8 mt-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                    <p className="text-sm text-gray-500 mt-2">Enter your email to receive a reset link.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded mb-6 border border-green-200">
                            {message}
                        </div>
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="bg-red-50 text-red-600 p-3 text-sm border border-red-200">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-gray-900 text-white py-2 px-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center text-sm">
                            <Link href="/login" className="text-gray-500 hover:text-gray-900">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
