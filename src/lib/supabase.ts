import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

declare global {
  interface Window {
    supabaseClient: SupabaseClient | null;
    ONNOY_IS_ADMIN?: boolean;
  }
}

function build(): SupabaseClient | null {
  if (!url || !anonKey) {
    console.warn('[onnoy] Supabase env vars missing — auth features disabled.');
    return null;
  }
  return createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}

/** Shared browser client. `null` when env is not configured. */
export const supabase: SupabaseClient | null = typeof window === 'undefined' ? null : build();

// Legacy scripts still read window.supabaseClient.
if (typeof window !== 'undefined') window.supabaseClient = supabase;

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

let adminCache: { userId: string; isAdmin: boolean } | null = null;

/** Admin status comes from profiles.role, enforced server-side by RLS. */
export async function isAdminUser(userId: string): Promise<boolean> {
  if (!supabase) return false;
  if (adminCache?.userId === userId) return adminCache.isAdmin;
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  const isAdmin = data?.role === 'admin';
  adminCache = { userId, isAdmin };
  window.ONNOY_IS_ADMIN = isAdmin;
  return isAdmin;
}
