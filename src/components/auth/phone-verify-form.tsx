'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { verifyPhoneOtp, type AuthActionState } from '@/modules/auth/actions';

const initialState: AuthActionState = { status: 'idle', message: '' };

export function PhoneVerifyForm({ enabled }: { enabled: boolean }) {
  const [state, formAction, pending] = useActionState(
    verifyPhoneOtp,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm font-bold" htmlFor="phone">
        Numéro utilisé
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
      <label className="block text-sm font-bold" htmlFor="token">
        Code de vérification
      </label>
      <input
        id="token"
        name="token"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        minLength={6}
        maxLength={8}
        pattern="[0-9]{6,8}"
        required
        className="w-full rounded-xl border border-rose-200 bg-surface px-4 py-3 text-sm tracking-[0.3em] outline-none focus:border-rose-500"
      />
      <button
        type="submit"
        disabled={!enabled || pending}
        className="w-full rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-ink/35"
      >
        {pending ? 'Vérification…' : 'Vérifier le code'}
      </button>
      {state.message && (
        <p
          role="alert"
          className="rounded-xl bg-coral-50 p-3 text-sm text-coral-600"
        >
          {state.message}
        </p>
      )}
      <p className="text-center text-sm text-ink/60">
        Code expiré ?{' '}
        <Link
          href="/login"
          className="font-bold text-rose-700 hover:text-rose-800"
        >
          Demander un nouveau code
        </Link>
      </p>
    </form>
  );
}
