import { useEffect, useState } from 'react';
import { Terminal, Shield, Cpu, Activity, Check } from 'lucide-react';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing core modules...');

    const steps = [
        "Initializing core modules...",
        "Verifying security signatures...",
        "Connecting to threat intelligence grid...",
        "Loading visualization engine...",
        "System ready."
    ];

    useEffect(() => {
        const duration = 2000; // 2 seconds boot time
        const interval = 20;
        const stepsCount = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / stepsCount) * 100, 100);
            setProgress(newProgress);

            // Update status text based on progress chunks
            const stepIndex = Math.floor((newProgress / 100) * (steps.length - 1));
            setStatus(steps[stepIndex]);

            if (currentStep >= stepsCount) {
                clearInterval(timer);
                setTimeout(onComplete, 500); // Small delay after 100%
            }
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo/Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative h-16 w-16 bg-[#0a0f1a] border border-blue-500/30 rounded-2xl flex items-center justify-center">
                            <img src="/traceveil-logo.svg" alt="Traceveil" className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                        <span>BOOT_SEQUENCE</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Terminal Log */}
                <div className="h-24 bg-[#0a0f1a] border border-white/5 rounded-lg p-3 font-mono text-xs overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] to-transparent pointer-events-none" />
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-500/80">
                            <Check className="w-3 h-3" />
                            <span>KERNEL_LOADED</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500/80">
                            <Check className="w-3 h-3" />
                            <span>ENV_VARS_CHECK</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                            <Activity className="w-3 h-3" />
                            <span>{status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 animate-pulse">
                            <span className="w-1.5 h-3 bg-slate-600 block" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
