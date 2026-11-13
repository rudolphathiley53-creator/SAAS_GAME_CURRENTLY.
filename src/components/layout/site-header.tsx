import Link from 'next/link';
import { ArrowUpRight, Menu, ShoppingBag } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const links = [
  { href: '/gaming', label: 'Gaming' },
  { href: '/categories', label: 'Catégories' },
  { href: '/ai-credits', label: 'AI Credits' },
  { href: '/faq', label: 'Aide' },
];

export function SiteHeader() {
  return (
    <header className="liquid-nav fixed left-3 right-3 top-3 z-40 mx-auto max-w-7xl rounded-3xl backdrop-blur-xl backdrop-saturate-150 sm:left-6 sm:right-6">
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="brand-wordmark block text-lg leading-none">
            GOCOINS
          </span>
          <span className="mt-1 block text-[9px] font-bold tracking-[0.18em] text-ink/50">
            GAMING STORE · AI CREDITS
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-bold text-ink/70 transition-colors hover:bg-rose-100 hover:text-rose-700"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/account"
            className="hidden items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-bold transition-colors hover:bg-rose-50 sm:inline-flex"
          >
            Mon compte <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50 sm:inline-flex"
          >
            Connexion
          </Link>
          <Link
            href="/cart"
            aria-label="Ouvrir le panier"
            className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 transition-colors hover:bg-rose-50"
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <details className="relative md:hidden">
            <summary
              aria-label="Ouvrir la navigation"
              className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-rose-200"
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </summary>
            <nav className="liquid-nav-panel absolute right-0 top-12 z-50 grid min-w-48 gap-1 rounded-2xl p-2 shadow-soft backdrop-blur-xl backdrop-saturate-150">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-rose-50"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/account"
                className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-rose-50"
              >
                Mon compte
              </Link>
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-rose-50"
              >
                Connexion
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
