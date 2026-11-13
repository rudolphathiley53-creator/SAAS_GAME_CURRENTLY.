import type { Metadata } from 'next';
import Link from 'next/link';
import { PhoneLoginForm } from '@/components/auth/phone-login-form';
import { Card } from '@/components/ui/card';
import { PageHeading } from '@/components/ui/page-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { getPhoneAuthStatus } from '@/modules/auth/phone-auth';

export const metadata: Metadata = { title: 'Créer un compte' };
export const dynamic = 'force-dynamic';

export default async function SignUpPage() {
  const authStatus = await getPhoneAuthStatus();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
      <PageHeading
        eyebrow="Créer un compte"
        title="Rejoignez GOCOINS"
        description="Supabase Auth crée le compte lors de la vérification d’un OTP, uniquement si le fournisseur SMS est activé."
      />
      <Card className="p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-game text-2xl font-bold">
            Inscription téléphone
          </h2>
          <StatusBadge
            label={authStatus.enabled ? 'SMS actif' : 'SMS inactif'}
            tone={authStatus.enabled ? 'success' : 'warning'}
          />
        </div>
        {!authStatus.enabled && (
          <p className="mb-5 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm leading-6 text-coral-600">
            {authStatus.status === 'unconfigured'
              ? 'Supabase n’est pas configuré dans cet environnement. Aucun OTP ne sera envoyé.'
              : authStatus.status === 'disabled'
                ? 'La connexion téléphone est désactivée dans Supabase Auth. Aucun code ne sera envoyé.'
                : 'La configuration Supabase Auth n’a pas pu être vérifiée. Aucun OTP ne sera envoyé.'}
          </p>
        )}
        <PhoneLoginForm enabled={authStatus.enabled} />
        <p className="mt-5 text-center text-sm text-ink/60">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-bold text-rose-700">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
}
