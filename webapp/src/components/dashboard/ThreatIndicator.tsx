'use client';

import { memo } from 'react';

export interface ThreatIndicatorProps {
  position: { x: number; y: number };
  severity: 'critical' | 'high' | 'medium' | 'low';
  label?: string;
  onClick?: () => void;
}

/**
 * Premium threat indicator for the radar map
 */
export const ThreatIndicator = memo(function ThreatIndicator({
  position,
  severity,
  label,
  onClick,
}: ThreatIndicatorProps) {
  const config = {
    critical: {
      bg: 'bg-red-500',
      ring: 'ring-red-500/30',
      glow: 'shadow-red-500/50',
      tooltip: 'bg-red-500/90',
    },
    high: {
      bg: 'bg-amber-500',
      ring: 'ring-amber-500/30',
      glow: 'shadow-amber-500/50',
      tooltip: 'bg-amber-500/90',
    },
    medium: {
      bg: 'bg-yellow-500',
      ring: 'ring-yellow-500/30',
      glow: 'shadow-yellow-500/50',
      tooltip: 'bg-yellow-500/90',
    },
    low: {
      bg: 'bg-blue-500',
      ring: 'ring-blue-500/30',
      glow: 'shadow-blue-500/50',
      tooltip: 'bg-blue-500/90',
    },
  }[severity];

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-label={`${severity} threat: ${label || 'Unknown'}`}
    >
      {/* Outer pulse ring */}
      <span
        className={`
          absolute inset-0 w-6 h-6 -m-1.5 rounded-full ${config.ring}
          ring-2 animate-ping opacity-75
        `}
        aria-hidden="true"
      />

      {/* Main indicator */}
      <span
        className={`
          relative block w-3 h-3 rounded-full ${config.bg}
          shadow-lg ${config.glow}
          transition-transform duration-200
          group-hover:scale-150
        `}
      />

      {/* Tooltip */}
      {label && (
        <span
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-2 py-1 rounded text-[10px] font-semibold text-white whitespace-nowrap
            ${config.tooltip}
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          `}
        >
          {label}
        </span>
      )}
    </button>
  );
});

ThreatIndicator.displayName = 'ThreatIndicator';

export default ThreatIndicator;