import { z } from 'zod';

const uuidSchema = z.string().uuid();

export function validateCartVariantIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  if (
    uniqueIds.length > 50 ||
    uniqueIds.some((id) => !uuidSchema.safeParse(id).success)
  ) {
    return { success: false as const };
  }
  return { success: true as const, ids: uniqueIds };
}
