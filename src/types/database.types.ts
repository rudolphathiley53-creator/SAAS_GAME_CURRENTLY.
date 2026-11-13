export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'customer' | 'support' | 'admin';
export type AccountStatus = 'active' | 'suspended' | 'closed';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type ProductType =
  'gift_card' | 'game_currency' | 'game_topup' | 'digital_code';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          display_name: string | null;
          role: AppRole;
          account_status: AccountStatus;
          locale: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          display_name?: string | null;
          role?: AppRole;
          account_status?: AccountStatus;
          locale?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          locale?: string;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          parent_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          vertical: 'gaming';
          product_type: ProductType;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          brand: string | null;
          region_code: string | null;
          image_path: string | null;
          status: ProductStatus;
          is_published: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          vertical?: 'gaming';
          product_type: ProductType;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          brand?: string | null;
          region_code?: string | null;
          image_path?: string | null;
          status?: ProductStatus;
          is_published?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          product_type?: ProductType;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          brand?: string | null;
          region_code?: string | null;
          image_path?: string | null;
          status?: ProductStatus;
          is_published?: boolean;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          name: string;
          description: string | null;
          price_xof: number;
          variant_data: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          name: string;
          description?: string | null;
          price_xof: number;
          variant_data?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          sku?: string;
          name?: string;
          description?: string | null;
          price_xof?: number;
          variant_data?: Json;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
      account_status: AccountStatus;
      product_status: ProductStatus;
      product_type: ProductType;
    };
    CompositeTypes: Record<string, never>;
  };
};
