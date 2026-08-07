import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts as useInterFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts as useManropeFonts, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { AppProvider, useApp } from '@/state/AppProvider';
import { LoadingScreen } from '@/components/ui';

function RootNavigator() {
  const { ready, isDark } = useApp();
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const [manropeLoaded] = useManropeFonts({ Manrope_700Bold, Manrope_800ExtraBold });
  if (!ready || !interLoaded || !manropeLoaded) return <LoadingScreen />;
  return <><StatusBar style={isDark ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, animation: 'fade' }}><Stack.Screen name="(tabs)" options={{ animation: 'fade' }} /><Stack.Screen name="onboarding/[step]" options={{ animation: 'slide_from_right' }} /><Stack.Screen name="onboarding/result" options={{ animation: 'fade' }} /><Stack.Screen name="quick-log" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} /><Stack.Screen name="recovery-checkin" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} /></Stack></>;
}

export default function RootLayout() { return <AppProvider><RootNavigator /></AppProvider>; }
