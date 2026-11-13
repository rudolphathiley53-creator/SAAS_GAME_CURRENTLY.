'use client';

import { useEffect } from 'react';
import { EmptyState } from '@/components/ui/empty-state';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application route error.', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <EmptyState
        title="Une erreur est survenue"
        description="Le contenu demandé n’a pas pu être chargé. Vous pouvez réessayer."
        action={
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700"
          >
            Réessayer
          </button>
        }
        tone="warning"
      />
    </div>
  );
}
