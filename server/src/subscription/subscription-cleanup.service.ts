import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class SubscriptionCleanupService {
  private readonly logger = new Logger(SubscriptionCleanupService.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Manual cleanup method for testing
  async manualCleanup() {
    this.logger.log('Manual cleanup triggered...');
    
    try {
      const expiredCount = await this.subscriptionService.handleExpiredSubscriptions();
      
      if (expiredCount > 0) {
        this.logger.log(`Successfully handled ${expiredCount} expired subscriptions`);
      } else {
        this.logger.log('No expired subscriptions found');
      }
      
      return expiredCount;
    } catch (error) {
      this.logger.error('Error handling expired subscriptions:', error);
      throw error;
    }
  }
}
