import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { AuthScreen } from '@/components/AuthScreen';
import { Button, Field } from '@/components/ui';
import { colors } from '@/constants/theme';
import { establishRecoverySession, updateCloudPassword } from '@/services/supabase';

export default function ResetPasswordScreen() {
  const incomingUrl = Linking.useURL(); const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [ready, setReady] = useState(false); const [loading, setLoading] = useState(true); const [message, setMessage] = useState('Validating your secure link…');
  useEffect(() => { let active = true; const prepare = async () => { try { const url = incomingUrl ?? await Linking.getInitialURL(); if (!url) throw new Error('Open the password reset link from your email.'); await establishRecoverySession(url); if (active) { setReady(true); setMessage('Choose a new password with at least 8 characters.'); } } catch (cause) { if (active) setMessage(cause instanceof Error ? cause.message : 'Unable to validate this reset link.'); } finally { if (active) setLoading(false); } }; prepare(); return () => { active = false; }; }, [incomingUrl]);
  const submit = async () => { if (password.length < 8) { setMessage('Use at least 8 characters.'); return; } if (password !== confirmation) { setMessage('The passwords do not match.'); return; } setLoading(true); try { await updateCloudPassword(password); setMessage('Password updated. You can sign in now.'); setReady(false); } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Unable to update your password.'); } finally { setLoading(false); } };
  return <AuthScreen title="Choose a new password" subtitle="Use the secure link from your reset email.">{ready ? <><Field label="New password" secureTextEntry value={password} onChangeText={setPassword} /><Field label="Confirm password" secureTextEntry value={confirmation} onChangeText={setConfirmation} /><Button label="Update password" loading={loading} onPress={submit} /></> : null}<Text accessibilityRole="alert" style={styles.message}>{message}</Text>{!ready && !loading ? <Button label="Back to sign in" variant="secondary" onPress={() => router.replace('/sign-in')} /> : null}</AuthScreen>;
}

const styles = StyleSheet.create({ message: { color: colors.purple, lineHeight: 21, textAlign: 'center' } });
