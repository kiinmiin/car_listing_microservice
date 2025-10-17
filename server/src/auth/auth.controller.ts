import { Body, Controller, Get, Post, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string; name: string }): Promise<{ token: string }>
  {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }): Promise<{ token: string }>
  {
    return this.auth.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: Request): Promise<{ userId: string; name: string; email: string; phone?: string; subscription: string; premiumListingsRemaining: number; createdAt?: string; subscriptionExpiresAt?: string; daysRemaining?: number }>
  {
    const userId = (req as any).user?.userId as string;
    const user = await this.auth.getUserById(userId);
    const effectiveSubscription = await this.auth.getEffectiveSubscription(userId);
    
    return { 
      userId: user.id, 
      name: user.name || '', 
      email: user.email,
      phone: user.phone || undefined,
      subscription: effectiveSubscription.subscription,
      premiumListingsRemaining: effectiveSubscription.premiumListingsRemaining,
      createdAt: user.createdAt.toISOString(),
      subscriptionExpiresAt: effectiveSubscription.expiresAt?.toISOString(),
      daysRemaining: effectiveSubscription.daysRemaining
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() body: { name?: string; email?: string }): Promise<{ success: boolean }>
  {
    const userId = (req as any).user?.userId as string;
    await this.auth.updateProfile(userId, body);
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('downgrade-subscription')
  async downgradeSubscription(@Req() req: Request, @Body() body: { planId: string }): Promise<{ success: boolean }>
  {
    const userId = (req as any).user?.userId as string;
    await this.auth.downgradeSubscription(userId, body.planId);
    return { success: true };
  }
}
