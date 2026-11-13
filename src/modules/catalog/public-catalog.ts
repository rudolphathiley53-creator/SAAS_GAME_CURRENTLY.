import 'server-only';

import type { ProductStatus, ProductType, Json } from '@/types/database.types';
import { hasSupabaseEnvironment } from '@/lib/env';
import { createSupabasePublicServerClient } from '@/lib/supabase/public';

export type PublicVariant = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  description: string | null;
  priceXof: number;
  variantData: Json;
};

export type PublicProduct = {
  id: string;
  categoryId: string | null;
  productType: ProductType;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  brand: string | null;
  regionCode: string | null;
  imagePath: string | null;
  metadata: Json;
  variants: PublicVariant[];
};

export type CatalogResult =
  | { status: 'unconfigured' }
  | { status: 'schema-required' }
  | { status: 'error' }
  | { status: 'ready'; products: PublicProduct[] };

export type ProductResult =
  | { status: 'unconfigured' }
  | { status: 'schema-required' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'ready'; product: PublicProduct };

export type CategoryResult =
  | { status: 'unconfigured' }
  | { status: 'schema-required' }
  | { status: 'error' }
  | {
      status: 'ready';
      category: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
      };
    };

export type CategoriesResult =
  | { status: 'unconfigured' }
  | { status: 'schema-required' }
  | { status: 'error' }
  | {
      status: 'ready';
      categories: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
      }[];
    };

const PRODUCT_COLUMNS =
  'id,category_id,product_type,name,slug,short_description,description,brand,region_code,image_path,metadata';
const VARIANT_COLUMNS =
  'id,product_id,sku,name,description,price_xof,variant_data,is_active,sort_order';

function isMissingSchema(code: string | undefined) {
  return code === 'PGRST205' || code === '42P01';
}

export async function listPublishedCatalog(): Promise<CatalogResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = createSupabasePublicServerClient();
  const { data: productRows, error: productError } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('status', 'active' satisfies ProductStatus)
    .eq('is_published', true)
    .order('name')
    .limit(100);

  if (productError) {
    if (isMissingSchema(productError.code))
      return { status: 'schema-required' };
    console.error('Unable to load public catalog products.', productError);
    return { status: 'error' };
  }

  if (!productRows?.length) return { status: 'ready', products: [] };

  const productIds = productRows.map((product) => product.id);
  const { data: variantRows, error: variantError } = await supabase
    .from('product_variants')
    .select(VARIANT_COLUMNS)
    .in('product_id', productIds)
    .eq('is_active', true)
    .order('sort_order')
    .limit(500);

  if (variantError) {
    if (isMissingSchema(variantError.code))
      return { status: 'schema-required' };
    console.error('Unable to load published product variants.', variantError);
    return { status: 'error' };
  }

  const variantsByProduct = new Map<string, PublicVariant[]>();
  for (const variant of variantRows ?? []) {
    const variants = variantsByProduct.get(variant.product_id) ?? [];
    variants.push({
      id: variant.id,
      productId: variant.product_id,
      sku: variant.sku,
      name: variant.name,
      description: variant.description,
      priceXof: Number(variant.price_xof),
      variantData: variant.variant_data,
    });
    variantsByProduct.set(variant.product_id, variants);
  }

  return {
    status: 'ready',
    products: productRows.map((product) => ({
      id: product.id,
      categoryId: product.category_id,
      productType: product.product_type,
      name: product.name,
      slug: product.slug,
      shortDescription: product.short_description,
      description: product.description,
      brand: product.brand,
      regionCode: product.region_code,
      imagePath: product.image_path,
      metadata: product.metadata,
      variants: variantsByProduct.get(product.id) ?? [],
    })),
  };
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<ProductResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = createSupabasePublicServerClient();
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'active' satisfies ProductStatus)
    .eq('is_published', true)
    .maybeSingle();

  if (productError) {
    if (isMissingSchema(productError.code))
      return { status: 'schema-required' };
    console.error('Unable to load public catalog product.', productError);
    return { status: 'error' };
  }
  if (!product) return { status: 'not-found' };

  const { data: variantRows, error: variantError } = await supabase
    .from('product_variants')
    .select(VARIANT_COLUMNS)
    .eq('product_id', product.id)
    .eq('is_active', true)
    .order('sort_order')
    .limit(100);

  if (variantError) {
    if (isMissingSchema(variantError.code))
      return { status: 'schema-required' };
    console.error('Unable to load public product variants.', variantError);
    return { status: 'error' };
  }

  return {
    status: 'ready',
    product: {
      id: product.id,
      categoryId: product.category_id,
      productType: product.product_type,
      name: product.name,
      slug: product.slug,
      shortDescription: product.short_description,
      description: product.description,
      brand: product.brand,
      regionCode: product.region_code,
      imagePath: product.image_path,
      metadata: product.metadata,
      variants: (variantRows ?? []).map((variant) => ({
        id: variant.id,
        productId: variant.product_id,
        sku: variant.sku,
        name: variant.name,
        description: variant.description,
        priceXof: Number(variant.price_xof),
        variantData: variant.variant_data,
      })),
    },
  };
}

