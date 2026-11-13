import Link from 'next/link';

const footerLinks = [
  { href: '/gaming', label: 'Gaming Store' },
  { href: '/ai-credits', label: 'AI Credits' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/legal/terms', label: 'Conditions' },
  { href: '/legal/privacy', label: 'Confidentialité' },
  { href: '/legal/refunds', label: 'Remboursements' },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rose-200/70 bg-surface/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div>
          <p className="brand-wordmark text-lg">GOCOINS</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">
            Plateforme Gaming Store &amp; AI Credits en préparation. Les
            fonctionnalités commerciales ne sont activées qu’après validation
            des services et des données.
          </p>
        </div>
        <nav
          aria-label="Liens légaux"
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-semibold text-ink/60 hover:text-rose-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-rose-200/60 py-4 text-center text-xs text-ink/45">
        © {new Date().getFullYear()} GOCOINS. Informations et disponibilités à
        confirmer.
      </div>
    </footer>
  );
}
