import type { ReactNode } from 'react';

type PageHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-balance font-game text-4xl font-bold leading-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
