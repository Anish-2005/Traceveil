
export function BackgroundEffects() {
    return (
        <>
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Primary orbs */}
                <div
                    className="absolute -top-24 -right-24 sm:-top-40 sm:-right-40 w-[360px] h-[360px] sm:w-[800px] sm:h-[800px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute -bottom-28 -left-28 sm:-bottom-40 sm:-left-40 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full opacity-25"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] sm:w-[1000px] sm:h-[1000px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
                    }}
                />
            </div>

            {/* Subtle grid */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.015]"
                aria-hidden="true"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />
        </>
    );
}
