import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getPublicEnvironment, hasSupabaseEnvironment } from '@/lib/env';
import type { Database } from '@/types/database.types';

export async function proxy(request: NextRequest) {
  if (!hasSupabaseEnvironment()) return NextResponse.next({ request });

  const { supabaseUrl, supabaseAnonKey } = getPublicEnvironment();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.getUser();
  if (error) {
    console.error('Unable to refresh the current Supabase session.', {
      code: error.code,
      status: error.status,
    });
  }
  return response;
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
