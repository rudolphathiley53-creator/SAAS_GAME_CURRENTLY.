import { signOut } from '@/modules/auth/sign-out';

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold hover:bg-rose-50"
      >
        Se déconnecter
      </button>
    </form>
  );
}