export async function getPublishedCategoryBySlug(
  slug: string,
): Promise<CategoryResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = createSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug,description')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    if (isMissingSchema(error.code)) return { status: 'schema-required' };
    console.error('Unable to load public catalog category.', error);
    return { status: 'error' };
  }

  if (!data) return { status: 'error' };

  return {
    status: 'ready',
    category: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  };
}

export async function listPublishedCategories(): Promise<CategoriesResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = createSupabasePublicServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug,description')
    .eq('is_active', true)
    .order('sort_order')
    .limit(50);

  if (error) {
    if (isMissingSchema(error.code)) return { status: 'schema-required' };
    console.error('Unable to load public catalog categories.', error);
    return { status: 'error' };
  }

  return {
    status: 'ready',
    categories: data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
  };
}

export async function listPublishedCategoryProducts(
  categoryId: string,
): Promise<CatalogResult> {
  if (!hasSupabaseEnvironment()) return { status: 'unconfigured' };

  const supabase = createSupabasePublicServerClient();
  const { data: productRows, error: productError } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category_id', categoryId)
    .eq('status', 'active' satisfies ProductStatus)
    .eq('is_published', true)
    .order('name')
    .limit(100);

  if (productError) {
    if (isMissingSchema(productError.code))
      return { status: 'schema-required' };
    console.error('Unable to load public category products.', productError);
    return { status: 'error' };
  }
  if (!productRows.length) return { status: 'ready', products: [] };

  const productIds = productRows.map((product) => product.id);
  const { data: variantRows, error: variantError } = await supabase
    .from('product_variants')
    .select(VARIANT_COLUMNS)
    .in('product_id', productIds)
    .eq('is_active', true)
    .order('sort_order')
    .limit(500);

  if (variantError) {
    if (isMissingSchema(variantError.code))
      return { status: 'schema-required' };
    console.error('Unable to load public category variants.', variantError);
    return { status: 'error' };
  }

  const variantsByProduct = new Map<string, PublicVariant[]>();
  for (const variant of variantRows) {
    const variants = variantsByProduct.get(variant.product_id) ?? [];
    variants.push({
      id: variant.id,
      productId: variant.product_id,
      sku: variant.sku,
      name: variant.name,
      description: variant.description,
      priceXof: Number(variant.price_xof),
      variantData: variant.variant_data,
    });
    variantsByProduct.set(variant.product_id, variants);
  }

  return {
    status: 'ready',
    products: productRows.map((product) => ({
      id: product.id,
      categoryId: product.category_id,
      productType: product.product_type,
      name: product.name,
      slug: product.slug,
      shortDescription: product.short_description,
      description: product.description,
      brand: product.brand,
      regionCode: product.region_code,
      imagePath: product.image_path,
      metadata: product.metadata,
      variants: variantsByProduct.get(product.id) ?? [],
    })),
  };
}
