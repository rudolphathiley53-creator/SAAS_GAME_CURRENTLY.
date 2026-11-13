import { NextResponse } from 'next/server';
import { hasSupabaseEnvironment } from '@/lib/env';
import { createSupabasePublicServerClient } from '@/lib/supabase/public';
import { validateCartVariantIds } from '@/modules/catalog/cart-input';

const VARIANT_COLUMNS = 'id,product_id,sku,name,price_xof';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedIds = validateCartVariantIds(searchParams.getAll('id'));

  if (!parsedIds.success) {
    return NextResponse.json(
      { error: 'Invalid variant IDs.' },
      { status: 400 },
    );
  }
  if (!hasSupabaseEnvironment()) {
    return NextResponse.json(
      { status: 'unconfigured', variants: [] },
      { status: 503 },
    );
  }
  if (!parsedIds.ids.length) {
    return NextResponse.json({ status: 'ready', variants: [] });
  }

  const supabase = createSupabasePublicServerClient();
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select(VARIANT_COLUMNS)
    .in('id', parsedIds.ids)
    .eq('is_active', true);

  if (variantsError) {
    if (variantsError.code === 'PGRST205' || variantsError.code === '42P01') {
      return NextResponse.json(
        { status: 'schema-required', variants: [] },
        { status: 503 },
      );
    }
    console.error('Unable to load current cart variants.', variantsError);
    return NextResponse.json(
      { status: 'error', variants: [] },
      { status: 503 },
    );
  }

  const productIds = [
    ...new Set((variants ?? []).map((variant) => variant.product_id)),
  ];
  if (!productIds.length) {
    return NextResponse.json({ status: 'ready', variants: [] });
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id,name,slug')
    .in('id', productIds)
    .eq('status', 'active')
    .eq('is_published', true);

  if (productsError) {
    if (productsError.code === 'PGRST205' || productsError.code === '42P01') {
      return NextResponse.json(
        { status: 'schema-required', variants: [] },
        { status: 503 },
      );
    }
    console.error('Unable to load cart product details.', productsError);
    return NextResponse.json(
      { status: 'error', variants: [] },
      { status: 503 },
    );
  }

  const productsById = new Map(
    (products ?? []).map((product) => [product.id, product]),
  );
  const currentVariants = (variants ?? []).flatMap((variant) => {
    const product = productsById.get(variant.product_id);
    if (!product) return [];
    return [
      {
        id: variant.id,
        productId: variant.product_id,
        productName: product.name,
        productSlug: product.slug,
        sku: variant.sku,
        name: variant.name,
        priceXof: Number(variant.price_xof),
      },
    ];
  });

  return NextResponse.json({ status: 'ready', variants: currentVariants });
}
