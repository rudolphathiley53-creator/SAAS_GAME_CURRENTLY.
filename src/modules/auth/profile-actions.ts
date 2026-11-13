'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/modules/auth/current-profile';

export type ProfileActionState = {
  status: 'idle' | 'saved' | 'error';
  message: string;
};

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(80),
});

export async function updateOwnProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    displayName: formData.get('displayName'),
  });
  if (!parsed.success) {
    return {
      status: 'error',
      message:
        parsed.error.issues[0]?.message ?? 'Le profil n’a pas pu être validé.',
    };
  }

  const currentProfile = await getCurrentProfile();
  if (
    currentProfile.status !== 'ready' ||
    currentProfile.profile.accountStatus !== 'active'
  ) {
    return {
      status: 'error',
      message:
        'Votre session ou votre profil n’est pas disponible. Reconnectez-vous puis réessayez.',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: parsed.data.displayName })
    .eq('id', currentProfile.profile.id);

  if (error) {
    console.error('Unable to update the current user display name.', {
      code: error.code,
      message: error.message,
    });
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le profil. Réessayez plus tard.',
    };
  }

  revalidatePath('/account');
  return { status: 'saved', message: 'Votre nom de profil a été mis à jour.' };
}
