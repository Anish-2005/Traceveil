'use client';

import { useState, useEffect } from 'react';
import { Activity, XCircle, CheckCircle2 } from 'lucide-react';
import { traceveilApi } from '@/lib/api';

export function APIStatus() {
    const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [latency, setLatency] = useState<number>(0);

    const checkHealth = async () => {
        const start = performance.now();
        try {
            // Use a short timeout for health check to fail fast if hung
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            // We use the healthCheck function from api.ts which hits the root endpoint
            const res = await traceveilApi.healthCheck();

            clearTimeout(timeoutId);
            const end = performance.now();
            setLatency(Math.round(end - start));

            if (res.status === 'healthy') {
                setStatus('online');
            } else {
                setStatus('offline');
            }
        } catch (error) {
            setStatus('offline');
        }
    };

    useEffect(() => {
        // Check immediately
        checkHealth();

        // Check every 5 seconds
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    if (status === 'online') return null; // Hide when online to be less intrusive? Or show small dot?

    // Show warning when offline or checking takes too long
    return (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md shadow-lg transition-colors ${status === 'offline'
                    ? 'bg-red-500/10 border-red-500/20 text-red-500'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}>
                {status === 'offline' ? (
                    <>
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">API Disconnected</span>
                        <button
                            onClick={checkHealth}
                            className="text-xs underline hover:text-red-400 ml-1"
                        >
                            Retry
                        </button>
                    </>
                ) : (
                    <>
                        <Activity className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Connectivity Check...</span>
                    </>
                )}
            </div>
        </div>
    );
}
