import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionCleanupService } from './subscription-cleanup.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly cleanupService: SubscriptionCleanupService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('cleanup')
  async manualCleanup() {
    const result = await this.cleanupService.manualCleanup();
    return { 
      success: true, 
      message: `Processed ${result} expired subscriptions` 
    };
  }
}
