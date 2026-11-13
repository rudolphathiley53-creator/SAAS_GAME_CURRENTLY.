import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  tone?: 'neutral' | 'warning';
};

export function EmptyState({
  title,
  description,
  action,
  tone = 'neutral',
}: EmptyStateProps) {
  return (
    <section
      className={`rounded-3xl border border-dashed p-8 text-center ${
        tone === 'warning'
          ? 'border-coral-300 bg-coral-50/60'
          : 'border-rose-200 bg-surface/70'
      }`}
      aria-live="polite"
    >
      <h2 className="font-game text-2xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink/65">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}
