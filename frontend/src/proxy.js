import { NextResponse } from 'next/server';

export function proxy(request) {
  // Extract token from cookies
  const token = request.cookies.get('access_token')?.value;

  // Protect the dashboard routes: profile, orders, products 
  // Wait, PRD states: "No access to dashboard without authentication."
  // And the navigation cards section links to Products, Orders, Profile
  
  const isDashboardRoute = 
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/orders');

  const isProductsRoute = request.nextUrl.pathname.startsWith('/products');

  const isAuthRoute = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');

  // If trying to access profile/orders without a token, redirect to login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login/register with a token, redirect to home or products
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/orders/:path*', '/products/:path*', '/login', '/register'],
};
