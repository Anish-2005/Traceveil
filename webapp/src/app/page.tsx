'use client';

/**
 * Traceveil Landing Page - Production Grade
 * 
 * Premium marketing landing page with scroll animations,
 * 3D effects, and mobile-first responsive design.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
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
  ChevronRight,
  Menu,
  X,
  Star,
  Award,
  Target,
  Cpu,
  LineChart,
  ShieldCheck,
  Fingerprint,
  Network,
  Server
} from 'lucide-react';

// ============================================================================
// HOOKS
// ============================================================================

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function useNavbarScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
}

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navScrolled = useNavbarScroll();
  useScrollReveal();

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Navigation */}
      <Navbar
        scrolled={navScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Menu */}
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Features Section */}
      <FeaturesSection />

      {/* AI Models Section */}
      <AIModelsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ============================================================================
// NAVIGATION
// ============================================================================

interface NavbarProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function Navbar({ scrolled, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'py-3 bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.08]'
        : 'py-5 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/traceveil-logo.svg"
                alt="Traceveil"
                className={`relative transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'
                  } group-hover:scale-110`}
              />
            </div>
            <span className={`font-bold gradient-text-animated transition-all duration-500 ${scrolled ? 'text-lg' : 'text-xl'
              }`}>
              Traceveil
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: '#features', label: 'Features' },
              { href: '#models', label: 'AI Models' },
              { href: '#stats', label: 'Performance' },
              { href: '/dashboard', label: 'Dashboard' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-6 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="magnetic-btn gap-2 text-sm py-2.5 px-5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors touch-target"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// MOBILE MENU
// ============================================================================

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MobileMenu({ open, onClose }: MobileMenuProps) {
  // Don't render anything when menu is closed
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fade-up 0.3s ease-out' }}
      />

      {/* Menu Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-[280px] z-50 bg-[#0a0f1a] border-l border-white/[0.08]"
        style={{ animation: 'slide-in-right 0.3s ease-out' }}
      >
        <div className="p-6 pt-20 space-y-6">
          {[
            { href: '#features', label: 'Features', icon: <Sparkles className="w-5 h-5" /> },
            { href: '#models', label: 'AI Models', icon: <Brain className="w-5 h-5" /> },
            { href: '#stats', label: 'Performance', icon: <BarChart3 className="w-5 h-5" /> },
            { href: '/dashboard', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <span className="text-blue-400">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </a>
          ))}

          <div className="pt-6 border-t border-white/[0.08]">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
        {/* Scanning Line Animation */}
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          style={{
            animation: 'scan 4s linear infinite',
            top: '20%',
          }}
        />
        {/* Pulsing Radar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-radar-ping" />
          <div className="absolute inset-[80px] rounded-full border border-blue-500/10 animate-radar-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-[160px] rounded-full border border-blue-500/10 animate-radar-ping" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Section - Status Bar */}
        <div className="scroll-reveal flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0a1628] border border-white/[0.08]">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-medium text-slate-300">System Status: <span className="text-emerald-400 font-bold">Operational</span></span>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-400">Threats Blocked Today: <span className="text-white font-bold">2,847</span></span>
          </div>
        </div>

        {/* Main Hero Content - Centered */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Headline with Typewriter Effect Look */}
          <div className="scroll-reveal reveal-delay-1 mb-8">
            <div className="inline-block mb-4">
              <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
                {'>'} TRACEVEIL.INIT()
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
              <span className="block text-white mb-2">REAL-TIME</span>
              <span className="block gradient-text-animated">THREAT DETECTION</span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="scroll-reveal reveal-delay-2 text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            AI-powered security that analyzes <span className="text-white font-medium">10M+ events per second</span>,
            identifying threats <span className="text-cyan-400 font-medium">before they strike</span>.
          </p>

          {/* CTA Buttons */}
          <div className="scroll-reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard" className="magnetic-btn gap-3 text-lg py-4 px-10">
              <span>Access Command Center</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] text-slate-300 hover:text-white font-medium text-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Play className="w-4 h-4 text-blue-400" />
              </div>
              <span>See Live Demo</span>
            </button>
          </div>
        </div>

        {/* Bottom Stats Panel */}
        <div className="scroll-reveal reveal-delay-4 max-w-6xl mx-auto">
          <HeroCommandPanel />
        </div>
      </div>

      {/* Add scan animation keyframe */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function HeroCommandPanel() {
  const accuracy = useCountUp(99, 2500);
  const threats = useCountUp(2847, 2000);
  const latency = useCountUp(4, 1500);

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />

      {/* Main Panel */}
      <div className="relative glass-card-elevated overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-500">traceveil://command-center</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
          {/* Stat Cells */}
          <CommandStat
            label="Detection Accuracy"
            value={<><span ref={accuracy.ref} className="counter-number">{accuracy.count}</span>.7%</>}
            icon={<Target className="w-5 h-5" />}
            color="blue"
            detail="Neural networks active"
          />
          <CommandStat
            label="Threats Neutralized"
            value={<span ref={threats.ref} className="counter-number">{threats.count.toLocaleString()}</span>}
            icon={<Shield className="w-5 h-5" />}
            color="emerald"
            detail="Last 24 hours"
          />
          <CommandStat
            label="Response Latency"
            value={<><span ref={latency.ref} className="counter-number">{latency.count}</span>ms</>}
            icon={<Zap className="w-5 h-5" />}
            color="amber"
            detail="P99 performance"
          />

          {/* Mini Activity Graph */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400">Threat Activity</span>
              <span className="text-xs text-emerald-400 font-semibold">↓ 23%</span>
            </div>
            <div className="flex items-end gap-1 h-12">
              {[35, 55, 40, 70, 45, 60, 30, 80, 50, 55, 65, 35, 75, 45, 60].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-blue-600/60 to-cyan-400/80 hover:from-blue-500 hover:to-cyan-300 transition-all cursor-pointer"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC 2 Type II
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              AES-256 Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              Global CDN
            </span>
          </div>
          <Link href="/dashboard" className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
            Open Full Dashboard
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface CommandStatProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
  detail: string;
}

function CommandStat({ label, value, icon, color, detail }: CommandStatProps) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
  };

  return (
    <div className="p-6 group hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg border ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{detail}</div>
    </div>
  );
}

interface MetricBoxProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber';
}

function MetricBox({ icon, value, label, color }: MetricBoxProps) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  };

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group cursor-default">
      <div className={`inline-flex p-2 rounded-lg border ${colors[color]} mb-3 icon-float`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1 counter-number">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

// ============================================================================
// TRUSTED BY SECTION
// ============================================================================

function TrustedBySection() {
  const companies = [
    'TechCorp', 'FinanceHub', 'CloudSec', 'DataFlow', 'SecureNet', 'PayGuard', 'CyberShield', 'TrustWave'
  ];

  return (
    <section className="py-16 border-y border-white/[0.04] bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 mb-8">Trusted by leading enterprises worldwide</p>

        <div className="marquee">
          <div className="marquee-content">
            {[...companies, ...companies].map((company, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] whitespace-nowrap hover:bg-white/[0.05] transition-colors"
              >
                <Server className="w-5 h-5 text-slate-500" />
                <span className="text-slate-400 font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURES SECTION
// ============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Detection',
      description: 'Deep learning models analyze behavioral patterns to identify threats before they materialize',
      color: 'blue' as const,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-Time Analysis',
      description: 'Sub-millisecond threat detection with streaming data processing and instant alerts',
      color: 'amber' as const,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Fraud Prevention',
      description: 'Block fraudulent transactions and suspicious activities with 99.7% accuracy',
      color: 'emerald' as const,
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with real-time metrics and trend analysis',
      color: 'purple' as const,
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Threat Intel',
      description: 'Cross-reference events against global threat databases and known patterns',
      color: 'cyan' as const,
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: 'Behavioral Biometrics',
      description: 'Detect account takeovers with advanced user behavior analysis',
      color: 'rose' as const,
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 mb-6">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Core Capabilities</span>
          </div>
          <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Enterprise-Grade <span className="gradient-text-premium">Security</span>
          </h2>
          <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive threat detection powered by state-of-the-art machine learning
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'cyan' | 'rose';
  delay: number;
}

function FeatureCard({ icon, title, description, color, delay }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/25 text-blue-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/25 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/25 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/25 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/25 text-cyan-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/25 text-rose-400',
  };

  return (
    <div className={`scroll-reveal reveal-delay-${Math.min(delay, 6)} glass-card p-6 lg:p-8 card-glow group`}>
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border mb-4 icon-float`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// ============================================================================
// AI MODELS SECTION
// ============================================================================

function AIModelsSection() {
  const models = [
    { name: 'Anomaly Detector', accuracy: 94.2, type: 'Autoencoder Neural Network', status: 'active' },
    { name: 'Sequence Model', accuracy: 91.8, type: 'LSTM Network', status: 'active' },
    { name: 'Graph Analyzer', accuracy: 96.5, type: 'Graph Neural Network', status: 'active' },
  ];

  return (
    <section id="models" className="py-24 lg:py-32 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div>
            <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-6">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">ML-Powered</span>
            </div>

            <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Trained on <span className="gradient-text-premium">Millions</span> of Patterns
            </h2>

            <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 mb-8 leading-relaxed">
              Our AI models are trained on extensive datasets of fraud patterns, behavioral anomalies,
              and threat signatures. Continuous learning ensures protection against emerging threats.
            </p>

            {/* Model Cards */}
            <div className="space-y-4">
              {models.map((model, i) => (
                <ModelCard key={model.name} {...model} delay={i + 3} />
              ))}
            </div>

            <Link
              href="/models"
              className="scroll-reveal reveal-delay-6 inline-flex items-center gap-2 mt-8 text-blue-400 hover:text-blue-300 font-semibold transition-colors group"
            >
              <span>Explore Our Models</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column - Visual */}
          <div className="scroll-reveal-right relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
            <div className="relative glass-card p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <LiveMetricBox icon={<Activity />} value="15,247" label="Events Analyzed" trend="+12%" />
                <LiveMetricBox icon={<Shield />} value="847" label="Threats Blocked" trend="+23%" />
                <LiveMetricBox icon={<TrendingUp />} value="96.8%" label="Detection Rate" trend="+0.5%" />
                <LiveMetricBox icon={<Users />} value="2,341" label="Active Streams" trend="+8%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ModelCardProps {
  name: string;
  accuracy: number;
  type: string;
  status: string;
  delay: number;
}

function ModelCard({ name, accuracy, type, delay }: ModelCardProps) {
  return (
    <div className={`scroll-reveal reveal-delay-${Math.min(delay, 6)} flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group`}>
      <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25">
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-white group-hover:text-emerald-200 transition-colors">{name}</span>
          <span className="text-sm font-bold text-emerald-400">{accuracy}%</span>
        </div>
        <p className="text-sm text-slate-400 mb-3">{type}</p>
        <div className="progress-glow">
          <div className="progress-glow-fill" style={{ width: `${accuracy}%` }} />
        </div>
      </div>
    </div>
  );
}

interface LiveMetricBoxProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
}

function LiveMetricBox({ icon, value, label, trend }: LiveMetricBoxProps) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center hover:bg-white/[0.04] transition-all group">
      <div className="inline-flex p-2 rounded-lg bg-blue-500/10 text-blue-400 mb-3 icon-pulse">
        {icon}
      </div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400 mb-2">{label}</div>
      <div className="text-xs font-semibold text-emerald-400">{trend}</div>
    </div>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================

function StatsSection() {
  const detectionRate = useCountUp(99, 2000);
  const responseTime = useCountUp(5, 1500);
  const events = useCountUp(10, 2500);
  const uptime = useCountUp(99, 2000);

  return (
    <section id="stats" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal-scale glass-card-elevated p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatItem
              value={<><span ref={detectionRate.ref} className="counter-number">{detectionRate.count}</span>.7%</>}
              label="Detection Accuracy"
              icon={<Target className="w-6 h-6" />}
            />
            <StatItem
              value={<>{'<'}<span ref={responseTime.ref} className="counter-number">{responseTime.count}</span>ms</>}
              label="Response Time"
              icon={<Zap className="w-6 h-6" />}
            />
            <StatItem
              value={<><span ref={events.ref} className="counter-number">{events.count}</span>M+</>}
              label="Events/Day"
              icon={<LineChart className="w-6 h-6" />}
            />
            <StatItem
              value={<><span ref={uptime.ref} className="counter-number">{uptime.count}</span>.9%</>}
              label="Uptime SLA"
              icon={<Network className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatItemProps {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
}

function StatItem({ value, label, icon }: StatItemProps) {
  return (
    <div className="text-center group">
      <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 mb-4 icon-float">
        {icon}
      </div>
      <div className="text-3xl lg:text-4xl font-black gradient-text-premium mb-2">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl animate-pulse-glow" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="scroll-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 mb-8">
          <Star className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">Start Protecting Today</span>
        </div>

        <h2 className="scroll-reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Secure Your Platform?
        </h2>

        <p className="scroll-reveal reveal-delay-2 text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Join thousands of companies using Traceveil to detect and prevent fraud in real-time.
          Start your free trial today.
        </p>

        <div className="scroll-reveal reveal-delay-3">
          <Link
            href="/dashboard"
            className="magnetic-btn gap-3 text-xl py-5 px-10"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <p className="scroll-reveal reveal-delay-4 text-sm text-slate-500 mt-6">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/traceveil-logo.svg" alt="Traceveil" className="w-8 h-8" />
              <span className="font-bold text-white">Traceveil</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered fraud detection and threat intelligence platform for modern enterprises.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Security', 'Enterprise'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {['Privacy', 'Terms', 'Cookies', 'Compliance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2026 Traceveil. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Twitter', 'GitHub', 'LinkedIn', 'Discord'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// BACKGROUND EFFECTS
// ============================================================================

function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Primary orbs */}
        <div
          className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </>
  );
}