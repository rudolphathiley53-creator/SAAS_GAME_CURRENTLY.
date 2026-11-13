'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Supabase sign-out failed.', {
      code: error.code,
      status: error.status,
    });
    throw new Error('Unable to sign out. Please try again.');
  }
  redirect('/login');
}
