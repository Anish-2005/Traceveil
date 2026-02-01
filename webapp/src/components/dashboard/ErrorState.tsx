import { Activity, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)',
                        animation: 'pulse-glow 4s ease-in-out infinite',
                    }}
                />
            </div>

            <div className="relative z-10 text-center max-w-md mx-auto p-8 animate-scale-in">
                {/* Error Icon */}
                <div className="relative mb-8 inline-block">
                    <div
                        className="absolute inset-0 bg-red-500/20 rounded-3xl blur-2xl"
                        aria-hidden="true"
                    />
                    <div className="relative p-8 rounded-3xl glass-card-elevated border-red-500/20">
                        <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" aria-hidden="true" />
                    </div>
                </div>

                {/* Error Content */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    Connection Error
                </h2>
                <p className="text-red-300/80 mb-4 leading-relaxed">
                    Unable to load dashboard data from the server.
                </p>
                <p className="text-sm text-slate-500 mb-8 font-mono bg-slate-900/50 p-3 rounded-lg border border-white/5">
                    {message}
                </p>

                {/* Retry Button */}
                <button
                    type="button"
                    onClick={onRetry}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 font-semibold text-white transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-red-400/40 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]"
                >
                    <span className="flex items-center gap-3">
                        <Activity className="w-5 h-5" aria-hidden="true" />
                        Retry Connection
                    </span>
                </button>
            </div>
        </div>
    );
}
