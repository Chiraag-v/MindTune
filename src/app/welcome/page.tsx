'use client';

import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/LandingPage';

export default function WelcomePage() {
  const router = useRouter();
  // Push to root with a flag so PromptPerfectApp forces Auth page
  return <LandingPage onGetStarted={() => router.push('/?auth=1')} />;
}
