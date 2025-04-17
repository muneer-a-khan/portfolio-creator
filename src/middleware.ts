import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication but not payment verification
const authRoutes = ['/checkout'];

// Routes that require both authentication and payment verification
const paidRoutes = ['/dashboard', '/editor', '/export'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the user's session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If no token and trying to access a protected route
  if (!token && (authRoutes.some(route => pathname.startsWith(route)) || 
                paidRoutes.some(route => pathname.startsWith(route)))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If authenticated but trying to access a route that requires payment
  if (token && paidRoutes.some(route => pathname.startsWith(route))) {
    // Check if the user has a stripeId, which indicates they've paid
    // We need to check this from the JWT token for performance reasons
    const hasPaid = token.stripeId;
    
    if (!hasPaid) {
      return NextResponse.redirect(new URL('/checkout', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/export/:path*',
    '/checkout/:path*',
  ],
}; 