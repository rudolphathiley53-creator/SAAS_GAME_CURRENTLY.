import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Gamepad2,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import { CatalogGrid } from '@/components/catalog/catalog-grid';
import { HeroVideos } from '@/components/layout/hero-videos';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { listPublishedCatalog } from '@/modules/catalog/public-catalog';

export const dynamic = 'force-dynamic';

const capabilities = [
  {
    icon: Gamepad2,
    title: 'Gaming Store',
    text: 'Un catalogue de produits gaming publié depuis la base de données.',
  },
  {
    icon: WalletCards,
    title: 'Wallet XOF',
    text: 'Un futur ledger avec montants entiers, réservations et traces vérifiables.',
  },
  {
    icon: Bot,
    title: 'AI Credits',
    text: 'Des modèles et usages mesurés, protégés par limites et contrôles serveur.',
  },
];

export default async function HomePage() {
  const catalog = await listPublishedCatalog();

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <section className="relative isolate min-h-[38rem] overflow-hidden rounded-[2rem] border border-rose-200 bg-[#101a14] px-6 py-10 shadow-soft sm:min-h-[42rem] sm:px-10 sm:py-14 lg:px-14">
        <HeroVideos />
        <div className="relative z-10 grid min-h-[34rem] gap-8 pb-20 sm:min-h-[36rem] sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge label="Plateforme en préparation" tone="warning" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Togo · XOF
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl text-balance font-game text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Le gaming et l’IA, dans une plateforme conçue pour la confiance.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Découvrez le socle de GOCOINS. Les informations commerciales
              seront affichées uniquement lorsqu’elles sont publiées et
              vérifiées côté serveur.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/gaming"
                className="gradient-brand inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-extrabold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Explorer le Gaming Store{' '}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/account"
                className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/20"
              >
                Espace client
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid gap-5 rounded-3xl border border-rose-200 bg-surface/80 p-5 backdrop-blur sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-700">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">Parcours sécurisé par conception</p>
              <p className="mt-1 text-xs text-ink/55">
                Aucune transaction fictive n’est exécutée
              </p>
            </div>
          </div>
          <ul className="grid gap-3 text-sm leading-6 text-ink/70 sm:grid-cols-3">
            <li>Prix et disponibilité lus depuis la base de données.</li>
            <li>Rôles, commandes et argent restent contrôlés côté serveur.</li>
            <li>
              Les paiements et livraisons attendent des fournisseurs vérifiés.
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="gaming-store-heading" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-700">
              Gaming Store
            </p>
            <h2
              id="gaming-store-heading"
              className="mt-2 font-game text-3xl font-bold sm:text-4xl"
            >
              Produits publiés
            </h2>
          </div>
          <Link
            href="/gaming"
            className="inline-flex items-center gap-2 text-sm font-bold text-rose-700 hover:text-rose-800"
          >
            Voir le catalogue{' '}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <CatalogGrid result={catalog} />
      </section>

      <section id="ai-credits" className="grid gap-5 md:grid-cols-3">
        {capabilities.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="h-full">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-game text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-coral-600">
              Activation à venir
            </p>
          </Card>
        ))}
      </section>
    </div>
  );
}
