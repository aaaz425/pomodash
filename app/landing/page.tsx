import type { Metadata } from 'next';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks';
import { LandingHighlights } from '@/components/landing/LandingHighlights';
import { LandingCtaSection } from '@/components/landing/LandingCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingSmoothScroll } from '@/components/landing/LandingSmoothScroll';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function LandingPage() {
  return (
    <LandingSmoothScroll>
      <div id="top" className="min-h-screen bg-background text-foreground">
        <LandingHeader />
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingHighlights />
        <LandingCtaSection />
        <LandingFooter />
      </div>
    </LandingSmoothScroll>
  );
}
