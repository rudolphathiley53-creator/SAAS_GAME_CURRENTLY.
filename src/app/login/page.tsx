import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { PhoneLoginForm } from '@/components/auth/phone-login-form';
import { PageHeading } from '@/components/ui/page-heading';
import { getPhoneAuthStatus } from '@/modules/auth/phone-auth';

export const metadata: Metadata = { title: 'Connexion' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const authStatus = await getPhoneAuthStatus();
  const enabled = authStatus.enabled;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
      <PageHeading
        eyebrow="Espace client"
        title="Connectez-vous en toute sécurité"
        description="La connexion par téléphone suit le fournisseur SMS réellement activé dans le projet Supabase."
      />
      <Card className="p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-game text-2xl font-bold">Connexion téléphone</h2>
          <StatusBadge
            label={enabled ? 'SMS actif' : 'SMS inactif'}
            tone={enabled ? 'success' : 'warning'}
          />
        </div>
        {!enabled && (
          <p className="mb-5 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-sm leading-6 text-coral-600">
            {authStatus.status === 'unconfigured'
              ? 'Supabase n’est pas configuré dans cet environnement. Aucun OTP ne sera envoyé.'
              : authStatus.status === 'disabled'
                ? `La connexion téléphone est désactivée dans Supabase${authStatus.smsProvider ? ` (fournisseur déclaré : ${authStatus.smsProvider})` : ''}. Configurez et activez un fournisseur SMS avant de l’utiliser.`
                : 'La configuration Supabase Auth n’a pas pu être vérifiée. Aucun OTP ne sera envoyé.'}
          </p>
        )}
        <PhoneLoginForm enabled={enabled} />
        <p className="mt-5 text-xs leading-5 text-ink/55">
          En continuant, vous acceptez les{' '}
          <Link href="/legal/terms" className="font-bold text-rose-700">
            conditions d’utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/legal/privacy" className="font-bold text-rose-700">
            politique de confidentialité
          </Link>
          .
        </p>
        <p className="mt-4 text-center text-sm text-ink/60">
          Nouveau sur GOCOINS ?{' '}
          <Link href="/signup" className="font-bold text-rose-700">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  );
}
