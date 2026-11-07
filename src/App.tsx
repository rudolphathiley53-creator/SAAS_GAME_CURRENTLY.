import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Sidebar, MobileBar, Footer } from '@/components/Nav';
import { BackToTop } from '@/components/BackToTop';
import { HomePage } from '@/pages/HomePage';
import { ThemeProvider } from '@/components/ThemeProvider';

const RechargerPage = lazy(() =>
  import('@/pages/RechargerPage').then((m) => ({ default: m.RechargerPage }))
);
const Placeholder = lazy(() =>
  import('@/pages/Placeholder').then((m) => ({ default: m.Placeholder }))
);

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
    </div>
  );
}

function ShopLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-rose-50 text-ink transition-colors duration-300">
      <Sidebar />
      <MobileBar />
      <main className="flex-1 pt-24 lg:pt-28">
        <Suspense fallback={<PageFallback />}>
          {children ?? <Outlet />}
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ShopLayout>
                <Placeholder
                  title="Administration retirée"
                  subtitle="Cette version contient uniquement la boutique GOCOINS."
                />
              </ShopLayout>
            }
          />
          <Route element={<ShopLayout />}>
            <Route index element={<HomePage />} />
            <Route path="recharger" element={<RechargerPage />} />
            <Route path="commande/:orderId" element={<Placeholder title="Caisse" subtitle="La page de paiement sera ajoutée à l'étape suivante." />} />
            <Route path="commandes" element={<Placeholder title="Mes commandes" subtitle="L'historique de tes commandes apparaîtra ici." />} />
            <Route path="suivi/:orderId" element={<Placeholder title="Suivi de commande" subtitle="Le suivi détaillé sera disponible ici." />} />
            <Route path="compte" element={<Placeholder title="Récompenses" subtitle="Tes points, ton palier et tes limites seront ici." />} />
            <Route path="aide" element={<Placeholder title="Aide" subtitle="FAQ, contact WhatsApp et politique de remboursement arriveront ici." />} />
            <Route path="*" element={<Placeholder title="Page introuvable" subtitle="Cette page n'existe pas." />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
