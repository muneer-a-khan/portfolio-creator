import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { db } from '../../../../lib/db';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing session ID' }),
      { status: 400 }
    );
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify payment status
    if (session.payment_status !== 'paid') {
      return redirect('/checkout?status=payment_failed');
    }

    // Get the user ID from metadata
    const userId = session.metadata?.userId;
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'User ID not found in session metadata' }),
        { status: 400 }
      );
    }

    // Update user in the database to mark as paid
    await db.user.update({
      where: { id: userId },
      data: { 
        stripeId: session.customer as string,
        // Add any other data you want to update for a paid user
      },
    });

    // Redirect to dashboard
    return redirect('/dashboard');
  } catch (error) {
    console.error('Error handling payment success:', error);
    return redirect('/checkout?status=error');
  }
} 