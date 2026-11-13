import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <article
      className={`rounded-3xl border border-rose-100 bg-surface p-5 shadow-soft ${className}`}
      {...props}
    >
      {children}
    </article>
  );
}
