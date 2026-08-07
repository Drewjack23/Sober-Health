import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { z } from 'zod';
import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/theme';
import { signUpWithEmail } from '@/services/supabase';
import { useApp } from '@/state/AppProvider';

const schema = z.object({ firstName: z.string().trim().min(2, 'Please add your first name.'), email: z.string().email('Enter a valid email.'), password: z.string().min(8, 'Use at least 8 characters.') });

export default function SignUpScreen() {
  const { createLocalAccount } = useApp(); const [firstName, setFirstName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async () => { const result = schema.safeParse({ firstName, email, password }); if (!result.success) { setError(result.error.issues[0]?.message ?? 'Check your details.'); return; } setLoading(true); setError(''); try { await signUpWithEmail(email.trim(), password); createLocalAccount(email.trim(), firstName.trim()); router.replace('/onboarding/1'); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to create your account.'); } finally { setLoading(false); } };
  return <AuthScreen title="Create your account" subtitle="We’ll build a plan around your goals—not somebody else’s."><Field label="First name" placeholder="What should we call you?" value={firstName} onChangeText={setFirstName} /><Field label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} /><Field label="Password" placeholder="At least 8 characters" secureTextEntry value={password} onChangeText={setPassword} error={error} /><Text style={styles.terms}>By continuing, you agree to the Terms and acknowledge the Privacy Policy.</Text><Button label="Continue" icon="arrow-forward" loading={loading} onPress={submit} /><Pressable onPress={() => router.replace('/sign-in')}><Text style={styles.center}>Already have an account? <Text style={styles.link}>Sign in</Text></Text></Pressable></AuthScreen>;
}
const styles = StyleSheet.create({ terms: { color: colors.muted, fontSize: 12, lineHeight: 18 }, link: { color: colors.purple, fontWeight: '800' }, center: { textAlign: 'center', color: colors.muted, marginTop: 4 } });
