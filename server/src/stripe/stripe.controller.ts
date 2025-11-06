import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService, private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout')
  async createCheckout(@Req() req: Request, @Body() body: { listingId: string; priceCents?: number; currency?: string }): Promise<{ url: string }> {
    const userId = (req as any).user?.userId as string;
    const priceCents = body.priceCents ?? 999; // $9.99 default
    const currency = body.currency ?? 'usd';

    // Prevent duplicate subscription purchases if user already has time remaining
    if (body.listingId?.includes('premium-upgrade')) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { subscription: true, subscriptionExpiresAt: true } });
      const now = new Date();
      const hasTimeRemaining = !!(user?.subscriptionExpiresAt && user.subscriptionExpiresAt > now);
      const isPremiumPurchase = (body.priceCents ?? 0) >= 2999 && (body.priceCents ?? 0) < 4999;
      const isSpotlightPurchase = (body.priceCents ?? 0) >= 4999;

      if (hasTimeRemaining) {
        // Allow upgrade from premium -> spotlight only
        if (isSpotlightPurchase && user?.subscription === 'premium') {
          // allowed
        } else {
          throw new Error('You already have an active subscription until the end of your current period.');
        }
      } else {
        // No time remaining: allow both purchases
      }
    }

    const successUrl = process.env.CORS_ORIGIN ? `${process.env.CORS_ORIGIN}/premium/success?amount=${priceCents}` : `http://localhost:3000/premium/success?amount=${priceCents}`;
    const cancelUrl = process.env.CORS_ORIGIN ? `${process.env.CORS_ORIGIN}/premium` : 'http://localhost:3000/premium';

    const session = await this.stripeService.createCheckoutSession({
      listingId: body.listingId,
      priceCents,
      currency,
      successUrl,
      cancelUrl,
      mode: 'payment',
      userId, // Add user ID to metadata
    });

    return { url: session.url as string };
  }

  @Post('test-webhook')
  @HttpCode(HttpStatus.OK)
  async testWebhook(@Body() body: { userId: string; listingId: string; amountTotal: number }): Promise<{ success: boolean }> {
    try {
      const { userId, listingId, amountTotal } = body;
      
      // Update user subscription if this is a premium upgrade
      if (userId && listingId?.includes('premium-upgrade')) {
        const priceCents = amountTotal;
        let subscription = 'free';
        let premiumListingsRemaining = 0;
        let subscriptionDurationDays = 0;
        
        if (priceCents >= 4999) { // $49.99 or more - Spotlight plan
          subscription = 'spotlight';
          premiumListingsRemaining = 10; // Give 10 premium listings for spotlight
          subscriptionDurationDays = 90; // 90 days for spotlight
        } else if (priceCents >= 2999) { // $29.99 or more - Premium plan
          subscription = 'premium';
          premiumListingsRemaining = 5; // Give 5 premium listings for premium
          subscriptionDurationDays = 60; // 60 days for premium
        }
        
        const now = new Date();
        const subscriptionExpiresAt = new Date(now.getTime() + (subscriptionDurationDays * 24 * 60 * 60 * 1000));
        
        console.log(`Test webhook processing: userId=${userId}, priceCents=${priceCents}, subscription=${subscription}, premiumListingsRemaining=${premiumListingsRemaining}, expiresAt=${subscriptionExpiresAt.toISOString()}`);
        
        await this.prisma.user.update({
          where: { id: userId },
          data: { 
            subscription,
            premiumListingsRemaining,
            subscriptionExpiresAt,
            subscriptionStartedAt: now
          }
        });
        
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Test webhook error:', error);
      return { success: false };
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature?: string,
  ): Promise<void> {
    try {
      const event = this.stripeService.constructEventFromPayload(signature, req.body as Buffer);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const listingId = session?.metadata?.listingId as string | undefined;
          const userId = session?.metadata?.userId as string | undefined;
          
          if (listingId && !listingId.includes('premium-upgrade')) {
            const now = new Date();
            const featuredUntil = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000); // default 60 days for one-off feature
            await this.prisma.listing.update({ where: { id: listingId }, data: { featured: true, featuredUntil } });
          }
          
          // Update user subscription if this is a premium upgrade
          if (userId && listingId?.includes('premium-upgrade')) {
            const priceCents = session.amount_total;
            let subscription = 'free';
            let premiumListingsRemaining = 0;
            let subscriptionDurationDays = 0;
            
            if (priceCents >= 4999) { // $49.99 or more - Spotlight plan
              subscription = 'spotlight';
              premiumListingsRemaining = 10; // Give 10 premium listings for spotlight
              subscriptionDurationDays = 90; // 90 days for spotlight
            } else if (priceCents >= 2999) { // $29.99 or more - Premium plan
              subscription = 'premium';
              premiumListingsRemaining = 5; // Give 5 premium listings for premium
              subscriptionDurationDays = 60; // 60 days for premium
            }
            
            const now = new Date();
            const subscriptionExpiresAt = new Date(now.getTime() + (subscriptionDurationDays * 24 * 60 * 60 * 1000));
            
            console.log(`Webhook processing: userId=${userId}, priceCents=${priceCents}, subscription=${subscription}, premiumListingsRemaining=${premiumListingsRemaining}, expiresAt=${subscriptionExpiresAt.toISOString()}`);
            
            await this.prisma.user.update({
              where: { id: userId },
              data: { 
                subscription,
                premiumListingsRemaining,
                subscriptionExpiresAt,
                subscriptionStartedAt: now
              }
            });
          }
          break;
        }
        default:
          break;
      }

      res.json({ received: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Stripe webhook error:', err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }
  }
}
