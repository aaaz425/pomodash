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
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function LandingPage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <LandingSmoothScroll>
      <div id="top" className="min-h-screen bg-background text-foreground">
        <LandingHeader isLoggedIn={isLoggedIn} />
        <LandingHero isLoggedIn={isLoggedIn} />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingHighlights />
        <LandingCtaSection isLoggedIn={isLoggedIn} />
        <LandingFooter />
      </div>
    </LandingSmoothScroll>
  );
}
