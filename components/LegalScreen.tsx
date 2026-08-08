import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { AppScreen, Header } from '@/components/ui';
import { colors, typeScale } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface LegalSection { title: string; paragraphs: string[]; bullets?: string[] }

export function LegalScreen({ title, subtitle, sections }: { title: string; subtitle: string; sections: LegalSection[] }) {
  const theme = useTheme(); const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? 'support@soberplushealth.com';
  return <AppScreen><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.canGoBack() ? router.back() : router.replace('/welcome')} style={styles.back}><Ionicons name="arrow-back" size={20} color={theme.colors.text} /><Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text></Pressable><Header title={title} subtitle={subtitle} />{sections.map((section) => <View key={section.title} style={[styles.section, { borderColor: theme.colors.border }]}><Text style={[styles.heading, { color: theme.colors.text }]}>{section.title}</Text>{section.paragraphs.map((paragraph) => <Text key={paragraph} style={[styles.body, { color: theme.colors.muted }]}>{paragraph}</Text>)}{section.bullets?.map((bullet) => <View key={bullet} style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={[styles.body, styles.flex, { color: theme.colors.muted }]}>{bullet}</Text></View>)}</View>)}<View style={[styles.contact, { borderColor: theme.colors.border }]}><Text style={[styles.heading, { color: theme.colors.text }]}>Contact</Text><Text style={[styles.body, { color: theme.colors.muted }]}>Questions about these terms, privacy, or the app can be sent to:</Text><Pressable accessibilityRole="link" onPress={() => Linking.openURL(`mailto:${supportEmail}`)}><Text style={styles.link}>{supportEmail}</Text></Pressable></View></AppScreen>;
}

const styles = StyleSheet.create({ back: { minHeight: 40, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7 }, backText: { ...typeScale.body, fontWeight: '600' }, section: { borderTopWidth: 1, paddingTop: 18 }, heading: { ...typeScale.section, fontWeight: '700', marginBottom: 7 }, body: { ...typeScale.body, marginBottom: 8 }, bulletRow: { flexDirection: 'row', gap: 9 }, bullet: { color: colors.purple, ...typeScale.body, fontWeight: '700' }, flex: { flex: 1 }, contact: { borderTopWidth: 1, paddingTop: 18, paddingBottom: 24 }, link: { color: colors.purple, ...typeScale.body, fontWeight: '600' } });
