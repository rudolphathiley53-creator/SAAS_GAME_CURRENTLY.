import 'server-only';

import { z } from 'zod';
import { getPublicEnvironment, hasSupabaseEnvironment } from '@/lib/env';

const authSettingsSchema = z.object({
  external: z
    .object({
      phone: z.boolean(),
    })
    .passthrough(),
  sms_provider: z.string().optional(),
});

export type PhoneAuthStatus =
  | { status: 'unconfigured'; enabled: false }
  | { status: 'disabled'; enabled: false; smsProvider: string | null }
  | { status: 'enabled'; enabled: true; smsProvider: string | null }
  | { status: 'error'; enabled: false };

export async function getPhoneAuthStatus(): Promise<PhoneAuthStatus> {
  if (!hasSupabaseEnvironment())
    return { status: 'unconfigured', enabled: false };

  const { supabaseUrl, supabaseAnonKey } = getPublicEnvironment();
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(
        'Unable to verify Supabase phone authentication settings.',
        {
          status: response.status,
        },
      );
      return { status: 'error', enabled: false };
    }

    const parsed = authSettingsSchema.safeParse(await response.json());
    if (!parsed.success) {
      console.error(
        'Supabase phone authentication settings have an unexpected shape.',
      );
      return { status: 'error', enabled: false };
    }

    const smsProvider = parsed.data.sms_provider ?? null;
    if (!parsed.data.external.phone) {
      return { status: 'disabled', enabled: false, smsProvider };
    }

    return { status: 'enabled', enabled: true, smsProvider };
  } catch (error) {
    console.error('Unable to reach Supabase Auth settings.', error);
    return { status: 'error', enabled: false };
  }
}
