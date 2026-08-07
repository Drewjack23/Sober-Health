import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/theme';
import { sendPasswordReset } from '@/services/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async () => { setLoading(true); try { await sendPasswordReset(email.trim()); setMessage('Check your email for a secure reset link.'); } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Unable to send reset email.'); } finally { setLoading(false); } };
  return <AuthScreen title="Reset your password" subtitle="Enter your email and we’ll send a secure reset link."><Field label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} /><Button label="Send reset link" loading={loading} disabled={!email} onPress={submit} />{message ? <Text style={styles.message}>{message}</Text> : null}<Button label="Back to sign in" variant="ghost" onPress={() => router.back()} /></AuthScreen>;
}
const styles = StyleSheet.create({ message: { color: colors.purple, lineHeight: 21, textAlign: 'center' } });
