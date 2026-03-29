'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCw, WifiOff, X } from 'lucide-react';
import { traceveilApi } from '@/lib/api';

const FAILURE_THRESHOLD = 4;
const GRACE_PERIOD_MS = 15000;
const POLL_INTERVAL_MS = 10000;
const DISMISS_KEY = 'traceveil_api_status_dismissed';

export function APIStatus() {
  const pathname = usePathname();
  const [status, setStatus] = useState<'online' | 'offline'>('online');
  const [latency, setLatency] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const isCheckingRef = useRef(false);
  const failureCountRef = useRef(0);
  const mountedAtRef = useRef(Date.now());

  const shouldShowOnRoute = /^\/(dashboard|analytics|entities|events|models|users)(\/|$)/.test(pathname);

  const checkHealth = useCallback(async () => {
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    try {
      const result = await traceveilApi.healthCheck();
      if (result.status === 'healthy') {
        failureCountRef.current = 0;
        setLatency(result.latencyMs ?? null);
        setStatus('online');
        return;
      }

      failureCountRef.current += 1;
      if (
        Date.now() - mountedAtRef.current > GRACE_PERIOD_MS &&
        failureCountRef.current >= FAILURE_THRESHOLD
      ) {
        setStatus('offline');
      }
    } catch {
      failureCountRef.current += 1;
      if (
        Date.now() - mountedAtRef.current > GRACE_PERIOD_MS &&
        failureCountRef.current >= FAILURE_THRESHOLD
      ) {
        setStatus('offline');
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
    }, 1000);

    const interval = setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkHealth]);

  if (!shouldShowOnRoute || status !== 'offline' || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Ignore storage errors.
    }
  };

  const handleRetry = async () => {
    await checkHealth();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full border border-amber-500/35 bg-slate-950/95 px-3 py-2 text-amber-300 shadow-lg shadow-black/30 backdrop-blur-md">
        <WifiOff className="h-4 w-4" />
        <span className="text-xs font-medium">API unreachable{latency ? ` (${latency}ms)` : ''}</span>
        <button
          onClick={handleRetry}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-amber-500/15"
          aria-label="Retry API health check"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDismiss}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-amber-500/15"
          aria-label="Dismiss API status"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
