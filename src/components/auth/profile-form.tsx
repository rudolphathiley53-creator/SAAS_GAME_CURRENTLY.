'use client';

import { useActionState } from 'react';
import {
  updateOwnProfile,
  type ProfileActionState,
} from '@/modules/auth/profile-actions';

const initialState: ProfileActionState = { status: 'idle', message: '' };

export function ProfileForm({ displayName }: { displayName: string | null }) {
  const [state, formAction, pending] = useActionState(
    updateOwnProfile,
    initialState,
  );

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <label htmlFor="displayName" className="block text-sm font-bold">
        Nom affiché
      </label>
      <input
        id="displayName"
        name="displayName"
        type="text"
        autoComplete="name"
        minLength={2}
        maxLength={80}
        defaultValue={displayName ?? ''}
        required
        className="w-full rounded-xl border border-rose-200 bg-surface px-4 py-3 text-sm outline-none focus:border-rose-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
      {state.message && (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className="text-sm text-ink/70"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
