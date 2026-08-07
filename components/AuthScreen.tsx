import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from './AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from './ui';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export function AuthScreen({ title, subtitle, children }: React.PropsWithChildren<{ title: string; subtitle: string }>) {
  const theme = useTheme();
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.shell}><View style={styles.brandRow}><BrandMark /><Text onPress={() => router.replace('/welcome')} style={[styles.brand, { color: theme.colors.text }]}>Sober Plus Health</Text></View><Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text><Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text><View style={styles.form}>{children}</View><Text style={[styles.privacy, { color: theme.colors.muted }]}>Your health and recovery data stay private. Nothing is public by default.</Text></View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl }, shell: { width: '100%', maxWidth: 460, alignSelf: 'center' }, brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 38 }, brand: { fontSize: 17, fontWeight: '700' }, title: { fontSize: 29, lineHeight: 36, fontWeight: '700', letterSpacing: -0.5 }, subtitle: { fontSize: 15, lineHeight: 23, marginTop: 6 }, form: { gap: 15, marginTop: 26 }, privacy: { fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 25 } });
