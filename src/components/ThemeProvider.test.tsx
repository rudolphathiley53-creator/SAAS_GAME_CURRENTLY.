import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

describe('theme controls', () => {
  it('toggles between light and dark themes and persists the selection', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggle = screen.getByRole('button', {
      name: 'Activer le thème sombre',
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(localStorage.getItem('gocoins-theme')).toBe('dark');
    });
    expect(
      screen.getByRole('button', { name: 'Activer le thème clair' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
