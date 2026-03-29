'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ArrowRight, Lock, Loader2, Mail, Shield } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { PageLayout, AnimatedSection } from '@/components/shared';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <main
        id="main-content"
        className="min-h-screen flex items-center justify-center px-4 py-14"
      >
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">
          <AnimatedSection
            className="hidden lg:flex flex-col justify-between rounded-3xl border border-white/[0.1] bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-transparent p-8"
            variant="left"
            delayMs={100}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                Enterprise Security
              </div>
              <h1 className="text-4xl font-extrabold text-white mt-6 leading-tight">
                Welcome back to Traceveil.
              </h1>
              <p className="text-slate-300 mt-4 max-w-md leading-relaxed">
                Access your operational dashboard, model intelligence, and live threat telemetry in one secure control plane.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400">Platform Guarantees</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>Real-time fraud inference pipeline</li>
                <li>Adaptive risk scoring and model observability</li>
                <li>Low-latency event ingestion for production workloads</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection className="glass-card-elevated p-6 sm:p-8 rounded-3xl" variant="right" delayMs={150}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                <Image src="/traceveil-logo.svg" width={22} height={22} alt="Traceveil" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <p className="text-sm text-slate-400">Secure access to the Traceveil console</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</span>
                <div className="relative mt-2">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@traceveil.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Password</span>
                <div className="relative mt-2">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-slate-500">
                <span className="px-2 bg-[#030712]">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.06] text-white py-3 font-semibold transition-colors"
            >
              Continue with Google
            </button>
          </AnimatedSection>
        </div>
      </main>
    </PageLayout>
  );
}
