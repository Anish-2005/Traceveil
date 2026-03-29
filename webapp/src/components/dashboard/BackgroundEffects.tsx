export function BackgroundEffects() {
    return (
        <>
            {/* Primary gradient orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Top-right blue orb */}
                <div
                    className="absolute -top-24 -right-24 sm:-top-40 sm:-right-40 w-[340px] h-[340px] sm:w-[600px] sm:h-[600px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                        animation: 'float 8s ease-in-out infinite',
                    }}
                />

                {/* Bottom-left purple orb */}
                <div
                    className="absolute -bottom-28 -left-28 sm:-bottom-40 sm:-left-40 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full opacity-25"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                        animation: 'float 10s ease-in-out infinite reverse',
                        animationDelay: '2s',
                    }}
                />

                {/* Center cyan accent */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[800px] sm:h-[800px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
                        animation: 'pulse-glow 6s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                aria-hidden="true"
                style={{
                    backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Top gradient overlay */}
            <div
                className="fixed top-0 left-0 right-0 h-40 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(3, 7, 18, 0.8), transparent)',
                }}
                aria-hidden="true"
            />
        </>
    );
}
