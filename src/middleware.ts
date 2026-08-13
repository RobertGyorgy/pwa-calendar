import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabaseServer';

const PUBLIC_ROUTES = ['/login', '/signup', '/api/auth'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, request } = context;

  // Allow public routes and static assets
  if (
    PUBLIC_ROUTES.some(route => url.pathname.startsWith(route)) ||
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff2?)$/)
  ) {
    return next();
  }

  // Check session server-side.
  // We use getSession() instead of getUser() to avoid JWT clock-skew errors
  // (e.g. "JWT issued at future") that can block login on Vercel/Supabase.
  // The session cookie is encrypted/signed by Supabase; if it is present the
  // user is considered authenticated. API calls will still validate the token.
  const supabase = createSupabaseServerClient(cookies, request.headers);
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return redirect('/login');
  }

  return next();
});
