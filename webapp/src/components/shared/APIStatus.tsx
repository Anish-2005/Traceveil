'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, XCircle } from 'lucide-react';
import { traceveilApi } from '@/lib/api';

export function APIStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const isCheckingRef = useRef(false);
  const failureCountRef = useRef(0);

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
      } else {
        failureCountRef.current += 1;
        if (failureCountRef.current >= 2) {
          setStatus('offline');
        }
      }
    } catch {
      failureCountRef.current += 1;
      if (failureCountRef.current >= 2) {
        setStatus('offline');
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
    }, 0);

    const interval = setInterval(checkHealth, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkHealth]);

  if (status === 'online') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-md shadow-lg transition-colors ${
          status === 'offline'
            ? 'bg-red-500/10 border-red-500/20 text-red-500'
            : 'bg-slate-800/80 border-slate-700 text-slate-400'
        }`}
      >
        {status === 'offline' ? (
          <>
            <XCircle className="w-4 h-4" />
            <span className="text-sm font-medium">API Disconnected</span>
            <button onClick={checkHealth} className="text-xs underline hover:text-red-400 ml-1">
              Retry
            </button>
          </>
        ) : (
          <>
            <Activity className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              Connectivity Check{latency ? ` (${latency}ms)` : '...'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

