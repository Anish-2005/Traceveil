'use client';

/**
 * Traceveil Landing Page - Production Grade
 * 
 * Premium marketing landing page with scroll animations,
 * 3D effects, and mobile-first responsive design.
 * 
 * Optimized with component lazy loading for performance.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useScrollReveal } from '@/hooks';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { BackgroundEffects } from '@/components/landing/BackgroundEffects';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

// Lazy load below-the-fold components
const TrustedBySection = dynamic(() => import('@/components/landing/TrustedBySection').then(mod => mod.TrustedBySection));
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection').then(mod => mod.FeaturesSection));
const AIModelsSection = dynamic(() => import('@/components/landing/AIModelsSection').then(mod => mod.AIModelsSection));
const StatsSection = dynamic(() => import('@/components/landing/StatsSection').then(mod => mod.StatsSection));
const CTASection = dynamic(() => import('@/components/landing/CTASection').then(mod => mod.CTASection));
const Footer = dynamic(() => import('@/components/landing/Footer').then(mod => mod.Footer));

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {!isLoading && <MainContent />}
    </>
  );
}

function MainContent() {
  // Initialize scroll animations only when content is mounted
  useScrollReveal();

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden animate-fade-in">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Navigation */}
      <Navbar />

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