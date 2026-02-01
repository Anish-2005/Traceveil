'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Lock, Mail, Loader2, ShieldCheck, Chrome, ArrowRight } from 'lucide-react';
import { BackgroundEffects } from '@/components';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Unified Background Effects */}
            <BackgroundEffects />

            <div className="w-full max-w-[420px] relative z-20 flex flex-col items-center">
                {/* Header Section */}
                <div className="text-center mb-10 animate-fade-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-6 shadow-2xl shadow-blue-500/10 relative group cursor-default">
                        <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img
                            src="/traceveil-logo.svg"
                            alt="Traceveil Logo"
                            className="w-12 h-12 relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">
                        Traceveil
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-80">
                        Intelligence & Fraud Detection
                    </p>
                </div>

                {/* Glass Card */}
                <div className="w-full glass-card-elevated p-8 animate-fade-up stagger-1 backdrop-blur-3xl border border-white/10">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-scale-in">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Email Access</label>
                            <div className="relative transform transition-transform duration-200 group-focus-within:scale-[1.01]">
                                <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="admin@traceveil.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-blue-400 transition-colors">Secure Key</label>
                            <div className="relative transform transition-transform duration-200 group-focus-within:scale-[1.01]">
                                <div className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-blue-500/[0.02] focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full group flex items-center justify-center gap-2 mt-2 py-3.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Initialize Session</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.08]"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase">
                            <span className="bg-[#0B0F17] px-3 text-slate-500">Authentication Options</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/[0.1] hover:border-white/[0.2] font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                </div>

                <div className="mt-2 text-center animate-fade-up stagger-2">
                    <p className="text-xs text-slate-500 font-medium hover:text-slate-400 transition-colors cursor-default">
                        Secure System • <span className="text-blue-500/50">Restricted Access</span> • 256-bit Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
