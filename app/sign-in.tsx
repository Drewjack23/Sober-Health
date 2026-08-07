import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/theme';
import { signInWithEmail } from '@/services/supabase';
import { useApp } from '@/state/AppProvider';

export default function SignInScreen() {
  const { startDemo } = useApp();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async () => { setError(''); setLoading(true); try { await signInWithEmail(email.trim(), password); startDemo(); router.replace('/(tabs)'); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to sign in.'); } finally { setLoading(false); } };
  return <AuthScreen title="Welcome back" subtitle="Pick up where you left off—without pressure."><Field label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} /><Field label="Password" placeholder="At least 8 characters" secureTextEntry value={password} onChangeText={setPassword} error={error} /><Pressable onPress={() => router.push('/forgot-password')}><Text style={styles.link}>Forgot password?</Text></Pressable><Button label="Sign in" loading={loading} disabled={!email || !password} onPress={submit} /><Button label="Use demo account" variant="secondary" onPress={() => { startDemo(); router.replace('/(tabs)'); }} /><Pressable onPress={() => router.replace('/sign-up')}><Text style={styles.center}>New here? <Text style={styles.link}>Create an account</Text></Text></Pressable></AuthScreen>;
}
const styles = StyleSheet.create({ link: { color: colors.purple, fontWeight: '800' }, center: { textAlign: 'center', color: colors.muted, marginTop: 4 } });
