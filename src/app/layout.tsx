import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { JoyfulMotion } from '@/components/layout/joyful-motion';
import { CartProvider } from '@/components/cart/cart-provider';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GOCOINS — Gaming Store & AI Credits',
    template: '%s | GOCOINS',
  },
  description: 'Plateforme Gaming Store & AI Credits pour le Togo.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CartProvider>
            <JoyfulMotion>
              <SiteHeader />
              <div aria-hidden="true" className="h-[5.5rem]" />
              <main id="main-content" className="min-h-[65vh]">
                {children}
              </main>
              <SiteFooter />
            </JoyfulMotion>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
