'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getPhoneAuthStatus } from '@/modules/auth/phone-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthActionState = {
  status: 'idle' | 'error' | 'sent';
  message: string;
};

const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    'Saisissez un numéro au format international E.164.',
  );

const idleState: AuthActionState = { status: 'idle', message: '' };

export async function requestPhoneOtp(
  _previousState: AuthActionState = idleState,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;
  const phone = phoneSchema.safeParse(formData.get('phone'));
  if (!phone.success)
    return {
      status: 'error',
      message: phone.error.issues[0]?.message ?? 'Numéro invalide.',
    };

  const provider = await getPhoneAuthStatus();
  if (!provider.enabled) {
    return {
      status: 'error',
      message:
        'La connexion SMS n’est pas activée pour ce projet Supabase. Aucun code n’a été envoyé.',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: phone.data });
  if (error) {
    console.error('Supabase phone OTP request failed.', {
      code: error.code,
      status: error.status,
    });
    return {
      status: 'error',
      message:
        'Impossible de demander un code pour le moment. Vérifiez le numéro et la configuration SMS.',
    };
  }

  return {
    status: 'sent',
    message:
      'Si le numéro est éligible, un code a été envoyé. Saisissez-le sur la page de vérification.',
  };
}

export async function verifyPhoneOtp(
  _previousState: AuthActionState = idleState,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;
  const phone = phoneSchema.safeParse(formData.get('phone'));
  const token = z
    .string()
    .trim()
    .regex(/^\d{6,8}$/)
    .safeParse(formData.get('token'));
  if (!phone.success || !token.success) {
    return {
      status: 'error',
      message: 'Le numéro ou le code saisi est invalide.',
    };
  }

  const provider = await getPhoneAuthStatus();
  if (!provider.enabled) {
    return {
      status: 'error',
      message: 'La vérification SMS n’est pas activée pour ce projet Supabase.',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: phone.data,
    token: token.data,
    type: 'sms',
  });
  if (error) {
    console.error('Supabase phone OTP verification failed.', {
      code: error.code,
      status: error.status,
    });
    return {
      status: 'error',
      message:
        'Code incorrect ou expiré. Vérifiez le code reçu puis réessayez.',
    };
  }

  redirect('/account');
}
