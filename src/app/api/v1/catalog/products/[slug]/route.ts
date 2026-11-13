import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublishedProductBySlug } from '@/modules/catalog/public-catalog';

export const dynamic = 'force-dynamic';

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success) {
    return NextResponse.json(
      { error: 'Invalid product slug.' },
      { status: 400 },
    );
  }

  const result = await getPublishedProductBySlug(slug);
  if (result.status === 'not-found') {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }
  if (result.status !== 'ready') {
    return NextResponse.json(result, {
      status: result.status === 'error' ? 500 : 503,
    });
  }
  return NextResponse.json(result);
}
