import 'server-only';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { getPublicEnvironment } from '@/lib/env';

export function createSupabasePublicServerClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnvironment();

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
