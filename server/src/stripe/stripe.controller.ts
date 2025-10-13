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

    const successUrl = process.env.CORS_ORIGIN ? `${process.env.CORS_ORIGIN}/premium/success` : 'http://localhost:3000/premium/success';
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
        
        if (priceCents >= 2999) { // $29.99 or more
          subscription = 'premium';
          premiumListingsRemaining = 5; // Give 5 premium listings
        }
        
        await this.prisma.user.update({
          where: { id: userId },
          data: { 
            subscription,
            premiumListingsRemaining
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
          
          if (listingId) {
            await this.prisma.listing.update({ where: { id: listingId }, data: { featured: true } });
          }
          
          // Update user subscription if this is a premium upgrade
          if (userId && listingId?.includes('premium-upgrade')) {
            const priceCents = session.amount_total;
            let subscription = 'free';
            let premiumListingsRemaining = 0;
            
            if (priceCents >= 2999) { // $29.99 or more
              subscription = 'premium';
              premiumListingsRemaining = 5; // Give 5 premium listings
            }
            
            await this.prisma.user.update({
              where: { id: userId },
              data: { 
                subscription,
                premiumListingsRemaining
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
