'use client';

import { ReactNode } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'scale';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  variant?: RevealVariant;
}

function variantClass(variant: RevealVariant): string {
  switch (variant) {
    case 'left':
      return 'scroll-reveal-left';
    case 'right':
      return 'scroll-reveal-right';
    case 'scale':
      return 'scroll-reveal-scale';
    case 'up':
    default:
      return 'scroll-reveal';
  }
}

export function AnimatedSection({
  children,
  className = '',
  delayMs = 0,
  once = false,
  variant = 'up',
}: AnimatedSectionProps) {
  return (
    <div
      className={`${variantClass(variant)} ${className}`.trim()}
      style={{ transitionDelay: `${Math.max(0, delayMs)}ms` }}
      data-once={once ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}
