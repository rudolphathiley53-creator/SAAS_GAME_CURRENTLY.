import { describe, expect, it } from 'vitest';
import { formatXof } from '@/lib/format-xof';

describe('formatXof', () => {
  it('formats integer XOF amounts without decimal places', () => {
    expect(formatXof(12500)).toBe(
      `${new Intl.NumberFormat('fr-FR').format(12500)} FCFA`,
    );
    expect(formatXof(BigInt(12500))).toBe(
      `${new Intl.NumberFormat('fr-FR').format(BigInt(12500))} FCFA`,
    );
  });
});
