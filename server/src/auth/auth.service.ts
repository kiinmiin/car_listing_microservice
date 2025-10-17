import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly jwt: JwtService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async register(params: { email: string; password: string; name: string }): Promise<{ token: string }>
  {
    const exists = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (exists) throw new BadRequestException('Email already in use');
    const passwordHash = await argon2.hash(params.password);
    const user = await this.prisma.user.create({ 
      data: { 
        email: params.email, 
        passwordHash, 
        name: params.name,
        subscription: 'free',
        premiumListingsRemaining: 0
      } 
    });
    const token = await this.signToken(user.id);
    return { token };
  }

  async login(params: { email: string; password: string }): Promise<{ token: string }>
  {
    const user = await this.prisma.user.findUnique({ where: { email: params.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, params.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.signToken(user.id);
    return { token };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async getEffectiveSubscription(userId: string) {
    return await this.subscriptionService.getEffectiveSubscription(userId);
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    const updateData: any = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    
    if (data.email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await this.prisma.user.findFirst({
        where: { 
          email: data.email,
          id: { not: userId }
        }
      });
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      updateData.email = data.email;
    }
    
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  }

  async downgradeSubscription(userId: string, planId: string) {
    // Validate planId
    if (planId !== 'basic' && planId !== 'premium') {
      throw new BadRequestException('Invalid plan for downgrade');
    }

    // Get current user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Determine target subscription and premium listings
    let targetSubscription: string;
    let targetPremiumListings: number;

    if (planId === 'basic') {
      targetSubscription = 'free';
      targetPremiumListings = 0;
    } else if (planId === 'premium') {
      targetSubscription = 'premium';
      targetPremiumListings = 5;
    } else {
      // This should not happen due to validation above, but TypeScript needs this
      throw new BadRequestException('Invalid plan for downgrade');
    }

    // Check if user is already on the target plan
    if (user.subscription === targetSubscription) {
      throw new BadRequestException(`User is already on the ${targetSubscription} plan`);
    }

    // Downgrade to target plan
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscription: targetSubscription,
        premiumListingsRemaining: targetPremiumListings
      }
    });
  }

  private async signToken(userId: string): Promise<string> {
    return this.jwt.signAsync({ sub: userId });
  }
}
