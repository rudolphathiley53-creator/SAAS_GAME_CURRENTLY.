import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { PhoneVerifyForm } from '@/components/auth/phone-verify-form';
import { getPhoneAuthStatus } from '@/modules/auth/phone-auth';

export const metadata: Metadata = { title: 'Vérification' };
export const dynamic = 'force-dynamic';

export default async function VerifyPage() {
  const authStatus = await getPhoneAuthStatus();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
      <PageHeading
        eyebrow="Vérification"
        title="Confirmez votre numéro"
        description="Les codes expirés ou incorrects sont refusés par Supabase Auth."
      />
      <Card className="p-6 sm:p-8">
        {authStatus.enabled ? (
          <PhoneVerifyForm enabled />
        ) : (
          <EmptyState
            title="Vérification indisponible"
            description="Le fournisseur SMS n’est pas activé ou sa configuration n’a pas pu être vérifiée."
            action={
              <Link href="/login" className="font-bold text-rose-700">
                Retour à la connexion
              </Link>
            }
            tone="warning"
          />
        )}
      </Card>
    </div>
  );
}
