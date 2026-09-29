import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        const stripePaymentIntentId = paymentIntent.id;

        const engagement = await prisma.engagement.findFirst({
          where: { stripePaymentIntentId },
        });

        if (engagement) {
          await prisma.engagement.update({
            where: { id: engagement.id },
            data: { status: 'FUNDS_IN_ESCROW' },
          });
        }
        break;

      case 'transfer.created':
        const transfer = event.data.object as any;
        console.log('Payout event logged:', transfer.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
