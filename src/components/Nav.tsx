import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Zap, Home, Package, Gift, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/recharger', label: 'Recharger', icon: Zap },
  { to: '/commandes', label: 'Mes commandes', icon: Package },
  { to: '/compte', label: 'Récompenses', icon: Gift },
  { to: '/aide', label: 'Aide', icon: HelpCircle },
];

export function Sidebar() {
  return (
    <header className="glass fixed left-1/2 top-4 z-40 hidden w-[min(1180px,calc(100%-2rem))] -translate-x-1/2 items-center justify-between gap-6 rounded-full border border-white/60 px-5 py-3 shadow-[0_12px_40px_-24px_rgba(17,26,20,0.45)] transition-all duration-300 lg:flex">
      <Link to="/" className="shrink-0">
        <span className="brand-wordmark block text-lg leading-none">GOCOINS</span>
        <span className="mt-1 block text-[9px] font-bold tracking-[0.18em] text-ink/50">RECHARGE JEUX</span>
      </Link>
      <nav className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-rose-100 text-rose-700'
                    : 'text-ink/70 hover:bg-white/50 hover:text-rose-700'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        <a href="https://wa.me/22890000000" className="rounded-full px-3 py-2 text-xs font-bold text-ink/60 transition-colors hover:text-rose-700">
          Aide
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function MobileBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="glass fixed inset-x-3 top-3 z-40 flex items-center justify-between rounded-full border border-white/60 px-4 py-2.5 shadow-soft lg:hidden">
        <Link to="/" className="brand-wordmark text-base">GOCOINS</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 bg-white/55 text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[88%] flex-col border-l border-rose-100 bg-white/95 p-4 shadow-soft-lg backdrop-blur-xl animate-slide-in-right">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" onClick={() => setOpen(false)} className="brand-wordmark text-lg">
                GOCOINS
              </Link>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 transition-colors hover:bg-rose-100"
              >
                <X className="h-5 w-5 text-ink" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? 'gradient-brand text-white shadow-soft'
                          : 'text-ink/70 hover:translate-x-0.5 hover:bg-rose-50'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white/35 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <span className="brand-wordmark text-lg">GOCOINS</span>
          <p className="mt-3 max-w-xs text-sm text-ink/60">
            La façon la plus rapide de recharger tes jeux au Togo. Flooz, Mix by Yas, livraison en moins de 2 minutes.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-ink">Liens</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/recharger" className="hover:text-rose-600">Recharger</Link></li>
            <li><Link to="/commandes" className="hover:text-rose-600">Mes commandes</Link></li>
            <li><Link to="/compte" className="hover:text-rose-600">Récompenses</Link></li>
            <li><Link to="/aide" className="hover:text-rose-600">Aide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-ink">À propos</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><span className="hover:text-rose-600">Comment ça marche</span></li>
            <li><span className="hover:text-rose-600">Sécurité</span></li>
            <li><span className="hover:text-rose-600">Dépense responsable</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-ink">Contact</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><a href="https://wa.me/22890000000" className="hover:text-rose-600">WhatsApp</a></li>
            <li><a href="https://facebook.com" className="hover:text-rose-600">Facebook</a></li>
            <li><a href="https://t.me" className="hover:text-rose-600">Telegram</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-center text-xs text-ink/40">
        © {new Date().getFullYear()} GOCOINS. Noms de jeux mentionnés à titre indicatif — aucune marque affiliée.
      </p>
    </footer>
  );
}
