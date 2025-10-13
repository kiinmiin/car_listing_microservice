import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe | null = null;

  private ensureClient(): Stripe {
    if (this.stripe) return this.stripe;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY is not set');
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    console.log('Initializing Stripe with key:', secretKey.substring(0, 10) + '...');
    this.stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
    return this.stripe;
  }

  async createCheckoutSession(params: {
    priceCents: number;
    currency: string;
    listingId: string;
    successUrl: string;
    cancelUrl: string;
    mode?: 'payment' | 'subscription';
    userId?: string;
  }): Promise<Stripe.Checkout.Session> {
    const { priceCents, currency, listingId, successUrl, cancelUrl, mode } = params;
    console.log('Creating checkout session with params:', { priceCents, currency, listingId, successUrl, cancelUrl, mode });
    
    try {
      const stripe = this.ensureClient();
      console.log('Stripe client initialized successfully');

      const session = await stripe.checkout.sessions.create({
        mode: mode ?? 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: `Premium placement for listing ${listingId}`,
              },
              unit_amount: priceCents,
            },
            quantity: 1,
          },
        ],
        metadata: { 
          listingId,
          ...(params.userId && { userId: params.userId })
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      
      console.log('Checkout session created successfully:', session.id);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  constructEventFromPayload(signature: string | undefined, payload: Buffer): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    if (!signature) throw new Error('Missing Stripe-Signature header');
    const stripe = this.ensureClient();
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
