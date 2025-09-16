import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService, private readonly prisma: PrismaService) {}

  @Post('checkout')
  async createCheckout(@Body() body: { listingId: string; priceCents?: number; currency?: string }): Promise<{ url: string }> {
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
    });

    return { url: session.url as string };
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
          if (listingId) {
            await this.prisma.listing.update({ where: { id: listingId }, data: { featured: true } });
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
