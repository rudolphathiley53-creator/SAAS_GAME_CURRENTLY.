'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';
import { getPublicEnvironment } from '@/lib/env';

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let browserClient: BrowserClient | undefined;

export function createSupabaseBrowserClient(): BrowserClient {
  if (browserClient) return browserClient;

  const { supabaseUrl, supabaseAnonKey } = getPublicEnvironment();
  browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

  return browserClient;
}
