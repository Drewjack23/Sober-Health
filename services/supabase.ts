import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : null;

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Cloud sign-in is not configured yet. Use Demo Mode or add Supabase environment variables.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) return { localDevelopment: true };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function sendPasswordReset(email: string) {
  if (!supabase) throw new Error('Password reset becomes available after Supabase is configured.');
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'soberplushealth://reset-password' });
  if (error) throw error;
}

export async function deleteCloudAccount() {
  if (!supabase) return;
  const { error } = await supabase.functions.invoke('delete-account');
  if (error) throw error;
  await supabase.auth.signOut();
}
