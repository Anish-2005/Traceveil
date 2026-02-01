'use client';

import { useState } from 'react';
import { Play, Loader2, ShieldCheck, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { traceveilApi, RiskAssessment } from '@/lib/api';

interface EventSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EventSimulator({ isOpen, onClose }: EventSimulatorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RiskAssessment | null>(null);
    const [formData, setFormData] = useState({
        user_id: 'user_' + Math.floor(Math.random() * 10000),
        event_type: 'login_attempt',
        device_id: 'dev_' + Math.floor(Math.random() * 1000),
        ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const response = await traceveilApi.ingestEvent({
                user_id: formData.user_id,
                event_type: formData.event_type,
                timestamp: new Date().toISOString(),
                metadata: {
                    device_id: formData.device_id,
                    ip: formData.ip_address,
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            });
            setResult(response);
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setResult(null);
        setFormData({
            user_id: 'user_' + Math.floor(Math.random() * 10000),
            event_type: 'login_attempt',
            device_id: 'dev_' + Math.floor(Math.random() * 1000),
            ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Event Risk Simulator"
        >
            <div className="space-y-6">
                {/* Description */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                    <BadgeInfo className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-200">
                        Simulate a user event to test the ML models in real-time.
                        The system will analyze the input using Graph, Sequence, and Anomaly detection models.
                    </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</label>
                            <input
                                type="text"
                                value={formData.user_id}
                                onChange={(e) => handleInputChange('user_id', e.target.value)}
                                className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Type</label>
                            <select
                                value={formData.event_type}
                                onChange={(e) => handleInputChange('event_type', e.target.value)}
                                className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                            >
                                <option value="login_attempt">Login Attempt</option>
                                <option value="page_view">Page View</option>
                                <option value="purchase">Purchase</option>
                                <option value="file_download">File Download</option>
                                <option value="settings_change">Settings Change</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Device ID</label>
                            <input
                                type="text"
                                value={formData.device_id}
                                onChange={(e) => handleInputChange('device_id', e.target.value)}
                                className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">IP Address</label>
                            <input
                                type="text"
                                value={formData.ip_address}
                                onChange={(e) => handleInputChange('ip_address', e.target.value)}
                                className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Run Simulation
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2.5 border border-white/[0.08] hover:bg-white/[0.04] text-slate-400 hover:text-white rounded-lg transition-all text-sm font-semibold"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {/* Results */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className={`
              rounded-xl p-5 border 
              ${result.risk_assessment.risk_score > 0.7
                                ? 'bg-red-500/10 border-red-500/30'
                                : result.risk_assessment.risk_score > 0.4
                                    ? 'bg-amber-500/10 border-amber-500/30'
                                    : 'bg-emerald-500/10 border-emerald-500/30'}
            `}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {result.risk_assessment.risk_score > 0.7
                                        ? <ShieldAlert className="w-8 h-8 text-red-500" />
                                        : <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                    }
                                    <div>
                                        <h4 className="text-lg font-bold text-white">
                                            {result.risk_assessment.risk_score > 0.7 ? 'High Risk Detected' : 'Low Risk Activity'}
                                        </h4>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${result.risk_assessment.risk_score > 0.7 ? 'text-red-400' : 'text-emerald-400'
                                            }`}>
                                            Confidence: {(result.risk_assessment.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white">
                                        {(result.risk_assessment.risk_score * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest">Risk Score</div>
                                </div>
                            </div>

                            {/* Explanation */}
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-[#030712]/40 border border-white/[0.04]">
                                    <p className="text-sm text-slate-200 leading-relaxed">
                                        <span className="font-semibold text-blue-300">Analysis: </span>
                                        {result.explanation.summary}
                                    </p>
                                </div>

                                {result.explanation.factors.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Factors</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.explanation.factors.map((factor, i) => (
                                                <span key={i} className="px-2 py-1 rounded text-xs bg-white/[0.06] text-slate-300 border border-white/[0.04]">
                                                    {factor}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
