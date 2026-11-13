'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const animatedElements =
  'header, main h1, main h2, main section, main article, main form, main [role="region"], footer';

export function JoyfulMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const elements = Array.from(
      root.querySelectorAll<HTMLElement>(animatedElements),
    );
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    elements.forEach((element) => {
      const siblingIndex = Array.from(
        element.parentElement?.children ?? [],
      ).indexOf(element);
      element.dataset.joyful = 'pending';
      element.style.setProperty(
        '--joy-delay',
        `${Math.min(siblingIndex * 70, 350)}ms`,
      );
    });

    if (motionPreference.matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.dataset.joyful = 'visible';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.joyful = 'visible';
          observer.unobserve(element);
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="contents" ref={rootRef}>
      {children}
    </div>
  );
}
