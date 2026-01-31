'use client';

/**
 * Traceveil Landing Page
 * 
 * Premium marketing landing page showcasing the AI-powered
 * fraud detection and threat intelligence platform.
 */

import Link from 'next/link';
import {
  Shield,
  Brain,
  Zap,
  BarChart3,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030712]/60 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/traceveil-logo.svg"
                  alt="Traceveil"
                  className="relative w-9 h-9 lg:w-10 lg:h-10 transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-xl font-bold gradient-text-premium">Traceveil</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#models" className="text-sm text-slate-400 hover:text-white transition-colors">AI Models</a>
              <a href="#security" className="text-sm text-slate-400 hover:text-white transition-colors">Security</a>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">AI-Powered Threat Detection</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
              <span className="gradient-text-premium">Detect Fraud</span>
              <br />
              <span className="text-white">Before It Happens</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Enterprise-grade AI platform for real-time fraud detection, behavioral analysis,
              and threat intelligence. Protect your business with ML models trained on millions of patterns.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] text-white font-semibold text-lg transition-all">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/[0.06]">
              <StatItem value="99.7%" label="Detection Accuracy" />
              <StatItem value="<5ms" label="Response Time" />
              <StatItem value="10M+" label="Events/Day" />
              <StatItem value="24/7" label="Monitoring" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Enterprise-Grade <span className="gradient-text-premium">Security</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive threat detection powered by advanced machine learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="AI-Powered Detection"
              description="Deep learning models analyze behavioral patterns to identify threats before they materialize"
              color="blue"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Real-Time Analysis"
              description="Sub-millisecond threat detection with streaming data processing and instant alerts"
              color="amber"
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Fraud Prevention"
              description="Block fraudulent transactions and suspicious activities with 99.7% accuracy"
              color="emerald"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Advanced Analytics"
              description="Comprehensive dashboards with real-time metrics and trend analysis"
              color="purple"
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Global Threat Intel"
              description="Cross-reference events against global threat databases and known patterns"
              color="cyan"
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Enterprise Security"
              description="SOC 2 compliant with end-to-end encryption and audit logging"
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="models" className="py-20 lg:py-32 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Trained on <span className="gradient-text-premium">Millions</span> of Patterns
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Our AI models are trained on extensive datasets of fraud patterns, behavioral anomalies,
                and threat signatures. Continuous learning ensures protection against emerging threats.
              </p>

              <div className="space-y-4">
                <ModelItem
                  name="Anomaly Detector"
                  accuracy="94.2%"
                  description="Autoencoder neural network for behavioral analysis"
                />
                <ModelItem
                  name="Sequence Model"
                  accuracy="91.8%"
                  description="LSTM network for temporal pattern detection"
                />
                <ModelItem
                  name="Graph Analyzer"
                  accuracy="96.5%"
                  description="Graph neural network for relationship fraud"
                />
              </div>

              <Link
                href="/models"
                className="inline-flex items-center gap-2 mt-8 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                <span>Explore Our Models</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <div className="relative glass-card p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <MetricBox icon={<Activity />} value="15,247" label="Events Analyzed" />
                  <MetricBox icon={<Shield />} value="847" label="Threats Blocked" />
                  <MetricBox icon={<TrendingUp />} value="96.8%" label="Detection Rate" />
                  <MetricBox icon={<Users />} value="2,341" label="Active Streams" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Secure Your Platform?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Start detecting threats in real-time with our AI-powered security platform.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xl transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/traceveil-logo.svg" alt="Traceveil" className="w-8 h-8" />
              <span className="font-bold text-white">Traceveil</span>
              <span className="text-slate-500">© 2026</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl lg:text-4xl font-black gradient-text-premium mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'cyan' | 'rose';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
  }[color];

  return (
    <div className="glass-card p-6 lg:p-8 group hover:scale-[1.02] transition-all">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses} border mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ModelItem({ name, accuracy, description }: { name: string; accuracy: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white">{name}</span>
          <span className="text-sm font-bold text-emerald-400">{accuracy}</span>
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function MetricBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
      <div className="inline-flex p-2 rounded-lg bg-blue-500/10 text-blue-400 mb-3">
        {icon}
      </div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}