'use client';

/**
 * PageLayout - Shared layout wrapper for all pages
 * 
 * Provides consistent styling with premium background effects
 * and proper content spacing for all application pages.
 */

import { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
    return (
        <div className={`app-shell relative overflow-hidden ${className}`}>
            {/* Premium Ambient Background */}
            <BackgroundEffects />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

function BackgroundEffects() {
    return (
        <>
            {/* Primary gradient orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Top-right blue orb */}
                <div
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, var(--ambient-orb-primary) 0%, transparent 70%)',
                        animation: 'float 8s ease-in-out infinite',
                    }}
                />

                {/* Bottom-left purple orb */}
                <div
                    className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
                    style={{
                        background: 'radial-gradient(circle, var(--ambient-orb-secondary) 0%, transparent 70%)',
                        animation: 'float 10s ease-in-out infinite reverse',
                        animationDelay: '2s',
                    }}
                />

                {/* Center cyan accent */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, var(--ambient-orb-tertiary) 0%, transparent 60%)',
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
        </>
    );
}

export default PageLayout;
