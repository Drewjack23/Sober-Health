import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { AppScreen, Button, Header, SectionTitle } from '@/components/ui';
import { colors, typeScale } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const topics = [
  ['My data is missing', 'Confirm you are using the same device and account. Demo and offline-first data remains on the device unless cloud sync is enabled.'],
  ['Delete my account', 'Open Settings, choose “Delete account and data,” and confirm. This clears device data and requests cloud deletion when signed in.'],
  ['Nutrition or recovery question', 'The app provides general wellness information. Contact a qualified professional for individual medical, nutrition, mental-health, or addiction-treatment advice.'],
  ['Report a problem', 'Include your device model, OS version, app version, the screen involved, and steps that reproduce the issue. Never email passwords or sensitive journal content.'],
];

export default function AppSupportScreen() { const theme = useTheme(); const email = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@soberplushealth.com'; return <AppScreen><Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/welcome')} style={styles.back}><Ionicons name="arrow-back" size={20} color={theme.colors.text} /><Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text></Pressable><Header title="App Support" subtitle="Help with accounts, data, and using Sober Plus Health." /><View><SectionTitle eyebrow="COMMON QUESTIONS" title="Start here" />{topics.map(([title, body]) => <View key={title} style={[styles.topic, { borderColor: theme.colors.border }]}><Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text><Text style={[styles.body, { color: theme.colors.muted }]}>{body}</Text></View>)}</View><View style={[styles.contact, { borderColor: theme.colors.border }]}><SectionTitle eyebrow="CONTACT" title="Still need help?" /><Text style={[styles.body, { color: theme.colors.muted }]}>Email our support team. Do not include passwords or unnecessary health information.</Text><Button label={`Email ${email}`} icon="mail-outline" onPress={() => Linking.openURL(`mailto:${email}?subject=Sober%20Plus%20Health%20Support`)} /></View><View style={styles.legal}><Pressable onPress={() => router.push('/privacy-policy')}><Text style={styles.link}>Privacy Policy</Text></Pressable><Pressable onPress={() => router.push('/terms')}><Text style={styles.link}>Terms of Use</Text></Pressable></View></AppScreen>; }

const styles = StyleSheet.create({ back: { minHeight: 40, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7 }, backText: { ...typeScale.body, fontWeight: '600' }, topic: { borderTopWidth: 1, paddingVertical: 15 }, title: { ...typeScale.bodyLarge, fontWeight: '700' }, body: { ...typeScale.body, marginTop: 4 }, contact: { borderTopWidth: 1, paddingTop: 18 }, legal: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, paddingBottom: 24 }, link: { color: colors.purple, ...typeScale.body, fontWeight: '600' } });
