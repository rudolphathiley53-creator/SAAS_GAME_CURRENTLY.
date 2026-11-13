import { describe, expect, it } from 'vitest';
import { validateCartVariantIds } from '@/modules/catalog/cart-input';

describe('validateCartVariantIds', () => {
  it('deduplicates valid UUIDs', () => {
    const id = 'c0d2f628-ea3f-4d49-83ef-2c2d01dd5301';
    expect(validateCartVariantIds([id, id])).toEqual({
      success: true,
      ids: [id],
    });
  });

  it('rejects invalid UUIDs and more than 50 unique variants', () => {
    expect(validateCartVariantIds(['invalid'])).toEqual({ success: false });
    const ids = Array.from(
      { length: 51 },
      (_, index) =>
        `c0d2f628-ea3f-4d49-83ef-2c2d01dd53${index.toString().padStart(2, '0')}`,
    );
    expect(validateCartVariantIds(ids)).toEqual({ success: false });
  });
});
