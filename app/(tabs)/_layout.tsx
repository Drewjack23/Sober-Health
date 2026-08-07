import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/state/AppProvider';

const icon = (active: keyof typeof Ionicons.glyphMap, inactive: keyof typeof Ionicons.glyphMap) => {
  function TabIcon({ color, size, focused }: { color: string | object; size: number; focused: boolean }) { return <View style={styles.iconWrap}>{focused ? <View style={styles.activeLine} /> : null}<Ionicons name={focused ? active : inactive} color={color as string} size={size - 1} /></View>; }
  TabIcon.displayName = `${active}TabIcon`;
  return TabIcon;
};

export default function TabLayout() {
  const { data } = useApp(); const theme = useTheme();
  if (!data.profile) return <Redirect href="/welcome" />;
  if (!data.profile.onboardingComplete) return <Redirect href="/onboarding/1" />;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.text, tabBarInactiveTintColor: theme.colors.faint, tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 10, marginTop: 0 }, tabBarItemStyle: { paddingTop: 4 }, tabBarStyle: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', height: 64, paddingTop: 3, paddingBottom: 7, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, borderTopWidth: 1, elevation: 0, shadowOpacity: 0 } }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
    <Tabs.Screen name="fitness" options={{ title: 'Fitness', tabBarIcon: icon('barbell', 'barbell-outline') }} />
    <Tabs.Screen name="nutrition" options={{ title: 'Nutrition', tabBarIcon: icon('restaurant', 'restaurant-outline') }} />
    <Tabs.Screen name="recovery" options={{ title: 'Recovery', href: data.recovery.enabled ? '/recovery' : null, tabBarIcon: icon('shield-checkmark', 'shield-checkmark-outline') }} />
    <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: icon('stats-chart', 'stats-chart-outline') }} />
  </Tabs>;
}

const styles = StyleSheet.create({ iconWrap: { width: 32, height: 27, alignItems: 'center', justifyContent: 'flex-end' }, activeLine: { position: 'absolute', top: -8, width: 24, height: 2, borderRadius: 1, backgroundColor: colors.purple } });
