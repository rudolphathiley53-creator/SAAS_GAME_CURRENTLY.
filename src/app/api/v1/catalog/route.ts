import { NextResponse } from 'next/server';
import { listPublishedCatalog } from '@/modules/catalog/public-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await listPublishedCatalog();
  if (result.status !== 'ready') {
    return NextResponse.json(result, {
      status: result.status === 'error' ? 500 : 503,
    });
  }
  return NextResponse.json(result);
}
