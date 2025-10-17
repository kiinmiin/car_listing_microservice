import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if a user's subscription is still active
   */
  async isSubscriptionActive(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscription: true, 
        subscriptionExpiresAt: true 
      }
    });

    if (!user) return false;

    // Free users are always "active" but with no premium features
    if (user.subscription === 'free') return true;

    // Check if subscription has expired
    if (user.subscriptionExpiresAt && user.subscriptionExpiresAt < new Date()) {
      return false;
    }

    return true;
  }

  /**
   * Get user's effective subscription status (handles expired subscriptions)
   */
  async getEffectiveSubscription(userId: string): Promise<{
    subscription: string;
    premiumListingsRemaining: number;
    isActive: boolean;
    expiresAt?: Date;
    daysRemaining?: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscription: true, 
        premiumListingsRemaining: true,
        subscriptionExpiresAt: true,
        subscriptionStartedAt: true
      }
    });

    if (!user) {
      return {
        subscription: 'free',
        premiumListingsRemaining: 0,
        isActive: true
      };
    }

    const now = new Date();
    const isActive = user.subscription === 'free' || 
      (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now);

    let daysRemaining: number | undefined;
    if (user.subscriptionExpiresAt) {
      const diffTime = user.subscriptionExpiresAt.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      subscription: isActive ? user.subscription : 'free',
      premiumListingsRemaining: isActive ? user.premiumListingsRemaining : 0,
      isActive: isActive || false,
      expiresAt: user.subscriptionExpiresAt || undefined,
      daysRemaining: daysRemaining && daysRemaining > 0 ? daysRemaining : undefined
    };
  }

  /**
   * Handle expired subscriptions by downgrading users to free
   */
  async handleExpiredSubscriptions(): Promise<number> {
    const now = new Date();
    
    // Find users with expired subscriptions
    const expiredUsers = await this.prisma.user.findMany({
      where: {
        subscription: { in: ['premium', 'spotlight'] },
        subscriptionExpiresAt: { lt: now }
      },
      select: { id: true, email: true, subscription: true }
    });

    if (expiredUsers.length === 0) {
      return 0;
    }

    // Downgrade all expired users to free
    await this.prisma.user.updateMany({
      where: {
        subscription: { in: ['premium', 'spotlight'] },
        subscriptionExpiresAt: { lt: now }
      },
      data: {
        subscription: 'free',
        premiumListingsRemaining: 0
      }
    });

    console.log(`Handled ${expiredUsers.length} expired subscriptions:`, 
      expiredUsers.map(u => `${u.email} (${u.subscription})`));

    return expiredUsers.length;
  }

  /**
   * Extend a user's subscription (useful for renewals)
   */
  async extendSubscription(
    userId: string, 
    subscriptionType: 'premium' | 'spotlight',
    durationDays: number
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionExpiresAt: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const currentExpiry = user.subscriptionExpiresAt || now;
    const newExpiry = new Date(Math.max(currentExpiry.getTime(), now.getTime()) + (durationDays * 24 * 60 * 60 * 1000));

    const premiumListingsRemaining = subscriptionType === 'spotlight' ? 10 : 5;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription: subscriptionType,
        premiumListingsRemaining,
        subscriptionExpiresAt: newExpiry,
        subscriptionStartedAt: user.subscriptionExpiresAt ? undefined : now // Only set start date if this is a new subscription
      }
    });
  }
}
