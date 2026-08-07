import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { colors, gradients, spacing } from '@/constants/theme';
import { useApp } from '@/state/AppProvider';

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const { startDemo } = useApp();
  const wide = width >= 840;
  const demo = () => { startDemo(); router.replace('/(tabs)'); };
  return <LinearGradient colors={gradients.dark} style={styles.gradient}><SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]}>
    <View style={[styles.copy, wide && styles.copyWide]}>
      <View style={styles.logoRow}><Image source={require('@/assets/app-icon.png')} style={styles.logo} /><View><Text style={styles.brand}>SOBER PLUS</Text><Text style={styles.brandHealth}>HEALTH</Text></View></View>
      <View style={styles.badge}><Ionicons name="sparkles" color="#C8B5FF" size={15} /><Text style={styles.badgeText}>Your whole health, in one calm place</Text></View>
      <Text style={styles.title}>Build a healthier life.{`\n`}One honest day at a time.</Text>
      <Text style={styles.body}>Fitness, nutrition, recovery, and mental wellness—designed to work together without judgment.</Text>
      <View style={styles.actions}><Button label="Create my plan" icon="arrow-forward" onPress={() => router.push('/sign-up')} /><Button label="Explore with demo data" icon="sparkles-outline" variant="secondary" onPress={demo} /></View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/sign-in')} style={styles.signIn}><Text style={styles.signInText}>Already have an account? </Text><Text style={styles.signInLink}>Sign in</Text></Pressable>
    </View>
    <View style={[styles.preview, wide && styles.previewWide]}><View style={styles.phone}>
      <View style={styles.phoneTop}><Text style={styles.previewKicker}>TODAY</Text><Text style={styles.previewHello}>Good morning, Andrew</Text><Text style={styles.previewSub}>{'Let’s keep building a healthier you.'}</Text></View>
      <View style={styles.statRow}><PreviewStat icon="flame" value="46 days" label="Recovery" /><PreviewStat icon="barbell" value="3 of 4" label="Workouts" /></View>
      <View style={styles.motivation}><Ionicons name="sparkles" color="#B8A0FF" size={18} /><Text style={styles.motivationText}>{'“I want a clear, healthy future with the people I love.”'}</Text></View>
      <View style={styles.progressRow}><View><Text style={styles.previewKicker}>THIS WEEK</Text><Text style={styles.progressTitle}>You showed up</Text></View><Text style={styles.progressNumber}>82%</Text></View>
      <View style={styles.bars}>{[38, 64, 48, 82, 68, 92, 76].map((height, index) => <LinearGradient key={index} colors={gradients.brand} style={[styles.bar, { height }]} />)}</View>
    </View></View>
  </ScrollView></SafeAreaView></LinearGradient>;
}

function PreviewStat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) { return <View style={styles.previewStat}><Ionicons name={icon} color="#B8A0FF" size={19} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  gradient: { flex: 1 }, safe: { flex: 1 }, content: { flexGrow: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', gap: 48, maxWidth: 1180, width: '100%', alignSelf: 'center' }, contentWide: { flexDirection: 'row', paddingHorizontal: 48 }, copy: { width: '100%', maxWidth: 560 }, copyWide: { flex: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 34 }, logo: { width: 50, height: 50, borderRadius: 11 }, brand: { color: colors.white, fontSize: 16, fontWeight: '700', letterSpacing: 1 }, brandHealth: { color: '#AFA8C7', fontSize: 11, fontWeight: '600', letterSpacing: 3.8, marginTop: 1 }, badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderLeftWidth: 2, borderLeftColor: '#8B5CF6', paddingVertical: 3, paddingLeft: 10 }, badgeText: { color: '#CBC6DA', fontSize: 11, fontWeight: '500' }, title: { color: colors.white, fontSize: Platform.OS === 'web' ? 46 : 36, lineHeight: Platform.OS === 'web' ? 53 : 43, fontWeight: '700', letterSpacing: -1.15, marginTop: 20 }, body: { color: '#B8B4C9', fontSize: 16, lineHeight: 25, maxWidth: 520, marginTop: 15 }, actions: { gap: 9, marginTop: 28, maxWidth: 360 }, signIn: { flexDirection: 'row', paddingVertical: 16, alignSelf: 'flex-start' }, signInText: { color: '#AFA8C7' }, signInLink: { color: colors.white, fontWeight: '600' },
  preview: { width: '100%', maxWidth: 420, alignItems: 'center' }, previewWide: { flex: 0.8 }, phone: { width: '100%', maxWidth: 360, minHeight: 550, borderRadius: 20, borderWidth: 1, borderColor: '#FFFFFF20', backgroundColor: '#11172C', padding: 20 }, phoneTop: { paddingTop: 8 }, previewKicker: { color: '#8A84A0', fontSize: 9, fontWeight: '600', letterSpacing: 1.4 }, previewHello: { color: colors.white, fontSize: 24, fontWeight: '700', marginTop: 6 }, previewSub: { color: '#9D98B1', fontSize: 12, marginTop: 4 }, statRow: { flexDirection: 'row', gap: 9, marginTop: 22 }, previewStat: { flex: 1, backgroundColor: '#FFFFFF08', borderTopWidth: 1, borderColor: '#FFFFFF18', paddingVertical: 14, borderRadius: 0 }, statValue: { color: colors.white, fontSize: 19, fontWeight: '700', marginTop: 11 }, statLabel: { color: '#8F8AA4', fontSize: 11, marginTop: 1 }, motivation: { flexDirection: 'row', gap: 10, backgroundColor: '#6F44D612', borderLeftWidth: 2, borderColor: '#8C61F5', padding: 13, marginTop: 12 }, motivationText: { color: '#D9D3E9', fontSize: 12, lineHeight: 19, flex: 1 }, progressRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 26 }, progressTitle: { color: colors.white, fontSize: 16, fontWeight: '600', marginTop: 2 }, progressNumber: { color: '#B8A0FF', fontSize: 21, fontWeight: '700' }, bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 104, marginTop: 13 }, bar: { flex: 1, minHeight: 16, borderRadius: 4 },
});
