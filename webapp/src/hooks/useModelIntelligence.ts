'use client';

import { useCallback, useEffect, useState } from 'react';
import { ModelIntelligenceSnapshot, traceveilApi } from '@/lib/api';
import { DASHBOARD_REFRESH_INTERVAL_MS } from '@/lib/constants';

export interface UseModelIntelligenceOptions {
  refreshInterval?: number;
  immediate?: boolean;
}

export interface UseModelIntelligenceResult {
  data: ModelIntelligenceSnapshot | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useModelIntelligence(
  options: UseModelIntelligenceOptions = {}
): UseModelIntelligenceResult {
  const {
    refreshInterval = DASHBOARD_REFRESH_INTERVAL_MS,
    immediate = true,
  } = options;

  const cacheKey = 'traceveil.model_intelligence.cache.v1';

  const readCache = (): ModelIntelligenceSnapshot | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (!raw) return null;
      return JSON.parse(raw) as ModelIntelligenceSnapshot;
    } catch {
      return null;
    }
  };

  const initialCache = readCache();

  const [data, setData] = useState<ModelIntelligenceSnapshot | null>(initialCache);
  const [isLoading, setIsLoading] = useState(immediate && !initialCache);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refreshOnly: boolean) => {
      if (refreshOnly) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const next = await traceveilApi.getModelIntelligence();
        setData(next);
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(next));
          } catch {
            // Ignore cache write issues.
          }
        }
        setError(null);
      } catch (err) {
        if (!data) {
          setError(err instanceof Error ? err.message : 'Failed to load model intelligence');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [data]
  );

  useEffect(() => {
    if (immediate) {
      load(false);
    }

    if (refreshInterval <= 0) {
      return;
    }

    const timer = setInterval(() => {
      load(true);
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [immediate, load, refreshInterval]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
