import { z } from 'zod';

const publicEnvironmentSchema = z.object({
  appUrl: z.string().url(),
  supabaseUrl: z
    .string()
    .url()
    .refine((value) => !value.includes('your-project.supabase.co')),
  supabaseAnonKey: z
    .string()
    .min(1)
    .refine((value) => !/replace-with|placeholder|your-supabase/i.test(value)),
});

export type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;

export function getPublicEnvironment(): PublicEnvironment {
  return publicEnvironmentSchema.parse({
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function hasSupabaseEnvironment() {
  return publicEnvironmentSchema.safeParse({
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }).success;
}
