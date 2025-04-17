import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../lib/db';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31' as any,
});

// Set this to skip CSRF protection for this webhook route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  // Validate the webhook signature
  if (!signature) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing stripe-signature header' }),
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe using the webhook signing secret
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(
      JSON.stringify({ error: `Webhook signature verification failed` }),
      { status: 400 }
    );
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Process the successful payment
        if (session.payment_status === 'paid' && session.metadata?.userId) {
          // Update user record to mark as paid
          await db.user.update({
            where: { id: session.metadata.userId },
            data: { 
              stripeId: session.customer as string,
              // You might want to set other fields to indicate successful payment
            },
          });
          
          console.log(`Payment completed for user ${session.metadata.userId}`);
        }
        break;
        
      case 'payment_intent.succeeded':
        // Handle successful payment intent if needed
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
        
      case 'payment_intent.payment_failed':
        // Handle failed payment intent if needed
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);
        break;
        
      // Add more event types as needed
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error processing webhook' }),
      { status: 500 }
    );
  }
} 