create type public.app_role as enum ('customer', 'support', 'admin');
create type public.account_status as enum ('active', 'suspended', 'closed');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.product_type as enum ('gift_card', 'game_currency', 'game_topup', 'digital_code');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  phone text,
  display_name text,
  role public.app_role not null default 'customer',
  account_status public.account_status not null default 'active',
  locale text not null default 'fr-TG',
  timezone text not null default 'Africa/Lome',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, phone, display_name)
  values (
    new.id,
    new.email,
    new.phone,
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(trim(name)) > 0)
);

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete restrict,
  vertical text not null default 'gaming' check (vertical = 'gaming'),
  product_type public.product_type not null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  brand text,
  region_code text,
  image_path text,
  status public.product_status not null default 'draft',
  is_published boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_name_not_blank check (length(trim(name)) > 0)
);

create index products_category_status_idx
  on public.products (category_id, status, is_published);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  sku text not null unique,
  name text not null,
  description text,
  price_xof bigint not null check (price_xof > 0 and price_xof <= 9007199254740991),
  variant_data jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_name_not_blank check (length(trim(name)) > 0),
  constraint product_variants_sku_not_blank check (length(trim(sku)) > 0)
);

create index product_variants_product_active_idx
  on public.product_variants (product_id, is_active, sort_order);

create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;

revoke all on public.profiles, public.categories, public.products, public.product_variants
  from public, anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, locale, timezone) on public.profiles to authenticated;
grant select on public.categories, public.products, public.product_variants to anon, authenticated;

create policy profiles_select_own
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy categories_select_active
  on public.categories for select to anon, authenticated
  using (is_active);

create policy products_select_published
  on public.products for select to anon, authenticated
  using (
    status = 'active'
    and is_published
    and (
      category_id is null
      or exists (
        select 1
        from public.categories as category
        where category.id = products.category_id
          and category.is_active
      )
    )
  );

create policy product_variants_select_available
  on public.product_variants for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1
      from public.products as product
      where product.id = product_variants.product_id
        and product.status = 'active'
        and product.is_published
        and (
          product.category_id is null
          or exists (
            select 1
            from public.categories as category
            where category.id = product.category_id
              and category.is_active
          )
        )
    )
  );
