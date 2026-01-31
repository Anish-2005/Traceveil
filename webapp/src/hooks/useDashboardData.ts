'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { traceveilApi, DashboardMetrics, DashboardModels } from '@/lib/api';
import { DASHBOARD_REFRESH_INTERVAL_MS } from '@/lib/constants';

/**
 * Dashboard data state interface
 */
export interface DashboardDataState {
    metrics: DashboardMetrics | null;
    models: DashboardModels | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date;
}

/**
 * Dashboard data hook return type
 */
export interface UseDashboardDataReturn extends DashboardDataState {
    /** Manually trigger a data refresh */
    refresh: () => Promise<void>;
    /** Whether the hook is currently fetching data */
    isFetching: boolean;
}

/**
 * Hook configuration options
 */
export interface UseDashboardDataOptions {
    /** Auto-refresh interval in milliseconds. Set to 0 to disable. Default: 30000 */
    refreshInterval?: number;
    /** Whether to fetch data immediately on mount. Default: true */
    fetchOnMount?: boolean;
    /** Callback fired when data is successfully loaded */
    onSuccess?: (data: { metrics: DashboardMetrics; models: DashboardModels }) => void;
    /** Callback fired when an error occurs */
    onError?: (error: Error) => void;
}

/**
 * Custom hook for fetching and managing dashboard data
 * 
 * Features:
 * - Automatic periodic refresh with configurable interval
 * - Loading and error state management
 * - Manual refresh capability
 * - Proper cleanup on unmount
 * - Prevents duplicate fetches
 * 
 * @example
 * ```tsx
 * const { metrics, models, isLoading, error, refresh, lastUpdated } = useDashboardData();
 * 
 * if (isLoading) return <LoadingSkeleton />;
 * if (error) return <ErrorState message={error} onRetry={refresh} />;
 * 
 * return <Dashboard metrics={metrics} models={models} />;
 * ```
 */
export function useDashboardData(options: UseDashboardDataOptions = {}): UseDashboardDataReturn {
    const {
        refreshInterval = DASHBOARD_REFRESH_INTERVAL_MS,
        fetchOnMount = true,
        onSuccess,
        onError,
    } = options;

    // State
    const [state, setState] = useState<DashboardDataState>({
        metrics: null,
        models: null,
        isLoading: true,
        error: null,
        lastUpdated: new Date(),
    });

    // Refs for tracking fetch state and preventing race conditions
    const isFetchingRef = useRef(false);
    const mountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    /**
     * Fetches dashboard data from the API
     */
    const fetchData = useCallback(async () => {
        // Prevent duplicate fetches
        if (isFetchingRef.current) {
            return;
        }

        // Cancel any pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        isFetchingRef.current = true;

        setState(prev => ({
            ...prev,
            isLoading: prev.metrics === null, // Only show loading on initial fetch
            error: null,
        }));

        try {
            const [metricsData, modelsData] = await Promise.all([
                traceveilApi.getDashboardMetrics(),
                traceveilApi.getDashboardModels(),
            ]);

            // Only update state if component is still mounted
            if (mountedRef.current) {
                setState({
                    metrics: metricsData,
                    models: modelsData,
                    isLoading: false,
                    error: null,
                    lastUpdated: new Date(),
                });

                onSuccess?.({ metrics: metricsData, models: modelsData });
            }
        } catch (err) {
            // Ignore abort errors
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            const errorMessage = err instanceof Error
                ? err.message
                : 'Failed to load dashboard data';

            if (mountedRef.current) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));

                onError?.(err instanceof Error ? err : new Error(errorMessage));
            }

            console.error('[useDashboardData] Fetch error:', err);
        } finally {
            isFetchingRef.current = false;
        }
    }, [onSuccess, onError]);

    /**
     * Manual refresh function exposed to consumers
     */
    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    // Initial fetch and auto-refresh setup
    useEffect(() => {
        mountedRef.current = true;

        // Fetch on mount if enabled
        if (fetchOnMount) {
            fetchData();
        }

        // Set up auto-refresh interval if enabled
        let intervalId: NodeJS.Timeout | null = null;
        if (refreshInterval > 0) {
            intervalId = setInterval(() => {
                fetchData();
            }, refreshInterval);
        }

        // Cleanup
        return () => {
            mountedRef.current = false;

            if (intervalId) {
                clearInterval(intervalId);
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData, fetchOnMount, refreshInterval]);

    return {
        ...state,
        refresh,
        isFetching: isFetchingRef.current,
    };
}

/**
 * Hook for managing dashboard refresh with visibility handling
 * Pauses refresh when the page is not visible to save resources
 */
export function useVisibilityAwareRefresh(
    refreshFn: () => Promise<void>,
    intervalMs: number = DASHBOARD_REFRESH_INTERVAL_MS
): void {
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page is hidden, stop the interval
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            } else {
                // Page is visible, restart the interval and fetch immediately
                refreshFn();
                intervalId = setInterval(refreshFn, intervalMs);
            }
        };

        // Initial setup
        if (!document.hidden) {
            intervalId = setInterval(refreshFn, intervalMs);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [refreshFn, intervalMs]);
}

export default useDashboardData;
