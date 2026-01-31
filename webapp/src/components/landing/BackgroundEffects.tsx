
export function BackgroundEffects() {
    return (
        <>
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Primary orbs */}
                <div
                    className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-10"
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
