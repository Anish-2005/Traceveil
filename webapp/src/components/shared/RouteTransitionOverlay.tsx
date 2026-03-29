'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type TransitionPhase = 'idle' | 'exiting' | 'entering';

const EXIT_DURATION_MS = 220;
const ENTER_DURATION_MS = 380;

export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const exitTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('idle');

  useEffect(() => {
    const clearTimers = () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
    };

    const triggerExitPulse = () => {
      if (phase !== 'idle') return;
      setPhase('exiting');
      clearTimers();
      exitTimerRef.current = window.setTimeout(() => {
        setPhase('idle');
      }, EXIT_DURATION_MS);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      if (anchor.getAttribute('target') === '_blank') return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.dataset.noRouteTransition === 'true') return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const nextUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) return;

      triggerExitPulse();
    };

    document.addEventListener('click', handleClickCapture, true);
    return () => {
      document.removeEventListener('click', handleClickCapture, true);
      clearTimers();
    };
  }, [phase]);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (enterTimerRef.current) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    setPhase('entering');
    enterTimerRef.current = window.setTimeout(() => {
      setPhase('idle');
    }, ENTER_DURATION_MS);
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <div
      aria-hidden="true"
      className={`route-transition-overlay ${phase}`}
    />
  );
}

