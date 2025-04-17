import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { db } from '../../../lib/db';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // Force type to bypass the version check
});

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ error: 'You must be logged in to make a purchase' }),
        { status: 401 }
      );
    }

    // Get user from database to associate payment
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'InstantDevPortfolios - Portfolio Creator',
              description: 'One-time purchase with lifetime access',
            },
            unit_amount: 1000, // $10.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 }
    );
  }
} 