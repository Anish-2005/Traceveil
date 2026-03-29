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

  const [data, setData] = useState<ModelIntelligenceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
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
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model intelligence');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
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

