import 'server-only';

import { hasSupabaseEnvironment } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type CurrentProfileResult =
  | { status: 'unconfigured' }
  | { status: 'unauthenticated' }
  | { status: 'schema-required' }
  | { status: 'profile-missing' }
  | { status: 'error' }
  | {
      status: 'ready';
      profile: {
        id: string;
        email: string | null;
        phone: string | null;
        displayName: string | null;
        role: 'customer' | 'support' | 'admin';
        accountStatus: 'active' | 'suspended' | 'closed';
        locale: string;
        timezone: string;
      };
    };

export async function getCurrentProfile(): Promise<CurrentProfileResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('Unable to verify the current Supabase session.', {
      code: authError.code,
      status: authError.status,
    });
    return { status: 'error' };
  }
  if (!authData.user) return { status: 'unauthenticated' };

  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,phone,display_name,role,account_status,locale,timezone')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST205' || error.code === '42P01') {
      return { status: 'schema-required' };
    }
    console.error('Unable to load the current user profile.', {
      code: error.code,
      message: error.message,
    });
    return { status: 'error' };
  }
  if (!data) return { status: 'profile-missing' };

  return {
    status: 'ready',
    profile: {
      id: data.id,
      email: data.email,
      phone: data.phone,
      displayName: data.display_name,
      role: data.role,
      accountStatus: data.account_status,
      locale: data.locale,
      timezone: data.timezone,
    },
  };
}
