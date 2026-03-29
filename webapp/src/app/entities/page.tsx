'use client';

import { useState, useEffect } from 'react';
import { PageLayout, PageHeader } from '@/components/shared';
import { ModelIntelligenceStrip } from '@/components/shared';
import { EntityCard } from '@/components/dashboard/EntityCard';
import { traceveilApi, HighRiskEntity } from '@/lib/api';
import { Search, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { getSeverityFromScore, getStatusFromSeverity } from '@/lib/constants';
import { useModelIntelligence } from '@/hooks';

// Add this to api.ts if not present, or use axios directly for now
// But consistent with codebase, I'll extend the api object in this file locally or update api.ts later.
// For now, I'll fetch directly or assume I update api.ts next.
// Actually, I should update api.ts first. But I can use the same pattern here for simplicity.
export default function EntitiesPage() {
    const [entities, setEntities] = useState<HighRiskEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { data: modelSnapshot, isLoading: isModelSnapshotLoading } = useModelIntelligence({
        refreshInterval: 30000,
    });

    const [error, setError] = useState<string | null>(null);

    const fetchEntities = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await traceveilApi.getRecentEvents(100);
            setEntities(response);
        } catch (err) {
            console.error('Failed to fetch entities:', err);
            setError('Failed to load entities. Please try again.');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchEntities();
    };

    const filteredEntities = entities.filter(e => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (e.user_id?.toLowerCase() || '').includes(searchLower) ||
            (e.event_type?.toLowerCase() || '').includes(searchLower) ||
            (e.description?.toLowerCase() || '').includes(searchLower)
        );
    });

    if (error) {
        return (
            <PageLayout>
                <PageHeader title="Entity Monitoring" subtitle="Real-time view of all detected entities and events" />
                <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-red-500/10 border border-red-500/20 max-w-lg mx-auto">
                        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Connection Error</h3>
                        <p className="text-slate-300 mb-6">{error}</p>
                        <button
                            onClick={fetchEntities}
                            className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                </main>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <PageHeader
                title="Entity Monitoring"
                subtitle="Real-time view of all detected entities and events"
                actions={
                    <button
                        onClick={handleRefresh}
                        className={`btn-secondary flex items-center gap-2 ${isRefreshing ? 'opacity-70 cursor-wait' : ''}`}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                }
            />

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <ModelIntelligenceStrip snapshot={modelSnapshot} loading={isModelSnapshotLoading} compact />
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search entities, events, or user IDs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                    {/* Add more filters here if needed */}
                </div>

                {/* Content */}
                {loading && !isRefreshing ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <p>Loading entities...</p>
                    </div>
                ) : filteredEntities.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEntities.map((entity, index) => {
                            const severity = getSeverityFromScore(entity.risk_score);
                            const status = getStatusFromSeverity(severity);

                            return (
                                <div
                                    key={entity.id || index}
                                    className="scroll-reveal"
                                    style={{ transitionDelay: `${index * 30}ms` }}
                                >
                                    <EntityCard
                                        id={entity.user_id || 'Unknown'} // Pass User ID for the link
                                        type={entity.event_type || 'Event'}
                                        riskScore={Math.round((entity.risk_score || 0) * 100)}
                                        flags={entity.flags || []}
                                        status={status}
                                        explanation={entity.description}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-white/[0.06] rounded-xl">
                        <Shield className="w-12 h-12 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-slate-400">No entities found</h3>
                        <p className="max-w-xs text-center text-sm opacity-60 mt-2">
                            Try adjusting your search criteria or waiting for new events.
                        </p>
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
