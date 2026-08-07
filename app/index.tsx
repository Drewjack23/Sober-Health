import { Redirect } from 'expo-router';
import { useApp } from '@/state/AppProvider';

export default function Index() {
  const { data } = useApp();
  if (!data.profile) return <Redirect href="/welcome" />;
  if (!data.profile.onboardingComplete) return <Redirect href="/onboarding/1" />;
  return <Redirect href="/(tabs)" />;
}

