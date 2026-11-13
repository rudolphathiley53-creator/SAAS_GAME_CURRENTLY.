import type { Metadata } from 'next';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = { title: 'FAQ' };

const questions = [
  {
    question: 'Les achats et recharges sont-ils disponibles ?',
    answer:
      'Non. La plateforme est en préparation. Aucun paiement, achat fournisseur ou crédit n’est exécuté.',
  },
  {
    question: 'Les produits affichés sont-ils réels ?',
    answer:
      'Seuls les produits publiés depuis le catalogue de données seront visibles. Aucun produit de démonstration n’est ajouté.',
  },
  {
    question: 'Puis-je me connecter par téléphone ?',
    answer:
      'La connexion SMS dépend de l’activation effective d’un fournisseur dans Supabase Auth. Si elle est désactivée, le formulaire reste bloqué et aucun code n’est envoyé.',
  },
  {
    question: 'Comment sont calculés les prix ?',
    answer:
      'Les prix affichés viennent des variantes actives du catalogue. Le panier est indicatif et ne crée pas de commande.',
  },
  {
    question: 'Les AI Credits et le wallet fonctionnent-ils ?',
    answer:
      'Non. Ces modules sont préparés comme sections, mais aucune valeur de solde, consommation, clé API ou transaction fictive n’est affichée.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Aide"
        title="Questions fréquentes"
        description="Informations transparentes sur l’état actuel de GOCOINS."
      />
      <div className="space-y-3">
        {questions.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-2xl border border-rose-200 bg-surface p-5"
          >
            <summary className="cursor-pointer list-none font-bold marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {question}
                <span
                  aria-hidden="true"
                  className="text-rose-700 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-6 text-ink/65">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
