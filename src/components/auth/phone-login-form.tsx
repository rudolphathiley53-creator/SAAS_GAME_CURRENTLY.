'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { requestPhoneOtp, type AuthActionState } from '@/modules/auth/actions';

const initialState: AuthActionState = { status: 'idle', message: '' };

export function PhoneLoginForm({ enabled }: { enabled: boolean }) {
  const [state, formAction, pending] = useActionState(
    requestPhoneOtp,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-bold" htmlFor="phone">
        Numéro de téléphone
      </label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+228 XX XX XX XX"
        required
        pattern="^\+[1-9][0-9]{7,14}$"
        className="w-full rounded-xl border border-rose-200 bg-surface px-4 py-3 text-sm outline-none focus:border-rose-500"
      />
      <p className="text-xs leading-5 text-ink/55">
        Utilisez le format international, par exemple +228…
      </p>
      <button
        type="submit"
        disabled={!enabled || pending}
        className="w-full rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-ink/35"
      >
        {pending ? 'Envoi en cours…' : 'Demander un code'}
      </button>
      {state.message && (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className={`rounded-xl p-3 text-sm ${state.status === 'error' ? 'bg-coral-50 text-coral-600' : 'bg-rose-50 text-rose-700'}`}
        >
          {state.message}
        </p>
      )}
      {state.status === 'sent' && (
        <Link
          href="/verify"
          className="block text-center text-sm font-bold text-rose-700 hover:text-rose-800"
        >
          Saisir le code de vérification
        </Link>
      )}
    </form>
  );
}
